export interface Symptom {
  id: string;
  question: string;
  weight: number;
}

export const symptoms: Symptom[] = [
  { id: 'headache', question: 'Severe Headache?', weight: 3 },
  { id: 'swelling', question: 'Swelling in hands/face?', weight: 2 },
  { id: 'blurred_vision', question: 'Blurred Vision?', weight: 5 },
  { id: 'abdominal_pain', question: 'Upper abdominal pain?', weight: 4 },
];

export interface RiskResult {
  score: number;
  level: 'Low' | 'Medium' | 'High';
  explanation: string;
  selectedSymptoms: string[];
}

export const calculateRisk = (selectedSymptoms: string[]): RiskResult => {
  const score = selectedSymptoms.reduce((total, symptomId) => {
    const symptom = symptoms.find(s => s.id === symptomId);
    return total + (symptom?.weight || 0);
  }, 0);

  let level: 'Low' | 'Medium' | 'High';
  if (score >= 8) {
    level = 'High';
  } else if (score >= 4) {
    level = 'Medium';
  } else {
    level = 'Low';
  }

  const symptomNames = selectedSymptoms
    .map(id => symptoms.find(s => s.id === id)?.question.replace('?', ''))
    .filter(Boolean);

  let explanation = `You are at ${level} Risk`;
  if (symptomNames.length > 0) {
    explanation += ` because you reported: ${symptomNames.join(', ')}.`;
    if (level === 'High' || level === 'Medium') {
      explanation += ' These are signs that require medical attention and could indicate potential complications like pre-eclampsia.';
    }
  } else {
    explanation += '. No significant risk symptoms reported.';
  }

  return {
    score,
    level,
    explanation,
    selectedSymptoms
  };
};
