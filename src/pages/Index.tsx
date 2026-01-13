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
    <PageLayout maxWidth="xl">
      <div className="flex flex-col" aria-label="MaaSathi AI home">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-2 animate-fade-in">
          <div className="flex items-center gap-3">
            <img
              src={logoIcon}
              alt="MaaSathi AI logo"
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-full shadow-sm object-cover"
            />
            <div className="leading-tight space-y-0.5">
              <h1 className="text-lg sm:text-2xl font-bold text-foreground tracking-tight">MaaSathi AI</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Early Care. Early Awareness.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <StatusBar />
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col justify-center animate-fade-in">
          <section className="grid gap-4 md:grid-cols-2 md:items-center lg:gap-6">
            <div className="order-2 md:order-1 space-y-3 text-center md:text-left px-2 md:px-0">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground leading-snug">
                {t('home.heroTitle')}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto md:mx-0">
                {t('home.heroSubtitle')}
              </p>

              {/* Action Buttons */}
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3 sm:max-w-md md:max-w-lg mx-auto md:mx-0">
                <Link to="/assess" className="w-full">
                  <Button
                    size="lg"
                    className="w-full h-12 sm:h-14 text-base font-semibold shadow-lg hover:shadow-xl hover-scale transition-all duration-200 active:scale-95"
                  >
                    {t('home.start')}
                  </Button>
                </Link>

                <Link to="/settings" className="w-full">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full h-12 sm:h-14 text-base font-medium hover-scale transition-all duration-200 active:scale-95"
                  >
                    Settings
                  </Button>
                </Link>
              </div>

              {/* Info Badge */}
              <div className="bg-card p-4 rounded-xl border border-border max-w-xl mx-auto md:mx-0 animate-fade-in shadow-sm">
                <p className="text-sm text-muted-foreground text-center md:text-left leading-relaxed">
                  {t('home.info')}
                </p>
              </div>
            </div>

            <div className="order-1 md:order-2 rounded-3xl overflow-hidden shadow-lg border border-border bg-muted/20 flex items-center justify-center animate-fade-in p-4 md:p-8">
              <img
                src={landingHero}
                alt="MaaSathi AI landing illustration"
                className="w-full h-auto max-h-[280px] sm:max-h-[360px] md:max-h-[400px] object-contain drop-shadow-md"
              />
            </div>
          </section>
        </main>
      </div>
    </PageLayout>
  );
};

export default Index;
