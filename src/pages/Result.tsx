import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { calculateRisk } from '@/lib/riskEngine';
import { db } from '@/lib/db';
import { MapPin, Save, AlertTriangle, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isSaving, setIsSaving] = useState(false);

  const selectedSymptoms = location.state?.selectedSymptoms || [];
  const result = calculateRisk(selectedSymptoms);

  const getRiskColor = () => {
    switch (result.level) {
      case 'High':
        return 'bg-destructive text-destructive-foreground border-destructive';
      case 'Medium':
        return 'bg-primary text-primary-foreground border-primary';
      case 'Low':
        return 'bg-card text-card-foreground border-border';
      default:
        return 'bg-muted text-foreground border-border';
    }
  };

  const getRiskIcon = () => {
    switch (result.level) {
      case 'High':
        return <AlertTriangle className="w-12 h-12" />;
      case 'Medium':
        return <AlertCircle className="w-12 h-12" />;
      case 'Low':
        return <CheckCircle2 className="w-12 h-12" />;
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await db.assessments.add({
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        riskScore: result.score,
        riskLevel: result.level,
        symptoms: selectedSymptoms,
        isSynced: false,
      });

      toast({
        title: "Assessment Saved",
        description: "Your health assessment has been saved successfully.",
      });

      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save assessment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getBanglaExplanation = () => {
    switch (result.level) {
      case 'High':
        return 'ঝুঁকির মাত্রা: উচ্চ (High). ব্যাখ্যা: আপনার লক্ষণগুলি প্রি-এক্লাম্পসিয়ার ইঙ্গিত দিচ্ছে। অবিলম্বে ডাক্তারের পরামর্শ নিন।';
      case 'Medium':
        return 'ঝুঁকির মাত্রা: মাঝারি (Medium). ব্যাখ্যা: আপনার লক্ষণগুলি উচ্চ রক্তচাপের ইঙ্গিত দিতে পারে।';
      case 'Low':
        return 'ঝুঁকির মাত্রা: নিম্ন (Low). ব্যাখ্যা: বর্তমানে গুরুতর ঝুঁকির লক্ষণ কম দেখা যাচ্ছে, তবে যেকোনো পরিবর্তন হলে স্বাস্থ্যকর্মীর সঙ্গে যোগাযোগ করুন।';
      default:
        return '';
    }
  };

  useEffect(() => {
    if (!location.state?.selectedSymptoms) {
      navigate('/assess');
    }
  }, [location.state, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto w-full p-6 space-y-6">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground text-center flex-1">
            {t('result.title')}
          </h1>
        </div>

        {/* Risk Level Card */}
        <Card className={`p-8 ${getRiskColor()} shadow-lg`}>
          <div className="flex flex-col items-center gap-4 text-center">
            {getRiskIcon()}
            <div>
              <h2 className="text-3xl font-bold mb-2">{result.level} Risk</h2>
              <p className="text-lg opacity-90">Risk Score: {result.score}</p>
            </div>
          </div>
        </Card>

        {/* Explanation */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-3">
            ফলাফল ব্যাখ্যা (Explanation)
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {getBanglaExplanation()}
          </p>
        </Card>

        {/* Disclaimer */}
        <Card className="p-4 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
          <p className="text-sm text-amber-900 dark:text-amber-200">
            <strong>Important:</strong> This tool does not diagnose conditions or prescribe medication. 
            Always consult with a healthcare professional for medical advice.
          </p>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => toast({
              title: "Coming Soon",
              description: "Clinic finder feature will be available soon.",
            })}
          >
            <MapPin className="w-5 h-5 mr-2" />
            Find Nearby Clinic
          </Button>
          
          <Button
            size="lg"
            className="w-full"
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className="w-5 h-5 mr-2" />
            {isSaving ? 'Saving...' : 'Save Record'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Result;
