import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Search,
  Plus,
  Trash2,
  Heart,
  Sparkles,
  RefreshCw,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  HeartHandshake,
  ShieldCheck,
  Tag,
  Eye,
  FolderOpen,
  Sun,
  Moon,
  LayoutGrid,
  FilePlus,
  X,
  Maximize2,
  Volume2,
  Gift,
  IndianRupee,
  Calendar,
  Sparkle,
  Zap,
  Smile,
  Home,
  Briefcase,
  Users,
  SlidersHorizontal,
  Award,
  TrendingUp,
  Activity,
  UserCheck,
  Feather,
  Flame,
  FileText,
  Download,
  PenTool,
  Printer,
  Check,
  ShoppingBag,
  User,
  Phone,
  Mail,
  MapPin,
  IdCard,
  CheckSquare
} from 'lucide-react';

// Extended Fallback Images by Category
const CATEGORY_FALLBACKS = {
  Dog: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600',
  Cat: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&q=80&w=600',
  Bird: 'https://images.unsplash.com/photo-1522858547137-f1dcec554f55?auto=format&fit=crop&q=80&w=600',
  Rabbit: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&q=80&w=600',
  Hamster: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&q=80&w=600',
  Reptile: 'https://images.unsplash.com/photo-1563460716037-460a3ad24ba9?auto=format&fit=crop&q=80&w=600',
  Fish: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&q=80&w=600',
  Pony: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=600',
  Exotic: 'https://images.unsplash.com/photo-1504006833117-8886a355efbf?auto=format&fit=crop&q=80&w=600'
};

// Safe Category Fallback Helper
const getCategoryFallbackImage = (cat) => {
  if (!cat) return CATEGORY_FALLBACKS.Dog;
  const key = Object.keys(CATEGORY_FALLBACKS).find(
    (k) => k.toLowerCase() === cat.toLowerCase()
  );
  return CATEGORY_FALLBACKS[key] || CATEGORY_FALLBACKS.Reptile || CATEGORY_FALLBACKS.Dog;
};

// Animal Category Cursors & Trail Particle Mappings
const ANIMAL_CURSOR_MAP = {
  Dog: { icon: '🐶', trail: ['🐾', '🦴', '✨', '🐾'] },
  Cat: { icon: '🐱', trail: ['🐾', '🐟', '✨', '🐾'] },
  Bird: { icon: '🦜', trail: ['🪶', '✨', '🌿', '🪶'] },
  Rabbit: { icon: '🐰', trail: ['🥕', '🐾', '✨', '🥕'] },
  Hamster: { icon: '🐹', trail: ['🌻', '🐾', '✨', '🌻'] },
  Reptile: { icon: '🦎', trail: ['🍃', '✨', '🦎', '🍃'] },
  Fish: { icon: '🐠', trail: ['🫧', '🌊', '✨', '🫧'] },
  Pony: { icon: '🐴', trail: ['🌾', '🍎', '✨', '🌾'] },
  Exotic: { icon: '🦔', trail: ['✨', '🍃', '🐾', '✨'] },
  Default: { icon: '🐶', trail: ['🐾', '✨', '🦴', '🐾'] }
};

// Helper: Animal-specific Treat Symbol
const getPetTreatSymbol = (cat) => {
  switch (cat) {
    case 'Dog': return '🦴';
    case 'Cat': return '🐟';
    case 'Bird': return '🥜';
    case 'Rabbit': return '🥕';
    case 'Hamster': return '🌻';
    case 'Reptile': return '🐛';
    case 'Fish': return '🍤';
    case 'Pony': return '🍎';
    default: return '🍓';
  }
};

// Available Care Badges Options
const AVAILABLE_CARE_TAGS = [
  'Vaccinated 💉',
  'House Trained 🏡',
  'Kid Friendly 👶',
  'Microchipped 🏷️',
  'Special Needs 🩺'
];

// Pre-populated Rich Mock Data (INR Currency Scale)
const INITIAL_MOCK_PETS = [
  {
    id: 'pet-1',
    name: 'Luna',
    microchipId: 'PET-4819',
    category: 'Dog',
    status: 'Available',
    description: 'Playful 2-year-old Golden Retriever mix who loves outdoor fetch, lake swimming, and belly rubs.',
    imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=600',
    isFavorite: true,
    treatsCount: 18,
    tags: ['Vaccinated 💉', 'House Trained 🏡', 'Kid Friendly 👶'],
    traits: { energy: 90, cuddle: 95, vocalness: 40, kidFriendly: 100, grooming: 60 },
    careCost: { food: 2800, litter: 1200, vet: 1500 },
    dailyRoutine: [
      { time: '07:00 AM', action: 'Morning park run & breakfast kibble 🥣' },
      { time: '12:00 PM', action: 'Backyard sunbathing & chew toy playtime 🧸' },
      { time: '05:00 PM', action: 'Evening agility training & belly rubs 🐕' },
      { time: '09:00 PM', action: 'Cozy fireplace nap on orthopedic bed 💤' }
    ],
    createdAt: Date.now() - 3600000 * 24 * 3
  },
  {
    id: 'pet-2',
    name: 'Mochi',
    microchipId: 'PET-9102',
    category: 'Cat',
    status: 'Urgent',
    description: 'Gentle 5-year-old Scottish Fold in urgent need of a quiet foster home. Exceptionally sweet purr machine.',
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600',
    isFavorite: true,
    treatsCount: 24,
    tags: ['Special Needs 🩺', 'Microchipped 🏷️'],
    traits: { energy: 30, cuddle: 100, vocalness: 20, kidFriendly: 70, grooming: 40 },
    careCost: { food: 1800, litter: 1500, vet: 1200 },
    dailyRoutine: [
      { time: '07:30 AM', action: 'Soft meows for wet food & scratching post 🐱' },
      { time: '01:00 PM', action: 'Window perch bird watching 🦜' },
      { time: '06:00 PM', action: 'Lap cuddle session & gentle grooming 🛋️' },
      { time: '10:00 PM', action: 'Nightly purring sleep at foot of bed 💤' }
    ],
    createdAt: Date.now() - 3600000 * 24 * 5
  },
  {
    id: 'pet-3',
    name: 'Barnaby',
    microchipId: 'PET-3374',
    category: 'Rabbit',
    status: 'Pending',
    description: 'Curious Holland Lop bunny who loves fresh mint leaves, wooden chew toys, and cardboard tunnels.',
    imageUrl: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&q=80&w=600',
    isFavorite: false,
    treatsCount: 15,
    tags: ['House Trained 🏡', 'Kid Friendly 👶'],
    traits: { energy: 60, cuddle: 80, vocalness: 10, kidFriendly: 85, grooming: 50 },
    careCost: { food: 1200, litter: 800, vet: 1000 },
    dailyRoutine: [
      { time: '08:00 AM', action: 'Fresh Timothy hay & organic mint leaf feast 🌿' },
      { time: '02:00 PM', action: 'Cardboard tunnel exploration & binkies 🐇' },
      { time: '06:30 PM', action: 'Gentle forehead pets & banana treat 🍌' },
      { time: '09:30 PM', action: 'Flopping down in soft fleece tunnel 💤' }
    ],
    createdAt: Date.now() - 3600000 * 24 * 1
  },
  {
    id: 'pet-4',
    name: 'Ziggy',
    microchipId: 'PET-7182',
    category: 'Reptile',
    status: 'Available',
    description: 'Friendly Leopard Gecko with striking spots. Low maintenance and loves basking under warm UV light.',
    imageUrl: 'https://images.unsplash.com/photo-1563460716037-460a3ad24ba9?auto=format&fit=crop&q=80&w=600',
    isFavorite: false,
    treatsCount: 11,
    tags: ['Microchipped 🏷️'],
    traits: { energy: 20, cuddle: 40, vocalness: 5, kidFriendly: 75, grooming: 10 },
    careCost: { food: 800, litter: 500, vet: 800 },
    dailyRoutine: [
      { time: '09:00 AM', action: 'Basking on warm rock under UV lamp ☀️' },
      { time: '02:00 PM', action: 'Exploring terrarium cave & hideouts 🦎' },
      { time: '07:00 PM', action: 'Mealworm dinner & gentle hand perch 🐛' },
      { time: '10:00 PM', action: 'Nightly sleep inside warm ceramic log 💤' }
    ],
    createdAt: Date.now() - 3600000 * 24 * 2
  },
  {
    id: 'pet-5',
    name: 'Pip',
    microchipId: 'PET-2940',
    category: 'Hamster',
    status: 'Available',
    description: 'Tiny Roborovski dwarf hamster who runs on his silent wheel at night and loves sunflower seeds.',
    imageUrl: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&q=80&w=600',
    isFavorite: true,
    treatsCount: 20,
    tags: ['Kid Friendly 👶'],
    traits: { energy: 95, cuddle: 50, vocalness: 10, kidFriendly: 80, grooming: 20 },
    careCost: { food: 600, litter: 600, vet: 500 },
    dailyRoutine: [
      { time: '08:00 AM', action: 'Cheek pouch seed stash restocking 🌻' },
      { time: '01:00 PM', action: 'Deep burrow sleeping under Aspen shavings 💤' },
      { time: '07:00 PM', action: 'Wheel sprinting marathon & maze play 🎡' },
      { time: '11:00 PM', action: 'Midnight sand bath & grooming 🚿' }
    ],
    createdAt: Date.now() - 3600000 * 24 * 4
  },
  {
    id: 'pet-6',
    name: 'Finny',
    microchipId: 'PET-8821',
    category: 'Fish',
    status: 'Available',
    description: 'Vibrant Blue Tang fish thriving in a peaceful saltwater community tank.',
    imageUrl: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&q=80&w=600',
    isFavorite: false,
    treatsCount: 7,
    tags: ['Special Needs 🩺'],
    traits: { energy: 50, cuddle: 10, vocalness: 0, kidFriendly: 90, grooming: 5 },
    careCost: { food: 700, litter: 1000, vet: 600 },
    dailyRoutine: [
      { time: '08:00 AM', action: 'Flake food feeding & coral swimming 🐠' },
      { time: '02:00 PM', action: 'Gliding through living anemones 🪸' },
      { time: '07:00 PM', action: 'Evening algae grazing 🌿' },
      { time: '10:00 PM', action: 'Resting in reef coral cave 💤' }
    ],
    createdAt: Date.now() - 3600000 * 24 * 6
  },
  {
    id: 'pet-7',
    name: 'Clover',
    microchipId: 'PET-5501',
    category: 'Pony',
    status: 'Pending',
    description: 'Sweet Shetland Mini Pony who loves apple slices, pasture trotting, and gentle grooming.',
    imageUrl: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=600',
    isFavorite: true,
    treatsCount: 32,
    tags: ['Vaccinated 💉', 'Kid Friendly 👶', 'House Trained 🏡'],
    traits: { energy: 70, cuddle: 90, vocalness: 50, kidFriendly: 100, grooming: 80 },
    careCost: { food: 4500, litter: 2000, vet: 2500 },
    dailyRoutine: [
      { time: '07:00 AM', action: 'Paddock turnout & morning oats 🌾' },
      { time: '12:00 PM', action: 'Pasture grazing with farm companions 🐴' },
      { time: '05:00 PM', action: 'Curry comb brushing & apple reward 🍎' },
      { time: '09:00 PM', action: 'Tucked in fresh straw bedding 💤' }
    ],
    createdAt: Date.now() - 3600000 * 24 * 8
  },
  {
    id: 'pet-8',
    name: 'Kiko',
    microchipId: 'PET-6215',
    category: 'Bird',
    status: 'Adopted',
    description: 'Vibrant Sun Conure with a singing voice. Successfully placed with a loving family.',
    imageUrl: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&q=80&w=600',
    isFavorite: false,
    treatsCount: 9,
    tags: ['Vaccinated 💉', 'Microchipped 🏷️'],
    traits: { energy: 85, cuddle: 65, vocalness: 80, kidFriendly: 60, grooming: 30 },
    careCost: { food: 1000, litter: 800, vet: 1000 },
    dailyRoutine: [
      { time: '07:00 AM', action: 'Sunrise whistling tune & seed breakfast 🦜' },
      { time: '01:00 PM', action: 'Out-of-cage flight exercise & mirror games 🪞' },
      { time: '05:30 PM', action: 'Nut treat foraging & head scritches 🥜' },
      { time: '08:30 PM', action: 'Covered cage night-night whispers 💤' }
    ],
    createdAt: Date.now() - 3600000 * 24 * 10
  }
];

