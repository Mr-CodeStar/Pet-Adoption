# 🐾 PawPath - Smart Pet Adoption Portal & Digital Certificate System

PawPath is a modern, full-stack pet adoption marketplace that connects animal shelters, pet owners, and compassionate adopters. PawPath offers transparent pet welfare profiles (including personality traits, daily routines, and monthly care budget breakdowns in INR ₹), lifestyle compatibility match-making, user ownership controls, and digital adoption agreements with interactive signature certificates.

---

## 🛠️ Technology Stack

### **Frontend**
- **Core Framework**: React 18 (Vite 8 build tool)
- **Styling**: Tailwind CSS with custom glassmorphism design tokens & 3D tilt effects
- **Icons**: Lucide React Icons
- **Interactivity**: HTML5 Canvas for Digital Signatures, `canvas-confetti` for adoption celebrations

### **Backend**
- **Runtime**: Node.js
- **Server Framework**: Express.js
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) & Password Hashing (`bcryptjs`)
- **Security & Middleware**: CORS, Custom Ownership Verification Middleware (`anyAuthMiddleware`)

### **Database**
- **Database Engine**: SQLite (WebAssembly `sql.js`)
- **Storage**: Disk-backed persistent SQLite database (`server/database.sqlite`)

---

## ✨ Key Features

- 🏠 **PawPath Landing Page**: Engaging hero section, impact metrics, 3-step adoption process guide, and interactive FAQ accordion.
- 🐾 **Adoption Marketplace**: Shared gallery for dogs, cats, birds, rabbits, hamsters, reptiles, fish, ponies, and exotics.
- ⚡ **Lifestyle Matchmeter**: Real-time compatibility score computed against user living situation (apartment, work hours, kids, activity level).
- 🔐 **User Account System**: Gmail & Password authentication, personal profile management, and dashboard for registered pets.
- 🛡️ **Ownership Security & Controls**: Regular users can add, edit, or delete ONLY their own listed pets. Non-owned pets can only be viewed, adopted, or sent virtual treats.
- 🔑 **Unified Admin Login**: Administrators log in seamlessly through the standard sign-in form using admin credentials.
- 📄 **Digital Adoption Certificate**: Official adoption agreement with interactive canvas signature, digital seal, and print/save PDF support.
- 📱 **Vertical Left Navigation Bar**: Modern vertical sidebar navigation with responsive layout support.

---

## 📂 Project Structure

```
PET-Adoption_Application/
├── server/                   # Backend Express API & SQLite Database
│   ├── db.js                 # SQLite database initialization & migrations
│   ├── index.js              # Express API server & routes
│   └── database.sqlite       # Persistent SQLite DB file (Git ignored)
├── src/                      # Frontend React Application
│   ├── components/           # React Components
│   │   ├── AdminPanel.jsx        # Admin control panel modal
│   │   ├── LandingPage.jsx       # PawPath landing page with FAQs
│   │   ├── UserAuthModal.jsx     # Login & Registration modal
│   │   └── UserDashboardModal.jsx # Profile & My Registered Pets modal
│   ├── services/
│   │   └── api.js            # Frontend API client service
│   ├── App.jsx               # Main Application component & Marketplace
│   ├── main.jsx              # Application entry point
│   └── index.css             # Glassmorphism design system & utility CSS
├── package.json              # Dependencies and scripts
├── vite.config.js            # Vite configuration
└── .gitignore                # Git ignore configuration
```

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (version 18 or higher recommended)
- npm (Node Package Manager)

### Installation & Run Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/pet-adoption-application.git
   cd pet-adoption-application
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run the Full-Stack Application**:
   - **Option A: Run Frontend & Backend Simultaneously**:
     ```bash
     npm run dev:all
     ```
   - **Option B: Run Backend and Frontend Separately**:
     - Terminal 1 (Express Backend Server on `http://localhost:5000`):
       ```bash
       npm run server
       ```
     - Terminal 2 (Vite Frontend Development Server on `http://localhost:5173`):
       ```bash
       npm run dev
       ```

4. **Access the App**:
   Open your browser and navigate to `http://localhost:5173`.

---

## 🌐 How to Deploy PawPath to the Web

### **Option 1: Full-Stack Deployment on Render / Railway / Fly.io (Recommended)**

Since PawPath uses an Express.js backend with persistent SQLite storage, deploying to a platform like Render or Railway is seamless:

1. **Push your code to GitHub** (Ensure `server/database.sqlite` and `node_modules/` are ignored in `.gitignore`).
2. **Create a Web Service on Render or Railway**:
   - Build Command: `npm install && npm run build`
   - Start Command: `node server/index.js`
3. **Configure Environment Variables**:
   - Set `PORT` = `5000`
   - Set `JWT_SECRET` = `your_secure_random_jwt_secret_key`
4. **Serve Static Files in Express**:
   Update `server/index.js` to serve the built static assets from `dist/` in production:
   ```javascript
   import path from 'path';
   if (process.env.NODE_NODE_ENV === 'production') {
     app.use(express.static(path.join(__dirname, '../dist')));
     app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '../dist', 'index.html')));
   }
   ```

### **Option 2: Decoupled Deployment (Vercel + Railway)**
- **Frontend**: Connect your GitHub repository to **Vercel** or **Netlify**. Set the build command to `npm run build` and publish directory to `dist`. Update `API_BASE_URL` in `src/services/api.js` to point to your live backend domain.
- **Backend**: Deploy the `server/` directory as a Node.js Web Service on **Railway** or **Render**.

---

## 📱 How to Convert PawPath into a Mobile App (iOS & Android)

PawPath's responsive UI and React architecture make it easy to convert into a mobile application.

### **Method 1: Ionic Capacitor (Recommended & Easiest)**

[Capacitor](https://capacitorjs.com/) turns any Vite/React web build into a native iOS and Android application without rewriting your code.

1. **Install Capacitor in your project**:
   ```bash
   npm install @capacitor/core @capacitor/cli
   npx cap init PawPath com.pawpath.app
   ```

2. **Add Android and iOS Native Platforms**:
   ```bash
   npm install @capacitor/android @capacitor/ios
   npx cap add android
   npx cap add ios
   ```

3. **Build the Web App & Sync to Mobile Native Projects**:
   ```bash
   npm run build
   npx cap sync
   ```

4. **Open in Android Studio or Xcode**:
   ```bash
   npx cap open android   # Opens in Android Studio to build APK/AAB
   npx cap open ios       # Opens in Xcode to build iOS App
   ```

---

### **Method 2: Progressive Web App (PWA)**

Turn PawPath into an installable mobile PWA with offline capabilities and a home-screen icon:

1. **Add `vite-plugin-pwa`**:
   ```bash
   npm install vite-plugin-pwa -D
   ```
2. **Add `manifest.json`** with app icons, theme colors (`#10b981`), and display name.
3. Users can tap **"Add to Home Screen"** on iOS Safari or Android Chrome to launch PawPath as an app.

---

### **Method 3: React Native / Expo**

If you want to build native UI components:
- You can reuse the backend API server (`server/index.js`) and API client functions (`src/services/api.js`).
- Initialize a React Native / Expo app (`npx create-expo-app PawPathMobile`) and consume the same endpoints.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
