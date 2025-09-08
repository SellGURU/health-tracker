import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, UserPlus, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { validateEmail, validatePassword } from "@/lib/utils";
import logoImage from "@assets/logo.png";

export default function AuthPage() {
  const { login, register } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [stage, setStage] = useState(1);
  const [fadeClass, setFadeClass] = useState("opacity-100");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentTab, setCurrentTab] = useState("login");
  
  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Register form state  
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (stage === 1) {
      const timer = setTimeout(() => {
        setFadeClass("opacity-0");
        setTimeout(() => {
          setStage(2);
          setFadeClass("opacity-100");
        }, 500);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const handleContinue = () => {
    setFadeClass("opacity-0");
    setTimeout(() => {
      setStage(3);
      setFadeClass("opacity-100");
    }, 500);
  };

  const fillTestCredentials = () => {
    setLoginData({
      email: "test@holisticare.com",
      password: "password123"
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
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

      if (registerData.password !== registerData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const registrationData = {
        email: registerData.email,
        password: registerData.password,
        fullName: registerData.email.split('@')[0], // Use email username as default name
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
    <div className="min-h-screen bg-gradient-to-b from-green-300 to-green-400 relative overflow-hidden">
      {/* Curved bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 400 120" className="w-full h-24" preserveAspectRatio="none">
          <path d="M0,60 Q100,20 200,60 T400,60 L400,120 L0,120 Z" fill="rgba(255,255,255,0.1)" />
          <path d="M0,80 Q150,40 300,80 T400,80 L400,120 L0,120 Z" fill="rgba(255,255,255,0.05)" />
        </svg>
      </div>

      {/* Content */}
      <div className={`flex flex-col items-center justify-center min-h-screen px-4 sm:px-8 pt-16 pb-8 transition-opacity duration-500 ${fadeClass}`}>
        
        {/* Stage 1: Loading with HolistiCare.io */}
        {stage === 1 && (
          <div className="text-center">
            {/* Logo circle */}
            <div className="w-20 h-20 mx-auto mb-6 bg-white rounded-full flex items-center justify-center">
              <img src={logoImage} alt="HolistiCare Logo" className="w-12 h-12" />
            </div>
            
            <h1 className="text-white text-2xl font-bold mb-2">HolistiCare.io</h1>
            <p className="text-white/90 text-sm">Empower Health with Intelligence</p>
          </div>
        )}

        {/* Stage 2: Welcome screen */}
        {stage === 2 && (
          <div className="text-center w-full">
            {/* Logo circle */}
            <div className="w-20 h-20 mx-auto mb-6 bg-white rounded-full flex items-center justify-center">
              <img src={logoImage} alt="HolistiCare Logo" className="w-12 h-12" />
            </div>
            
            <h1 className="text-white text-xl font-bold mb-2">HolistiCare</h1>
            <p className="text-white/90 text-sm mb-8 sm:mb-12">Welcome back to your health journey</p>
            
            <Button 
              onClick={handleContinue}
              className="w-full bg-white text-green-600 hover:bg-white/90 font-semibold py-4 rounded-full max-w-xs mx-auto"
            >
              Continue
            </Button>
          </div>
        )}

        {/* Stage 3: Auth forms */}
        {stage === 3 && (
          <div className="text-center w-full">
            {/* Logo circle */}
            <div className="w-20 h-20 mx-auto mb-6 bg-white rounded-full flex items-center justify-center">
              <img src={logoImage} alt="HolistiCare Logo" className="w-12 h-12" />
            </div>
            
            <h1 className="text-white text-xl font-bold mb-6">HolistiCare</h1>
            
            <div className="w-full max-w-xs mx-auto">
              <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white/20 mb-6">
                  <TabsTrigger value="login" className="text-white data-[state=active]:bg-white data-[state=active]:text-green-600">
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger value="register" className="text-white data-[state=active]:bg-white data-[state=active]:text-green-600">
                    Create Account
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="space-y-4">
                  <p className="text-white/90 text-sm mb-6 sm:mb-8 px-2 sm:px-4 text-center">
                    Welcome back! Enter your email and password to continue your health journey.
                  </p>
                  
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="text-left">
                      <Label htmlFor="login-email" className="text-white text-sm">
                        Email
                      </Label>
                      <Input
                        id="login-email"
                        type="email"
                        required
                        value={loginData.email}
                        onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                        className="mt-1 bg-green-300 border-0 text-gray-600 placeholder-gray-500 rounded-lg"
                        placeholder="Enter your email"
                      />
                    </div>
                    
                    <div className="text-left">
                      <Label htmlFor="login-password" className="text-white text-sm">
                        Password
                      </Label>
                      <div className="relative mt-1">
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          required
                          value={loginData.password}
                          onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                          className="bg-green-300 border-0 text-gray-600 placeholder-gray-500 rounded-lg pr-10"
                          placeholder="Enter your password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 text-gray-600 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-white text-green-600 hover:bg-white/90 font-semibold py-4 rounded-full mt-6"
                      disabled={isLoading}
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      {isLoading ? "Logging in..." : "Log in"}
                    </Button>
                  </form>
                  
                  {/* Test credentials button */}
                  <Button
                    type="button"
                    onClick={fillTestCredentials}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-full mt-4"
                  >
                    Fill Test Credentials
                  </Button>
                </TabsContent>

                <TabsContent value="register" className="space-y-4">
                  <p className="text-white/90 text-sm mb-6 sm:mb-8 px-2 sm:px-4 text-center">
                    Join HolistiCare and start your personalized health journey today.
                  </p>
                  
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="text-left">
                      <Label htmlFor="register-email" className="text-white text-sm">
                        Email
                      </Label>
                      <Input
                        id="register-email"
                        type="email"
                        required
                        value={registerData.email}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                        className="mt-1 bg-green-300 border-0 text-gray-600 placeholder-gray-500 rounded-lg"
                        placeholder="Enter your email"
                      />
                    </div>
                    
                    <div className="text-left">
                      <Label htmlFor="register-password" className="text-white text-sm">
                        Password
                      </Label>
                      <div className="relative mt-1">
                        <Input
                          id="register-password"
                          type={showPassword ? "text" : "password"}
                          required
                          value={registerData.password}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                          className="bg-green-300 border-0 text-gray-600 placeholder-gray-500 rounded-lg pr-10"
                          placeholder="Create a secure password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 text-gray-600 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="text-left">
                      <Label htmlFor="confirm-password" className="text-white text-sm">
                        Confirm Password
                      </Label>
                      <div className="relative mt-1">
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          value={registerData.confirmPassword}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="bg-green-300 border-0 text-gray-600 placeholder-gray-500 rounded-lg pr-10"
                          placeholder="Confirm your password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 text-gray-600 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-white text-green-600 hover:bg-white/90 font-semibold py-4 rounded-full mt-6"
                      disabled={isLoading}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      {isLoading ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}