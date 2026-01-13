# MaaSathi AI 🏥🤰

**MaaSathi AI** is an intelligent, offline-first Progressive Web App (PWA) designed to empower Health Workers and Pregnant Mothers in rural areas. It uses rule-based AI to assess maternal health risks, works completely offline, and automatically syncs data to the cloud when internet connectivity is available.

![MaaSathi Banner](/public/pwa-512x512.png)

## 🌐 Live Demo
[**https://maasathi-health.vercel.app/login**](https://maasathi-health.vercel.app/login)

## 🌟 Key Features

### 1. 📶 Offline-First Core
*   **Works Everywhere**: Fully functional without internet access. Data is stored locally using `Dexie.js` (IndexedDB).
*   **Smart Sync**: Automatically uploads offline assessments to Supabase once connectivity is restored.
*   **Resilient**: Handles network interruptions gracefully with batch processing and retry logic.

### 2. 🧠 AI-Powered Assessment
*   **Clinical Logic**: Calculates risk scores based on symptoms (e.g., high fever, severe headache, bleeding).
*   **Instant Feedback**: Classifies risks as **High**, **Moderate**, or **Low** and provides immediate actionable advice.
*   **Bilingual**: Full support for **English** and **Bengali (Bangla)**.

### 3. 📱 Mobile-First PWA & Android App
*   **Installable**: safe to install on any Android/iOS device directly from the browser.
*   **Native Android**: Built with **Capacitor** to generate a legitimate `.apk` file.
*   **Optimized UI**:
    *   **Glassmorphism Design**: Modern, beautiful interface.
    *   **Thumb-Friendly**: Sticky bottom navigation and buttons for easy mobile use.
    *   **Responsive**: Side Navigation Rail for desktop/tablet users.

### 4. 🔐 Secure Role-Based Authentication
*   **Google Auth**: One-click login with automatic profile creation.
*   **Role Management**:
    *   **Health Workers**: Access to Analytics Dashboard, Patient History, and CSV Exports.
    *   **Pregnant Mothers**: Access to Self-Assessment, Educational Home Page, and Emergency Contacts.
*   **Security**: Row Level Security (RLS) ensures strict data privacy.

---

## 🛠️ Tech Stack

*   **Frontend**: React (Vite), TypeScript, Tailwind CSS, Shadcn UI
*   **State & Cache**: TanStack Query (React Query)
*   **Local Database**: Dexie.js (IndexedDB wrapper)
*   **Backend & Auth**: Supabase (PostgreSQL, Auth, Edge Functions)
*   **Mobile Engine**: Capacitor (for Android Native Build)
*   **Animations**: Framer Motion

---

## 🚀 Getting Started

### Prerequisites
*   Node.js & npm installed
*   Android Studio (only for building the native Android app)

### 1. Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd maasathi-health

# Install dependencies
npm install
```

### 2. running Locally (Web)

```bash
npm run dev
# Open http://localhost:8080
```

### 3. Building for Android

```bash
# Build web assets and sync with Capacitor
npm run build:android

# Open Android Studio
npx cap open android
# Click the "Run" (Play) button in Android Studio to launch on Emulator/Device
```

---

## ☁️ Deployment

### Web (Vercel)
The easiest way to deploy is via Vercel.
1.  Push code to GitHub.
2.  Import project in Vercel.
3.  Add Environment Variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`).
4.  Deploy!

### Android (APK)
1.  Run `npx cap open android`.
2.  Go to **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
3.  Locate the generated `app-debug.apk` and share it!

---

## 🔒 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

---

## 👨‍💻 Developed By

**Muhammad Raisul Maharub**  
*Empowering Maternal Health through Technology.*
