import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db, { initDB, dbRun, dbGet, dbAll } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'pawpath_secret_key_2026_super_secure';

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Support base64 digital signatures

// Initialize DB schema & seed data
initDB();

// Helper to format SQLite pet row to JSON API object
const formatPet = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    ownerId: row.owner_id || 'system',
    name: row.name,
    microchipId: row.microchip_id,
    category: row.category,
    status: row.status,
    description: row.description,
    imageUrl: row.image_url,
    isFavorite: Boolean(row.is_favorite),
    treatsCount: Number(row.treats_count || 0),
    tags: row.tags ? JSON.parse(row.tags) : [],
    traits: row.traits ? JSON.parse(row.traits) : { energy: 70, cuddle: 80, vocalness: 40, kidFriendly: 85, grooming: 50 },
    careCost: row.care_cost ? JSON.parse(row.care_cost) : { food: 2000, litter: 1000, vet: 1200 },
    dailyRoutine: row.daily_routine ? JSON.parse(row.daily_routine) : [],
    createdAt: row.created_at
  };
};

// Authentication Middleware for Admin routes
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. Authorization token missing.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role === 'admin' || decoded.username) {
      req.admin = decoded;
    } else {
      req.user = decoded;
    }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session token.' });
  }
};

// Flexible Auth Middleware for Users or Admins
const anyAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. Please log in to perform this action.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role === 'admin' || decoded.username) {
      req.admin = decoded;
    } else {
      req.user = decoded;
    }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Session expired or invalid token. Please log in again.' });
  }
};

// ==========================================
// 👤 USER AUTHENTICATION & PROFILE ROUTES
// ==========================================

