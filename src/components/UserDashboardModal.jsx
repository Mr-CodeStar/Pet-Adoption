import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Plus, Trash2, Edit, X, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import api from '../services/api';

export default function UserDashboardModal({
  isOpen,
  onClose,
  currentUser,
  userToken,
  pets = [],
  isDarkMode,
  onEditPet,
  onDeletePet,
  onProfileUpdate,
  onOpenRegisterPet
}) {
  const [activeTab, setActiveTab] = useState('pets'); // 'pets' | 'profile'
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.fullName || '');
      setPhone(currentUser.phone || '');
      setAddress(currentUser.address || '');
    }
  }, [currentUser]);

  if (!isOpen || !currentUser) return null;

  // Pets registered by this logged in user
  const myPets = pets.filter((p) => p.ownerId === currentUser.id);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');
    setLoading(true);

    try {
      const res = await api.updateUserProfile({ fullName, phone, address }, userToken);
      if (res.success && res.user) {
        onProfileUpdate(res.user, res.token);
        setMsg('Profile details updated successfully!');
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const modalBg = isDarkMode
    ? 'bg-slate-950/95 border-slate-800 text-slate-100'
    : 'bg-white border-slate-200 text-slate-800';

  const cardBg = isDarkMode
    ? 'bg-slate-900/80 border-slate-800/80'
    : 'bg-slate-50 border-slate-200';

  const inputClass = isDarkMode
    ? 'bg-slate-900 border-slate-800 text-slate-100 focus:border-emerald-500'
    : 'bg-white border-slate-300 text-slate-900 focus:border-emerald-600';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl border transition-all ${modalBg}`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Dashboard Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-emerald-500/20">
            {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">{currentUser.fullName}</h2>
            <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              {currentUser.email}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-slate-900/60 p-1 rounded-2xl border border-slate-800/80 mb-6 text-xs font-bold gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('pets')}
            className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === 'pets'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Heart className="w-4 h-4" />
            My Pets ({myPets.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            Profile Details
          </button>
          {currentUser.role === 'admin' && (
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onOpenAdmin) onOpenAdmin();
              }}
              className="px-3 py-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition flex items-center justify-center gap-1.5 shrink-0"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Admin Portal
            </button>
          )}
        </div>

        {/* TAB 1: MY REGISTERED PETS */}
        {activeTab === 'pets' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold">Pets Offered for Adoption</h3>
                <p className="text-xs text-slate-400">Manage, update, or remove pets registered under your account</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenRegisterPet) onOpenRegisterPet();
                }}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-extrabold flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" />
                Register New Pet
              </button>
            </div>

            {myPets.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {myPets.map((pet) => (
                  <div key={pet.id} className={`p-4 rounded-2xl border flex flex-col justify-between ${cardBg}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={pet.imageUrl}
                        alt={pet.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-700/50"
                      />
                      <div>
                        <h4 className="text-sm font-black flex items-center gap-1.5">
                          {pet.name}
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            pet.status === 'Available'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : pet.status === 'Urgent'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}>
                            {pet.status}
                          </span>
                        </h4>
                        <p className="text-xs text-slate-400">{pet.category} • {pet.microchipId}</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 mb-4">{pet.description}</p>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60">
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onEditPet(pet);
                        }}
                        className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                      >
                        <Edit className="w-3.5 h-3.5 text-sky-400" />
                        Edit Pet
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeletePet(pet.id, pet.name)}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold transition"
                        title="Delete Pet"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl border border-dashed border-slate-800 space-y-3">
                <div className="text-3xl">🐾</div>
                <h4 className="text-sm font-extrabold">No Pets Registered Yet</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  You haven't listed any pets for adoption yet. Register a pet to make them available in the shared adoption marketplace!
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenRegisterPet) onOpenRegisterPet();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-extrabold inline-flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" />
                  List a Pet Now
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PERSONAL DETAILS */}
        {activeTab === 'profile' && (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            {msg && (
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                ✓ {msg}
              </div>
            )}
            {error && (
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold">
                ⚠️ {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">Gmail / Email Address (Immutable)</label>
              <div className="relative opacity-70">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={currentUser.email}
                  disabled
                  className={`w-full rounded-2xl pl-10 pr-4 py-2.5 text-xs font-medium border ${inputClass} cursor-not-allowed`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`w-full rounded-2xl pl-10 pr-4 py-2.5 text-xs font-medium border focus:outline-none transition ${inputClass}`}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">Contact Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full rounded-2xl pl-10 pr-4 py-2.5 text-xs font-medium border focus:outline-none transition ${inputClass}`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">Address / Location</label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Full residence address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={`w-full rounded-2xl pl-10 pr-4 py-2.5 text-xs font-medium border focus:outline-none transition ${inputClass}`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-extrabold shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-400 transition"
            >
              {loading ? 'Saving Changes...' : 'Save Profile Details'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