// DYNAMIC ANIMAL CURSOR & TRAIL COMPONENT
function DynamicAnimalCursorTrail({ activeCategory }) {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trails, setTrails] = useState([]);
  const lastPos = useRef({ x: 0, y: 0 });

  const activeData = ANIMAL_CURSOR_MAP[activeCategory] || ANIMAL_CURSOR_MAP.Default;

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX: x, clientY: y } = e;
      setPos({ x, y });

      const dist = Math.hypot(x - lastPos.current.x, y - lastPos.current.y);
      if (dist > 18) {
        lastPos.current = { x, y };

        const trailOptions = activeData.trail;
        const randomSymbol = trailOptions[Math.floor(Math.random() * trailOptions.length)];

        const newTrail = {
          id: Date.now() + Math.random(),
          x,
          y,
          symbol: randomSymbol
        };

        setTrails((prev) => [...prev.slice(-14), newTrail]);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [activeCategory, activeData]);

  return (
    <>
      {trails.map((t) => (
        <div
          key={t.id}
          className="fixed pointer-events-none z-[9998] text-base animate-paw-trail select-none"
          style={{ left: `${t.x}px`, top: `${t.y}px` }}
        >
          {t.symbol}
        </div>
      ))}

      <div
        className="fixed pointer-events-none z-[9999] transition-transform duration-75 ease-out select-none flex items-center justify-center"
        style={{
          transform: `translate3d(${pos.x - 12}px, ${pos.y - 12}px, 0)`,
        }}
      >
        <div className="absolute w-9 h-9 rounded-full bg-emerald-400/30 blur-md -inset-1"></div>
        <span className="text-2xl filter drop-shadow-md animate-wag inline-block">
          {activeData.icon}
        </span>
      </div>
    </>
  );
}

// Web Audio API Synthesizer Sound Generator
const playPetAudioSound = (category) => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (category === 'Dog') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.18);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.18);
    } else if (category === 'Cat') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(680, now + 0.22);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.42);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.42);
      osc.start(now);
      osc.stop(now + 0.42);
    } else if (category === 'Bird') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1800, now);
      osc.frequency.linearRampToValueAtTime(2500, now + 0.12);
      osc.frequency.linearRampToValueAtTime(1500, now + 0.25);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(130, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.2);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    }
  } catch (e) {
    console.error('Audio synth error:', e);
  }
};

