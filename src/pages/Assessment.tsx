import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Check, Info, Stethoscope, X } from 'lucide-react';
import { symptoms } from '@/lib/riskEngine';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';

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
      navigate('/');
    }
  };

  const groupedCategories = useMemo(
    () => Array.from(new Set(symptoms.map((s) => s.category))),
    []
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="max-w-md mx-auto w-full p-6 flex flex-col min-h-screen">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>
              {t('assessment.step')} {currentStep + 1} {t('assessment.of')} {symptoms.length}
            </span>
            <span>{Math.round(((currentStep + 1) / symptoms.length) * 100)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / symptoms.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Details: how it works */}
        <Card className="mb-4 p-4 flex gap-3 items-start">
          <div className="mt-1">
            <Info className="w-4 h-4 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">How this assessment works</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We add different weights to each warning sign (like severe headache, swelling, blurred vision).
              Higher scores mean higher risk. This tool is designed to support, not replace, clinical judgment.
            </p>
          </div>
        </Card>

        {/* Question */}
        <div className="flex-1 flex flex-col justify-center space-y-6">
          <div className="text-center space-y-3">
            <h1 className="text-2xl font-bold text-foreground">{t('assessment.title')}</h1>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {t('assessment.subtitle')}
            </p>
            <div className="mt-3 space-y-1">
              <p className="text-base font-semibold text-foreground">
                {currentSymptom.questionEn}
              </p>
              <p className="text-sm text-muted-foreground">
                {currentSymptom.questionBn}
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-1 justify-center mt-1">
                <Stethoscope className="w-3 h-3" />
                <span>{currentSymptom.category}</span>
              </p>
            </div>
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-2 gap-4">
            <Card
              className={`p-6 cursor-pointer transition-all hover:scale-105 ${
                answers[currentSymptom.id] === true
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card hover:bg-accent'
              }`}
              onClick={() => handleAnswer(true)}
            >
              <div className="flex flex-col items-center gap-3">
                <div
                  className={`p-3 rounded-full ${
                    answers[currentSymptom.id] === true
                      ? 'bg-primary-foreground/20'
                      : 'bg-primary/10'
                  }`}
                >
                  <Check className="w-8 h-8" />
                </div>
                <span className="text-lg font-semibold">{t('assessment.yes')}</span>
              </div>
            </Card>

            <Card
              className={`p-6 cursor-pointer transition-all hover:scale-105 ${
                answers[currentSymptom.id] === false
                  ? 'bg-secondary text-secondary-foreground border-secondary'
                  : 'bg-card hover:bg-accent'
              }`}
              onClick={() => handleAnswer(false)}
            >
              <div className="flex flex-col items-center gap-3">
                <div
                  className={`p-3 rounded-full ${
                    answers[currentSymptom.id] === false
                      ? 'bg-secondary-foreground/20'
                      : 'bg-muted'
                  }`}
                >
                  <X className="w-8 h-8" />
                </div>
                <span className="text-lg font-semibold">{t('assessment.no')}</span>
              </div>
            </Card>
          </div>
        </div>

        {/* Category overview */}
        <div className="mt-6 flex flex-wrap gap-2 justify-center text-xs text-muted-foreground">
          {groupedCategories.map((cat) => (
            <span
              key={cat}
              className="px-2 py-1 rounded-full border border-border bg-card"
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex gap-4 mt-6">
          <Button variant="outline" size="lg" onClick={handleBack} className="flex-1">
            <ArrowLeft className="w-5 h-5 mr-2" />
            {t('nav.back')}
          </Button>
          <Button
            size="lg"
            onClick={handleNext}
            disabled={!hasAnswer}
            className="flex-1"
          >
            {isLastStep ? t('assessment.viewResults') : t('assessment.next')}
            {!isLastStep && <ArrowRight className="w-5 h-5 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Assessment;
