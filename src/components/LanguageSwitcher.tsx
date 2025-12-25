import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={language === "en" ? "default" : "outline"}
        size="sm"
        className="px-3 py-1 text-xs"
        onClick={() => setLanguage("en")}
      >
        EN
      </Button>
      <Button
        variant={language === "bn" ? "default" : "outline"}
        size="sm"
        className="px-3 py-1 text-xs"
        onClick={() => setLanguage("bn")}
      >
        বাংলা
      </Button>
    </div>
  );
};