// COMPONENT: 3D Tilt Card Wrapper with Real-time Mouse Reflection
function Tilt3DCard({ children, className = '', isInteractive = true }) {
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [shinePos, setShinePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!isInteractive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setRotX(rotateX);
    setRotY(rotateY);
    setShinePos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  };

  const handleMouseLeave = () => {
    setRotX(0);
    setRotY(0);
    setIsHovered(false);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative transition-transform duration-200 ease-out preserve-3d ${className}`}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transformStyle: 'preserve-3d',
      }}
    >
      {isHovered && (
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none z-30 transition-opacity duration-300 opacity-60"
          style={{
            background: `radial-gradient(circle at ${shinePos.x}% ${shinePos.y}%, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0) 65%)`,
          }}
        />
      )}
      {children}
    </div>
  );
}

// COMPONENT: Expanded Digital Adoption Paper & Interactive Signature Modal
function AdoptionCertificateModal({ pet, onClose, isDarkMode, onCompleteAdoption }) {
  const [adopterName, setAdopterName] = useState('Alex Morgan');
  const [adopterEmail, setAdopterEmail] = useState('alex.morgan@example.com');
  const [adopterPhone, setAdopterPhone] = useState('+91 98765 43210');
  const [adopterAddress, setAdopterAddress] = useState('72 Palm Grove Avenue, Bandra, Mumbai');
  const [adopterIdNum, setAdopterIdNum] = useState('ID-884920');

  // Adoption Type State
  const [adoptionType, setAdoptionType] = useState('Full Permanent Adoption 🏡');

  const [step, setStep] = useState('sign'); // 'sign' | 'certificate'
  const [signatureDataUrl, setSignatureDataUrl] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);

  const canvasRef = useRef(null);

  useEffect(() => {
    if (step === 'sign' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = isDarkMode ? '#10b981' : '#047857';
    }
  }, [step, isDarkMode]);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (canvasRef.current) {
      setSignatureDataUrl(canvasRef.current.toDataURL());
    }
  };

  const clearSignature = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setSignatureDataUrl('');
    }
  };

  const handleConfirmSignature = () => {
    if (!signatureDataUrl) {
      alert('Please provide your digital signature on the pad before proceeding.');
      return;
    }
    if (!adopterName.trim()) {
      alert('Please enter your full legal name.');
      return;
    }
    if (!adopterPhone.trim() || !adopterAddress.trim()) {
      alert('Please fill in your contact phone number and address.');
      return;
    }

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });

    setStep('certificate');
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  const handleFinishAdoption = () => {
    onCompleteAdoption(pet.id, pet.name, adopterName);
    onClose();
  };

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn print:p-0 print:bg-white print:fixed print:inset-0">
      
      {/* EXPANDED CERTIFICATE CONTAINER: max-w-4xl (896px) and max-h-[96vh] */}
      <div className={`relative w-full max-w-4xl rounded-3xl overflow-hidden border shadow-2xl transition-all max-h-[96vh] flex flex-col ${
        isDarkMode ? 'bg-[#0f172a] text-slate-100 border-slate-700' : 'bg-white text-slate-900 border-slate-200'
      } print:max-h-full print:border-none print:shadow-none print:bg-white print:text-black`}>
        
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-950/70 text-slate-300 hover:text-white transition print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: PERSONAL DETAILS, ADOPTION TYPE & DIGITAL SIGNATURE PAD */}
        {step === 'sign' && (
          <div className="p-6 sm:p-8 space-y-5 overflow-y-auto">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl font-bold">
                ✍️
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black">Official Adoption Agreement</h2>
                <p className="text-xs text-slate-400">Select Adoption Type & sign for {pet.name} ({pet.microchipId})</p>
              </div>
            </div>

            {/* Feature: Adoption Type Radio Selector */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-emerald-400 mb-1.5 flex items-center gap-1">
                <CheckSquare className="w-3.5 h-3.5" /> Select Adoption Type *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'Full Permanent Adoption 🏡', label: 'Full Permanent 🏡', desc: 'Forever Guardianship' },
                  { id: 'Temporary Foster Care 🏠', label: 'Temporary Foster 🏠', desc: 'Nurturing Parent' },
                  { id: 'Virtual Sponsorship 🌟', label: 'Virtual Sponsor 🌟', desc: 'Care Supporter' },
                  { id: 'Senior Companion Care 💛', label: 'Senior Companion 💛', desc: 'Special Partner' }
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setAdoptionType(type.id)}
                    className={`p-2.5 rounded-2xl border text-left transition active:scale-98 ${
                      adoptionType === type.id
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md'
                        : isDarkMode
                            ? 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="text-xs font-black">{type.label}</div>
                    <div className="text-[10px] opacity-75">{type.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Basic Personal Details Form Input Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-emerald-400" /> Full Legal Name *
                </label>
                <input
                  type="text"
                  value={adopterName}
                  onChange={(e) => setAdopterName(e.target.value)}
                  className={`w-full px-3.5 py-2 rounded-xl text-xs font-bold transition border ${
                    isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-emerald-400" /> Email Address *
                </label>
                <input
                  type="email"
                  value={adopterEmail}
                  onChange={(e) => setAdopterEmail(e.target.value)}
                  className={`w-full px-3.5 py-2 rounded-xl text-xs font-bold transition border ${
                    isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" /> Phone Number *
                </label>
                <input
                  type="text"
                  value={adopterPhone}
                  onChange={(e) => setAdopterPhone(e.target.value)}
                  className={`w-full px-3.5 py-2 rounded-xl text-xs font-bold transition border ${
                    isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 flex items-center gap-1">
                  <IdCard className="w-3.5 h-3.5 text-emerald-400" /> Gov ID / Aadhaar Tag *
                </label>
                <input
                  type="text"
                  value={adopterIdNum}
                  onChange={(e) => setAdopterIdNum(e.target.value)}
                  className={`w-full px-3.5 py-2 rounded-xl text-xs font-bold transition border ${
                    isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Residential Address *
                </label>
                <input
                  type="text"
                  value={adopterAddress}
                  onChange={(e) => setAdopterAddress(e.target.value)}
                  className={`w-full px-3.5 py-2 rounded-xl text-xs font-bold transition border ${
                    isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-1">
              <div className="font-extrabold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                PawPath Guardianship Terms ({adoptionType})
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                I certify that I will fulfill all obligations for <strong>{pet.name}</strong> under the <strong>{adoptionType}</strong> program.
              </p>
            </div>

            {/* Canvas Signature Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1 text-emerald-400">
                  <PenTool className="w-4 h-4" /> Draw Digital Signature:
                </span>
                <button
                  type="button"
                  onClick={clearSignature}
                  className="text-rose-400 hover:underline text-[11px] font-bold"
                >
                  Clear Pad
                </button>
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-emerald-500/40 bg-slate-950/80 touch-none">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={130}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-32 cursor-crosshair"
                />
                {!signatureDataUrl && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-slate-600 text-xs font-semibold">
                    Sign here using mouse or touch finger...
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-extrabold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSignature}
                className="px-5 py-2.5 rounded-2xl text-xs font-black bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-xl flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Generate Certificate
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: EXPANDED FULL PRINTABLE ADOPTION CERTIFICATE */}
        {step === 'certificate' && (
          <div className="p-6 sm:p-10 space-y-6 overflow-y-auto bg-gradient-to-b from-amber-500/5 to-transparent">
            
            {/* Printable Certificate Frame */}
            <div id="printable-certificate" className="p-6 sm:p-10 rounded-3xl border-4 border-double border-amber-500/60 bg-slate-900/90 text-slate-100 space-y-6 relative shadow-2xl print:border-amber-600 print:bg-white print:text-black">
              
              <div className="flex flex-col sm:flex-row items-center justify-between border-b border-amber-500/30 pb-5 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center text-3xl font-black shadow-lg shrink-0">
                    🐾
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-3xl font-black tracking-tight text-amber-400 print:text-amber-700">
                      PawPath Adoption Sanctuary
                    </h2>
                    <p className="text-[11px] font-mono text-slate-400 tracking-wider uppercase print:text-slate-600">
                      Official Certificate of Guardianship & Deed
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-3.5 py-1.5 rounded-2xl text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 whitespace-nowrap print:bg-amber-100 print:text-amber-900">
                    {adoptionType}
                  </span>
                  <div className="w-14 h-14 rounded-full border-2 border-dashed border-amber-400/80 flex items-center justify-center text-center p-1 bg-amber-500/10 text-[8px] font-black text-amber-300 shrink-0 print:text-amber-800">
                    SEAL OF ADOPTION
                  </div>
                </div>
              </div>

              <div className="text-center space-y-1.5 py-2">
                <p className="text-xs uppercase tracking-widest text-slate-400 print:text-slate-600">This certifies that</p>
                <h1 className="text-2xl sm:text-4xl font-black text-emerald-400 underline decoration-amber-400/60 underline-offset-8 print:text-emerald-800">
                  {adopterName}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 pt-2 print:text-slate-700 max-w-xl mx-auto leading-relaxed">
                  has officially entered an agreement under <strong>{adoptionType}</strong> and promised lifelong love and care to
                </p>
              </div>

              {/* Pet Showcase Card */}
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl bg-slate-950/60 border border-slate-800 print:bg-slate-100 print:border-slate-300 gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={pet.imageUrl || getCategoryFallbackImage(pet.category)}
                    alt={pet.name}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400/50 shrink-0"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = getCategoryFallbackImage(pet.category);
                    }}
                  />
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-white print:text-black">{pet.name}</h3>
                    <div className="text-xs font-mono text-emerald-400 font-bold print:text-emerald-700">
                      Microchip Tag: {pet.microchipId} • Species: {pet.category}
                    </div>
                    <div className="text-[11px] text-slate-400 print:text-slate-600">
                      Official Date: <strong>{currentDate}</strong>
                    </div>
                  </div>
                </div>

                <div className="text-right text-xs space-y-0.5 text-slate-400 print:text-slate-700">
                  <div>Status: <span className="font-extrabold text-emerald-400 print:text-emerald-700">Guardian Approved</span></div>
                  <div>Registry Code: <span className="font-mono text-slate-300 print:text-black">REG-2026-PAW</span></div>
                </div>
              </div>

              {/* Personal Details Records Grid */}
              <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 space-y-2.5 print:bg-slate-50 print:border-slate-300">
                <div className="text-xs font-extrabold uppercase tracking-wider text-amber-400 print:text-amber-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-400" /> Adopter Official Personal Record
                  </span>
                  <span className="text-[11px] text-slate-400 print:text-slate-600">Verified Legal Deed</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div>
                    <span className="text-slate-400 print:text-slate-500 font-medium">Email: </span>
                    <span className="font-bold text-slate-200 print:text-slate-900">{adopterEmail}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 print:text-slate-500 font-medium">Phone: </span>
                    <span className="font-bold text-slate-200 print:text-slate-900">{adopterPhone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 print:text-slate-500 font-medium">Gov ID Tag: </span>
                    <span className="font-bold text-slate-200 print:text-slate-900">{adopterIdNum}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 print:text-slate-500 font-medium">Address: </span>
                    <span className="font-bold text-slate-200 print:text-slate-900">{adopterAddress}</span>
                  </div>
                </div>
              </div>

              {/* Signature Render Row */}
              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-amber-500/30">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold print:text-slate-600">Authorized Sanctuary Director</div>
                  <div className="h-14 flex items-center font-serif italic text-lg text-amber-300 print:text-amber-800">
                    Dr. PawPath Director
                  </div>
                  <div className="border-t border-slate-700 pt-1 text-[10px] text-slate-500 print:text-slate-600">Sanctuary Representative</div>
                </div>

                <div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold print:text-slate-600">Adopter Digital Signature</div>
                  <div className="h-14 flex items-center">
                    {signatureDataUrl ? (
                      <img src={signatureDataUrl} alt="Signature" className="h-12 object-contain filter drop-shadow" />
                    ) : (
                      <span className="font-serif italic text-lg text-emerald-400">{adopterName}</span>
                    )}
                  </div>
                  <div className="border-t border-slate-700 pt-1 text-[10px] text-slate-500 print:text-slate-600">{adopterName}</div>
                </div>
              </div>

            </div>

            {/* Print & Complete Buttons */}
            <div className="flex items-center justify-between pt-2 print:hidden">
              <button
                type="button"
                onClick={handlePrintCertificate}
                className="px-4 py-2.5 rounded-2xl text-xs font-black bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-2"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                Print / Save PDF
              </button>

              <button
                type="button"
                onClick={handleFinishAdoption}
                className="px-6 py-2.5 rounded-2xl text-xs font-black bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-xl flex items-center gap-2"
              >
                <HeartHandshake className="w-4 h-4" />
                Complete Adoption 🎉
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

// COMPONENT: Pet Quick Detail Modal Component (With Rupee Currency ₹ & Adopt Button)
function PetDetailModal({ pet, onClose, isDarkMode, onFavorite, onDelete, onSendTreat, matchScore, isSpoiledCareMode, setSpoiledCareMode, onOpenAdoptModal }) {
  const [activeModalTab, setActiveModalTab] = useState('bio');

  if (!pet) return null;

  const baseCost = (pet.careCost?.food || 2000) + (pet.careCost?.litter || 1000) + (pet.careCost?.vet || 1200);
  const totalCost = isSpoiledCareMode ? Math.round(baseCost * 1.6) : baseCost;
  const treatSymbol = getPetTreatSymbol(pet.category);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className={`relative w-full max-w-xl rounded-3xl overflow-hidden border shadow-2xl transition-all ${
        isDarkMode ? 'bg-[#0f172a] text-slate-100 border-slate-700' : 'bg-white text-slate-900 border-slate-200'
      }`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-950/70 text-slate-300 hover:text-white transition"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="relative h-64 bg-slate-900 overflow-hidden">
          <img
            src={pet.imageUrl || getCategoryFallbackImage(pet.category)}
            alt={pet.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = getCategoryFallbackImage(pet.category);
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>

          <span className="absolute top-4 left-4 px-3.5 py-1.5 rounded-2xl text-xs font-black bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-xl flex items-center gap-1.5">
            <Zap className="w-4 h-4 fill-white" />
            {matchScore}% Match
          </span>

          <span className="absolute bottom-4 left-4 px-3.5 py-1 rounded-xl text-xs font-black bg-slate-900/90 text-emerald-400 border border-emerald-500/30">
            {pet.category} • {pet.microchipId}
          </span>
        </div>

        <div className="flex border-b border-slate-800 bg-slate-900/60 p-1.5">
          <button
            onClick={() => setActiveModalTab('bio')}
            className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 ${
              activeModalTab === 'bio' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smile className="w-4 h-4" /> Bio & Traits
          </button>
          <button
            onClick={() => setActiveModalTab('routine')}
            className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 ${
              activeModalTab === 'routine' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" /> Daily Routine
          </button>
          <button
            onClick={() => setActiveModalTab('cost')}
            className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 ${
              activeModalTab === 'cost' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <IndianRupee className="w-4 h-4" /> Care Budget
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[50vh] overflow-y-auto">
          {activeModalTab === 'bio' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black">{pet.name}</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => playPetAudioSound(pet.category)}
                    className="p-2.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 text-xs font-bold"
                    title="Hear Sound"
                  >
                    <Volume2 className="w-5 h-5" />
                    Hear Sound
                  </button>
                  <button
                    onClick={() => onFavorite(pet.id)}
                    className={`p-2.5 rounded-full border transition ${
                      pet.isFavorite
                        ? 'bg-rose-500/20 border-rose-500/50 text-rose-500'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${pet.isFavorite ? 'fill-rose-500' : ''}`} />
                  </button>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-slate-300">{pet.description}</p>

              <div className="space-y-2.5 pt-2 border-t border-slate-800">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Personality Trait Spectrum</h4>
                {[
                  { label: 'Energy Level ⚡', val: pet.traits?.energy || 70, color: 'bg-amber-400' },
                  { label: 'Cuddle Bug Factor 🛋️', val: pet.traits?.cuddle || 85, color: 'bg-rose-400' },
                  { label: 'Vocalness / Noise 🔊', val: pet.traits?.vocalness || 40, color: 'bg-sky-400' },
                  { label: 'Kid & Pet Friendly 👶', val: pet.traits?.kidFriendly || 90, color: 'bg-emerald-400' },
                  { label: 'Grooming & Maintenance ✂️', val: pet.traits?.grooming || 50, color: 'bg-indigo-400' }
                ].map((t, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-300">{t.label}</span>
                      <span className="text-slate-400">{t.val}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div className={`h-2 rounded-full ${t.color}`} style={{ width: `${t.val}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeModalTab === 'routine' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">A Day in the Life of {pet.name}</h4>
              <div className="relative pl-6 space-y-4 border-l-2 border-emerald-500/40">
                {(pet.dailyRoutine || [
                  { time: '07:30 AM', action: 'Breakfast & morning stretching' },
                  { time: '01:00 PM', action: 'Midday nap & cozy window perch' },
                  { time: '06:00 PM', action: 'Playtime, treats, and affection' },
                  { time: '09:30 PM', action: 'Bedtime flopping & quiet night' }
                ]).map((step, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900"></span>
                    <div className="text-xs font-black text-emerald-400">{step.time}</div>
                    <div className="text-sm text-slate-300 font-medium">{step.action}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeModalTab === 'cost' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Monthly Care Budget Estimator (₹ INR)</h4>
                <button
                  onClick={() => setSpoiledCareMode(!isSpoiledCareMode)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold border transition ${
                    isSpoiledCareMode
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  {isSpoiledCareMode ? '👑 Spoiled Pet Mode' : '🪙 Standard Care Mode'}
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                  <div className="text-xs text-slate-400 font-bold">Food & Treats</div>
                  <div className="text-lg font-black text-emerald-400">
                    ₹{isSpoiledCareMode ? Math.round((pet.careCost?.food || 2000) * 1.6) : (pet.careCost?.food || 2000)}
                    <span className="text-[10px] text-slate-500">/mo</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                  <div className="text-xs text-slate-400 font-bold">Bedding/Litter</div>
                  <div className="text-lg font-black text-emerald-400">
                    ₹{isSpoiledCareMode ? Math.round((pet.careCost?.litter || 1000) * 1.5) : (pet.careCost?.litter || 1000)}
                    <span className="text-[10px] text-slate-500">/mo</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                  <div className="text-xs text-slate-400 font-bold">Vet Reserve</div>
                  <div className="text-lg font-black text-emerald-400">
                    ₹{isSpoiledCareMode ? Math.round((pet.careCost?.vet || 1200) * 1.5) : (pet.careCost?.vet || 1200)}
                    <span className="text-[10px] text-slate-500">/mo</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-emerald-400">Total Monthly Estimate</div>
                  <div className="text-[11px] text-slate-400">No hidden surprises for pet owners</div>
                </div>
                <div className="text-2xl font-black text-emerald-400">₹{totalCost}/mo</div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 pt-0 flex flex-wrap items-center justify-between border-t border-slate-800 mt-2 pt-4 gap-2">
          <button
            onClick={() => {
              onSendTreat(pet.id);
            }}
            className="px-3.5 py-2.5 rounded-2xl text-xs font-black bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border border-amber-500/30 flex items-center gap-1.5"
          >
            <Gift className="w-4 h-4 text-amber-400" />
            Treat {treatSymbol} ({pet.treatsCount || 0})
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenAdoptModal(pet);
              }}
              className="px-5 py-2.5 rounded-2xl text-xs font-black bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-xl flex items-center gap-1.5"
            >
              <HeartHandshake className="w-4 h-4" />
              Adopt {pet.name} 🐾
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl text-xs font-extrabold bg-slate-800 text-slate-200 hover:bg-slate-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Mobile View Navigation State ('gallery' | 'register')
  const [mobileTab, setMobileTab] = useState('gallery');

  // Selected Modal Pet State
  const [activeModalPet, setActiveModalPet] = useState(null);

  // Active Adopt Certificate Modal Pet State
  const [activeAdoptPet, setActiveAdoptPet] = useState(null);

  // Active Hover Category for Dynamic Cursor Morphing
  const [hoveredCategory, setHoveredCategory] = useState(null);

  // Expanded Lifestyle Quiz Matchmeter States
  const [livesInApartment, setLivesInApartment] = useState(true);
  const [worksLongHours, setWorksLongHours] = useState(false);
  const [hasKidsOrPets, setHasKidsOrPets] = useState(true);
  const [isActiveLifestyle, setIsActiveLifestyle] = useState(false);
  const [isFirstTimeOwner, setIsFirstTimeOwner] = useState(true);
  const [prefersLowMaintenance, setPrefersLowMaintenance] = useState(false);

  // Care Cost Mode State
  const [isSpoiledCareMode, setIsSpoiledCareMode] = useState(false);

  // Care Tags Selection State in Form
  const [selectedCareTags, setSelectedCareTags] = useState(['Vaccinated 💉']);

  // 1. MANDATORY INDIVIDUAL FORM FIELD REACT STATES
  const [name, setName] = useState('');
  const [microchipId, setMicrochipId] = useState('');
  const [category, setCategory] = useState('Dog');
  const [status, setStatus] = useState('Available');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // 2. MAIN PETS ARRAY STATE
  const [pets, setPets] = useState(INITIAL_MOCK_PETS);

  // 3. SEARCH & FILTER REACT STATES
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  // Validation & Notification State
  const [formError, setFormError] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [isSpinningId, setIsSpinningId] = useState(false);

  // Floating Toast Notification
  const showNotification = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Expanded Matchmeter Score Calculation Algorithm
  const calculateMatchScore = (pet) => {
    let score = 80;

    if (livesInApartment) {
      if (['Cat', 'Rabbit', 'Bird', 'Hamster', 'Fish', 'Reptile'].includes(pet.category)) score += 8;
      if (pet.category === 'Dog' && (pet.traits?.energy || 70) > 80) score -= 12;
    } else {
      if (pet.category === 'Dog' || pet.category === 'Pony') score += 8;
    }

    if (worksLongHours) {
      if ((pet.traits?.energy || 70) > 75) score -= 10;
      if (['Cat', 'Reptile', 'Fish', 'Hamster'].includes(pet.category)) score += 8;
    }

    if (hasKidsOrPets) {
      if ((pet.traits?.kidFriendly || 80) >= 80) score += 10;
      if ((pet.traits?.kidFriendly || 80) < 60) score -= 14;
    }

    if (isActiveLifestyle) {
      if (pet.category === 'Dog' || (pet.traits?.energy || 70) >= 80) score += 10;
      if (['Fish', 'Reptile', 'Hamster'].includes(pet.category)) score -= 6;
    }

    if (isFirstTimeOwner) {
      if ((pet.traits?.cuddle || 80) > 80 && (pet.traits?.kidFriendly || 80) > 75) score += 8;
      if (pet.tags?.includes('Special Needs 🩺') || (pet.traits?.grooming || 50) > 75) score -= 12;
    }

    if (prefersLowMaintenance) {
      if (['Hamster', 'Fish', 'Reptile', 'Cat'].includes(pet.category)) score += 10;
      if ((pet.traits?.grooming || 50) > 70 || pet.category === 'Pony') score -= 12;
    }

    return Math.min(99, Math.max(55, score));
  };

  // Complete Adoption & Update Status State to Adopted
  const handleCompleteAdoption = (petId, petName, adopterName) => {
    setPets(
      pets.map((p) => {
        if (p.id === petId) {
          return { ...p, status: 'Adopted' };
        }
        return p;
      })
    );
    showNotification(`🎉 Congratulations ${adopterName}! Official Adoption of ${petName} complete!`);
  };

  // Virtual Treat Counter + Confetti Trigger
  const handleSendTreat = (id) => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 }
    });

    setPets(
      pets.map((p) => {
        if (p.id === id) {
          const nextCount = (p.treatsCount || 0) + 1;
          const symbol = getPetTreatSymbol(p.category);
          showNotification(`${symbol} Sent a virtual treat to ${p.name}! (${nextCount} total)`);
          return { ...p, treatsCount: nextCount };
        }
        return p;
      })
    );
  };

  // Care Tag Toggle Handler
  const toggleCareTag = (tag) => {
    if (selectedCareTags.includes(tag)) {
      setSelectedCareTags(selectedCareTags.filter((t) => t !== tag));
    } else {
      setSelectedCareTags([...selectedCareTags, tag]);
    }
  };

  // Auto-Generate Microchip ID (PET-XXXX)
  const handleGenerateId = () => {
    setIsSpinningId(true);
    setTimeout(() => {
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      const newId = `PET-${randomDigits}`;
      setMicrochipId(newId);
      setIsSpinningId(false);
      showNotification(`🎲 Tag Created: ${newId}`);
    }, 250);
  };

  // Form Submit Handler
  const handleAddPet = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setFormError('Pet name is required.');
      return;
    }

    if (!description.trim()) {
      setFormError('Please enter a bio or medical notes.');
      return;
    }

    setFormError('');

    const finalMicrochipId = microchipId.trim() || `PET-${Math.floor(1000 + Math.random() * 9000)}`;
    const finalImageUrl = imageUrl.trim() || getCategoryFallbackImage(category);

    const newPet = {
      id: `pet-${Date.now()}`,
      name: name.trim(),
      microchipId: finalMicrochipId,
      category,
      status,
      description: description.trim(),
      imageUrl: finalImageUrl,
      isFavorite: false,
      treatsCount: 1,
      tags: selectedCareTags.length > 0 ? selectedCareTags : ['Health Checked 🩺'],
      traits: { energy: 75, cuddle: 85, vocalness: 40, kidFriendly: 90, grooming: 50 },
      careCost: { food: 2000, litter: 1000, vet: 1200 },
      dailyRoutine: [
        { time: '08:00 AM', action: 'Breakfast & morning routine' },
        { time: '01:00 PM', action: 'Afternoon play & sunbath' },
        { time: '06:00 PM', action: 'Evening treats & cuddling' },
        { time: '09:30 PM', action: 'Cozy bedtime sleep' }
      ],
      createdAt: Date.now()
    };

    setPets([newPet, ...pets]);
    showNotification(`✨ ${newPet.name} added to PawPath!`);

    // Reset Form Fields
    setName('');
    setMicrochipId('');
    setCategory('Dog');
    setStatus('Available');
    setDescription('');
    setImageUrl('');
    setSelectedCareTags(['Vaccinated 💉']);
    setMobileTab('gallery');
  };

  // Delete Pet Handler
  const handleDeletePet = (id, petName) => {
    setPets(pets.filter((p) => p.id !== id));
    showNotification(`🗑️ Removed ${petName}`);
  };

  // Toggle Favorite Handler
  const handleToggleFavorite = (id) => {
    setPets(
      pets.map((p) => {
        if (p.id === id) {
          const nextFav = !p.isFavorite;
          showNotification(nextFav ? `❤️ Favorited ${p.name}` : `Unfavorited ${p.name}`);
          return { ...p, isFavorite: nextFav };
        }
        return p;
      })
    );
  };

  // Dynamic Statistics Calculated Directly from State
  const totalPets = pets.length;
  const availablePets = pets.filter((p) => p.status === 'Available').length;
  const urgentPets = pets.filter((p) => p.status === 'Urgent').length;
  const adoptedPets = pets.filter((p) => p.status === 'Adopted').length;

  // Filtered & Sorted Pets Grid Computation
  const filteredPets = pets
    .filter((pet) => {
      const matchesCategory =
        selectedCategory === 'All' || pet.category.toLowerCase() === selectedCategory.toLowerCase();
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        pet.name.toLowerCase().includes(query) ||
        pet.microchipId.toLowerCase().includes(query) ||
        pet.category.toLowerCase().includes(query);
      const matchesFavorites = !onlyFavorites || pet.isFavorite;

      return matchesCategory && matchesSearch && matchesFavorites;
    })
    .sort((a, b) => {
      if (sortBy === 'urgent') {
        if (a.status === 'Urgent' && b.status !== 'Urgent') return -1;
        if (a.status !== 'Urgent' && b.status === 'Urgent') return 1;
      }
      if (sortBy === 'match') {
        return calculateMatchScore(b) - calculateMatchScore(a);
      }
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return b.createdAt - a.createdAt;
    });

  const previewImageSrc = imageUrl.trim() || getCategoryFallbackImage(category);

  // Status Badge Renderer
  const renderStatusBadge = (petStatus) => {
    switch (petStatus) {
      case 'Available':
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
            isDarkMode 
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
              : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
          }`}>
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Available
          </span>
        );
      case 'Pending':
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
            isDarkMode 
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
              : 'bg-amber-100 text-amber-800 border border-amber-300'
          }`}>
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            Pending
          </span>
        );
      case 'Urgent':
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-extrabold animate-neon-pulse ${
            isDarkMode 
              ? 'bg-rose-500/25 text-rose-300 border border-rose-500/60' 
              : 'bg-rose-100 text-rose-900 border border-rose-400'
          }`}>
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            Urgent
          </span>
        );
      case 'Adopted':
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
            isDarkMode 
              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' 
              : 'bg-sky-100 text-sky-800 border border-sky-300'
          }`}>
            <span className="w-2 h-2 rounded-full bg-sky-400"></span>
            Adopted
          </span>
        );
      default:
        return null;
    }
  };

  const inputThemeClass = isDarkMode
    ? 'bg-slate-900/90 border-slate-800 text-slate-100 placeholder-slate-500 focus:border-emerald-500'
    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-600 shadow-sm';

  const subTextColorClass = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const mainHeadingColorClass = isDarkMode ? 'text-white' : 'text-slate-900';

  return (
    <div className={`${isDarkMode ? 'dark' : 'light'} min-h-screen ${
      isDarkMode ? 'bg-[#090d16] text-slate-100' : 'bg-[#f4f7fb] text-slate-900'
    } pb-24 md:pb-12 p-3 sm:p-6 lg:p-8 transition-colors duration-300 relative`}>
      
      {/* Dynamic Hover Animal Cursor Component */}
      <DynamicAnimalCursorTrail activeCategory={hoveredCategory} />

      {/* Detail Quick Modal Component */}
      {activeModalPet && (
        <PetDetailModal
          pet={activeModalPet}
          onClose={() => setActiveModalPet(null)}
          isDarkMode={isDarkMode}
          onFavorite={handleToggleFavorite}
          onDelete={handleDeletePet}
          onSendTreat={handleSendTreat}
          matchScore={calculateMatchScore(activeModalPet)}
          isSpoiledCareMode={isSpoiledCareMode}
          setSpoiledCareMode={setIsSpoiledCareMode}
          onOpenAdoptModal={(pet) => setActiveAdoptPet(pet)}
        />
      )}

      {/* Digital Adoption Agreement & Signature Paper Modal */}
      {activeAdoptPet && (
        <AdoptionCertificateModal
          pet={activeAdoptPet}
          onClose={() => setActiveAdoptPet(null)}
          isDarkMode={isDarkMode}
          onCompleteAdoption={handleCompleteAdoption}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl border shadow-2xl backdrop-blur-xl animate-bounce text-xs font-bold ${
          isDarkMode 
            ? 'bg-slate-900/95 text-emerald-300 border-emerald-500/40' 
            : 'bg-white/95 text-indigo-900 border-indigo-300 shadow-indigo-100'
        }`}>
          <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* TOP HEADER & INTEGRATED STATS BAR */}
        <header className="glass-panel-3d p-4 sm:p-6 rounded-3xl flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-2xl sm:text-3xl shadow-lg shadow-emerald-500/20 animate-float-3d">
                🐾
              </div>
              <div>
                <h1 className="text-xl sm:text-3xl font-black tracking-tight gradient-text-emerald">
                  PawPath
                </h1>
                <p className={`text-[11px] sm:text-xs font-semibold ${subTextColorClass}`}>
                  Smart Adoption Portal & Digital Paper Certificate
                </p>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setOnlyFavorites(!onlyFavorites);
                  showNotification(!onlyFavorites ? '❤️ Favorites Filter' : 'All Pets');
                }}
                className={`p-2.5 sm:px-4 sm:py-2.5 rounded-2xl text-xs font-bold border transition flex items-center gap-2 active:scale-95 ${
                  onlyFavorites
                    ? 'bg-rose-500/20 border-rose-500/50 text-rose-400'
                    : isDarkMode
                        ? 'bg-slate-900/60 border-slate-800 text-slate-400'
                        : 'bg-white border-slate-200 text-slate-700'
                }`}
                title="Toggle Favorites"
              >
                <Heart className={`w-5 h-5 ${onlyFavorites ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span className="hidden sm:inline">Favorites</span>
              </button>

              <button
                onClick={() => {
                  setIsDarkMode(!isDarkMode);
                  showNotification(isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode');
                }}
                className={`p-2.5 sm:px-4 sm:py-2.5 rounded-2xl border transition text-xs font-bold active:scale-95 flex items-center gap-2 ${
                  isDarkMode
                    ? 'bg-slate-800 border-slate-700 text-amber-300'
                    : 'bg-white border-slate-300 text-indigo-700'
                }`}
              >
                {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
                <span className="hidden sm:inline">{isDarkMode ? 'Light' : 'Dark'}</span>
              </button>
            </div>
          </div>

          {/* DYNAMIC 4 STATS ROW */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800/40">
            <Tilt3DCard className="rounded-2xl">
              <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
                <div className={`text-xs font-bold ${subTextColorClass}`}>Total Listed</div>
                <div className={`text-xl sm:text-2xl font-black ${mainHeadingColorClass}`}>{totalPets}</div>
              </div>
            </Tilt3DCard>

            <Tilt3DCard className="rounded-2xl">
              <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'}`}>
                <div className="text-xs font-bold text-emerald-500 dark:text-emerald-400">Available</div>
                <div className="text-xl sm:text-2xl font-black text-emerald-500 dark:text-emerald-400">{availablePets}</div>
              </div>
            </Tilt3DCard>

            <Tilt3DCard className="rounded-2xl">
              <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-rose-500/10 border-rose-500/20' : 'bg-rose-50 border-rose-200'}`}>
                <div className="text-xs font-bold text-rose-500 dark:text-rose-400">Urgent</div>
                <div className="text-xl sm:text-2xl font-black text-rose-500 dark:text-rose-400">{urgentPets}</div>
              </div>
            </Tilt3DCard>

            <Tilt3DCard className="rounded-2xl">
              <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-sky-500/10 border-sky-500/20' : 'bg-sky-50 border-sky-200'}`}>
                <div className="text-xs font-bold text-sky-500 dark:text-sky-400">Adopted</div>
                <div className="text-xl sm:text-2xl font-black text-sky-500 dark:text-sky-400">{adoptedPets}</div>
              </div>
            </Tilt3DCard>
          </div>
        </header>

        {/* EXPANDED LIFESTYLE MATCHMETER WIDGET */}
        <div className="glass-panel-3d p-4 sm:p-5 rounded-3xl border space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-emerald-400 fill-emerald-400/20" />
              <h3 className="text-sm sm:text-base font-extrabold">Lifestyle Compatibility Matchmeter</h3>
            </div>
            <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
              Real-time AI Match Engine
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {/* Question 1: Apartment */}
            <button
              type="button"
              onClick={() => setLivesInApartment(!livesInApartment)}
              className={`p-2.5 rounded-2xl border text-xs font-bold flex flex-col justify-between gap-1 transition active:scale-95 ${
                livesInApartment
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <Home className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] font-extrabold opacity-80">{livesInApartment ? 'YES' : 'NO'}</span>
              </div>
              <span className="text-left leading-tight">Apartment Living</span>
            </button>

            {/* Question 2: Long Hours */}
            <button
              type="button"
              onClick={() => setWorksLongHours(!worksLongHours)}
              className={`p-2.5 rounded-2xl border text-xs font-bold flex flex-col justify-between gap-1 transition active:scale-95 ${
                worksLongHours
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <Briefcase className="w-4 h-4 text-amber-400" />
                <span className="text-[10px] font-extrabold opacity-80">{worksLongHours ? 'YES' : 'NO'}</span>
              </div>
              <span className="text-left leading-tight">Work 8+ Hours</span>
            </button>

            {/* Question 3: Kids / Pets */}
            <button
              type="button"
              onClick={() => setHasKidsOrPets(!hasKidsOrPets)}
              className={`p-2.5 rounded-2xl border text-xs font-bold flex flex-col justify-between gap-1 transition active:scale-95 ${
                hasKidsOrPets
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <Users className="w-4 h-4 text-rose-400" />
                <span className="text-[10px] font-extrabold opacity-80">{hasKidsOrPets ? 'YES' : 'NO'}</span>
              </div>
              <span className="text-left leading-tight">Kids & Other Pets</span>
            </button>

            {/* Question 4: Active Outdoor Lifestyle */}
            <button
              type="button"
              onClick={() => setIsActiveLifestyle(!isActiveLifestyle)}
              className={`p-2.5 rounded-2xl border text-xs font-bold flex flex-col justify-between gap-1 transition active:scale-95 ${
                isActiveLifestyle
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <Activity className="w-4 h-4 text-sky-400" />
                <span className="text-[10px] font-extrabold opacity-80">{isActiveLifestyle ? 'YES' : 'NO'}</span>
              </div>
              <span className="text-left leading-tight">Active / Outdoors</span>
            </button>

            {/* Question 5: First-Time Pet Owner */}
            <button
              type="button"
              onClick={() => setIsFirstTimeOwner(!isFirstTimeOwner)}
              className={`p-2.5 rounded-2xl border text-xs font-bold flex flex-col justify-between gap-1 transition active:scale-95 ${
                isFirstTimeOwner
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <UserCheck className="w-4 h-4 text-indigo-400" />
                <span className="text-[10px] font-extrabold opacity-80">{isFirstTimeOwner ? 'YES' : 'NO'}</span>
              </div>
              <span className="text-left leading-tight">First-Time Owner</span>
            </button>

            {/* Question 6: Low Maintenance */}
            <button
              type="button"
              onClick={() => setPrefersLowMaintenance(!prefersLowMaintenance)}
              className={`p-2.5 rounded-2xl border text-xs font-bold flex flex-col justify-between gap-1 transition active:scale-95 ${
                prefersLowMaintenance
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <Feather className="w-4 h-4 text-teal-400" />
                <span className="text-[10px] font-extrabold opacity-80">{prefersLowMaintenance ? 'YES' : 'NO'}</span>
              </div>
              <span className="text-left leading-tight">Low Maintenance</span>
            </button>
          </div>
        </div>

        {/* MOBILE NAVIGATION TABS */}
        <div className="flex md:hidden bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setMobileTab('gallery')}
            className={`flex-1 py-3 rounded-xl transition flex items-center justify-center gap-2 ${
              mobileTab === 'gallery'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'
                : 'text-slate-400'
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
            3D Gallery ({filteredPets.length})
          </button>
          <button
            onClick={() => setMobileTab('register')}
            className={`flex-1 py-3 rounded-xl transition flex items-center justify-center gap-2 ${
              mobileTab === 'register'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'
                : 'text-slate-400'
            }`}
          >
            <FilePlus className="w-5 h-5" />
            Register & Preview
          </button>
        </div>

        {/* MAIN SPLIT-SCREEN LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* MAIN PET GALLERY GRID (7 Cols) */}
          <div className={`md:col-span-7 lg:col-span-7 space-y-5 ${
            mobileTab === 'gallery' ? 'block' : 'hidden md:block'
          }`}>
            
            {/* SEARCH & CATEGORY FILTER BAR */}
            <div className="glass-panel-3d p-4 sm:p-5 rounded-3xl space-y-3.5">
              <div className="flex flex-col sm:flex-row items-center gap-2.5">
                <div className="relative w-full">
                  <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search pet name, ID code, category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full rounded-2xl pl-11 pr-9 py-3 text-xs sm:text-sm transition focus:outline-none ${inputThemeClass}`}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400"
                    >
                      ×
                    </button>
                  )}
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`w-full sm:w-auto px-3.5 py-3 rounded-2xl text-xs font-bold transition focus:outline-none cursor-pointer border ${
                    isDarkMode 
                      ? 'bg-slate-900/90 border-slate-800 text-slate-300' 
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  <option value="newest">Newest First</option>
                  <option value="match">Highest % Match</option>
                  <option value="name">Alphabetical</option>
                  <option value="urgent">Urgent First</option>
                </select>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { id: 'All', label: 'All 🐾' },
                  { id: 'Dog', label: 'Dogs 🐶' },
                  { id: 'Cat', label: 'Cats 🐱' },
                  { id: 'Bird', label: 'Birds 🦜' },
                  { id: 'Rabbit', label: 'Rabbits 🐰' },
                  { id: 'Hamster', label: 'Hamsters 🐹' },
                  { id: 'Reptile', label: 'Reptiles 🦎' },
                  { id: 'Fish', label: 'Fish 🐠' },
                  { id: 'Pony', label: 'Ponies 🐴' },
                  { id: 'Exotic', label: 'Exotics 🦔' }
                ].map((pill) => (
                  <button
                    key={pill.id}
                    onClick={() => setSelectedCategory(pill.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap shrink-0 ${
                      selectedCategory === pill.id
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'
                        : isDarkMode
                            ? 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 border border-slate-800/80'
                            : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 shadow-sm'
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>

            {/* DYNAMIC PET CARDS GRID */}
            {filteredPets.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {filteredPets.map((pet) => {
                  const matchScore = calculateMatchScore(pet);
                  const treatSymbol = getPetTreatSymbol(pet.category);
                  const isAdopted = pet.status === 'Adopted';

                  return (
                    <Tilt3DCard key={pet.id} className="h-full">
                      <div className="glass-card-3d rounded-3xl overflow-hidden border flex flex-col justify-between h-full group relative">
                        <div>
                          {/* Image Banner */}
                          <div
                            className="relative h-48 bg-slate-900 overflow-hidden cursor-pointer"
                            onMouseEnter={() => setHoveredCategory(pet.category)}
                            onMouseLeave={() => setHoveredCategory(null)}
                            onClick={() => setActiveModalPet(pet)}
                          >
                            <img
                              src={pet.imageUrl || getCategoryFallbackImage(pet.category)}
                              alt={pet.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = getCategoryFallbackImage(pet.category);
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

                            <span className="absolute top-2.5 left-2.5 px-3 py-1 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg flex items-center gap-1">
                              <Zap className="w-3.5 h-3.5 fill-white" />
                              {matchScore}% Match
                            </span>

                            <div className="absolute top-2.5 right-2.5">
                              {renderStatusBadge(pet.status)}
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleFavorite(pet.id);
                              }}
                              className={`absolute bottom-2.5 right-2.5 p-2.5 rounded-xl backdrop-blur-md border transition transform active:scale-90 ${
                                pet.isFavorite
                                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-500 shadow-md'
                                  : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:text-rose-400'
                              }`}
                            >
                              <Heart className={`w-4 h-4 ${pet.isFavorite ? 'fill-rose-500' : ''}`} />
                            </button>
                          </div>

                          {/* Content Body */}
                          <div className="p-4 space-y-2.5 cursor-pointer" onClick={() => setActiveModalPet(pet)}>
                            <div className="flex items-center justify-between gap-1">
                              <h3 className={`text-lg font-black tracking-tight truncate ${mainHeadingColorClass}`}>
                                {pet.name}
                              </h3>
                              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border font-bold shrink-0 ${
                                isDarkMode 
                                  ? 'bg-slate-900 text-emerald-400 border-emerald-500/20' 
                                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              }`}>
                                {pet.microchipId}
                              </span>
                            </div>

                            <p className={`text-xs leading-relaxed line-clamp-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                              {pet.description}
                            </p>

                            <div className="space-y-1.5 pt-1">
                              <div className="flex justify-between text-[11px] font-bold text-slate-400">
                                <span>Energy ⚡ ({pet.traits?.energy || 70}%)</span>
                                <span>Cuddle 🛋️ ({pet.traits?.cuddle || 80}%)</span>
                              </div>
                              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-gradient-to-r from-emerald-400 to-teal-400 h-1.5 rounded-full" style={{ width: `${pet.traits?.energy || 70}%` }}></div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Buttons Footer with Adopt Button */}
                        <div className={`p-4 pt-0 space-y-2 border-t mt-2 pt-2.5 ${
                          isDarkMode ? 'border-slate-800/80' : 'border-slate-200/80'
                        }`}>
                          <div className="flex items-center justify-between gap-1.5">
                            <button
                              onClick={() => playPetAudioSound(pet.category)}
                              className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition"
                              title="Hear Sound"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleSendTreat(pet.id)}
                              className="px-2.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1 transition active:scale-95"
                              title={`Send Virtual Treat (${treatSymbol})`}
                            >
                              <Gift className="w-3.5 h-3.5 text-amber-400" />
                              Treat {treatSymbol} ({pet.treatsCount || 0})
                            </button>

                            <button
                              onClick={() => handleDeletePet(pet.id, pet.name)}
                              className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 border border-rose-500/20 transition active:scale-95"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Primary Adopt / Sign Paper Button */}
                          <button
                            disabled={isAdopted}
                            onClick={() => setActiveAdoptPet(pet)}
                            className={`w-full py-2.5 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 shadow-lg active:scale-98 ${
                              isAdopted
                                ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                                : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-emerald-500/20'
                            }`}
                          >
                            <HeartHandshake className="w-4 h-4" />
                            {isAdopted ? 'Forever Home Found 🎉' : `Adopt ${pet.name} 🐾`}
                          </button>
                        </div>
                      </div>
                    </Tilt3DCard>
                  );
                })}
              </div>
            ) : (
              /* EMPTY STATE UI */
              <div className="glass-panel-3d p-8 rounded-3xl text-center space-y-3 my-4 border">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-3xl animate-float-3d">
                  🐾
                </div>
                <div className="max-w-xs mx-auto space-y-1">
                  <h3 className={`text-base font-extrabold ${mainHeadingColorClass}`}>No Pets Found</h3>
                  <p className={`text-xs ${subTextColorClass}`}>
                    Try adjusting search query or category pills!
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setOnlyFavorites(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-extrabold shadow-md"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>

          {/* SECONDARY SIDE PANEL: FORM & LIVE 3D PREVIEW (5 Cols) */}
          <div className={`md:col-span-5 lg:col-span-5 space-y-5 md:sticky md:top-6 ${
            mobileTab === 'register' ? 'block' : 'hidden md:block'
          }`}>
            
            {/* REGISTRATION FORM COMPONENT */}
            <div className="glass-panel-3d p-5 sm:p-6 rounded-3xl border shadow-xl">
              <div className={`flex items-center gap-2.5 mb-4 pb-3 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold">
                  <Plus className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className={`text-base font-extrabold ${mainHeadingColorClass}`}>Create Pet Profile</h2>
                  <p className={`text-[11px] ${subTextColorClass}`}>Local state profile creation</p>
                </div>
              </div>

              {formError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleAddPet} className="space-y-3.5">
                
                {/* 1. Name */}
                <div>
                  <label className={`block text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} mb-1`}>
                    Pet Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bella, Milo..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full rounded-xl px-3.5 py-2.5 text-xs sm:text-sm transition focus:outline-none ${inputThemeClass}`}
                  />
                </div>

                {/* 2. Microchip ID & Auto-Generate Side Button */}
                <div>
                  <label className={`block text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} mb-1`}>
                    Microchip ID Tag
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. PET-8492"
                      value={microchipId}
                      onChange={(e) => setMicrochipId(e.target.value)}
                      className={`w-full rounded-xl px-3.5 py-2.5 text-xs font-mono transition focus:outline-none ${inputThemeClass}`}
                    />
                    <button
                      type="button"
                      onClick={handleGenerateId}
                      className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shrink-0 active:scale-95 border ${
                        isDarkMode
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                          : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      }`}
                    >
                      <RefreshCw className={`w-4 h-4 ${isSpinningId ? 'animate-spin' : ''}`} />
                      Auto ID
                    </button>
                  </div>
                </div>

                {/* 3. Category Select Dropdown */}
                <div>
                  <label className={`block text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} mb-1`}>
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`w-full rounded-xl px-3.5 py-2.5 text-xs sm:text-sm transition cursor-pointer focus:outline-none ${inputThemeClass}`}
                  >
                    <option value="Dog" className={isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>🐶 Dog (Treat: 🦴)</option>
                    <option value="Cat" className={isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>🐱 Cat (Treat: 🐟)</option>
                    <option value="Bird" className={isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>🦜 Bird (Treat: 🥜)</option>
                    <option value="Rabbit" className={isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>🐰 Rabbit (Treat: 🥕)</option>
                    <option value="Hamster" className={isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>🐹 Hamster (Treat: 🌻)</option>
                    <option value="Reptile" className={isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>🦎 Reptile (Treat: 🐛)</option>
                    <option value="Fish" className={isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>🐠 Fish (Treat: 🍤)</option>
                    <option value="Pony" className={isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>🐴 Pony (Treat: 🍎)</option>
                    <option value="Exotic" className={isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>🦔 Exotic (Treat: 🍓)</option>
                  </select>
                </div>

                {/* 4. Adoption Status Styled Radio Buttons */}
                <div>
                  <label className={`block text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} mb-1.5`}>
                    Adoption Status <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'Available', label: 'Available', dot: 'bg-emerald-400' },
                      { id: 'Pending', label: 'Pending', dot: 'bg-amber-400' },
                      { id: 'Urgent', label: 'Urgent', dot: 'bg-rose-500' },
                      { id: 'Adopted', label: 'Adopted', dot: 'bg-sky-400' }
                    ].map((item) => (
                      <label
                        key={item.id}
                        className={`flex items-center gap-1.5 p-2 rounded-xl border cursor-pointer text-xs font-bold transition ${
                          status === item.id
                            ? isDarkMode
                                ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300'
                                : 'border-emerald-400 bg-emerald-50 text-emerald-900'
                            : isDarkMode 
                                ? 'border-slate-800 bg-slate-900/60 text-slate-400' 
                                : 'border-slate-200 bg-white text-slate-600'
                        }`}
                      >
                        <input
                          type="radio"
                          name="statusRadioGroup"
                          value={item.id}
                          checked={status === item.id}
                          onChange={(e) => setStatus(e.target.value)}
                          className="sr-only"
                        />
                        <span className={`w-2.5 h-2.5 rounded-full ${item.dot}`}></span>
                        <span>{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 5. Care Badges Selector Component */}
                <div>
                  <label className={`block text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} mb-1.5`}>
                    Health & Care Badges
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {AVAILABLE_CARE_TAGS.map((tag) => {
                      const isSelected = selectedCareTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleCareTag(tag)}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition ${
                            isSelected
                              ? 'bg-emerald-500 text-white shadow-sm'
                              : isDarkMode
                                  ? 'bg-slate-900 text-slate-400 border border-slate-800'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 6. Description Bio Textarea */}
                <div>
                  <label className={`block text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} mb-1`}>
                    Bio & Description <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={2.5}
                    placeholder="Temperament, medical notes..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={`w-full rounded-xl p-3 text-xs sm:text-sm transition focus:outline-none resize-none ${inputThemeClass}`}
                  ></textarea>
                </div>

                {/* 7. Image URL Input */}
                <div>
                  <label className={`block text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} mb-1`}>
                    Image URL <span className="text-slate-400 font-normal">(Optional direct image URL)</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className={`w-full rounded-xl px-3.5 py-2.5 text-xs transition focus:outline-none ${inputThemeClass}`}
                  />
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-xl text-xs sm:text-sm font-extrabold shadow-lg shadow-emerald-500/20 transition active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Pet Profile
                </button>
              </form>
            </div>

            {/* LIVE 3D CARD PREVIEW */}
            <div className="glass-panel-3d p-4 rounded-3xl border relative">
              <div className="flex items-center justify-between mb-2 text-xs font-extrabold uppercase text-emerald-500 dark:text-emerald-400">
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  Live 3D Tilt Preview
                </span>
                <span className="text-[10px] opacity-75">State Synced</span>
              </div>

              <Tilt3DCard>
                <div
                  className="glass-card-3d rounded-2xl overflow-hidden border shadow-lg cursor-pointer"
                  onMouseEnter={() => setHoveredCategory(category)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <div className="relative h-36 bg-slate-900 overflow-hidden">
                    <img
                      src={previewImageSrc}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getCategoryFallbackImage(category);
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-950/80 text-emerald-300 border border-emerald-500/30">
                      {category}
                    </span>

                    <div className="absolute top-2 right-2">
                      {renderStatusBadge(status)}
                    </div>
                  </div>

                  <div className="p-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-extrabold text-sm truncate ${mainHeadingColorClass}`}>
                        {name.trim() || 'Pet Name'}
                      </h3>
                      <span className="text-[10px] font-mono opacity-80">{microchipId.trim() || 'PET-XXXX'}</span>
                    </div>

                    <p className={`text-[11px] line-clamp-2 ${subTextColorClass}`}>
                      {description.trim() || 'Preview bio text...'}
                    </p>
                  </div>
                </div>
              </Tilt3DCard>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