// User Registration
app.post('/api/users/register', async (req, res) => {
  try {
    const { email, password, fullName, phone = '', address = '' } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ error: 'Email, password, and full name are required.' });
    }

    if (!email.includes('@')) {
      return res.status(400).json({ error: 'Please enter a valid Gmail / email address.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await dbGet('SELECT * FROM users WHERE email = ?', [cleanEmail]);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email address already exists. Please log in.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = `user-${Date.now()}`;
    const createdAt = Date.now();

    await dbRun(
      `INSERT INTO users (id, email, password_hash, full_name, phone, address, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, cleanEmail, hashedPassword, fullName.trim(), phone.trim(), address.trim(), createdAt]
    );

    const userObj = { id: userId, email: cleanEmail, fullName: fullName.trim(), phone: phone.trim(), address: address.trim(), role: 'user' };
    const token = jwt.sign(userObj, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      token,
      user: userObj
    });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: 'Failed to create user account.' });
  }
});

// User & Admin Unified Login
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email/Username and password are required.' });
    }

    const cleanInput = email.trim().toLowerCase();

    // 1. Check if input matches an admin in admins table (e.g. 'admin' or 'admin@pawpath.com')
    const admin = await dbGet('SELECT * FROM admins WHERE LOWER(username) = ? OR LOWER(username) = ?', [cleanInput, cleanInput.replace('@pawpath.com', '')]);
    if (admin) {
      const isMatch = await bcrypt.compare(password, admin.password_hash);
      if (isMatch) {
        const adminUserObj = {
          id: admin.id,
          email: `${admin.username}@pawpath.com`,
          fullName: 'System Administrator',
          username: admin.username,
          phone: '+1 800-PAWPATH',
          address: 'PawPath HQ',
          role: 'admin'
        };
        const token = jwt.sign(adminUserObj, JWT_SECRET, { expiresIn: '7d' });
        return res.json({
          success: true,
          token,
          user: adminUserObj
        });
      }
    }

    // 2. Check regular users table
    const user = await dbGet('SELECT * FROM users WHERE email = ?', [cleanInput]);
    if (!user) {
      return res.status(401).json({ error: 'No account found with this email or username.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password. Please try again.' });
    }

    const userObj = { id: user.id, email: user.email, fullName: user.full_name, phone: user.phone || '', address: user.address || '', role: 'user' };
    const token = jwt.sign(userObj, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      user: userObj
    });
  } catch (err) {
    console.error('Error logging in user/admin:', err);
    res.status(500).json({ error: 'Internal server error during login.' });
  }
});

// Get Current User Profile
app.get('/api/users/me', anyAuthMiddleware, async (req, res) => {
  if (req.admin) {
    return res.json({ id: req.admin.id, username: req.admin.username, role: 'admin' });
  }
  try {
    const user = await dbGet('SELECT id, email, full_name, phone, address, created_at FROM users WHERE id = ?', [req.user.id]);
    if (!user) {
      return res.status(404).json({ error: 'User profile not found.' });
    }
    res.json({
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      phone: user.phone || '',
      address: user.address || '',
      createdAt: user.created_at,
      role: 'user'
    });
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ error: 'Failed to retrieve profile.' });
  }
});

// Update User Profile
app.put('/api/users/me', anyAuthMiddleware, async (req, res) => {
  if (!req.user) {
    return res.status(400).json({ error: 'Only regular user accounts can update personal details.' });
  }
  try {
    const { fullName, phone, address } = req.body;
    await dbRun(
      `UPDATE users SET full_name = ?, phone = ?, address = ? WHERE id = ?`,
      [fullName.trim(), phone.trim(), address.trim(), req.user.id]
    );

    const updated = await dbGet('SELECT id, email, full_name, phone, address FROM users WHERE id = ?', [req.user.id]);
    const userObj = { id: updated.id, email: updated.email, fullName: updated.full_name, phone: updated.phone || '', address: updated.address || '', role: 'user' };
    const token = jwt.sign(userObj, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      user: userObj,
      token
    });
  } catch (err) {
    console.error('Error updating user profile:', err);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

// ==========================================
// 🔑 ADMIN AUTH ROUTES
// ==========================================

// Admin Login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const admin = await dbGet('SELECT * FROM admins WHERE username = ?', [username.trim()]);
    if (!admin) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const token = jwt.sign({ id: admin.id, username: admin.username, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
    res.json({
      success: true,
      token,
      admin: { id: admin.id, username: admin.username, role: 'admin' }
    });
  } catch (err) {
    console.error('Error logging in admin:', err);
    res.status(500).json({ error: 'Internal server error during login.' });
  }
});

// Verify Admin Token
app.get('/api/admin/verify', authMiddleware, (req, res) => {
  res.json({ valid: true, admin: req.admin });
});

// Admin Dashboard Summary Metrics
app.get('/api/admin/stats', authMiddleware, async (req, res) => {
  try {
    const totalPets = (await dbGet('SELECT COUNT(*) as count FROM pets')).count;
    const availablePets = (await dbGet("SELECT COUNT(*) as count FROM pets WHERE status = 'Available'")).count;
    const pendingPets = (await dbGet("SELECT COUNT(*) as count FROM pets WHERE status = 'Pending'")).count;
    const urgentPets = (await dbGet("SELECT COUNT(*) as count FROM pets WHERE status = 'Urgent'")).count;
    const adoptedPets = (await dbGet("SELECT COUNT(*) as count FROM pets WHERE status = 'Adopted'")).count;
    
    const totalApplications = (await dbGet('SELECT COUNT(*) as count FROM adoption_applications')).count;
    const pendingApplications = (await dbGet("SELECT COUNT(*) as count FROM adoption_applications WHERE status = 'Pending'")).count;
    const approvedApplications = (await dbGet("SELECT COUNT(*) as count FROM adoption_applications WHERE status = 'Approved'")).count;

    const treatsSum = (await dbGet('SELECT SUM(treats_count) as total FROM pets')).total || 0;

    res.json({
      totalPets,
      availablePets,
      pendingPets,
      urgentPets,
      adoptedPets,
      totalApplications,
      pendingApplications,
      approvedApplications,
      totalTreats: treatsSum
    });
  } catch (err) {
    console.error('Error fetching admin stats:', err);
    res.status(500).json({ error: 'Failed to compute admin dashboard statistics.' });
  }
});

// ==========================================
// 🐶 PETS CRUD ROUTES
// ==========================================

// Get All Pets (Shared Marketplace)
app.get('/api/pets', async (req, res) => {
  try {
    const rows = await dbAll('SELECT * FROM pets ORDER BY created_at DESC');
    const pets = rows.map(formatPet);
    res.json(pets);
  } catch (err) {
    console.error('Error fetching pets:', err);
    res.status(500).json({ error: 'Failed to retrieve pets from database.' });
  }
});

// Get User Registered Pets (My Pets)
app.get('/api/pets/my-pets', anyAuthMiddleware, async (req, res) => {
  try {
    const ownerId = req.user?.id || req.admin?.id || 'system';
    const rows = await dbAll('SELECT * FROM pets WHERE owner_id = ? ORDER BY created_at DESC', [ownerId]);
    res.json(rows.map(formatPet));
  } catch (err) {
    console.error('Error fetching user pets:', err);
    res.status(500).json({ error: 'Failed to retrieve registered pets.' });
  }
});

// Get Single Pet
app.get('/api/pets/:id', async (req, res) => {
  try {
    const row = await dbGet('SELECT * FROM pets WHERE id = ?', [req.params.id]);
    if (!row) {
      return res.status(404).json({ error: 'Pet not found.' });
    }
    res.json(formatPet(row));
  } catch (err) {
    console.error('Error fetching pet:', err);
    res.status(500).json({ error: 'Failed to retrieve pet.' });
  }
});

// Create New Pet (User or Admin)
app.post('/api/pets', anyAuthMiddleware, async (req, res) => {
  try {
    const {
      name,
      microchipId,
      category,
      status = 'Available',
      description,
      imageUrl,
      tags = [],
      traits = {},
      careCost = {},
      dailyRoutine = []
    } = req.body;

    if (!name || !description || !category) {
      return res.status(400).json({ error: 'Name, category, and description are required.' });
    }

    // Regular users registering a pet for adoption cannot set status to 'Adopted' directly
    let finalStatus = status;
    if (req.user && finalStatus === 'Adopted') {
      finalStatus = 'Available';
    }

    const ownerId = req.user?.id || req.admin?.id || 'system';
    const id = `pet-${Date.now()}`;
    const finalMicrochipId = microchipId?.trim() || `PET-${Math.floor(1000 + Math.random() * 9000)}`;
    const createdAt = Date.now();

    await dbRun(
      `INSERT INTO pets (id, owner_id, name, microchip_id, category, status, description, image_url, is_favorite, treats_count, tags, traits, care_cost, daily_routine, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        ownerId,
        name.trim(),
        finalMicrochipId,
        category,
        finalStatus,
        description.trim(),
        imageUrl || '',
        0,
        1,
        JSON.stringify(tags),
        JSON.stringify(traits),
        JSON.stringify(careCost),
        JSON.stringify(dailyRoutine),
        createdAt
      ]
    );

    const newRow = await dbGet('SELECT * FROM pets WHERE id = ?', [id]);
    res.status(201).json(formatPet(newRow));
  } catch (err) {
    console.error('Error creating pet:', err);
    res.status(500).json({ error: err.message || 'Failed to create pet profile.' });
  }
});

