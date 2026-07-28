import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'database.sqlite');

let db = null;

// Save SQLite database to disk file
const saveDB = () => {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  }
};

// Helper wrappers matching standard async query signature
export const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    try {
      db.run(sql, params);
      saveDB();
      resolve({ success: true });
    } catch (err) {
      reject(err);
    }
  });
};

export const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    try {
      const stmt = db.prepare(sql);
      stmt.bind(params);
      if (stmt.step()) {
        const row = stmt.getAsObject();
        stmt.free();
        resolve(row);
      } else {
        stmt.free();
        resolve(null);
      }
    } catch (err) {
      reject(err);
    }
  });
};

export const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    try {
      const stmt = db.prepare(sql);
      stmt.bind(params);
      const rows = [];
      while (stmt.step()) {
        rows.push(stmt.getAsObject());
      }
      stmt.free();
      resolve(rows);
    } catch (err) {
      reject(err);
    }
  });
};

// Initial Seed Pets Data
const INITIAL_PETS_SEED = [
  {
    id: 'pet-1',
    name: 'Luna',
    microchip_id: 'PET-4819',
    category: 'Dog',
    status: 'Available',
    description: 'Playful 2-year-old Golden Retriever mix who loves outdoor fetch, lake swimming, and belly rubs.',
    image_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=600',
    is_favorite: 1,
    treats_count: 18,
    tags: JSON.stringify(['Vaccinated 💉', 'House Trained 🏡', 'Kid Friendly 👶']),
    traits: JSON.stringify({ energy: 90, cuddle: 95, vocalness: 40, kidFriendly: 100, grooming: 60 }),
    care_cost: JSON.stringify({ food: 2800, litter: 1200, vet: 1500 }),
    daily_routine: JSON.stringify([
      { time: '07:00 AM', action: 'Morning park run & breakfast kibble 🥣' },
      { time: '12:00 PM', action: 'Backyard sunbathing & chew toy playtime 🧸' },
      { time: '05:00 PM', action: 'Evening agility training & belly rubs 🐕' },
      { time: '09:00 PM', action: 'Cozy fireplace nap on orthopedic bed 💤' }
    ]),
    created_at: Date.now() - 3600000 * 24 * 3
  },
  {
    id: 'pet-2',
    name: 'Mochi',
    microchip_id: 'PET-9102',
    category: 'Cat',
    status: 'Urgent',
    description: 'Gentle 5-year-old Scottish Fold in urgent need of a quiet foster home. Exceptionally sweet purr machine.',
    image_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600',
    is_favorite: 1,
    treats_count: 24,
    tags: JSON.stringify(['Special Needs 🩺', 'Microchipped 🏷️']),
    traits: JSON.stringify({ energy: 30, cuddle: 100, vocalness: 20, kidFriendly: 70, grooming: 40 }),
    care_cost: JSON.stringify({ food: 1800, litter: 1500, vet: 1200 }),
    daily_routine: JSON.stringify([
      { time: '07:30 AM', action: 'Soft meows for wet food & scratching post 🐱' },
      { time: '01:00 PM', action: 'Window perch bird watching 🦜' },
      { time: '06:00 PM', action: 'Lap cuddle session & gentle grooming 🛋️' },
      { time: '10:00 PM', action: 'Nightly purring sleep at foot of bed 💤' }
    ]),
    created_at: Date.now() - 3600000 * 24 * 5
  },
  {
    id: 'pet-3',
    name: 'Barnaby',
    microchip_id: 'PET-3374',
    category: 'Rabbit',
    status: 'Pending',
    description: 'Curious Holland Lop bunny who loves fresh mint leaves, wooden chew toys, and cardboard tunnels.',
    image_url: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&q=80&w=600',
    is_favorite: 0,
    treats_count: 15,
    tags: JSON.stringify(['House Trained 🏡', 'Kid Friendly 👶']),
    traits: JSON.stringify({ energy: 60, cuddle: 80, vocalness: 10, kidFriendly: 85, grooming: 50 }),
    care_cost: JSON.stringify({ food: 1200, litter: 800, vet: 1000 }),
    daily_routine: JSON.stringify([
      { time: '08:00 AM', action: 'Fresh Timothy hay & organic mint leaf feast 🌿' },
      { time: '02:00 PM', action: 'Cardboard tunnel exploration & binkies 🐇' },
      { time: '06:30 PM', action: 'Gentle forehead pets & banana treat 🍌' },
      { time: '09:30 PM', action: 'Flopping down in soft fleece tunnel 💤' }
    ]),
    created_at: Date.now() - 3600000 * 24 * 1
  },
  {
    id: 'pet-4',
    name: 'Ziggy',
    microchip_id: 'PET-7182',
    category: 'Reptile',
    status: 'Available',
    description: 'Friendly Leopard Gecko with striking spots. Low maintenance and loves basking under warm UV light.',
    image_url: 'https://images.unsplash.com/photo-1563460716037-460a3ad24ba9?auto=format&fit=crop&q=80&w=600',
    is_favorite: 0,
    treats_count: 11,
    tags: JSON.stringify(['Microchipped 🏷️']),
    traits: JSON.stringify({ energy: 20, cuddle: 40, vocalness: 5, kidFriendly: 75, grooming: 10 }),
    care_cost: JSON.stringify({ food: 800, litter: 500, vet: 800 }),
    daily_routine: JSON.stringify([
      { time: '09:00 AM', action: 'Basking on warm rock under UV lamp ☀️' },
      { time: '02:00 PM', action: 'Exploring terrarium cave & hideouts 🦎' },
      { time: '07:00 PM', action: 'Mealworm dinner & gentle hand perch 🐛' },
      { time: '10:00 PM', action: 'Nightly sleep inside warm ceramic log 💤' }
    ]),
    created_at: Date.now() - 3600000 * 24 * 2
  },
  {
    id: 'pet-5',
    name: 'Pip',
    microchip_id: 'PET-2940',
    category: 'Hamster',
    status: 'Available',
    description: 'Tiny Roborovski dwarf hamster who runs on his silent wheel at night and loves sunflower seeds.',
    image_url: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&q=80&w=600',
    is_favorite: 1,
    treats_count: 20,
    tags: JSON.stringify(['Kid Friendly 👶']),
    traits: JSON.stringify({ energy: 95, cuddle: 50, vocalness: 10, kidFriendly: 80, grooming: 20 }),
    care_cost: JSON.stringify({ food: 600, litter: 600, vet: 500 }),
    daily_routine: JSON.stringify([
      { time: '08:00 AM', action: 'Cheek pouch seed stash restocking 🌻' },
      { time: '01:00 PM', action: 'Deep burrow sleeping under Aspen shavings 💤' },
      { time: '07:00 PM', action: 'Wheel sprinting marathon & maze play 🎡' },
      { time: '11:00 PM', action: 'Midnight sand bath & grooming 🚿' }
    ]),
    created_at: Date.now() - 3600000 * 24 * 4
  },
  {
    id: 'pet-6',
    name: 'Finny',
    microchip_id: 'PET-8821',
    category: 'Fish',
    status: 'Available',
    description: 'Vibrant Blue Tang fish thriving in a peaceful saltwater community tank.',
    image_url: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&q=80&w=600',
    is_favorite: 0,
    treats_count: 7,
    tags: JSON.stringify(['Special Needs 🩺']),
    traits: JSON.stringify({ energy: 50, cuddle: 10, vocalness: 0, kidFriendly: 90, grooming: 5 }),
    care_cost: JSON.stringify({ food: 700, litter: 1000, vet: 600 }),
    daily_routine: JSON.stringify([
      { time: '08:00 AM', action: 'Flake food feeding & coral swimming 🐠' },
      { time: '02:00 PM', action: 'Gliding through living anemones 🪸' },
      { time: '07:00 PM', action: 'Evening algae grazing 🌿' },
      { time: '10:00 PM', action: 'Resting in reef coral cave 💤' }
    ]),
    created_at: Date.now() - 3600000 * 24 * 6
  },
  {
    id: 'pet-7',
    name: 'Clover',
    microchip_id: 'PET-5501',
    category: 'Pony',
    status: 'Pending',
    description: 'Sweet Shetland Mini Pony who loves apple slices, pasture trotting, and gentle grooming.',
    image_url: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=600',
    is_favorite: 1,
    treats_count: 32,
    tags: JSON.stringify(['Vaccinated 💉', 'Kid Friendly 👶', 'House Trained 🏡']),
    traits: JSON.stringify({ energy: 70, cuddle: 90, vocalness: 50, kidFriendly: 100, grooming: 80 }),
    care_cost: JSON.stringify({ food: 4500, litter: 2000, vet: 2500 }),
    daily_routine: JSON.stringify([
      { time: '07:00 AM', action: 'Paddock turnout & morning oats 🌾' },
      { time: '12:00 PM', action: 'Pasture grazing with farm companions 🐴' },
      { time: '05:00 PM', action: 'Curry comb brushing & apple reward 🍎' },
      { time: '09:00 PM', action: 'Tucked in fresh straw bedding 💤' }
    ]),
    created_at: Date.now() - 3600000 * 24 * 8
  },
  {
    id: 'pet-8',
    name: 'Kiko',
    microchip_id: 'PET-6215',
    category: 'Bird',
    status: 'Adopted',
    description: 'Vibrant Sun Conure with a singing voice. Successfully placed with a loving family.',
    image_url: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&q=80&w=600',
    is_favorite: 0,
    treats_count: 9,
    tags: JSON.stringify(['Vaccinated 💉', 'Microchipped 🏷️']),
    traits: JSON.stringify({ energy: 85, cuddle: 65, vocalness: 80, kidFriendly: 60, grooming: 30 }),
    care_cost: JSON.stringify({ food: 1000, litter: 800, vet: 1000 }),
    daily_routine: JSON.stringify([
      { time: '07:00 AM', action: 'Sunrise whistling tune & seed breakfast 🦜' },
      { time: '01:00 PM', action: 'Out-of-cage flight exercise & mirror games 🪞' },
      { time: '05:30 PM', action: 'Nut treat foraging & head scritches 🥜' },
      { time: '08:30 PM', action: 'Covered cage night-night whispers 💤' }
    ]),
    created_at: Date.now() - 3600000 * 24 * 10
  }
];

