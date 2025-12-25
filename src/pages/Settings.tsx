import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { ArrowLeft, Moon, Sun, HelpCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PageLayout from "@/components/PageLayout";

const Settings = () => {
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="bg-background min-h-screen pb-20">
      <div className="max-w-md mx-auto w-full px-4 py-3 space-y-3 animate-fade-in">
        <header className="flex items-center gap-3 mb-2">
          <Button variant="ghost" size="icon" className="-ml-1 hover-scale" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold text-foreground flex-1">
            Settings
          </h1>
        </header>

        <Card className="p-4 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-semibold text-foreground">Theme</p>
              <p className="text-sm text-muted-foreground">Toggle light / dark mode</p>
            </div>
            <Button variant="outline" size="icon" className="h-11 w-11" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>

          <div className="border-t border-border pt-4 flex items-center justify-between">
            <div>
              <p className="text-base font-semibold text-foreground">Language</p>
              <p className="text-sm text-muted-foreground">Switch between English and Bangla</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={language === "en" ? "default" : "outline"}
                size="lg"
                className="px-6 py-5 text-base font-bold"
                onClick={() => setLanguage("en")}
              >
                EN
              </Button>
              <Button
                variant={language === "bn" ? "default" : "outline"}
                size="lg"
                className="px-6 py-5 text-base font-bold"
                onClick={() => setLanguage("bn")}
              >
                BN
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between gap-3 animate-fade-in">
          <div>
            <p className="text-base font-semibold text-foreground">Help & guidance</p>
            <p className="text-sm text-muted-foreground">How to use MaaSathi safely</p>
          </div>
          <Link to="/help">
            <Button variant="outline" className="gap-2 hover-scale px-5 py-5">
              <HelpCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Open help</span>
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
