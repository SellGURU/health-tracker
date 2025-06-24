export interface SurveyQuestion {
  id: string;
  question: string;
  type: 'single' | 'multiple';
  options: string[];
  defaultAnswer?: string | string[];
}

export interface BodySystemSurvey {
  id: string;
  name: string;
  points: number;
  questions: SurveyQuestion[];
}

export const bloodSurveyQuestions: SurveyQuestion[] = [
  {
    id: 'blood_symptoms',
    question: 'Do you have any of the following symptoms?',
    type: 'multiple',
    options: [
      'Dizziness',
      'Heavy or very long periods',
      'Flickering in the eyes during physical activity',
      'Increased fatigue',
      'Weakness',
      'Bleeding gums',
      'Fine skin rash',
      'Easy bruising',
      'Frequent heavy nosebleeds',
      'Enlarged lymph nodes',
      'Rapid pulse'
    ],
    defaultAnswer: []
  },
  {
    id: 'liver_spleen',
    question: 'Do you have an enlarged liver or spleen?',
    type: 'single',
    options: [
      'No',
      'Enlarged spleen',
      'Enlarged liver',
      'Enlarged liver and spleen',
      'I don\'t know'
    ],
    defaultAnswer: 'No'
  },
  {
    id: 'medications',
    question: 'Do you take any medication on a regular basis?',
    type: 'multiple',
    options: [
      'Nonsteroidal anti-inflammatory drugs',
      'Antiaggregants',
      'Iron supplements',
      'Vitamin B12 supplements',
      'Anthemophilic drugs',
      'Antineoplastic drugs',
      'Combined oral contraceptives'
    ],
    defaultAnswer: []
  },
  {
    id: 'blood_disorders',
    question: 'Have you had a blood disorder or have you ever had a blood disorder?',
    type: 'multiple',
    options: [
      'I don\'t know',
      'Hemophilia',
      'Thrombocytopenia',
      'Thrombosis',
      'Immunodeficiency, including HIV',
      'Anemia',
      'Leukemia'
    ],
    defaultAnswer: []
  },
  {
    id: 'blood_transfusion',
    question: 'Have you had a blood transfusion or blood components?',
    type: 'single',
    options: [
      'No',
      'I don\'t know',
      'Yes',
      'Yes, with transfused red blood cells',
      'Yes, with transfused plasma',
      'Other'
    ],
    defaultAnswer: 'No'
  },
  {
    id: 'body_pain',
    question: 'Do you regularly experience pain in any part of your body?',
    type: 'multiple',
    options: [
      'No, everything feels good',
      'Pain in the central upper part of the chest',
      'Abdominal pain on the right side',
      'Pain in the head',
      'Lower abdominal pain'
    ],
    defaultAnswer: ['No, everything feels good']
  },
  {
    id: 'skin_color',
    question: 'Which of these best describes your natural skin color?',
    type: 'single',
    options: [
      'My skin color is normal',
      'My skin has a yellow hue',
      'My skin is pale',
      'My skin has a bluish hue',
      'My skin has a green hue',
      'My skin is flushed'
    ],
    defaultAnswer: 'My skin color is normal'
  },
  {
    id: 'nail_appearance',
    question: 'What do your nails look like?',
    type: 'multiple',
    options: [
      'Good',
      'Vertical ridges',
      'Yellow-ish color',
      'White lines and/or dots',
      'Nail pitting',
      'Barely visible lunulae',
      'Breaking or splitting',
      'Horizontal ridges'
    ],
    defaultAnswer: ['Good']
  },
  {
    id: 'stool_color',
    question: 'What color is your stool?',
    type: 'single',
    options: [
      'Brown',
      'Dark brown',
      'Light brown',
      'Orange-colored',
      'Reddish-colored',
      'Green-colored',
      'Light yellow',
      'Black-colored',
      'Greenish-black',
      'Greyish-white'
    ],
    defaultAnswer: 'Brown'
  },
  {
    id: 'exotic_diseases',
    question: 'Have you had any of the following exotic diseases?',
    type: 'multiple',
    options: [
      'Malaria',
      'Yellow fever',
      'Lyme disease',
      'Typhus fever',
      'Other'
    ],
    defaultAnswer: []
  }
];

