import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBar } from '@/components/StatusBar';
import { Link } from 'react-router-dom';
import logoIcon from '@/assets/maasathi-logo-icon.png';
import landingHero from '@/assets/maasathi-landing.png';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';
import ThemeToggle from '@/components/ThemeToggle';

const Index = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-background flex flex-col min-h-screen pb-20">
      <div className="max-w-md mx-auto w-full px-4 py-3 flex flex-col h-full" aria-label="MaaSathi AI home">
        <header className="flex items-center justify-between mb-3 animate-fade-in">
          <div className="flex items-center gap-2.5">
            <img
              src={logoIcon}
              alt="MaaSathi AI logo"
              className="h-10 w-10 rounded-full shadow-sm object-cover"
            />
            <div className="leading-tight">
              <h1 className="text-base font-bold text-foreground">MaaSathi AI</h1>
              <p className="text-xs text-muted-foreground">Early Care. Early Awareness.</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <LanguageSwitcher />
            <ThemeToggle />
            <StatusBar />
          </div>
        </header>

        <main className="flex-1 flex flex-col justify-start animate-fade-in space-y-3">
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 overflow-hidden">
            <CardContent className="p-3">
              <div className="flex flex-col items-center text-center gap-2.5">
                <img 
                  src={landingHero} 
                  alt="MaaSathi AI Landing" 
                  className="w-full max-w-[240px] h-auto rounded-lg"
                />
                <div className="space-y-1">
                  <h2 className="text-base font-bold text-foreground leading-tight">
                    {t('home.heroTitle')}
                  </h2>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {t('home.heroSubtitle')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Link to="/assess">
              <Button 
                size="lg" 
                className="w-full text-base font-semibold py-6 hover-scale shadow-md"
              >
                {t('home.start')}
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full text-base font-medium py-5 hover-scale"
              >
                {t('home.dashboard')}
              </Button>
            </Link>
            <Link to="/settings">
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full text-base font-medium py-5 hover-scale"
              >
                Settings
              </Button>
            </Link>
          </div>

          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t('home.info')}
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Index;
