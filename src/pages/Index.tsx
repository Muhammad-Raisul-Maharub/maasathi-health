import { Button } from '@/components/ui/button';
import { StatusBar } from '@/components/StatusBar';
import { Heart, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="max-w-md mx-auto w-full p-6 flex flex-col min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">MaaSathi AI</h1>
          </div>
          <StatusBar />
        </div>

        {/* Hero Section */}
        <div className="flex-1 flex flex-col justify-center space-y-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-primary/10 rounded-full">
                <ShieldCheck className="w-16 h-16 text-primary" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-foreground">
              Offline, Explainable AI for Early Maternal Risk Detection
            </h2>
            <p className="text-lg text-muted-foreground">
              Get instant health risk assessment without internet connection
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link to="/assess" className="block">
              <Button size="lg" className="w-full text-lg py-6 shadow-lg hover:shadow-xl transition-all">
                Start Health Checkup
              </Button>
            </Link>
            <Link to="/dashboard" className="block">
              <Button variant="outline" size="lg" className="w-full text-lg py-6">
                Health Worker Dashboard
              </Button>
            </Link>
          </div>

          {/* Info Badge */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground text-center">
              Safe, private, and works offline. Your data stays on your device.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
