import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react';
import { symptoms } from '@/lib/riskEngine';
import { useNavigate } from 'react-router-dom';

const Assessment = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="max-w-md mx-auto w-full p-6 flex flex-col min-h-screen">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Step {currentStep + 1} of {symptoms.length}</span>
            <span>{Math.round(((currentStep + 1) / symptoms.length) * 100)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / symptoms.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="flex-1 flex flex-col justify-center space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              {currentSymptom.question}
            </h2>
            <p className="text-muted-foreground">
              Select your answer
            </p>
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
                <div className={`p-3 rounded-full ${
                  answers[currentSymptom.id] === true
                    ? 'bg-primary-foreground/20'
                    : 'bg-primary/10'
                }`}>
                  <Check className="w-8 h-8" />
                </div>
                <span className="text-lg font-semibold">Yes</span>
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
                <div className={`p-3 rounded-full ${
                  answers[currentSymptom.id] === false
                    ? 'bg-secondary-foreground/20'
                    : 'bg-muted'
                }`}>
                  <X className="w-8 h-8" />
                </div>
                <span className="text-lg font-semibold">No</span>
              </div>
            </Card>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-4 mt-8">
          <Button
            variant="outline"
            size="lg"
            onClick={handleBack}
            className="flex-1"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <Button
            size="lg"
            onClick={handleNext}
            disabled={!hasAnswer}
            className="flex-1"
          >
            {isLastStep ? 'View Results' : 'Next'}
            {!isLastStep && <ArrowRight className="w-5 h-5 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Assessment;