// Update Existing Pet (Owner or Admin only)
app.put('/api/pets/:id', anyAuthMiddleware, async (req, res) => {
  try {
    const petId = req.params.id;
    const existing = await dbGet('SELECT * FROM pets WHERE id = ?', [petId]);
    if (!existing) {
      return res.status(404).json({ error: 'Pet not found.' });
    }

    // Permission check: Must be Admin OR owner of the pet
    const callerId = req.user?.id || req.admin?.id;
    const isOwner = existing.owner_id === callerId || existing.owner_id === 'system';
    if (!req.admin && !isOwner) {
      return res.status(403).json({ error: 'Permission denied. You can only update pets you registered.' });
    }

    const {
      name = existing.name,
      microchipId = existing.microchip_id,
      category = existing.category,
      status = existing.status,
      description = existing.description,
      imageUrl = existing.image_url,
      isFavorite = existing.is_favorite,
      treatsCount = existing.treats_count,
      tags = existing.tags ? JSON.parse(existing.tags) : [],
      traits = existing.traits ? JSON.parse(existing.traits) : {},
      careCost = existing.care_cost ? JSON.parse(existing.care_cost) : {},
      dailyRoutine = existing.daily_routine ? JSON.parse(existing.daily_routine) : []
    } = req.body;

    await dbRun(
      `UPDATE pets SET
        name = ?, microchip_id = ?, category = ?, status = ?, description = ?,
        image_url = ?, is_favorite = ?, treats_count = ?, tags = ?, traits = ?,
        care_cost = ?, daily_routine = ?
       WHERE id = ?`,
      [
        name,
        microchipId,
        category,
        status,
        description,
        imageUrl,
        isFavorite ? 1 : 0,
        treatsCount,
        JSON.stringify(tags),
        JSON.stringify(traits),
        JSON.stringify(careCost),
        JSON.stringify(dailyRoutine),
        petId
      ]
    );

    const updatedRow = await dbGet('SELECT * FROM pets WHERE id = ?', [petId]);
    res.json(formatPet(updatedRow));
  } catch (err) {
    console.error('Error updating pet:', err);
    res.status(500).json({ error: 'Failed to update pet profile.' });
  }
});

