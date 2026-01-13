import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { calculateRisk } from '@/lib/riskEngine';
import { db } from '@/lib/db';
import { MapPin, Save, AlertTriangle, CheckCircle2, AlertCircle, ArrowLeft, Printer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { Textarea } from '@/components/ui/textarea';
import ThemeToggle from '@/components/ThemeToggle';
import FloatingHelpButton from '@/components/FloatingHelpButton';
import PageLayout from '@/components/PageLayout';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isSaving, setIsSaving] = useState(false);
  const [notes, setNotes] = useState('');

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
        notes,
        isSynced: false,
      });

      toast({
        title: `${t('toast.saveSuccessTitle')} / সফলভাবে সংরক্ষণ হয়েছে`,
        description: `${t('toast.saveSuccessDescription')} / মূল্যায়নের তথ্য নিরাপদে সংরক্ষণ করা হয়েছে।`,
      });

      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      toast({
        title: `${t('toast.saveErrorTitle')} / সংরক্ষণ করা যায়নি`,
        description: `${t('toast.saveErrorDescription')} / দয়া করে আবার চেষ্টা করুন।`,
        variant: 'destructive',
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
    <PageLayout maxWidth="lg">
      <div className="space-y-2.5 animate-fade-in">
        <div className="flex items-center justify-between mb-1 gap-2 border-b border-border/60 pb-1.5">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-foreground">
                {t('result.title')}
              </h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                Snapshot of this assessment's risk so you can decide next steps quickly.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <Button
              variant="outline"
              size="icon"
              className="print:hidden bg-background hover:bg-accent border-primary/20"
              onClick={() => window.print()}
              aria-label="Print assessment report"
            >
              <Printer className="w-4 h-4 text-primary" />
            </Button>
          </div>
        </div>

        {/* Risk Level Card */}
        <Card className={`p-4 ${getRiskColor()} shadow-lg animate-fade-in`}>
          <div className="flex flex-col items-center gap-2.5 text-center">
            {getRiskIcon()}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-1">{result.level} Risk</h2>
              <p className="text-sm sm:text-base opacity-90">Risk Score: {result.score}</p>
            </div>
          </div>
        </Card>

        {/* Explanation */}
        <Card className="p-3 animate-fade-in">
          <h3 className="text-sm sm:text-base font-semibold text-foreground mb-2">
            ফলাফল ব্যাখ্যা (Explanation)
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {getBanglaExplanation()}
          </p>
        </Card>

        {/* Disclaimer */}
        <Card className="p-2.5 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900 animate-fade-in">
          <p className="text-xs text-amber-900 dark:text-amber-200">
            <strong>{t('result.disclaimerHeading')}</strong>{' '}
            {t('result.disclaimerBody')}
          </p>
        </Card>

        {/* Notes */}
        <Card className="p-2.5 space-y-1.5 animate-fade-in">
          <p className="text-xs font-medium text-foreground">Optional notes</p>
          <p className="text-[10px] text-muted-foreground">
            Add any observations, blood pressure readings or follow-up plan. This will be saved with the assessment.
          </p>
          <Textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Type notes here (optional)"
            className="text-xs"
          />
        </Card>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button
            size="lg"
            className="w-full justify-center text-sm"
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className="w-4 h-4 mr-1.5" />
            {isSaving ? t('result.save') + '...' : t('result.save')}
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full justify-center text-sm"
            onClick={() => navigate('/assess')}
          >
            {t('home.start')}
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full justify-center text-sm"
            onClick={() => navigate('/dashboard')}
          >
            {t('home.dashboard')}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center gap-1 text-xs"
            onClick={() =>
              toast({
                title: `${t('toast.clinicComingSoonTitle')} / ক্লিনিক লোকেশন শীঘ্রই আসছে`,
                description: `${t('toast.clinicComingSoonDescription')} / আপাতত কাছের রেফারেল সেন্টারের তথ্য ম্যানুয়ালি ব্যবহার করুন।`,
              })
            }
          >
            <MapPin className="w-3.5 h-3.5" />
            {t('result.findClinic')}
          </Button>
        </div>
        <FloatingHelpButton section="result" />
      </div>
    </PageLayout>
  );
};

export default Result;
