import { Button } from '@/components/ui/button';
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
    <div className="min-h-screen bg-background flex flex-col">
      <div className="max-w-5xl mx-auto w-full px-4 py-6 sm:px-6 sm:py-8 flex flex-col min-h-screen" aria-label="MaaSathi AI home">
        <header className="flex items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4 animate-fade-in">
            <img
              src={logoIcon}
              alt="MaaSathi AI logo"
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-full shadow-sm"
            />
            <div className="leading-tight">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{t('app.name')}</h1>
              <p className="text-sm sm:text-base text-muted-foreground">{t('app.tagline')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
            <StatusBar />
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col justify-center">
          <section className="grid gap-8 md:grid-cols-2 md:items-center">
            <div className="order-2 md:order-1 space-y-4 text-center md:text-left px-2 md:px-0">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-snug">
                {t('home.heroTitle')}
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto md:mx-0">
                {t('home.heroSubtitle')}
              </p>

              {/* Action Buttons */}
              <div className="mt-4 space-y-3 sm:space-y-0 sm:flex sm:flex-wrap sm:gap-3">
                <Link to="/assess" className="flex-1 min-w-[150px]">
                  <Button
                    size="lg"
                    className="w-full text-base sm:text-lg py-3 sm:py-4 shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
                  >
                    {t('home.start')}
                  </Button>
                </Link>
                <Link to="/dashboard" className="flex-1 min-w-[150px]">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full text-base sm:text-lg py-3 sm:py-4 transition-all duration-200 active:scale-95"
                  >
                    {t('home.dashboard')}
                  </Button>
                </Link>
                <Link to="/settings" className="flex-1 min-w-[150px]">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full text-base sm:text-lg py-3 sm:py-4 transition-all duration-200 active:scale-95"
                  >
                    Settings
                  </Button>
                </Link>
              </div>

              {/* Info Badge */}
              <div className="bg-card p-4 rounded-lg border border-border mt-4 max-w-xl mx-auto md:mx-0">
                <p className="text-sm sm:text-base text-muted-foreground text-center md:text-left">
                  {t('home.info')}
                </p>
              </div>
            </div>

            <div className="order-1 md:order-2 rounded-3xl overflow-hidden shadow-md border border-border animate-fade-in">
              <img
                src={landingHero}
                alt="MaaSathi AI landing illustration showing mother and child with Offline-First and Explainable AI"
                className="w-full h-full max-h-[320px] sm:max-h-[380px] md:max-h-[440px] object-cover"
              />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Index;
