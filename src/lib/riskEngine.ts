export interface Symptom {
  id: string;
  questionEn: string;
  questionBn: string;
  weight: number;
  category: string;
}

export const symptoms: Symptom[] = [
  {
    id: 'headache',
    questionEn: 'Severe headache or new-onset headache?',
    questionBn: 'তীব্র বা নতুন ধরনের মাথাব্যথা কি রয়েছে?',
    weight: 3,
    category: 'Neurological',
  },
  {
    id: 'swelling',
    questionEn: 'Swelling in hands, face or feet?',
    questionBn: 'হাত, মুখ বা পায়ে কি ফোলা রয়েছে?',
    weight: 2,
    category: 'Swelling',
  },
  {
    id: 'blurred_vision',
    questionEn: 'Blurred vision or seeing spots of light?',
    questionBn: 'দৃষ্টিতে ঝাপসা দেখা বা চোখের সামনে আলোর দাগ দেখছেন?',
    weight: 5,
    category: 'Vision',
  },
  {
    id: 'abdominal_pain',
    questionEn: 'Severe pain in the upper abdomen?',
    questionBn: 'উপরের পেটে কি তীব্র ব্যথা রয়েছে?',
    weight: 4,
    category: 'Abdominal',
  },
  {
    id: 'breathlessness',
    questionEn: 'Shortness of breath at rest or with mild activity?',
    questionBn: 'অল্প কাজেই বা বিশ্রামের সময় কি শ্বাসকষ্ট হয়?',
    weight: 4,
    category: 'Breathing',
  },
  {
    id: 'reduced_urine',
    questionEn: 'Very little urine in last 12 hours?',
    questionBn: 'গত ১২ ঘন্টায় কি খুব কম প্রস্রাব হয়েছে?',
    weight: 3,
    category: 'Kidney',
  },
  {
    id: 'seizure_history',
    questionEn: 'History of convulsions or seizures in this pregnancy?',
    questionBn: 'এই গর্ভাবস্থায় কি খিঁচুনি বা সিজারের ইতিহাস আছে?',
    weight: 6,
    category: 'Neurological',
  },
];

export interface RiskResult {
  score: number;
  level: 'Low' | 'Medium' | 'High';
  explanation: string;
  selectedSymptoms: string[];
}

export const calculateRisk = (selectedSymptoms: string[]): RiskResult => {
  const score = selectedSymptoms.reduce((total, symptomId) => {
    const symptom = symptoms.find((s) => s.id === symptomId);
    return total + (symptom?.weight || 0);
  }, 0);

  let level: 'Low' | 'Medium' | 'High';
  if (score >= 10) {
    level = 'High';
  } else if (score >= 5) {
    level = 'Medium';
  } else {
    level = 'Low';
  }

  const symptomNames = selectedSymptoms
    .map((id) => symptoms.find((s) => s.id === id)?.questionEn.replace('?', ''))
    .filter(Boolean);

  let explanation = `You are at ${level} Risk`;
  if (symptomNames.length > 0) {
    explanation += ` because you reported: ${symptomNames.join(', ')}.`;
    if (level === 'High' || level === 'Medium') {
      explanation +=
        ' These are signs that require medical attention and could indicate potential complications like pre-eclampsia.';
    }
  } else {
    explanation += '. No significant risk symptoms reported.';
  }

  return {
    score,
    level,
    explanation,
    selectedSymptoms,
  };
};