// Delete Pet (Owner or Admin only)
app.delete('/api/pets/:id', anyAuthMiddleware, async (req, res) => {
  try {
    const petId = req.params.id;
    const existing = await dbGet('SELECT * FROM pets WHERE id = ?', [petId]);
    if (!existing) {
      return res.status(404).json({ error: 'Pet not found.' });
    }

    // Permission check: Must be Admin OR owner of the pet
    const callerId = req.user?.id || req.admin?.id;
    const isOwner = existing.owner_id === callerId || existing.owner_id === 'system';
    if (!req.admin && !isOwner) {
      return res.status(403).json({ error: 'Permission denied. You can only delete pets you registered.' });
    }

    await dbRun('DELETE FROM pets WHERE id = ?', [petId]);
    res.json({ success: true, message: `Pet ${existing.name} deleted successfully.` });
  } catch (err) {
    console.error('Error deleting pet:', err);
    res.status(500).json({ error: 'Failed to delete pet.' });
  }
});

// Public: Give Pet Treat (Increments count)
app.post('/api/pets/:id/treat', async (req, res) => {
  try {
    const petId = req.params.id;
    const existing = await dbGet('SELECT * FROM pets WHERE id = ?', [petId]);
    if (!existing) {
      return res.status(404).json({ error: 'Pet not found.' });
    }

    const newCount = (existing.treats_count || 0) + 1;
    await dbRun('UPDATE pets SET treats_count = ? WHERE id = ?', [newCount, petId]);
    res.json({ success: true, treatsCount: newCount });
  } catch (err) {
    console.error('Error giving treat:', err);
    res.status(500).json({ error: 'Failed to send treat.' });
  }
});

// Public: Toggle Favorite
app.post('/api/pets/:id/favorite', async (req, res) => {
  try {
    const petId = req.params.id;
    const existing = await dbGet('SELECT * FROM pets WHERE id = ?', [petId]);
    if (!existing) {
      return res.status(404).json({ error: 'Pet not found.' });
    }

    const newFav = existing.is_favorite ? 0 : 1;
    await dbRun('UPDATE pets SET is_favorite = ? WHERE id = ?', [newFav, petId]);
    res.json({ success: true, isFavorite: Boolean(newFav) });
  } catch (err) {
    console.error('Error toggling favorite:', err);
    res.status(500).json({ error: 'Failed to update favorite status.' });
  }
});

// ==========================================
// 📝 ADOPTION APPLICATIONS ROUTES
// ==========================================

