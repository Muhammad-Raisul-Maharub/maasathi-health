import { Button } from '@/components/ui/button';
import { StatusBar } from '@/components/StatusBar';
import { ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoIcon from '@/assets/maasathi-logo-icon.png';
import landingHero from '@/assets/maasathi-landing.png';

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="max-w-md mx-auto w-full p-6 flex flex-col min-h-screen" aria-label="MaaSathi AI home">

        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <img src={logoIcon} alt="MaaSathi AI logo" className="h-10 w-10 rounded-full shadow-sm" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">MaaSathi AI</h1>
              <p className="text-sm text-muted-foreground">Early Care. Early Awareness.</p>
            </div>
          </div>
          <StatusBar />
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col justify-center space-y-8">
          <div className="space-y-6">
            <div className="rounded-3xl overflow-hidden shadow-md border border-border">
              <img
                src={landingHero}
                alt="MaaSathi AI landing illustration showing mother and child with Offline-First and Explainable AI"
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="text-center space-y-3">
              <h2 className="text-2xl font-bold text-foreground">
                Offline-First, Explainable AI for Early Maternal Risk Detection
              </h2>
              <p className="text-base text-muted-foreground">
                Get instant, private risk awareness support that works even without internet.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <section className="mt-4 space-y-4" aria-label="Primary actions">
            <Link to="/assess" className="block">
              <Button
                size="lg"
                className="w-full text-lg py-6 shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
              >
                Start Health Checkup
              </Button>
            </Link>
            <Link to="/dashboard" className="block">
              <Button
                variant="outline"
                size="lg"
                className="w-full text-lg py-6 transition-all duration-200 active:scale-95"
              >
                Health Worker Dashboard
              </Button>
            </Link>

            {/* Info Badge */}
            <div className="bg-card p-4 rounded-lg border border-border mt-2">
              <p className="text-sm text-muted-foreground text-center">
                Offline-First • Explainable AI • Your data stays safely on this device.
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Index;
