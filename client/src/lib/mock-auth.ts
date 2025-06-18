// Mock authentication for UI testing without backend
import { AuthUser } from './auth';

const MOCK_USER: AuthUser = {
  id: 1,
  email: 'test@healthtracker.com',
  fullName: 'Test User',
  age: 30,
  gender: 'male',
  height: 175,
  weight: 70.5,
  role: 'patient',
  subscriptionTier: 'plus',
  createdAt: '2024-12-01T00:00:00Z',
  updatedAt: '2024-12-01T00:00:00Z'
};

const MOCK_LAB_RESULTS = [
  {
    id: 1,
    userId: 1,
    testName: 'Total Cholesterol',
    value: 185.5,
    unit: 'mg/dL',
    referenceMin: 125,
    referenceMax: 200,
    testDate: '2024-12-01T00:00:00Z',
    notes: 'Good levels',
    source: 'manual',
    fileName: null,
    createdAt: '2024-12-01T00:00:00Z'
  },
  {
    id: 2,
    userId: 1,
    testName: 'HDL Cholesterol',
    value: 52.3,
    unit: 'mg/dL',
    referenceMin: 40,
    referenceMax: 100,
    testDate: '2024-12-01T00:00:00Z',
    notes: 'Healthy range',
    source: 'manual',
    fileName: null,
    createdAt: '2024-12-01T00:00:00Z'
  },
  {
    id: 3,
    userId: 1,
    testName: 'LDL Cholesterol',
    value: 118.2,
    unit: 'mg/dL',
    referenceMin: 0,
    referenceMax: 100,
    testDate: '2024-12-01T00:00:00Z',
    notes: 'Slightly elevated',
    source: 'manual',
    fileName: null,
    createdAt: '2024-12-01T00:00:00Z'
  },
  {
    id: 4,
    userId: 1,
    testName: 'Glucose',
    value: 92.1,
    unit: 'mg/dL',
    referenceMin: 70,
    referenceMax: 100,
    testDate: '2024-12-01T00:00:00Z',
    notes: 'Fasting glucose normal',
    source: 'manual',
    fileName: null,
    createdAt: '2024-12-01T00:00:00Z'
  },
  {
    id: 5,
    userId: 1,
    testName: 'HbA1c',
    value: 5.2,
    unit: '%',
    referenceMin: 4.0,
    referenceMax: 5.6,
    testDate: '2024-12-01T00:00:00Z',
    notes: 'Good diabetes control',
    source: 'manual',
    fileName: null,
    createdAt: '2024-12-01T00:00:00Z'
  }
];

const MOCK_HEALTH_SCORE = {
  id: 1,
  userId: 1,
  overallScore: 78,
  cardiovascularScore: 72,
  metabolicScore: 85,
  vitaminScore: 75,
  calculatedAt: '2024-12-01T10:00:00Z'
};

const MOCK_ACTION_PLANS = [
  {
    id: 1,
    userId: 1,
    type: 'nutrition',
    status: 'active',
    title: 'Lower LDL Cholesterol',
    description: 'Focus on heart-healthy diet to reduce LDL levels',
    tasks: [
      { id: '1', text: 'Eat oatmeal for breakfast 5 days/week', completed: false, dueDate: '2024-12-15' },
      { id: '2', text: 'Replace saturated fats with olive oil', completed: true, dueDate: '2024-12-10' },
      { id: '3', text: 'Add 2 servings of fish per week', completed: false, dueDate: '2024-12-20' }
    ],
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  },
  {
    id: 2,
    userId: 1,
    type: 'exercise',
    status: 'active',
    title: 'Cardiovascular Health',
    description: 'Improve heart health through regular exercise',
    tasks: [
      { id: '1', text: 'Walk 30 minutes daily', completed: true, dueDate: '2024-12-08' },
      { id: '2', text: 'Join a gym or fitness class', completed: false, dueDate: '2024-12-12' },
      { id: '3', text: 'Track weekly cardio sessions', completed: false, dueDate: '2024-12-15' }
    ],
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  }
];

const MOCK_AI_INSIGHTS = [
  {
    id: 1,
    userId: 1,
    title: 'LDL Cholesterol Alert',
    content: 'Your LDL cholesterol is slightly above optimal range. Consider dietary modifications and regular exercise to improve your cardiovascular health profile.',
    category: 'cardiovascular',
    relatedBiomarkers: ['LDL Cholesterol', 'Total Cholesterol'],
    acknowledged: false,
    createdAt: '2024-12-01T00:00:00Z'
  },
  {
    id: 2,
    userId: 1,
    title: 'Great Glucose Control',
    content: 'Your glucose and HbA1c levels indicate excellent blood sugar management. Keep up the good work with your current lifestyle choices.',
    category: 'metabolic',
    relatedBiomarkers: ['Glucose', 'HbA1c'],
    acknowledged: false,
    createdAt: '2024-12-01T00:00:00Z'
  }
];

export class MockAuthService {
  private static instance: MockAuthService;
  private currentUser: AuthUser | null = null;
  private isEnabled: boolean;

  constructor() {
    // Enable mock mode in development or when localStorage flag is set
    this.isEnabled = import.meta.env.DEV || localStorage.getItem('MOCK_MODE') === 'true';
    if (this.isEnabled) {
      console.log('🔧 Mock Auth Mode Enabled - UI Testing Mode');
    }
  }

  static getInstance(): MockAuthService {
    if (!MockAuthService.instance) {
      MockAuthService.instance = new MockAuthService();
    }
    return MockAuthService.instance;
  }

  enableMockMode() {
    this.isEnabled = true;
    localStorage.setItem('MOCK_MODE', 'true');
    console.log('🔧 Mock Auth Mode Enabled');
  }

  disableMockMode() {
    this.isEnabled = false;
    localStorage.removeItem('MOCK_MODE');
    this.currentUser = null;
    console.log('🔧 Mock Auth Mode Disabled');
  }

  isMockModeEnabled(): boolean {
    return this.isEnabled;
  }

  async mockLogin(email: string, password: string): Promise<AuthUser> {
    // Simple mock validation
    if (email === 'test@healthtracker.com' && password === 'password123') {
      this.currentUser = MOCK_USER;
      localStorage.setItem('mock_user', JSON.stringify(MOCK_USER));
      return MOCK_USER;
    }
    throw new Error('Invalid mock credentials');
  }

  getCurrentUser(): AuthUser | null {
    if (!this.isEnabled) return null;
    
    if (this.currentUser) return this.currentUser;
    
    const stored = localStorage.getItem('mock_user');
    if (stored) {
      this.currentUser = JSON.parse(stored);
      return this.currentUser;
    }
    
    return null;
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('mock_user');
  }

  // Mock API responses
  getMockLabResults() {
    return Promise.resolve(MOCK_LAB_RESULTS);
  }

  getMockHealthScore() {
    return Promise.resolve(MOCK_HEALTH_SCORE);
  }

  getMockActionPlans() {
    return Promise.resolve(MOCK_ACTION_PLANS);
  }

  getMockAiInsights() {
    return Promise.resolve(MOCK_AI_INSIGHTS);
  }
}

export const mockAuth = MockAuthService.getInstance();