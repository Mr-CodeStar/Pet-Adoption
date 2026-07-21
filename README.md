# 🐾 PawPath - Ultra-Modern Pet Adoption Sanctuary & Portal

**PawPath** is a single-page React application for pet adoption management, compatibility matching, and digital guardianship certification. Built with a pure frontend architecture (`useState` local state management), glassmorphism design tokens, interactive 3D physics tilt effects, and real-time animal specific features.

---

## 🌟 Key Features

### 1. 🎯 Real-Time Lifestyle Compatibility Matchmeter
- Dynamic **% Match Score** calculation based on 6 lifestyle questions:
  - 🏢 Apartment Living
  - 💼 Long Work Hours (8+ hrs)
  - 👶 Kids & Other Pets
  - 🏃 Active Outdoor Lifestyle
  - 🔰 First-Time Pet Owner
  - 🧹 Low Maintenance Preference

### 2. ✍️ Digital Signature Pad & Guardianship Deed Certificate
- Draw digital signatures directly using a mouse or touch screen finger on an interactive HTML5 `<canvas>`.
- Collects official adopter details: Full Name, Email, Phone, Address, and Government ID tag.
- Select from 4 Adoption Types:
  - 🏡 *Full Permanent Adoption*
  - 🏠 *Temporary Foster Care*
  - 🌟 *Virtual Sponsorship*
  - 💛 *Senior Companion Care*
- **Print & Save PDF**: High-resolution official printable certificate format (`window.print()`).

### 3. 🐾 Dynamic Animal Hover Cursors & Particle Footprint Trails
- Morphing cursor that adapts per animal species when hovering image cards:
  - 🐶 **Dogs**: `🐶` with `🐾` `🦴` `✨` trails
  - 🐱 **Cats**: `🐱` with `🐾` `🐟` `✨` trails
  - 🦜 **Birds**: `🦜` with `🪶` `✨` `🌿` trails
  - 🐰 **Rabbits**: `🐰` with `🥕` `🐾` `✨` trails
  - 🐹 **Hamsters**: `🐹` with `🌻` `🐾` `✨` trails
  - 🦎 **Reptiles**: `🦎` with `🍃` `✨` `🦎` trails
  - 🐠 **Fish**: `🐠` with `🫧` `🌊` `✨` trails
  - 🐴 **Ponies**: `🐴` with `🌾` `🍎` `✨` trails

### 4. 📐 3D Card Tilt Physics & Specular Reflection
- Real-time mouse rotation physics (`perspective`, `rotateX`, `rotateY`, `scale3d`) with dynamic radial light reflection overlays.

### 5. 🍖 Species-Specific Virtual Treats & Confetti Explosion
- Interactive treat counter with custom treats per animal (Bones 🦴, Fish 🐟, Nuts 🥜, Carrots 🥕, Seeds 🌻, Worms 🐛, Shrimp 🍤, Apples 🍎).
- Celebratory particle confetti bursts powered by `canvas-confetti`.

### 6. 🪙 Monthly Care Budget Estimator in Indian Rupees (₹)
- Cost breakdown for Food, Bedding, and Vet Reserves in **₹ INR**.
- Interactive multiplier toggle: **🪙 Standard Care Mode** vs. **👑 Spoiled Pet Mode**.

### 7. 🔊 Native Web Audio Synthesizer Soundboard
- Native Web Audio API frequency ramps generating barks, meows, chirps, and thumps for each animal category without external MP3 files.

### 8. 🌙 Dark & Light Mode Theme Toggle
- Instant theme switcher tailored for ambient night views or bright daylight.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + Custom Glassmorphism System
- **Icons**: [Lucide React](https://lucide.dev/)
- **Effects**: `canvas-confetti`, Web Audio API, Canvas Signature API

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn

### Installation & Local Run

```bash
# 1. Clone the repository
git clone https://github.com/your-username/pet-adoption-application.git

# 2. Navigate to project folder
cd pet-adoption-application

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

### Production Build

```bash
# Build production bundle
npm run build

# Preview production build
npm run preview
```

---

## 📄 License
MIT License © 2026 PawPath Sanctuary
