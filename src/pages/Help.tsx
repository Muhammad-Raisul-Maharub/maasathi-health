import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import ThemeToggle from "@/components/ThemeToggle";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/PageLayout";

const Help = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="bg-background flex flex-col pb-16">
      <div className="w-full max-w-md sm:max-w-2xl mx-auto px-4 py-3 space-y-2.5 animate-fade-in">
        <header className="flex items-center justify-between mb-1 gap-2">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Back to previous page"
              className="-ml-1 hover-scale"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-foreground">
                MaaSathi Help / সহায়তা
              </h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                How to use the app safely in the clinic.
              </p>
            </div>
          </div>
          <ThemeToggle />
        </header>

        <Card id="assessment" className="p-2.5 space-y-2 animate-fade-in">
          <h2 className="text-base font-semibold text-foreground">
            1. Using the assessment / মূল্যায়ন ব্যবহার
          </h2>
          <p className="text-xs text-muted-foreground">
            English: Ask each question clearly and record whether the symptom is present. Use the
            tool with the mother sitting comfortably and repeat back important warning signs.
          </p>
          <p className="text-xs text-muted-foreground">
            বাংলা: প্রতিটি প্রশ্ন পরিষ্কারভাবে জিজ্ঞাসা করুন এবং উপসর্গ আছে কিনা তা নির্বাচন করুন। মা যেন
            স্বস্তিতে বসে থাকেন এবং গুরুত্বপূর্ণ সতর্ক সংকেতগুলো তাকে আবার বুঝিয়ে বলুন।
          </p>
        </Card>

        <Card className="p-2.5 space-y-2 animate-fade-in">
          <h2 className="text-base font-semibold text-foreground">
            2. Understanding scores / স্কোর বোঝা
          </h2>
          <p className="text-xs text-muted-foreground">
            English: Higher scores and "High" risk mean more red-flag symptoms. This does not
            replace clinical judgment but signals that urgent review may be needed.
          </p>
          <p className="text-xs text-muted-foreground">
            বাংলা: বেশি স্কোর এবং "High" রিস্ক মানে একাধিক মারাত্মক সতর্ক উপসর্গ আছে। এটি কখনোই
            ডাক্তারের সিদ্ধান্তের বিকল্প নয়, বরং দ্রুত মূল্যায়নের প্রয়োজনীয়তা বোঝায়।
          </p>
        </Card>

        <Card id="result" className="p-2.5 space-y-2 animate-fade-in">
          <h2 className="text-base font-semibold text-foreground">
            3. When to escalate / কখন রেফার করবেন
          </h2>
          <p className="text-xs text-muted-foreground">
            English: If risk is High or symptoms suddenly worsen, contact a doctor or referral
            centre immediately according to your local protocol.
          </p>
          <p className="text-xs text-muted-foreground">
            বাংলা: যদি ঝুঁকি "High" হয় বা উপসর্গ হঠাৎ খারাপ হয়, স্থানীয় নির্দেশিকা অনুযায়ী দ্রুত
            ডাক্তার বা রেফারেল সেন্টারের সাথে যোগাযোগ করুন।
          </p>
        </Card>

        <Card className="p-2.5 space-y-2 animate-fade-in">
          <h2 className="text-base font-semibold text-foreground">
            4. Light vs Dark mode / লাইট ও ডার্ক মোড
          </h2>
          <p className="text-xs text-muted-foreground">
            English: Use light mode in bright clinics for maximum readability. Use dark mode at
            night or in low light to reduce eye strain and keep the screen discreet.
          </p>
          <p className="text-xs text-muted-foreground">
            বাংলা: উজ্জ্বল আলোযুক্ত ক্লিনিকে লেখা স্পষ্ট দেখার জন্য লাইট মোড ব্যবহার করুন। রাতের সময় বা
            কম আলোতে চোখের আরাম ও গোপনীয়তা বজায় রাখতে ডার্ক মোড ব্যবহার করুন।
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Help;
