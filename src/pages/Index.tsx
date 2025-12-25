import { Button } from '@/components/ui/button';
import { StatusBar } from '@/components/StatusBar';
import { Link } from 'react-router-dom';
import logoIcon from '@/assets/maasathi-logo-icon.png';
import landingHero from '@/assets/maasathi-landing.png';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';
import ThemeToggle from '@/components/ThemeToggle';
import PageLayout from '@/components/PageLayout';

const Index = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20">
      <div className="max-w-5xl mx-auto w-full px-4 py-4 sm:px-6 sm:py-6 flex flex-col min-h-screen" aria-label="MaaSathi AI home">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-3 animate-fade-in">
            <img
              src={logoIcon}
              alt="MaaSathi AI logo"
              className="h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-sm object-cover"
            />
            <div className="leading-tight space-y-0.5">
              <h1 className="text-xl sm:text-3xl font-bold text-foreground tracking-tight">MaaSathi AI</h1>
              <p className="text-sm sm:text-base text-muted-foreground max-w-[14rem] sm:max-w-none">
                Early Care. Early Awareness.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
            <StatusBar />
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col justify-center">
          <section className="grid gap-6 md:grid-cols-2 md:items-center">
            <div className="order-2 md:order-1 space-y-4 text-center md:text-left px-2 md:px-0">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-snug">
                {t('home.heroTitle')}
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto md:mx-0">
                {t('home.heroSubtitle')}
              </p>

              {/* Action Buttons */}
              <div className="mt-5 w-full space-y-3 sm:max-w-sm sm:mx-auto md:mx-0">
                <Link to="/assess">
                  <Button
                    size="lg"
                    className="w-full justify-center text-base sm:text-lg py-3 sm:py-4 shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
                  >
                    {t('home.start')}
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full justify-center text-base sm:text-lg py-3 sm:py-4 transition-all duration-200 active:scale-95"
                  >
                    {t('home.dashboard')}
                  </Button>
                </Link>
                <Link to="/settings">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full justify-center text-base sm:text-lg py-3 sm:py-4 transition-all duration-200 active:scale-95"
                  >
                    Settings
                  </Button>
                </Link>
              </div>

              {/* Info Badge */}
              <div className="bg-card p-3 rounded-lg border border-border mt-3 max-w-xl mx-auto md:mx-0">
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
