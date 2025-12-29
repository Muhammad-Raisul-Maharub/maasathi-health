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
    <div className="bg-background flex flex-col pb-16">
      <div className="w-full max-w-md sm:max-w-3xl lg:max-w-5xl mx-auto px-4 py-3 space-y-2.5 animate-fade-in">
        <header className="flex items-center gap-2 mb-1">
          <Button variant="ghost" size="icon" className="-ml-1 hover-scale" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg sm:text-xl font-bold text-foreground flex-1">
            Settings
          </h1>
        </header>

        <Card className="p-3 space-y-2.5 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Theme</p>
              <p className="text-xs text-muted-foreground">Toggle light / dark mode</p>
            </div>
            <Button variant="outline" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>

          <div className="border-t border-border pt-2.5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Language</p>
              <p className="text-xs text-muted-foreground">Switch between English and Bangla</p>
            </div>
            <div className="flex gap-1.5">
              <Button
                variant={language === "en" ? "default" : "outline"}
                size="sm"
                onClick={() => setLanguage("en")}
              >
                EN
              </Button>
              <Button
                variant={language === "bn" ? "default" : "outline"}
                size="sm"
                onClick={() => setLanguage("bn")}
              >
                BN
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-3 flex flex-col sm:flex-row items-center justify-between gap-2 animate-fade-in">
          <div className="text-left w-full sm:w-auto">
            <p className="text-sm font-medium text-foreground">Help & guidance</p>
            <p className="text-xs text-muted-foreground">How to use MaaSathi safely</p>
          </div>
          <Link to="/help" className="w-full sm:w-auto">
            <Button variant="outline" size="sm" className="w-full sm:w-auto gap-2 hover-scale">
              <HelpCircle className="w-4 h-4" />
              Open help
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