export const hormonesSurveyQuestions: SurveyQuestion[] = [
  {
    id: 'hormonal_symptoms',
    question: 'Select all options that best describe you:',
    type: 'multiple',
    options: [
      'Overweight',
      'Prone to swelling',
      'Low body temperature',
      'Heart palpitations',
      'Excess sweating',
      'Rapid weight gain or loss',
      'Shivering in the body, increased body temperature',
      'Constant thinness with increased appetite',
      'High blood pressure',
      'Stretch marks on the body'
    ],
    defaultAnswer: []
  },
  {
    id: 'unusual_sensations',
    question: 'Have you noticed any unusual peculiarities or sensations?',
    type: 'multiple',
    options: [
      'Ice water required to quench thirst',
      'Tingling and burning in the fingers and toes',
      'Frequent nightmares',
      'Waking up with headaches and hunger',
      'High collars cause a choking sensation',
      'Fidgetiness and extreme emotionality',
      'Frequent dry mouth even after drinking',
      'Sudden visual disturbances'
    ],
    defaultAnswer: []
  },
  {
    id: 'blood_pressure',
    question: 'What is your blood pressure?',
    type: 'single',
    options: [
      'Within the normal range',
      'Sometimes low',
      'Always low',
      'Sometimes high',
      'Always high',
      'Sometimes extremely high (hypertensive crisis)'
    ],
    defaultAnswer: 'Within the normal range'
  },
  {
    id: 'nail_condition',
    question: 'What do your nails look like?',
    type: 'multiple',
    options: [
      'Good',
      'Vertical ridges',
      'Yellow-ish color',
      'White lines and/or dots',
      'Nail pitting',
      'Barely visible lunulae',
      'Breaking or splitting',
      'Horizontal ridges'
    ],
    defaultAnswer: ['Good']
  },
  {
    id: 'hair_problems',
    question: 'Are you experiencing any hair problems?',
    type: 'multiple',
    options: [
      'No',
      'Broken, split ends',
      'Widespread hair loss at the back of the head',
      'Gray hair',
      'Widespread hair loss',
      'Nested baldness with full losses in some places',
      'Short locks of hair up to ½ inch in length',
      'Dull, lifeless hair and hair loss'
    ],
    defaultAnswer: ['No']
  },
  {
    id: 'tongue_plaque',
    question: 'Do you have any plaque on your tongue?',
    type: 'single',
    options: [
      'No or the plaque is transparent',
      'White plaque',
      'Yellow plaque',
      'Green plaque',
      'Orange plaque',
      'Blue plaque',
      'Green-black plaque',
      'Gray plaque'
    ],
    defaultAnswer: 'No or the plaque is transparent'
  },
  {
    id: 'metabolic_medications',
    question: 'Do you take any metabolic medications on a regular basis?',
    type: 'multiple',
    options: [
      'Blood glucose tablets',
      'Sugar-lowering injectables',
      'Hypotensive',
      'Estrogen (androgen replacement therapy)',
      'Thyroid hormones',
      'Cortisol preparations'
    ],
    defaultAnswer: []
  }
];

export const bodySystemSurveys: BodySystemSurvey[] = [
  {
    id: 'blood',
    name: 'Blood',
    points: 8,
    questions: bloodSurveyQuestions
  },
  {
    id: 'hormones',
    name: 'Hormones',
    points: 8,
    questions: hormonesSurveyQuestions
  },
  {
    id: 'liver',
    name: 'Liver',
    points: 10,
    questions: [] // Will be added in future iterations
  },
  {
    id: 'cardiovascular',
    name: 'Cardiovascular system',
    points: 10,
    questions: [] // Will be added in future iterations
  },
  {
    id: 'urogenital',
    name: 'Urogenital system',
    points: 10,
    questions: [] // Will be added in future iterations
  },
  {
    id: 'immunity',
    name: 'Immunity',
    points: 8,
    questions: [] // Will be added in future iterations
  },
  {
    id: 'digestion',
    name: 'Digestion',
    points: 10,
    questions: [] // Will be added in future iterations
  },
  {
    id: 'nerves',
    name: 'Nerves',
    points: 9,
    questions: [] // Will be added in future iterations
  },
  {
    id: 'respiratory',
    name: 'Respiratory system',
    points: 7,
    questions: [] // Will be added in future iterations
  }
];