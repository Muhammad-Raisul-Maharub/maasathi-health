import { Button } from '@/components/ui/button';
import { StatusBar } from '@/components/StatusBar';
import { Link } from 'react-router-dom';
import logoIcon from '@/assets/maasathi-logo-icon.png';
import landingHero from '@/assets/maasathi-landing.png';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';

const Index = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="max-w-md mx-auto w-full p-6 flex flex-col min-h-screen" aria-label="MaaSathi AI home">

        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3 animate-fade-in">
            <img src={logoIcon} alt="MaaSathi AI logo" className="h-10 w-10 rounded-full shadow-sm" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">{t('app.name')}</h1>
              <p className="text-sm text-muted-foreground">{t('app.tagline')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <StatusBar />
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col justify-center space-y-8">
          <div className="space-y-6">
            <div className="rounded-3xl overflow-hidden shadow-md border border-border animate-fade-in">
              <img
                src={landingHero}
                alt="MaaSathi AI landing illustration showing mother and child with Offline-First and Explainable AI"
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="text-center space-y-3 px-2 md:px-4">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-snug">
                {t('home.heroTitle')}
              </h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('home.heroSubtitle')}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <section className="mt-4 space-y-4" aria-label="Primary actions">
            <Link to="/assess" className="block">
              <Button
                size="lg"
                className="w-full text-lg py-6 shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 hover-scale"
              >
                {t('home.start')}
              </Button>
            </Link>
            <Link to="/dashboard" className="block">
              <Button
                variant="outline"
                size="lg"
                className="w-full text-lg py-6 transition-all duration-200 active:scale-95 hover-scale"
              >
                {t('home.dashboard')}
              </Button>
            </Link>

            {/* Info Badge */}
            <div className="bg-card p-4 rounded-lg border border-border mt-2">
              <p className="text-sm md:text-base text-muted-foreground text-center">
                {t('home.info')}
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Index;
