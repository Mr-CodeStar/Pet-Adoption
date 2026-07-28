import React, { useState } from 'react';
import {
  Heart,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  Plus,
  User,
  Search,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  HeartHandshake,
  HelpCircle,
  Clock,
  IndianRupee,
  Smile,
  Home,
  Users,
  Award,
  Star
} from 'lucide-react';

export default function LandingPage({
  isDarkMode,
  onGoToMarketplace,
  onOpenAuth,
  onOpenRegisterPet,
  currentUser
}) {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const faqs = [
    {
      q: 'How does pet adoption work on PawPath?',
      a: 'Browse our shared adoption marketplace, filter by animal category or lifestyle compatibility, and view pet profiles. When you find a pet you love, click "Adopt" to fill out the digital agreement and sign with your signature on canvas!'
    },
    {
      q: 'Can I list a pet for adoption if I can no longer care for them?',
      a: 'Yes! Simply create a free user account with your Gmail, then fill out the Pet Registration form. You can detail your pet’s bio, daily schedule, monthly care costs, and traits so prospective adopters get a complete picture.'
    },
    {
      q: 'Can other users edit or delete my registered pet profiles?',
      a: 'No. PawPath enforces strict ownership security. Only you (the account owner who registered the pet) or shelter administrators have permission to edit or delete your pet profiles.'
    },
    {
      q: 'Is there an adoption fee or cost?',
      a: 'PawPath provides a transparent monthly care budget breakdown (food, vet, supplies in INR ₹) for each pet so adopters know exactly what to expect. PawPath itself does not charge hidden platform adoption fees.'
    },
    {
      q: 'How does the Lifestyle Compatibility Matchmeter work?',
      a: 'Our real-time match engine computes a compatibility percentage based on your living situation (apartment, work hours, kids/other pets, activity level) against each pet’s energy and temperament traits.'
    }
  ];

  const mainBg = isDarkMode ? 'bg-[#090d16] text-slate-100' : 'bg-[#f4f7fb] text-slate-900';
  const glassCard = isDarkMode ? 'glass-panel-3d bg-slate-900/60 border-slate-800' : 'glass-panel-3d bg-white/80 border-slate-200';
  const headingColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subTextColor = isDarkMode ? 'text-slate-400' : 'text-slate-600';

  return (
    <div className={`min-h-screen ${mainBg} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
        
        {/* HERO SECTION */}
        <section className="relative pt-6 pb-12 overflow-hidden text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wider animate-pulse">
            <Sparkles className="w-4 h-4" />
            Connecting Loving Homes with Pets in Need
          </div>

          <h1 className={`text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-tight ${headingColor}`}>
            Find Your <span className="gradient-text-emerald">Pawfect Companion</span> & Give Them a Forever Home 🐾
          </h1>

          <p className={`text-sm sm:text-lg max-w-2xl mx-auto font-medium ${subTextColor}`}>
            PawPath bridges the gap between pet owners, animal shelters, and compassionate adopters. Explore verified pet profiles, complete with daily routines, personality traits, and digital adoption certificates.
          </p>

          {/* Action Callouts */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onGoToMarketplace}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-sm shadow-xl shadow-emerald-500/25 active:scale-95 transition flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              Browse Adoption Marketplace
              <ArrowRight className="w-4 h-4" />
            </button>

            {currentUser ? (
              <button
                onClick={onOpenRegisterPet}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-emerald-300 font-extrabold text-sm border border-slate-700 active:scale-95 transition flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5 text-emerald-400" />
                Register a Pet for Adoption
              </button>
            ) : (
              <button
                onClick={() => onOpenAuth('register')}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-sm border border-slate-700 active:scale-95 transition flex items-center justify-center gap-2"
              >
                <User className="w-5 h-5 text-emerald-400" />
                Sign Up to List a Pet
              </button>
            )}
          </div>

          {/* Hero Feature Badges */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-slate-400">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% Free Public Adoption Marketplace</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Owner Ownership Controls</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Digital Signature Certificate</span>
          </div>
        </section>

        {/* IMPACT STATS BANNER */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`p-6 rounded-3xl border text-center space-y-2 ${glassCard}`}>
            <div className="text-3xl font-black text-emerald-400">500+</div>
            <div className="text-xs font-extrabold text-slate-400">Happy Adoptions</div>
          </div>
          <div className={`p-6 rounded-3xl border text-center space-y-2 ${glassCard}`}>
            <div className="text-3xl font-black text-teal-400">100%</div>
            <div className="text-xs font-extrabold text-slate-400">Verified Profiles</div>
          </div>
          <div className={`p-6 rounded-3xl border text-center space-y-2 ${glassCard}`}>
            <div className="text-3xl font-black text-amber-400">24/7</div>
            <div className="text-xs font-extrabold text-slate-400">Live AI Match Engine</div>
          </div>
          <div className={`p-6 rounded-3xl border text-center space-y-2 ${glassCard}`}>
            <div className="text-3xl font-black text-rose-400">0 Fees</div>
            <div className="text-xs font-extrabold text-slate-400">Hidden Charges</div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-block text-xs font-black uppercase text-emerald-400 tracking-wider">Simple Process</div>
            <h2 className={`text-2xl sm:text-4xl font-black ${headingColor}`}>How PawPath Works</h2>
            <p className={`text-xs sm:text-sm max-w-xl mx-auto ${subTextColor}`}>Three simple steps to rehome or adopt a pet with full transparency.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className={`p-6 rounded-3xl border space-y-4 relative ${glassCard}`}>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl font-black">
                1
              </div>
              <h3 className={`text-lg font-extrabold ${headingColor}`}>Create Account & Browse</h3>
              <p className={`text-xs leading-relaxed ${subTextColor}`}>
                Register with your Gmail address to list your pets for adoption or browse available dogs, cats, rabbits, birds, hamsters, and exotics.
              </p>
            </div>

            {/* Step 2 */}
            <div className={`p-6 rounded-3xl border space-y-4 relative ${glassCard}`}>
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center text-xl font-black">
                2
              </div>
              <h3 className={`text-lg font-extrabold ${headingColor}`}>Review Care & Traits</h3>
              <p className={`text-xs leading-relaxed ${subTextColor}`}>
                Inspect detailed pet profiles with daily routine schedules, energy/cuddle traits sliders, monthly care budgets (food, vet, supplies), and health tags.
              </p>
            </div>

            {/* Step 3 */}
            <div className={`p-6 rounded-3xl border space-y-4 relative ${glassCard}`}>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl font-black">
                3
              </div>
              <h3 className={`text-lg font-extrabold ${headingColor}`}>Digital Adoption Certificate</h3>
              <p className={`text-xs leading-relaxed ${subTextColor}`}>
                Click "Adopt" to generate an official adoption agreement contract, sign directly on the digital signature canvas, and print or download your certificate!
              </p>
            </div>
          </div>
        </section>

        {/* TRANSPARENT PET CARE FEATURES */}
        <section className={`p-8 sm:p-10 rounded-3xl border space-y-6 ${glassCard}`}>
          <div className="max-w-2xl space-y-2">
            <h2 className={`text-2xl sm:text-3xl font-black ${headingColor}`}>Built for Pet Welfare & Complete Transparency</h2>
            <p className={`text-xs sm:text-sm ${subTextColor}`}>
              Every pet profile registered on PawPath includes comprehensive details so potential adopters are fully prepared for responsible pet parenting.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2">
              <Zap className="w-6 h-6 text-emerald-400" />
              <h4 className="text-sm font-extrabold">Personality Traits</h4>
              <p className="text-xs text-slate-400">Energy, cuddliness, vocalness, kid friendliness, and grooming requirements.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2">
              <IndianRupee className="w-6 h-6 text-teal-400" />
              <h4 className="text-sm font-extrabold">Care Budget Breakdown</h4>
              <p className="text-xs text-slate-400">Estimated monthly costs for food, veterinary care, and litter/supplies.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2">
              <Clock className="w-6 h-6 text-amber-400" />
              <h4 className="text-sm font-extrabold">Daily Routine Schedule</h4>
              <p className="text-xs text-slate-400">Morning walks, feeding times, play sessions, and bedtime routines.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2">
              <ShieldCheck className="w-6 h-6 text-indigo-400" />
              <h4 className="text-sm font-extrabold">Owner Control</h4>
              <p className="text-xs text-slate-400">Full control to add, edit, or delete your own listed pets securely.</p>
            </div>
          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS (FAQ) */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-emerald-400 tracking-wider">
              <HelpCircle className="w-4 h-4" /> Got Questions?
            </div>
            <h2 className={`text-2xl sm:text-4xl font-black ${headingColor}`}>Frequently Asked Questions</h2>
            <p className={`text-xs sm:text-sm max-w-xl mx-auto ${subTextColor}`}>Everything you need to know about adopting or registering pets on PawPath.</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className={`rounded-2xl border transition-all overflow-hidden ${glassCard}`}
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base focus:outline-none"
                  >
                    <span className={headingColor}>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-0 text-xs sm:text-sm text-slate-400 border-t border-slate-800/40 leading-relaxed animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* BOTTOM CALL TO ACTION */}
        <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-center space-y-6 shadow-2xl shadow-emerald-500/20">
          <h2 className="text-2xl sm:text-4xl font-black">Ready to Find Your New Best Friend?</h2>
          <p className="text-xs sm:text-sm max-w-xl mx-auto text-emerald-100 font-medium">
            Join hundreds of happy families and pet parents. Register your pet for adoption or start browsing verified pets today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onGoToMarketplace}
              className="px-8 py-3.5 rounded-2xl bg-white text-emerald-900 font-black text-sm shadow-lg hover:bg-emerald-50 active:scale-95 transition flex items-center gap-2"
            >
              Explore Adoption Marketplace
              <ArrowRight className="w-4 h-4" />
            </button>
            {!currentUser && (
              <button
                onClick={() => onOpenAuth('register')}
                className="px-6 py-3.5 rounded-2xl bg-emerald-800/60 hover:bg-emerald-800 text-white font-extrabold text-sm border border-emerald-400/40 active:scale-95 transition"
              >
                Create Account Now
              </button>
            )}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="pt-8 border-t border-slate-800/60 text-center space-y-3 text-xs text-slate-500">
          <div className="flex items-center justify-center gap-2 font-bold text-slate-400">
            <span className="text-base">🐾</span> PawPath Pet Adoption Portal © 2026
          </div>
          <p>Connecting shelter animals & private pets with loving lifelong homes.</p>
        </footer>

      </div>
    </div>
  );
}
