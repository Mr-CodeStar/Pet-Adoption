import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  User,
  LogOut,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  RefreshCw,
  Search,
  Check,
  AlertCircle,
  FileText,
  Heart,
  Tag,
  Sliders,
  DollarSign,
  Calendar,
  X,
  Sparkles,
  TrendingUp,
  Activity,
  Users
} from 'lucide-react';
import api from '../services/api';

const AVAILABLE_CARE_TAGS = [
  'Vaccinated 💉',
  'House Trained 🏡',
  'Kid Friendly 👶',
  'Microchipped 🏷️',
  'Special Needs 🩺'
];

export default function AdminPanel({ isOpen, onClose, isDarkMode, onPetsUpdated }) {
  const [adminToken, setAdminToken] = useState(localStorage.getItem('pawpath_admin_token') || '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'pets' | 'applications'
  const [stats, setStats] = useState(null);
  const [pets, setPets] = useState([]);
  const [applications, setApplications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals inside Admin
  const [isAddEditPetModalOpen, setIsAddEditPetModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState(null); // null = add, object = edit
  const [selectedApp, setSelectedApp] = useState(null); // Application detail modal

  // Pet Form State
  const [petName, setPetName] = useState('');
  const [microchipId, setMicrochipId] = useState('');
  const [category, setCategory] = useState('Dog');
  const [status, setStatus] = useState('Available');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedTags, setSelectedTags] = useState(['Vaccinated 💉']);
  const [energyTrait, setEnergyTrait] = useState(80);
  const [cuddleTrait, setCuddleTrait] = useState(85);
  const [vocalnessTrait, setVocalnessTrait] = useState(40);
  const [kidFriendlyTrait, setKidFriendlyTrait] = useState(90);
  const [groomingTrait, setGroomingTrait] = useState(50);
  const [foodCost, setFoodCost] = useState(2500);
  const [vetCost, setVetCost] = useState(1500);
  const [litterCost, setLitterCost] = useState(1000);
  const [formError, setFormError] = useState('');

  // Auto-verify token on mount or open
  useEffect(() => {
    if (adminToken && isOpen) {
      verifyAndLoadData();
    }
  }, [adminToken, isOpen]);

  const verifyAndLoadData = async () => {
    setLoading(true);
    try {
      await api.verifyToken(adminToken);
      await loadAdminData();
    } catch (err) {
      console.warn('Session expired, clearing token.');
      setAdminToken('');
      localStorage.removeItem('pawpath_admin_token');
    } finally {
      setLoading(false);
    }
  };

  const loadAdminData = async () => {
    try {
      const [statsData, petsData, appsData] = await Promise.all([
        api.getAdminStats(adminToken),
        api.getPets(),
        api.getApplications(adminToken)
      ]);
      setStats(statsData);
      setPets(petsData);
      setApplications(appsData);
      if (onPetsUpdated) onPetsUpdated(petsData);
    } catch (err) {
      console.error('Error loading admin dataset:', err);
    }
  };

  // Login Handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    if (!username.trim() || !password.trim()) {
      setLoginError('Please enter username and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.adminLogin(username.trim(), password.trim());
      setAdminToken(res.token);
      localStorage.setItem('pawpath_admin_token', res.token);
      setUsername('');
      setPassword('');
      await loadAdminData();
    } catch (err) {
      setLoginError(err.message || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  // Logout Handler
  const handleLogout = () => {
    setAdminToken('');
    localStorage.removeItem('pawpath_admin_token');
  };

  // Quick Pet Status Toggle
  const handleStatusChange = async (petId, newStatus) => {
    try {
      await api.updatePet(petId, { status: newStatus }, adminToken);
      await loadAdminData();
    } catch (err) {
      alert('Failed to update pet status: ' + err.message);
    }
  };

  // Delete Pet Handler
  const handleDeletePet = async (petId, petName) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${petName}"?`)) return;
    try {
      await api.deletePet(petId, adminToken);
      await loadAdminData();
    } catch (err) {
      alert('Failed to delete pet: ' + err.message);
    }
  };

  // Application Approval / Rejection
  const handleApplicationStatus = async (appId, newStatus) => {
    try {
      await api.updateApplicationStatus(appId, newStatus, adminToken);
      await loadAdminData();
    } catch (err) {
      alert('Failed to update application: ' + err.message);
    }
  };

  // Delete Application
  const handleDeleteApplication = async (appId) => {
    if (!window.confirm('Are you sure you want to delete this adoption record?')) return;
    try {
      await api.deleteApplication(appId, adminToken);
      if (selectedApp?.id === appId) setSelectedApp(null);
      await loadAdminData();
    } catch (err) {
      alert('Failed to delete application: ' + err.message);
    }
  };

  // Open Pet Add Modal
  const openAddPetModal = () => {
    setEditingPet(null);
    setPetName('');
    setMicrochipId(`PET-${Math.floor(1000 + Math.random() * 9000)}`);
    setCategory('Dog');
    setStatus('Available');
    setDescription('');
    setImageUrl('');
    setSelectedTags(['Vaccinated 💉']);
    setEnergyTrait(85);
    setCuddleTrait(90);
    setVocalnessTrait(40);
    setKidFriendlyTrait(95);
    setGroomingTrait(50);
    setFoodCost(2500);
    setVetCost(1500);
    setLitterCost(1000);
    setFormError('');
    setIsAddEditPetModalOpen(true);
  };

  // Open Pet Edit Modal
  const openEditPetModal = (pet) => {
    setEditingPet(pet);
    setPetName(pet.name);
    setMicrochipId(pet.microchipId);
    setCategory(pet.category);
    setStatus(pet.status);
    setDescription(pet.description);
    setImageUrl(pet.imageUrl || '');
    setSelectedTags(pet.tags || []);
    setEnergyTrait(pet.traits?.energy || 70);
    setCuddleTrait(pet.traits?.cuddle || 80);
    setVocalnessTrait(pet.traits?.vocalness || 40);
    setKidFriendlyTrait(pet.traits?.kidFriendly || 85);
    setGroomingTrait(pet.traits?.grooming || 50);
    setFoodCost(pet.careCost?.food || 2000);
    setVetCost(pet.careCost?.vet || 1200);
    setLitterCost(pet.careCost?.litter || 1000);
    setFormError('');
    setIsAddEditPetModalOpen(true);
  };

  // Save Pet (Create or Update)
  const handleSavePet = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!petName.trim()) {
      setFormError('Pet name is required.');
      return;
    }
    if (!description.trim()) {
      setFormError('Pet bio/description is required.');
      return;
    }

    const payload = {
      name: petName.trim(),
      microchipId: microchipId.trim() || `PET-${Math.floor(1000 + Math.random() * 9000)}`,
      category,
      status,
      description: description.trim(),
      imageUrl: imageUrl.trim(),
      tags: selectedTags,
      traits: {
        energy: Number(energyTrait),
        cuddle: Number(cuddleTrait),
        vocalness: Number(vocalnessTrait),
        kidFriendly: Number(kidFriendlyTrait),
        grooming: Number(groomingTrait)
      },
      careCost: {
        food: Number(foodCost),
        vet: Number(vetCost),
        litter: Number(litterCost)
      },
      dailyRoutine: editingPet?.dailyRoutine || [
        { time: '08:00 AM', action: 'Morning play & meal kibble 🥣' },
        { time: '01:00 PM', action: 'Afternoon sunbath & rest ☀️' },
        { time: '06:00 PM', action: 'Evening treats & walk 🐾' },
        { time: '09:30 PM', action: 'Cozy bedtime sleep 💤' }
      ]
    };

    try {
      if (editingPet) {
        await api.updatePet(editingPet.id, payload, adminToken);
      } else {
        await api.createPet(payload, adminToken);
      }
      setIsAddEditPetModalOpen(false);
      await loadAdminData();
    } catch (err) {
      setFormError(err.message || 'Failed to save pet details.');
    }
  };

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  if (!isOpen) return null;

  const bgClass = isDarkMode ? 'bg-[#0f172a] text-slate-100' : 'bg-white text-slate-900';
  const cardBgClass = isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200';
  const inputClass = isDarkMode
    ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500'
    : 'bg-white border-slate-300 text-slate-900 focus:border-emerald-500';

  // Render Login Screen if not authenticated
  if (!adminToken) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
        <div className={`relative w-full max-w-md p-6 sm:p-8 rounded-3xl border shadow-2xl ${bgClass} border-slate-700 space-y-6`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="w-9 h-9" />
            </div>
            <h2 className="text-2xl font-black tracking-tight">Admin Authentication</h2>
            <p className="text-xs text-slate-400">Sign in with administrator credentials to manage sanctuary data.</p>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-1">
            <div className="font-extrabold text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Default Demo Credentials
            </div>
            <p className="text-slate-300 text-[11px]">
              Username: <strong className="text-emerald-300">admin</strong> • Password: <strong className="text-emerald-300">admin123</strong>
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold mb-1.5 uppercase text-slate-400">Admin Username</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-bold border transition ${inputClass}`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5 uppercase text-slate-400">Security Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-bold border transition ${inputClass}`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Sign In to Admin Portal
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const filteredPets = pets.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.microchipId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-hidden">
      <div className={`relative w-full max-w-6xl max-h-[96vh] rounded-3xl border shadow-2xl flex flex-col ${bgClass} border-slate-700`}>
        
        {/* Admin Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black">PawPath Admin Dashboard</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  SQLite Connected
                </span>
              </div>
              <p className="text-xs text-slate-400">Authenticated Administrator Workspace</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadAdminData}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex border-b border-slate-800 px-6 bg-slate-950/40">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: TrendingUp },
            { id: 'pets', label: `Manage Pets (${pets.length})`, icon: Activity },
            { id: 'applications', label: `Adoption Requests (${applications.length})`, icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3.5 px-4 text-xs font-extrabold flex items-center gap-2 border-b-2 transition ${
                  activeTab === tab.id
                    ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: OVERVIEW METRICS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className={`p-5 rounded-2xl border ${cardBgClass} space-y-2`}>
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-bold">Total Pet Profiles</span>
                    <Users className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-black text-white">{stats?.totalPets || pets.length}</div>
                  <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {stats?.availablePets || 0} Available for adoption
                  </div>
                </div>

                <div className={`p-5 rounded-2xl border ${cardBgClass} space-y-2`}>
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-bold">Adoption Requests</span>
                    <FileText className="w-5 h-5 text-sky-400" />
                  </div>
                  <div className="text-3xl font-black text-white">{stats?.totalApplications || applications.length}</div>
                  <div className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {stats?.pendingApplications || 0} Pending reviews
                  </div>
                </div>

                <div className={`p-5 rounded-2xl border ${cardBgClass} space-y-2`}>
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-bold">Urgent Cases</span>
                    <AlertCircle className="w-5 h-5 text-rose-400" />
                  </div>
                  <div className="text-3xl font-black text-rose-400">{stats?.urgentPets || 0}</div>
                  <div className="text-[11px] text-slate-400">High-priority care</div>
                </div>

                <div className={`p-5 rounded-2xl border ${cardBgClass} space-y-2`}>
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-bold">Total Virtual Treats</span>
                    <Heart className="w-5 h-5 text-pink-400" />
                  </div>
                  <div className="text-3xl font-black text-pink-400">{stats?.totalTreats || 0}</div>
                  <div className="text-[11px] text-slate-400">Given by adopters</div>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className={`p-6 rounded-3xl border ${cardBgClass} space-y-4`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black">Admin Management Portal</h3>
                    <p className="text-xs text-slate-400">Directly manage pet entries and review digital guardianship forms.</p>
                  </div>
                  <button
                    onClick={openAddPetModal}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add New Pet Profile
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PETS CRUD TABLE */}
          {activeTab === 'pets' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search pets by name, microchip ID, or species..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs font-bold border ${inputClass}`}
                  />
                </div>

                <button
                  onClick={openAddPetModal}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  Add New Pet
                </button>
              </div>

              <div className={`rounded-2xl border ${cardBgClass} overflow-x-auto`}>
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-extrabold uppercase text-[10px] bg-slate-900/60">
                      <th className="p-3.5">Pet Info</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Care Budget (₹)</th>
                      <th className="p-3.5">Treats</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {filteredPets.map((pet) => (
                      <tr key={pet.id} className="hover:bg-slate-800/30 transition">
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            <img
                              src={pet.imageUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1'}
                              alt={pet.name}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-700 shrink-0"
                            />
                            <div>
                              <div className="font-extrabold text-white">{pet.name}</div>
                              <div className="text-[10px] font-mono text-slate-400">{pet.microchipId}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-[11px] font-bold">
                            {pet.category}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <select
                            value={pet.status}
                            onChange={(e) => handleStatusChange(pet.id, e.target.value)}
                            className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 text-xs font-bold text-emerald-400 focus:outline-none"
                          >
                            <option value="Available">Available</option>
                            <option value="Pending">Pending</option>
                            <option value="Urgent">Urgent</option>
                            <option value="Adopted">Adopted</option>
                          </select>
                        </td>
                        <td className="p-3.5 font-bold text-slate-300">
                          ₹{((pet.careCost?.food || 0) + (pet.careCost?.vet || 0) + (pet.careCost?.litter || 0)).toLocaleString('en-IN')}
                        </td>
                        <td className="p-3.5 font-bold text-pink-400">
                          🦴 {pet.treatsCount || 0}
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditPetModal(pet)}
                              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 transition"
                              title="Edit Pet"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePet(pet.id, pet.name)}
                              className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                              title="Delete Pet"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ADOPTION APPLICATIONS */}
          {activeTab === 'applications' && (
            <div className="space-y-4">
              <div className={`rounded-2xl border ${cardBgClass} overflow-x-auto`}>
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-extrabold uppercase text-[10px] bg-slate-900/60">
                      <th className="p-3.5">Adopter Details</th>
                      <th className="p-3.5">Target Pet</th>
                      <th className="p-3.5">Adoption Type</th>
                      <th className="p-3.5">Date</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {applications.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400">
                          No adoption applications submitted yet.
                        </td>
                      </tr>
                    ) : (
                      applications.map((app) => (
                        <tr key={app.id} className="hover:bg-slate-800/30 transition">
                          <td className="p-3.5">
                            <div className="font-extrabold text-white">{app.adopterName}</div>
                            <div className="text-[10px] text-slate-400">{app.adopterEmail} • {app.adopterPhone}</div>
                          </td>
                          <td className="p-3.5 font-bold text-emerald-400">{app.petName}</td>
                          <td className="p-3.5 text-slate-300 font-bold">{app.adoptionType}</td>
                          <td className="p-3.5 text-slate-400">
                            {new Date(app.createdAt).toLocaleDateString('en-IN')}
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                              app.status === 'Approved'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : app.status === 'Rejected'
                                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            }`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setSelectedApp(app)}
                                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 transition"
                                title="View Signature & Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {app.status !== 'Approved' && (
                                <button
                                  onClick={() => handleApplicationStatus(app.id, 'Approved')}
                                  className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition"
                                  title="Approve Application"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </button>
                              )}

                              {app.status !== 'Rejected' && (
                                <button
                                  onClick={() => handleApplicationStatus(app.id, 'Rejected')}
                                  className="p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition"
                                  title="Reject Application"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              )}

                              <button
                                onClick={() => handleDeleteApplication(app.id)}
                                className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                                title="Delete Record"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ADD / EDIT PET MODAL */}
      {isAddEditPetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className={`relative w-full max-w-2xl p-6 rounded-3xl border shadow-2xl max-h-[92vh] overflow-y-auto ${bgClass} border-slate-700 space-y-4`}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xl font-black">{editingPet ? `Edit ${editingPet.name}` : 'Add New Pet Profile'}</h3>
              <button
                onClick={() => setIsAddEditPetModalOpen(false)}
                className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSavePet} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">Pet Name *</label>
                  <input
                    type="text"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    placeholder="e.g. Bella"
                    className={`w-full px-3.5 py-2 rounded-xl text-xs font-bold border ${inputClass}`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Microchip Tag ID</label>
                  <input
                    type="text"
                    value={microchipId}
                    onChange={(e) => setMicrochipId(e.target.value)}
                    placeholder="PET-XXXX"
                    className={`w-full px-3.5 py-2 rounded-xl text-xs font-bold border ${inputClass}`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Species Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`w-full px-3.5 py-2 rounded-xl text-xs font-bold border ${inputClass}`}
                  >
                    {['Dog', 'Cat', 'Bird', 'Rabbit', 'Hamster', 'Reptile', 'Fish', 'Pony', 'Exotic'].map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className={`w-full px-3.5 py-2 rounded-xl text-xs font-bold border ${inputClass}`}
                  >
                    {['Available', 'Pending', 'Urgent', 'Adopted'].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Image Direct URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className={`w-full px-3.5 py-2 rounded-xl text-xs font-bold border ${inputClass}`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Pet Bio / Description *</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe pet temperament, history, and medical needs..."
                  className={`w-full px-3.5 py-2 rounded-xl text-xs font-bold border ${inputClass}`}
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-bold mb-1.5">Care Badges / Tags</label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_CARE_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold border transition ${
                        selectedTags.includes(tag)
                          ? 'bg-emerald-500 text-white border-emerald-400'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Traits Sliders */}
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="text-xs font-extrabold uppercase text-emerald-400">Personality Trait Spectrum</div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="flex justify-between font-bold"><span>Energy</span><span>{energyTrait}%</span></label>
                    <input type="range" min="0" max="100" value={energyTrait} onChange={(e) => setEnergyTrait(e.target.value)} className="w-full accent-emerald-500" />
                  </div>
                  <div>
                    <label className="flex justify-between font-bold"><span>Cuddle Bug</span><span>{cuddleTrait}%</span></label>
                    <input type="range" min="0" max="100" value={cuddleTrait} onChange={(e) => setCuddleTrait(e.target.value)} className="w-full accent-emerald-500" />
                  </div>
                  <div>
                    <label className="flex justify-between font-bold"><span>Vocalness</span><span>{vocalnessTrait}%</span></label>
                    <input type="range" min="0" max="100" value={vocalnessTrait} onChange={(e) => setVocalnessTrait(e.target.value)} className="w-full accent-emerald-500" />
                  </div>
                  <div>
                    <label className="flex justify-between font-bold"><span>Kid Friendly</span><span>{kidFriendlyTrait}%</span></label>
                    <input type="range" min="0" max="100" value={kidFriendlyTrait} onChange={(e) => setKidFriendlyTrait(e.target.value)} className="w-full accent-emerald-500" />
                  </div>
                </div>
              </div>

              {/* Care Costs */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-bold mb-1">Food (₹/mo)</label>
                  <input type="number" value={foodCost} onChange={(e) => setFoodCost(e.target.value)} className={`w-full px-3 py-1.5 rounded-xl border ${inputClass}`} />
                </div>
                <div>
                  <label className="block font-bold mb-1">Vet Reserve (₹/mo)</label>
                  <input type="number" value={vetCost} onChange={(e) => setVetCost(e.target.value)} className={`w-full px-3 py-1.5 rounded-xl border ${inputClass}`} />
                </div>
                <div>
                  <label className="block font-bold mb-1">Toys/Litter (₹/mo)</label>
                  <input type="number" value={litterCost} onChange={(e) => setLitterCost(e.target.value)} className={`w-full px-3 py-1.5 rounded-xl border ${inputClass}`} />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddEditPetModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-lg shadow-emerald-500/20"
                >
                  Save Pet Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* APPLICATION DETAILS & DIGITAL SIGNATURE PREVIEW MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className={`relative w-full max-w-lg p-6 rounded-3xl border shadow-2xl ${bgClass} border-slate-700 space-y-4`}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-black">Adoption Application Deed</h3>
                <p className="text-xs text-slate-400">Submitted for {selectedApp.petName}</p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div><span className="text-slate-400">Adopter:</span> <strong className="text-white block">{selectedApp.adopterName}</strong></div>
                <div><span className="text-slate-400">Email:</span> <strong className="text-white block">{selectedApp.adopterEmail}</strong></div>
                <div><span className="text-slate-400">Phone:</span> <strong className="text-white block">{selectedApp.adopterPhone}</strong></div>
                <div><span className="text-slate-400">Gov ID Tag:</span> <strong className="text-white block">{selectedApp.adopterIdNum}</strong></div>
              </div>

              <div>
                <span className="text-slate-400 font-bold">Residential Address:</span>
                <p className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-200 mt-1">{selectedApp.adopterAddress}</p>
              </div>

              <div>
                <span className="text-slate-400 font-bold">Adoption Classification:</span>
                <p className="font-extrabold text-emerald-400 mt-0.5">{selectedApp.adoptionType}</p>
              </div>

              {/* Digital Signature Preview */}
              <div>
                <span className="text-slate-400 font-bold block mb-1">Adopter Digital Signature:</span>
                <div className="p-2 rounded-2xl bg-slate-950 border border-emerald-500/40 flex items-center justify-center">
                  <img
                    src={selectedApp.signatureDataUrl}
                    alt="Digital Signature"
                    className="max-h-24 object-contain filter invert opacity-90"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
              {selectedApp.status !== 'Approved' && (
                <button
                  onClick={() => {
                    handleApplicationStatus(selectedApp.id, 'Approved');
                    setSelectedApp({ ...selectedApp, status: 'Approved' });
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> Approve Deed
                </button>
              )}
              {selectedApp.status !== 'Rejected' && (
                <button
                  onClick={() => {
                    handleApplicationStatus(selectedApp.id, 'Rejected');
                    setSelectedApp({ ...selectedApp, status: 'Rejected' });
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 font-extrabold text-xs"
                >
                  Reject Deed
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
