// Mock API interceptor for UI testing
import { mockAuth } from './mock-auth';

export function createMockApiInterceptor() {
  if (!mockAuth.isMockModeEnabled()) {
    return;
  }

  console.log('🔧 Mock API interceptor enabled');

  // Store original fetch
  const originalFetch = window.fetch;

  // Override fetch for API calls
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = typeof input === 'string' ? input : input.toString();
    
    // Only intercept API calls
    if (!url.startsWith('/api/')) {
      return originalFetch(input, init);
    }

    console.log('🔧 Intercepting API call:', url);

    // Mock responses for different endpoints
    if (url === '/api/auth/me' || url === '/api/auth/login') {
      const user = mockAuth.getCurrentUser();
      if (user) {
        return new Response(JSON.stringify({ user, sessionId: 'mock-session', expires: new Date(Date.now() + 86400000).toISOString() }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    if (url.includes('/api/lab-results')) {
      const data = await mockAuth.getMockLabResults();
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (url.includes('/api/health-score')) {
      const data = await mockAuth.getMockHealthScore();
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (url.includes('/api/action-plans')) {
      const data = await mockAuth.getMockActionPlans();
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (url.includes('/api/ai-insights')) {
      const data = await mockAuth.getMockAiInsights();
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (url.includes('/api/holistic-plans')) {
      const data = await mockAuth.getMockHolisticPlans();
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (url.includes('/api/health-goals')) {
      const data = await mockAuth.getMockHealthGoals();
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (url.includes('/api/wellness-challenges')) {
      const data = await mockAuth.getMockWellnessChallenges();
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (url.includes('/api/client_information_mobile')) {
      // Always return mock client information with hasChangedPassword: false
      return new Response(JSON.stringify({
        name: 'Test User',
        age: 30,
        sex: 'male',
        id: '1',
        connected_wearable: false,
        coach_username: [],
        email: 'test@holisticare.com',
        date_of_birth: '2024-12-01T00:00:00Z',
        pheno_age: 30,
        verified_account: true,
        member_since: '2024-12-01T00:00:00Z',
        lab_test: 5,
        action_plan: 2,
        active_client: true,
        plan: 'plus',
        show_phenoage: true,
        has_report: false,
        has_changed_password: false,  // This triggers password change redirect
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // For other API calls, return success with empty data
    return new Response(JSON.stringify({}), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  };
}

// Clean up function
export function removeMockApiInterceptor() {
  // This would restore original fetch if we stored it
  console.log('🔧 Mock API interceptor removed');
}