// Initialize Database Tables & Default Seed Data
export const initDB = async () => {
  try {
    const SQL = await initSqlJs();

    if (fs.existsSync(dbPath)) {
      const fileBuffer = fs.readFileSync(dbPath);
      db = new SQL.Database(fileBuffer);
      console.log('✅ Loaded existing WebAssembly SQLite database from file.');
    } else {
      db = new SQL.Database();
      console.log('✨ Created fresh WebAssembly SQLite database.');
    }

    // 1. Create Pets Table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS pets (
        id TEXT PRIMARY KEY,
        owner_id TEXT DEFAULT 'system',
        name TEXT NOT NULL,
        microchip_id TEXT UNIQUE NOT NULL,
        category TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Available',
        description TEXT NOT NULL,
        image_url TEXT,
        is_favorite INTEGER DEFAULT 0,
        treats_count INTEGER DEFAULT 0,
        tags TEXT DEFAULT '[]',
        traits TEXT DEFAULT '{}',
        care_cost TEXT DEFAULT '{}',
        daily_routine TEXT DEFAULT '[]',
        created_at INTEGER NOT NULL
      )
    `);

    // Ensure owner_id column exists on existing databases
    try {
      await dbRun(`ALTER TABLE pets ADD COLUMN owner_id TEXT DEFAULT 'system'`);
    } catch (e) {
      // Column already exists
    }

    // 2. Create Users Table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name TEXT NOT NULL,
        phone TEXT,
        address TEXT,
        created_at INTEGER NOT NULL
      )
    `);

    // 3. Create Adoption Applications Table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS adoption_applications (
        id TEXT PRIMARY KEY,
        pet_id TEXT NOT NULL,
        pet_name TEXT NOT NULL,
        adopter_name TEXT NOT NULL,
        adopter_email TEXT NOT NULL,
        adopter_phone TEXT NOT NULL,
        adopter_id_num TEXT NOT NULL,
        adopter_address TEXT NOT NULL,
        adoption_type TEXT NOT NULL,
        signature_data_url TEXT NOT NULL,
        status TEXT DEFAULT 'Pending',
        created_at INTEGER NOT NULL
      )
    `);

    // 4. Create Admins Table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS admins (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at INTEGER NOT NULL
      )
    `);

    // 5. Seed Pets if table is empty
    const petCount = await dbGet(`SELECT COUNT(*) as count FROM pets`);
    if (!petCount || petCount.count === 0) {
      console.log('🌱 Seeding initial pets dataset into SQLite database...');
      for (const pet of INITIAL_PETS_SEED) {
        await dbRun(
          `INSERT INTO pets (id, owner_id, name, microchip_id, category, status, description, image_url, is_favorite, treats_count, tags, traits, care_cost, daily_routine, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            pet.id,
            'system',
            pet.name,
            pet.microchip_id,
            pet.category,
            pet.status,
            pet.description,
            pet.image_url,
            pet.is_favorite,
            pet.treats_count,
            pet.tags,
            pet.traits,
            pet.care_cost,
            pet.daily_routine,
            pet.createdAt || pet.created_at || Date.now()
          ]
        );
      }
      console.log('✅ Successfully seeded 8 initial pets.');
    }

    // 5. Seed Admin Account if table is empty
    const adminCount = await dbGet(`SELECT COUNT(*) as count FROM admins`);
    if (!adminCount || adminCount.count === 0) {
      console.log('🔑 Seeding default admin user ("admin" / "admin123")...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await dbRun(
        `INSERT INTO admins (id, username, password_hash, created_at) VALUES (?, ?, ?, ?)`,
        [`admin-1`, `admin`, hashedPassword, Date.now()]
      );
      console.log('✅ Default admin user created successfully.');
    }

  } catch (err) {
    console.error('❌ Error initializing WebAssembly SQLite database:', err);
  }
};

export default db;
