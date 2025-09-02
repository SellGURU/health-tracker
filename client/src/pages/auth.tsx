import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { validateEmail, validatePassword } from "@/lib/utils";
import { Heart, Upload, TrendingUp, Brain, UserPlus, LogIn, TestTube } from "lucide-react";
import { mockAuth } from "@/lib/mock-auth";
import { useSahha } from "@/hooks/use-sahha";

export default function AuthPage() {
  const { login, register } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { isInitialized, data, error, authenticate, connect } = useSahha();
  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const fillTestCredentials = () => {
    setLoginData({
      email: "test@holisticare.com",
      password: "password123"
    });
  };
  
  // Register form state
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    fullName: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      alert("authenticate started");
      await authenticate("BF9yybnbq44AreyJf04tNbvBCXXRIFJH", "YFhSuGe4CuY13XZZzW0dGqowfM6oMNSwz9qkQBiyCxm8FneNGncwuQU7YkU50sMp", "test12");
      await connect();
      if (!validateEmail(loginData.email)) {
        throw new Error("Please enter a valid email address");
      }

      if (loginData.password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      await login(loginData);
      
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      
      // Force a small delay to ensure auth state updates
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: error instanceof Error ? error.message : "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!validateEmail(registerData.email)) {
        throw new Error("Please enter a valid email address");
      }

      const passwordValidation = validatePassword(registerData.password);
      if (!passwordValidation.valid) {
        throw new Error(passwordValidation.message);
      }

      if (!registerData.fullName.trim()) {
        throw new Error("Please enter your full name");
      }

      const registrationData = {
        email: registerData.email,
        password: registerData.password,
        fullName: registerData.fullName.trim(),
        age: registerData.age ? parseInt(registerData.age) : undefined,
        gender: registerData.gender || undefined,
        height: registerData.height ? parseInt(registerData.height) : undefined,
        weight: registerData.weight ? parseFloat(registerData.weight) : undefined,
      };

      await register(registrationData);
      
      toast({
        title: "Account created!",
        description: "Welcome to HolistiCare. Let's start monitoring your health.",
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please check your information and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
      {/* Hero Section */}
      <div className="health-gradient medical-pattern relative overflow-hidden px-6 py-16 text-center text-white">
        <div className="relative z-10">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-4">HolistiCare</h1>
          <p className="text-lg opacity-90 mb-8">Your personal health companion for better wellness insights</p>
          
          {/* Key Features */}
          <div className="space-y-4 text-left max-w-sm mx-auto">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Upload className="w-4 h-4" />
              </div>
              <span className="text-sm">Upload lab results instantly</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-sm">Track 4,100+ biomarkers</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Brain className="w-4 h-4" />
              </div>
              <span className="text-sm">AI-powered health insights</span>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Forms */}
      <div className="p-6 -mt-8 relative z-10">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Get Started</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Create Account</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4">
                {mockAuth.isMockModeEnabled() && (
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TestTube className="w-4 h-4 text-blue-600" />
                        <Badge variant="secondary" className="text-xs">UI Testing Mode</Badge>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={fillTestCredentials}
                        className="text-xs"
                      >
                        Use Test Login
                      </Button>
                    </div>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      Backend bypassed - use test@holisticare.com / password123
                    </p>
                  </div>
                )}
                
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email">Email Address</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    <LogIn className="w-4 h-4 mr-2" />
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
                
                <p className="text-center text-xs text-gray-600 dark:text-gray-400">
                  Healthcare Professional? 
                  <button className="text-primary ml-1 hover:underline">
                    Sign in here
                  </button>
                </p>
              </TabsContent>
              
              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <Label htmlFor="register-name">Full Name</Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={registerData.fullName}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, fullName: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="register-email">Email Address</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={registerData.email}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="Create a secure password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="register-age">Age</Label>
                      <Input
                        id="register-age"
                        type="number"
                        placeholder="25"
                        value={registerData.age}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, age: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="register-gender">Gender</Label>
                      <Select
                        value={registerData.gender}
                        onValueChange={(value) => setRegisterData(prev => ({ ...prev, gender: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="register-height">Height (cm)</Label>
                      <Input
                        id="register-height"
                        type="number"
                        placeholder="170"
                        value={registerData.height}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, height: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="register-weight">Weight (kg)</Label>
                      <Input
                        id="register-weight"
                        type="number"
                        step="0.1"
                        placeholder="70"
                        value={registerData.weight}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, weight: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <Checkbox required />
                      <Label className="text-xs leading-4">
                        I agree to the <button type="button" className="text-primary hover:underline">Terms of Service</button> and <button type="button" className="text-primary hover:underline">Privacy Policy</button>
                      </Label>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <Checkbox />
                      <Label className="text-xs leading-4">
                        I consent to data processing for health insights (GDPR/HIPAA compliant)
                      </Label>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
