import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { calculateRisk } from '@/lib/riskEngine';
import { db } from '@/lib/db';
import { MapPin, Save, AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const selectedSymptoms = location.state?.selectedSymptoms || [];
  const result = calculateRisk(selectedSymptoms);

  const getRiskColor = () => {
    switch (result.level) {
      case 'High':
        return 'bg-destructive text-destructive-foreground border-destructive';
      case 'Medium':
        return 'bg-amber-500 text-white border-amber-600';
      case 'Low':
        return 'bg-green-500 text-white border-green-600';
      default:
        return 'bg-muted';
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
        isSynced: false
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
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
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
        <h1 className="text-2xl font-bold text-foreground text-center mb-8">
          Your Assessment Results
        </h1>

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
            Why this result?
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {result.explanation}
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
            {isSaving ? 'Saving...' : 'Save & Finish'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Result;
