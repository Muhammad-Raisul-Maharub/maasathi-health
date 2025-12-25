import { useState, useMemo } from 'react';
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
  const { t, language } = useLanguage();

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
    <div className="bg-background flex flex-col min-h-screen pb-20">
      <div className="max-w-md mx-auto w-full px-4 py-3 flex flex-col h-full">
        <div className="flex justify-end mb-2">
          <ThemeToggle />
        </div>
        
        {/* Progress Bar */}
        <div className="mb-3 border-b border-border/60 pb-2">
          <div className="flex justify-between text-sm font-medium text-muted-foreground mb-1.5">
            <span>
              {t('assessment.step')} {currentStep + 1} {t('assessment.of')} {symptoms.length}
            </span>
            <span className="font-semibold">{Math.round(((currentStep + 1) / symptoms.length) * 100)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / symptoms.length) * 100}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
            Complete all questions to generate an accurate clinic risk summary.
          </p>
        </div>

        {/* Info Card */}
        <Card className="mb-3 p-3 flex gap-2.5 items-start bg-primary/5 border-primary/20">
          <div className="mt-0.5">
            <Info className="w-4 h-4 text-primary flex-shrink-0" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">How this assessment works</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We add different weights to each warning sign (like severe headache, swelling, blurred vision).
              Higher scores mean higher risk. This tool is designed to support, not replace, clinical judgment.
            </p>
          </div>
        </Card>

        {/* Question Section */}
        <div className="flex-1 flex flex-col justify-start space-y-4">
          <div className="text-center space-y-3">
            <h1 className="text-xl font-bold text-foreground">{t('assessment.title')}</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('assessment.subtitle')}
            </p>
            
            <div className="space-y-2 pt-2">
              <div className="flex flex-col items-center gap-2">
                <p className="text-base font-bold text-foreground text-center leading-snug">
                  {currentSymptom.questionEn}
                </p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-full border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground hover:bg-accent"
                      aria-label="Why this symptom matters"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-left">
                    <p className="text-xs font-medium mb-1">Why this matters clinically</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      This warning sign can indicate serious pregnancy complications. If present, it increases the overall risk score.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-sm text-muted-foreground text-center leading-snug">
                {currentSymptom.questionBn}
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5 justify-center">
                {getCategoryIcon(currentSymptom.category)}
                <span className="font-medium">{currentSymptom.category}</span>
              </p>
            </div>
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-1 gap-3">
            <Card
              className={`p-5 cursor-pointer transition-all hover-scale hover:shadow-lg animate-fade-in ${
                answers[currentSymptom.id] === true
                  ? 'bg-primary text-primary-foreground border-primary shadow-md'
                  : 'bg-card hover:bg-accent border-2'
              }`}
              onClick={() => handleAnswer(true)}
            >
              <div className="flex items-center justify-center gap-3">
                <div
                  className={`p-2.5 rounded-full ${
                    answers[currentSymptom.id] === true
                      ? 'bg-primary-foreground/20'
                      : 'bg-primary/10'
                  }`}
                >
                  <Check className="w-7 h-7" />
                </div>
                <span className="text-lg font-bold">{t('assessment.yes')}</span>
              </div>
            </Card>

            <Card
              className={`p-5 cursor-pointer transition-all hover-scale hover:shadow-lg animate-fade-in ${
                answers[currentSymptom.id] === false
                  ? 'bg-destructive text-destructive-foreground border-destructive shadow-md'
                  : 'bg-card hover:bg-accent border-2'
              }`}
              onClick={() => handleAnswer(false)}
            >
              <div className="flex items-center justify-center gap-3">
                <div
                  className={`p-2.5 rounded-full ${
                    answers[currentSymptom.id] === false
                      ? 'bg-destructive-foreground/20'
                      : 'bg-muted'
                  }`}
                >
                  <X className="w-7 h-7" />
                </div>
                <span className="text-lg font-bold">{t('assessment.no')}</span>
              </div>
            </Card>
          </div>
        </div>

        {/* Category Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5 justify-center">
          {groupedCategories.map((cat) => (
            <span
              key={cat}
              className="px-2.5 py-1 rounded-full border border-border bg-card inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
            >
              {getCategoryIcon(cat)}
              <span>{cat}</span>
            </span>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex gap-3 mt-4">
          <Button
            variant="outline"
            size="lg"
            onClick={handleBack}
            className="flex-1 hover-scale text-base font-medium py-6"
          >
            <ArrowLeft className="w-5 h-5 mr-1.5" />
            {t('nav.back')}
          </Button>
          <Button
            size="lg"
            onClick={handleNext}
            disabled={!hasAnswer}
            className="flex-1 hover-scale text-base font-medium py-6"
          >
            {isLastStep ? t('assessment.viewResults') : t('assessment.next')}
            {!isLastStep && <ArrowRight className="w-5 h-5 ml-1.5" />}
          </Button>
        </div>
        <FloatingHelpButton section="assessment" />
      </div>
    </div>
  );
};

export default Assessment;
