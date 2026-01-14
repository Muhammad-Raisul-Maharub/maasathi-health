import { createContext, useContext, useEffect, useState } from "react";

export type Language = "en" | "bn";

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = "maasathi_language";

const translations: Record<Language, Record<string, string>> = {
  en: {
    "app.name": "MaaSathi AI",
    "app.tagline": "Early Care. Early Awareness.",
    "status.online": "Online",
    "status.offline": "Offline mode",
    "home.heroTitle": "Offline-First, Explainable AI for Early Maternal Risk Detection",
    "home.heroSubtitle": "Get instant, private risk awareness support that works even without internet.",
    "home.start": "Start Health Checkup",
    "home.dashboard": "Health Worker Dashboard",
    "home.info": "Offline-First • Explainable AI • Your data stays safely on this device.",
    "nav.back": "Back",
    "assessment.title": "Health Risk Checkup",
    "assessment.subtitle": "Answer a few quick questions to understand your current risk.",
    "assessment.selectAnswer": "Select your answer",
    "assessment.yes": "Yes",
    "assessment.no": "No",
    "assessment.next": "Next",
    "assessment.viewResults": "View Results",
    "assessment.step": "Step",
    "assessment.of": "of",
    "result.title": "Your Assessment Results",
    "result.findClinic": "Find Nearby Clinic",
    "result.save": "Save Record",
    "result.disclaimerHeading": "Important:",
    "result.disclaimerBody": "This tool does not diagnose conditions or prescribe medication. Always consult with a healthcare professional for medical advice.",
    "dashboard.title": "Health Worker Dashboard",
    "dashboard.sync": "Sync to Cloud",
    "dashboard.total": "Total Assessments",
    "dashboard.unsynced": "Unsynced",
    "dashboard.status": "Status",
    "dashboard.online": "Online",
    "dashboard.offline": "Offline",
    "dashboard.history": "Assessment History",
    "dashboard.empty": "No assessments recorded yet.",
    "dashboard.startFirst": "Start First Assessment",
    "dashboard.analytics": "Analytics Overview",
    "dashboard.riskDistribution": "Risk Level Distribution",
    "dashboard.symptomFrequency": "Symptom Frequency",
    "dashboard.trend": "Risk Trend Over Time",
    "toast.offlineTitle": "Offline Mode",
    "toast.offlineDescription": "Cannot sync while offline. Connect to internet and try again.",
    "toast.alreadySyncedTitle": "Already Synced",
    "toast.alreadySyncedDescription": "All assessments are already synced to cloud.",
    "toast.syncCompleteTitle": "Sync Complete",
    "toast.syncCompleteDescription": "Successfully synced your assessments to cloud.",
    "toast.syncFailedTitle": "Sync Failed",
    "toast.syncFailedDescription": "Failed to sync assessments. Please try again.",
    "toast.saveSuccessTitle": "Assessment Saved",
    "toast.saveSuccessDescription": "Your health assessment has been saved successfully.",
    "toast.saveErrorTitle": "Error",
    "toast.saveErrorDescription": "Failed to save assessment. Please try again.",
    "toast.clinicComingSoonTitle": "Coming Soon",
    "toast.clinicComingSoonDescription": "Clinic finder feature will be available soon.",
    "notFound.title": "Page not found",
    "notFound.description": "Oops! Page not found",
    "notFound.backHome": "Return to Home",
    "result.followUp": "Follow Up",
    "result.viewHistory": "View History",
    "dashboard.export": "Export PDF",
    "workerHome.welcome": "Welcome, Health Worker",
    "workerHome.subtitle": "Manage maternal health assessments efficiently",
  },
  bn: {
    "app.name": "মা-সাথী এআই",
    "app.tagline": "আগে যত্ন, আগে সচেতনতা।",
    "status.online": "অনলাইনে",
    "status.offline": "অফলাইন মোড",
    "home.heroTitle": "অফলাইন-ফার্স্ট, ব্যাখ্যাযোগ্য এআই মাতৃস্বাস্থ্য ঝুঁকি শনাক্তকরণের জন্য",
    "home.heroSubtitle": "ইন্টারনেট ছাড়াই দ্রুত ও ব্যক্তিগত ঝুঁকি সচেতনতা সহায়তা পান।",
    "home.start": "হেলথ চেকআপ শুরু করুন",
    "home.dashboard": "স্বাস্থ্যকর্মী ড্যাশবোর্ড",
    "home.info": "অফলাইন-ফার্স্ট • ব্যাখ্যাযোগ্য এআই • আপনার ডাটা নিরাপদে এই ডিভাইসেই থাকে।",
    "nav.back": "ফিরে যান",
    "assessment.title": "স্বাস্থ্য ঝুঁকি মূল্যায়ন",
    "assessment.subtitle": "কিছু সহজ প্রশ্নের উত্তর দিন এবং আপনার ঝুঁকি সম্পর্কে জানুন।",
    "assessment.selectAnswer": "আপনার উত্তর নির্বাচন করুন",
    "assessment.yes": "হ্যাঁ",
    "assessment.no": "না",
    "assessment.next": "পরবর্তী",
    "assessment.viewResults": "ফলাফল দেখুন",
    "assessment.step": "ধাপ",
    "assessment.of": "মোট",
    "result.title": "আপনার মূল্যায়নের ফলাফল",
    "result.findClinic": "নিকটস্থ ক্লিনিক খুঁজুন",
    "result.save": "রেকর্ড সংরক্ষণ করুন",
    "result.disclaimerHeading": "গুরুত্বপূর্ণ:",
    "result.disclaimerBody": "এই টুল কোনও রোগ নির্ণয় করে না বা ওষুধের পরামর্শ দেয় না। সব সময় চিকিৎসকের পরামর্শ নিন।",
    "dashboard.title": "স্বাস্থ্যকর্মী ড্যাশবোর্ড",
    "dashboard.sync": "ক্লাউডে সিঙ্ক করুন",
    "dashboard.total": "মোট মূল্যায়ন",
    "dashboard.unsynced": "অসিঙ্কড রেকর্ড",
    "dashboard.status": "অবস্থা",
    "dashboard.online": "অনলাইন",
    "dashboard.offline": "অফলাইন",
    "dashboard.history": "মূল্যায়নের তালিকা",
    "dashboard.empty": "এখনও কোনও মূল্যায়ন রেকর্ড করা হয়নি।",
    "dashboard.startFirst": "প্রথম মূল্যায়ন শুরু করুন",
    "dashboard.analytics": "বিশ্লেষণাত্মক সারাংশ",
    "dashboard.riskDistribution": "ঝুঁকি স্তর বণ্টন",
    "dashboard.symptomFrequency": "লক্ষণ অনুযায়ী সংখ্যা",
    "dashboard.trend": "সময়ের সাথে ঝুঁকির প্রবণতা",
    "toast.offlineTitle": "অফলাইন মোড",
    "toast.offlineDescription": "অফলাইনে থাকায় এখন সিঙ্ক করা যাচ্ছে না। ইন্টারনেটে যুক্ত হয়ে আবার চেষ্টা করুন।",
    "toast.alreadySyncedTitle": "ইতিমধ্যে সিঙ্কড",
    "toast.alreadySyncedDescription": "সব মূল্যায়ন ইতিমধ্যেই ক্লাউডে সিঙ্ক করা আছে।",
    "toast.syncCompleteTitle": "সিঙ্ক সম্পন্ন",
    "toast.syncCompleteDescription": "আপনার সব মূল্যায়ন সফলভাবে ক্লাউডে সিঙ্ক হয়েছে।",
    "toast.syncFailedTitle": "সিঙ্ক ব্যর্থ",
    "toast.syncFailedDescription": "সিঙ্ক সম্পন্ন হয়নি। অনুগ্রহ করে আবার চেষ্টা করুন।",
    "toast.saveSuccessTitle": "মূল্যায়ন সংরক্ষিত",
    "toast.saveSuccessDescription": "আপনার স্বাস্থ্য মূল্যায়ন সফলভাবে সংরক্ষণ করা হয়েছে।",
    "toast.saveErrorTitle": "ত্রুটি",
    "toast.saveErrorDescription": "মূল্যায়ন সংরক্ষণ করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।",
    "toast.clinicComingSoonTitle": "শীঘ্রই আসছে",
    "toast.clinicComingSoonDescription": "ক্লিনিক খোঁজার ফিচারটি খুব শিগগিরই চালু হবে।",
    "notFound.title": "পাতা পাওয়া যায়নি",
    "notFound.description": "উফ! পাতা খুঁজে পাওয়া যায়নি",
    "notFound.backHome": "হোম পেজে ফিরুন",
    "result.followUp": "ফলো আপ",
    "result.viewHistory": "ইতিহাস দেখুন",
    "dashboard.export": "PDF ডাউনলোড",
    "workerHome.welcome": "স্বাগতম, স্বাস্থ্যকর্মী",
    "workerHome.subtitle": "মাতৃস্বাস্থ্য মূল্যায়ন দক্ষতার সাথে পরিচালনা করুন",
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = (typeof window !== "undefined" && window.localStorage.getItem(STORAGE_KEY)) as Language | null;
    return stored === "bn" ? "bn" : "en";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, language);
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string) => translations[language][key] ?? translations.en[key] ?? key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