// Get All Adoption Applications (Admin only)
app.get('/api/applications', authMiddleware, async (req, res) => {
  try {
    const rows = await dbAll('SELECT * FROM adoption_applications ORDER BY created_at DESC');
    const apps = rows.map((r) => ({
      id: r.id,
      petId: r.pet_id,
      petName: r.pet_name,
      adopterName: r.adopter_name,
      adopterEmail: r.adopter_email,
      adopterPhone: r.adopter_phone,
      adopterIdNum: r.adopter_id_num,
      adopterAddress: r.adopter_address,
      adoptionType: r.adoption_type,
      signatureDataUrl: r.signature_data_url,
      status: r.status,
      createdAt: r.created_at
    }));
    res.json(apps);
  } catch (err) {
    console.error('Error fetching applications:', err);
    res.status(500).json({ error: 'Failed to retrieve adoption applications.' });
  }
});

// Submit New Adoption Application (Public)
app.post('/api/applications', async (req, res) => {
  try {
    const {
      petId,
      petName,
      adopterName,
      adopterEmail,
      adopterPhone,
      adopterIdNum,
      adopterAddress,
      adoptionType,
      signatureDataUrl
    } = req.body;

    if (!petId || !adopterName || !adopterEmail || !adopterPhone || !signatureDataUrl) {
      return res.status(400).json({ error: 'Please fill in all required fields and provide digital signature.' });
    }

    const id = `app-${Date.now()}`;
    const createdAt = Date.now();

    await dbRun(
      `INSERT INTO adoption_applications
        (id, pet_id, pet_name, adopter_name, adopter_email, adopter_phone, adopter_id_num, adopter_address, adoption_type, signature_data_url, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        petId,
        petName || 'Unknown Pet',
        adopterName.trim(),
        adopterEmail.trim(),
        adopterPhone.trim(),
        adopterIdNum?.trim() || 'N/A',
        adopterAddress.trim(),
        adoptionType || 'Full Permanent Adoption 🏡',
        signatureDataUrl,
        'Pending',
        createdAt
      ]
    );

    // Update pet status to Pending
    await dbRun("UPDATE pets SET status = 'Pending' WHERE id = ?", [petId]);

    res.status(201).json({
      success: true,
      message: 'Adoption agreement submitted successfully!',
      applicationId: id
    });
  } catch (err) {
    console.error('Error submitting adoption application:', err);
    res.status(500).json({ error: 'Failed to submit adoption application.' });
  }
});

// Update Application Status (Approve / Reject) (Admin only)
app.put('/api/applications/:id/status', authMiddleware, async (req, res) => {
  try {
    const appId = req.params.id;
    const { status } = req.body; // 'Approved' | 'Rejected' | 'Pending'

    if (!['Approved', 'Rejected', 'Pending'].includes(status)) {
      return res.status(400).json({ error: 'Invalid application status value.' });
    }

    const appRow = await dbGet('SELECT * FROM adoption_applications WHERE id = ?', [appId]);
    if (!appRow) {
      return res.status(404).json({ error: 'Adoption application not found.' });
    }

    await dbRun('UPDATE adoption_applications SET status = ? WHERE id = ?', [status, appId]);

    // If Approved, update pet status to Adopted
    if (status === 'Approved') {
      await dbRun("UPDATE pets SET status = 'Adopted' WHERE id = ?", [appRow.pet_id]);
    } else if (status === 'Rejected') {
      await dbRun("UPDATE pets SET status = 'Available' WHERE id = ?", [appRow.pet_id]);
    }

    res.json({ success: true, status });
  } catch (err) {
    console.error('Error updating application status:', err);
    res.status(500).json({ error: 'Failed to update application status.' });
  }
});

// Delete Application (Admin only)
app.delete('/api/applications/:id', authMiddleware, async (req, res) => {
  try {
    const appId = req.params.id;
    await dbRun('DELETE FROM adoption_applications WHERE id = ?', [appId]);
    res.json({ success: true, message: 'Application deleted.' });
  } catch (err) {
    console.error('Error deleting application:', err);
    res.status(500).json({ error: 'Failed to delete application.' });
  }
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 PawPath Express SQLite Server running on http://localhost:${PORT}`);
});
