import { useState, useMemo } from 'react';
import { useUserRole } from '@/hooks/useUserRole';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Check, Info, Stethoscope, X, Brain, Eye, Activity, Droplets, Wind } from 'lucide-react';
import { symptoms } from '@/lib/riskEngine';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import ThemeToggle from '@/components/ThemeToggle';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import FloatingHelpButton from '@/components/FloatingHelpButton';
import PageLayout from '@/components/PageLayout';

const Assessment = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { role } = useUserRole();

  const currentSymptom = symptoms[currentStep];
  const isLastStep = currentStep === symptoms.length - 1;
  const hasAnswer = currentSymptom.id in answers;

  const handleAnswer = (value: boolean) => {
    setAnswers({ ...answers, [currentSymptom.id]: value });
  };

  const handleNext = () => {
    if (isLastStep) {
      const selectedSymptoms = Object.entries(answers)
        .filter(([_, value]) => value)
        .map(([key]) => key);

      navigate('/result', { state: { selectedSymptoms } });
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate(-1);
    }
  };

  const groupedCategories = useMemo(
    () => Array.from(new Set(symptoms.map((s) => s.category))),
    []
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Neurological':
        return <Brain className="w-3 h-3" />;
      case 'Vision':
        return <Eye className="w-3 h-3" />;
      case 'Breathing':
        return <Wind className="w-3 h-3" />;
      case 'Kidney':
        return <Droplets className="w-3 h-3" />;
      case 'Abdominal':
        return <Activity className="w-3 h-3" />;
      case 'Swelling':
        return <Activity className="w-3 h-3" />;
      default:
        return <Stethoscope className="w-3 h-3" />;
    }
  };

  return (
    <PageLayout maxWidth="md">
      <div className="flex flex-col gap-2">
        <div className="flex justify-end mb-1">
          <ThemeToggle />
        </div>
        {/* Progress Bar */}
        <div className="mb-2 border-b border-border/60 pb-1.5">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>
              {t('assessment.step')} {currentStep + 1} {t('assessment.of')} {symptoms.length}
            </span>
            <span>{Math.round(((currentStep + 1) / symptoms.length) * 100)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5">
            <div
              className="bg-primary h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / symptoms.length) * 100}%` }}
            />
          </div>
          <p className="mt-0.5 text-[10px] sm:text-xs text-muted-foreground">
            Complete all questions to generate an accurate clinic risk summary.
          </p>
        </div>

        {/* Details: how it works */}
        <Card className="mb-2 p-2.5 flex gap-2 items-start">
          <div className="mt-0.5">
            <Info className="w-3.5 h-3.5 text-primary" />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-medium text-foreground">How this assessment works</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed">
              We add different weights to each warning sign (like severe headache, swelling, blurred vision).
              Higher scores mean higher risk. This tool is designed to support, not replace, clinical judgment.
            </p>
          </div>
        </Card>

        {/* Question */}
        <div className="flex-1 flex flex-col justify-start space-y-3">
          <div className="text-center space-y-2 px-1">
            <h1 className="text-lg sm:text-xl font-bold text-foreground">
              {role === 'health_worker' ? 'Patient Assessment' : t('assessment.title')}
            </h1>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              {role === 'health_worker'
                ? 'Assess the patient for the following warning signs.'
                : t('assessment.subtitle')}
            </p>
            <div className="mt-2 space-y-1">
              <div className="flex flex-col items-center gap-1.5">
                <p className="text-sm sm:text-base font-semibold text-foreground text-center">
                  {currentSymptom.questionEn}
                </p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-accent transition-colors"
                      aria-label="Why this symptom matters"
                    >
                      <Info className="w-3 h-3" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-left">
                    <p className="text-xs font-medium mb-1">Why this matters clinically</p>
                    <p className="text-xs text-muted-foreground mb-1">
                      This warning sign can indicate serious pregnancy complications such as high blood
                      pressure or organ stress. If present, it increases the overall risk score and may
                      require earlier clinical review.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      বাংলায়: এই উপসর্গটি প্রি-এক্লাম্পসিয়া বা অন্যান্য জটিলতার একটি গুরুত্বপূর্ণ সতর্ক সংকেত।
                      এই উপসর্গ থাকলে ঝুঁকির মাত্রা বাড়ে এবং দ্রুত স্বাস্থ্যকর্মীর মূল্যায়ন প্রয়োজন হতে পারে।
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-sm sm:text-lg text-muted-foreground text-center font-medium leading-relaxed">
                {currentSymptom.questionBn}
              </p>
              <p className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1 justify-center mt-0.5">
                {getCategoryIcon(currentSymptom.category)}
                <span>{currentSymptom.category}</span>
              </p>
            </div>
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 md:justify-center gap-4 max-w-2xl mx-auto w-full">
            <Card
              className={`p-3 sm:p-5 md:w-64 md:h-24 cursor-pointer transition-all hover-scale hover:shadow-lg animate-fade-in flex flex-col items-center justify-center gap-3 ${answers[currentSymptom.id] === true
                ? 'bg-green-500 hover:bg-green-600 text-white border-green-500 shadow-md ring-2 ring-green-600 ring-offset-2'
                : 'bg-card hover:bg-accent border-muted-foreground/20'
                }`}
              onClick={() => handleAnswer(true)}
            >
              <div
                className={`p-1.5 rounded-full ${answers[currentSymptom.id] === true
                  ? 'bg-white/20'
                  : 'bg-primary/10'
                  }`}
              >
                <Check className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <span className="text-base sm:text-lg font-semibold">{t('assessment.yes')}</span>
            </Card>

            <Card
              className={`p-3 sm:p-5 md:w-64 md:h-24 cursor-pointer transition-all hover-scale hover:shadow-lg animate-fade-in flex flex-col items-center justify-center gap-3 ${answers[currentSymptom.id] === false
                ? 'bg-destructive text-destructive-foreground border-destructive shadow-md ring-2 ring-destructive ring-offset-2'
                : 'bg-card hover:bg-accent border-muted-foreground/20'
                }`}
              onClick={() => handleAnswer(false)}
            >
              <div
                className={`p-1.5 rounded-full ${answers[currentSymptom.id] === false
                  ? 'bg-destructive-foreground/20'
                  : 'bg-muted'
                  }`}
              >
                <X className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <span className="text-base sm:text-lg font-semibold">{t('assessment.no')}</span>
            </Card>
          </div>
        </div>

        {/* Category overview */}
        <div className="mt-2 flex flex-wrap gap-1 justify-center text-[10px] sm:text-xs text-muted-foreground">
          {groupedCategories.map((cat) => (
            <span
              key={cat}
              className="px-2 py-0.5 rounded-full border border-border bg-card inline-flex items-center gap-1"
            >
              {getCategoryIcon(cat)}
              <span>{cat}</span>
            </span>
          ))}
        </div>

        {/* Navigation */}
        <div className="sticky bottom-0 left-0 right-0 p-3 bg-background/80 backdrop-blur-md border-t border-border mt-auto -mx-4 sm:mx-0 sm:rounded-b-lg z-10">
          <div className="flex gap-2 max-w-lg mx-auto w-full">
            <Button
              variant="outline"
              size="lg"
              onClick={handleBack}
              className="flex-1 hover-scale active:scale-95 transition-transform"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              {t('nav.back')}
            </Button>
            <Button
              size="lg"
              onClick={handleNext}
              disabled={!hasAnswer}
              className="flex-1 hover-scale active:scale-95 transition-transform shadow-lg"
            >
              {isLastStep ? t('assessment.viewResults') : t('assessment.next')}
              {!isLastStep && <ArrowRight className="w-4 h-4 ml-1" />}
            </Button>
          </div>
        </div>
        <FloatingHelpButton section="assessment" />
      </div>
    </PageLayout>
  );
};

export default Assessment;
