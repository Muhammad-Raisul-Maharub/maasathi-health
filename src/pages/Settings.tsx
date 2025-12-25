import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";

const Settings = () => {
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto w-full p-6 space-y-6">
        <header className="flex items-center gap-3 mb-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground flex-1">
            Settings
          </h1>
        </header>

        <Card className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Theme</p>
              <p className="text-sm text-muted-foreground">Toggle light / dark mode</p>
            </div>
            <Button variant="outline" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>

          <div className="border-t border-border pt-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Language</p>
              <p className="text-sm text-muted-foreground">Switch between English and Bangla</p>
            </div>
            <div className="flex gap-2">
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
      </div>
    </div>
  );
};

export default Settings;
