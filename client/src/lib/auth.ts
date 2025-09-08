import { apiRequest } from "./queryClient";
import { mockAuth } from "./mock-auth";

export interface AuthUser {
  id: number;
  email: string;
  fullName: string;
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  role: string;
  subscriptionTier: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: AuthUser;
  sessionId: string;
  expires: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
}

class AuthService {
  private static instance: AuthService;
  private currentUser: AuthUser | null = null;
  private sessionId: string | null = null;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  constructor() {
    // Try to restore session from localStorage
    this.restoreSession();
  }

  private restoreSession() {
    try {
      const userData = localStorage.getItem("health_user");
      const sessionId = localStorage.getItem("health_session");
      const expires = localStorage.getItem("health_session_expires");

      if (userData && sessionId && expires) {
        const expiresDate = new Date(expires);
        if (expiresDate > new Date()) {
          this.currentUser = JSON.parse(userData);
          this.sessionId = sessionId;
        } else {
          this.clearSession();
        }
      }
    } catch (error) {
      console.error("Error restoring session:", error);
      this.clearSession();
    }
  }

  private saveSession(response: AuthResponse) {
    this.currentUser = response.user;
    this.sessionId = response.sessionId;

    localStorage.setItem("health_user", JSON.stringify(response.user));
    localStorage.setItem("health_session", response.sessionId);
    localStorage.setItem("health_session_expires", response.expires);
  }

  private clearSession() {
    this.currentUser = null;
    this.sessionId = null;

    localStorage.removeItem("health_user");
    localStorage.removeItem("health_session");
    localStorage.removeItem("health_session_expires");
  }

  async login(credentials: LoginCredentials): Promise<AuthUser> {
    // Check if mock mode is enabled for UI testing
    if (mockAuth.isMockModeEnabled()) {
      try {
        const user = await mockAuth.mockLogin(
          credentials.email,
          credentials.password
        );
        this.currentUser = user;
        this.sessionId = "mock-session-123";
        // Store mock session
        localStorage.setItem("health_user", JSON.stringify(user));
        localStorage.setItem("health_session", "mock-session-123");
        return user;
      } catch (error) {
        throw new Error("Invalid credentials");
      }
    }

    const response = await apiRequest("POST", "/api/auth/login", credentials);
    const data: AuthResponse = await response.json();

    this.saveSession(data);
    return data.user;
  }

  async register(userData: RegisterData): Promise<AuthUser> {
    const response = await apiRequest("POST", "/api/auth/register", userData);
    const data: AuthResponse = await response.json();

    this.saveSession(data);
    return data.user;
  }

  async logout(): Promise<void> {
    // Handle mock mode logout
    if (mockAuth.isMockModeEnabled()) {
      mockAuth.logout();
    } else if (this.sessionId) {
      try {
        await apiRequest("POST", "/api/auth/logout", {});
      } catch (error) {
        console.error("Error during logout:", error);
      }
    }

    this.clearSession();
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    // Check mock mode first
    if (mockAuth.isMockModeEnabled()) {
      const user = mockAuth.getCurrentUser();
      if (user) {
        this.currentUser = user;
        this.sessionId = "mock-session-123";
        return user;
      }
    }

    if (!this.sessionId) {
      return null;
    }

    try {
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${this.sessionId}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        this.currentUser = data.user;
        return data.user;
      } else if (response.status === 401) {
        this.clearSession();
        return null;
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
    }

    return this.currentUser;
  }

  getUser(): AuthUser | null {
    return this.currentUser;
  }

  getSessionId(): string | null {
    return this.sessionId;
  }

  isAuthenticated(): boolean {
    // Check mock mode
    if (localStorage.getItem("token")) {
      return true;
    }
    return false;
  }

  hasSubscription(tier: "plus" | "professional"): boolean {
    if (!this.currentUser) return false;

    const userTier = this.currentUser.subscriptionTier;
    if (tier === "plus") {
      return userTier === "plus" || userTier === "professional";
    }
    if (tier === "professional") {
      return userTier === "professional";
    }

    return false;
  }

  // Add auth header to requests
  getAuthHeaders(): Record<string, string> {
    if (this.sessionId) {
      return {
        Authorization: `Bearer ${this.sessionId}`,
      };
    }
    return {};
  }
}

export const authService = AuthService.getInstance();

// Custom hook for auth (to be used in React components)
export function useAuth() {
  return {
    user: authService.getUser(),
    isAuthenticated: authService.isAuthenticated(),
    login: authService.login.bind(authService),
    register: authService.register.bind(authService),
    logout: authService.logout.bind(authService),
    hasSubscription: authService.hasSubscription.bind(authService),
  };
}
