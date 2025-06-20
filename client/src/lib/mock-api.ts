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