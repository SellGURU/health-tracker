import Auth from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { validateEmail, validatePassword } from "@/lib/utils";
import { Eye, EyeOff, LogIn, UserPlus, Mail, Key, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import axios from "axios";
// import logoImage from "@assets/logo.png";

export default function AuthPage() {
  const logoImage = "./logo.png";
  const { toast } = useToast();
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);
  const [isLoadingRegister, setIsLoadingRegister] = useState(false);
  const [errorsLogin, setErrorsLogin] = useState({
    email: "",
    password: "",
  });
  const [errorsRegister, setErrorsRegister] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [stage, setStage] = useState(1);
  const [fadeClass, setFadeClass] = useState("opacity-100");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentTab, setCurrentTab] = useState("login");

  // Forgot password state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1);
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: "",
    resetCode: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoadingForgotPassword, setIsLoadingForgotPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [codeExpireTime, setCodeExpireTime] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

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
    terms: false,
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

  // Timer for code expiration
  useEffect(() => {
    if (codeExpireTime && forgotPasswordStep === 2) {
      const interval = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, Math.floor((codeExpireTime - now) / 1000));
        setTimeRemaining(remaining);
        
        if (remaining === 0) {
          clearInterval(interval);
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [codeExpireTime, forgotPasswordStep]);

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
      password: "password123",
    });
  };
  const CallLoginAuthApi = async (isRegister = false) => {
    setIsLoadingLogin(true);
    const data = {
      email: loginData.email,
      password: loginData.password,
    };
    if (isRegister) {
      data.email = registerData.email;
      data.password = registerData.password;
    }
    Auth.login(data.email, data.password)
      .then((res) => {
        localStorage.setItem("health_session", res.data.access_token);
        localStorage.setItem("token", res.data.access_token);
        localStorage.setItem("encoded_mi", res.data.encoded_mi);
        if (!isRegister) {
          toast({
            title: "Welcome back!",
            description: "You have successfully signed in.",
          });
        }
        setTimeout(() => {
          window.location.reload();
        }, 500);
      })
      .catch((res) => {
        if (res.response.data.detail) {
          if (res.response.data.detail.includes("email")) {
            toast({
              title: "Sign in failed",
              description:
                "This email address is not registered in our system.",
              variant: "destructive",
            });
          } else if (res.response.data.detail.includes("password")) {
            toast({
              title: "Sign in failed",
              description: "Incorrect password. Please try again.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Sign in failed",
              description: res.response.data.detail,
              variant: "destructive",
            });
          }
        }
      })
      .finally(() => {
        setIsLoadingLogin(false);
      });
  };
  const CallRegisterAuthApi = async () => {
    setIsLoadingRegister(true);
    Auth.signup(registerData.email, registerData.password)
      .then(() => {
        CallLoginAuthApi(true);
        toast({
          title: "Account created!",
          description:
            "Welcome to HolistiCare. Let's start monitoring your health.",
        });
      })
      .catch((res) => {
        toast({
          title: "Sign up failed",
          description: res.response.data.detail,
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsLoadingRegister(false);
      });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(loginData.email)) {
      setErrorsLogin({
        ...errorsLogin,
        email: "Please enter a valid email address",
      });
      return;
    }

    if (loginData.password.length < 6) {
      setErrorsLogin({
        ...errorsLogin,
        password: "Password must be at least 6 characters long",
      });
      return;
    }
    CallLoginAuthApi();
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(registerData.email)) {
      setErrorsRegister({
        ...errorsRegister,
        email: "Please enter a valid email address",
      });
      return;
    }
    const passwordValidation = validatePassword(registerData.password);
    if (!passwordValidation.valid) {
      setErrorsRegister({
        ...errorsRegister,
        password: passwordValidation.message || "",
      });
      return;
    }
    if (registerData.password !== registerData.confirmPassword) {
      setErrorsRegister({
        ...errorsRegister,
        confirmPassword: "Passwords do not match",
      });
      return;
    }
    if (!registerData.terms) {
      return;
    }
    CallRegisterAuthApi();
  };

  const handleForgotPasswordStep1 = async () => {
    if (!validateEmail(forgotPasswordData.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingForgotPassword(true);
    try {
      await axios.post(
        "https://vercel-backend-one-roan.vercel.app/holisticare/mobile/auth/forget_password/send_verification",
        { email: forgotPasswordData.email }
      );
      
      // Set expiration time to 10 minutes from now
      setCodeExpireTime(Date.now() + 10 * 60 * 1000);
      
      toast({
        title: "Verification code sent",
        description: "Please check your email for the verification code.",
      });
      setForgotPasswordStep(2);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to send verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingForgotPassword(false);
    }
  };

  const handleForgotPasswordStep2 = async () => {
    if (!forgotPasswordData.resetCode) {
      toast({
        title: "Code required",
        description: "Please enter the verification code.",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingForgotPassword(true);
    try {
      await axios.post(
        "https://vercel-backend-one-roan.vercel.app/holisticare/mobile/auth/forget_password/verify_reset_code",
        { 
          email: forgotPasswordData.email,
          reset_code: parseInt(forgotPasswordData.resetCode)
        }
      );
      
      toast({
        title: "Code verified",
        description: "Please enter your new password.",
      });
      setForgotPasswordStep(3);
    } catch (error: any) {
      const statusCode = error.response?.status;
      const detail = error.response?.data?.detail;
      
      if (statusCode === 406) {
        toast({
          title: "Verification failed",
          description: detail || "Invalid verification code.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to verify code. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoadingForgotPassword(false);
    }
  };

  const handleForgotPasswordStep3 = async () => {
    setIsLoadingForgotPassword(true);
    try {
      await axios.post(
        "https://vercel-backend-one-roan.vercel.app/holisticare/mobile/auth/forget_password/reset_password",
        { 
          email: forgotPasswordData.email,
          password: forgotPasswordData.newPassword
        }
      );
      
      toast({
        title: "Password reset successful",
        description: "Your password has been updated. Please sign in with your new password.",
      });
      
      // Reset forgot password state
      setShowForgotPassword(false);
      setForgotPasswordStep(1);
      setForgotPasswordData({
        email: "",
        resetCode: "",
        newPassword: "",
        confirmPassword: "",
      });
      setCodeExpireTime(null);
      setTimeRemaining(0);
      
      // Switch to login tab
      setCurrentTab("login");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to reset password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingForgotPassword(false);
    }
  };

  const handleResendCode = async () => {
    await handleForgotPasswordStep1();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-300 to-green-400 relative overflow-hidden">
      {/* Curved bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 400 120"
          className="w-full h-24 pointer-events-none -z-10"
          preserveAspectRatio="none"
        >
          <path
            d="M0,60 Q100,20 200,60 T400,60 L400,120 L0,120 Z"
            fill="rgba(255,255,255,0.1)"
          />
          <path
            d="M0,80 Q150,40 300,80 T400,80 L400,120 L0,120 Z"
            fill="rgba(255,255,255,0.05)"
          />
        </svg>
      </div>

      {/* Content */}
      <div
        className={`flex flex-col items-center justify-center min-h-screen px-4 sm:px-8 pt-16 pb-8 transition-opacity duration-500 relative z-10 ${fadeClass}`}
      >
        {/* Stage 1: Loading with HolistiCare.io */}
        {stage === 1 && (
          <div className="text-center">
            {/* Logo circle */}
            <div className="w-20 h-20 mx-auto mb-6 bg-white rounded-full flex items-center justify-center">
              <img
                src={logoImage}
                alt="HolistiCare Logo"
                className="w-12 h-12"
              />
            </div>

            <h1 className="text-white text-2xl font-bold mb-2">
              HolistiCare.io
            </h1>
            <p className="text-white/90 text-sm">
              Empower Health with Intelligence
            </p>
          </div>
        )}

        {/* Stage 2: Welcome screen */}
        {stage === 2 && (
          <div className="text-center w-full">
            {/* Logo circle */}
            <div className="w-20 h-20 mx-auto mb-6 bg-white rounded-full flex items-center justify-center">
              <img
                src={logoImage}
                alt="HolistiCare Logo"
                className="w-12 h-12"
              />
            </div>

            <h1 className="text-white text-xl font-bold mb-2">HolistiCare</h1>
            <p className="text-white/90 text-sm mb-8 sm:mb-12">
              Welcome back to your health journey
            </p>

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
              <img
                src={logoImage}
                alt="HolistiCare Logo"
                className="w-12 h-12"
              />
            </div>

            <h1 className="text-white text-xl font-bold mb-6">HolistiCare</h1>

            <div className="w-full max-w-xs mx-auto">
              <Tabs
                value={currentTab}
                onValueChange={setCurrentTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 bg-white/20 mb-6">
                  <TabsTrigger
                    value="login"
                    className="text-white data-[state=active]:bg-white data-[state=active]:text-green-600"
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger
                    value="register"
                    className="text-white data-[state=active]:bg-white data-[state=active]:text-green-600"
                  >
                    Create Account
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-4">
                  <p className="text-white/90 text-sm mb-6 sm:mb-8 px-2 sm:px-4 text-center">
                    Welcome back! Enter your email and password to continue your
                    health journey.
                  </p>

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="text-left">
                      <Label
                        htmlFor="login-email"
                        className="text-white text-sm"
                      >
                        Email
                      </Label>
                      <Input
                        id="login-email"
                        type="email"
                        required
                        value={loginData.email}
                        onChange={(e) => {
                          setLoginData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }));
                          setErrorsLogin({
                            ...errorsLogin,
                            email: "",
                          });
                        }}
                        className="mt-1 bg-green-200 border-0 text-gray-700 placeholder-gray-500 rounded-lg"
                        placeholder="Enter your email"
                      />
                      {errorsLogin.email && (
                        <p className="text-red-500 text-sm">
                          {errorsLogin.email}
                        </p>
                      )}
                    </div>

                    <div className="text-left">
                      <Label
                        htmlFor="login-password"
                        className="text-white text-sm"
                      >
                        Password
                      </Label>
                      <div className="relative mt-1">
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          required
                          value={loginData.password}
                          onChange={(e) => {
                            setLoginData((prev) => ({
                              ...prev,
                              password: e.target.value,
                            }));
                            setErrorsLogin({
                              ...errorsLogin,
                              password: "",
                            });
                          }}
                          className="bg-green-200 border-0 text-gray-700 placeholder-gray-500 rounded-lg pr-10"
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
                      {errorsLogin.password && (
                        <p className="text-red-500 text-sm">
                          {errorsLogin.password}
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setShowForgotPassword(true);
                          setForgotPasswordStep(1);
                          setForgotPasswordData({
                            email: loginData.email,
                            resetCode: "",
                            newPassword: "",
                            confirmPassword: "",
                          });
                        }}
                        className="text-white text-sm hover:underline"
                        data-testid="link-forgot-password"
                      >
                        Forgot Password?
                      </button>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-white text-green-600 hover:bg-white/90 font-semibold py-4 rounded-full mt-6 cursor-pointer"
                      disabled={isLoadingLogin}
                      data-testid="button-login"
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      {isLoadingLogin ? "Logging in..." : "Log in"}
                    </Button>
                  </form>

                  {/* Test credentials button */}
                  {/* <Button
                    type="button"
                    onClick={fillTestCredentials}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-full mt-4"
                  >
                    Fill Test Credentials
                  </Button> */}
                </TabsContent>

                <TabsContent value="register" className="space-y-4">
                  <p className="text-white/90 text-sm mb-6 sm:mb-8 px-2 sm:px-4 text-center">
                    Join HolistiCare and start your personalized health journey
                    today.
                  </p>

                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="text-left">
                      <Label
                        htmlFor="register-email"
                        className="text-white text-sm"
                      >
                        Email
                      </Label>
                      <Input
                        id="register-email"
                        type="email"
                        required
                        value={registerData.email}
                        onChange={(e) => {
                          setRegisterData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }));
                          setErrorsRegister({
                            ...errorsRegister,
                            email: "",
                          });
                        }}
                        className="mt-1 bg-green-200 border-0 text-gray-700 placeholder-gray-500 rounded-lg"
                        placeholder="Enter your email"
                      />
                      {errorsRegister.email && (
                        <p className="text-red-500 text-sm">
                          {errorsRegister.email}
                        </p>
                      )}
                    </div>

                    <div className="text-left">
                      <Label
                        htmlFor="register-password"
                        className="text-white text-sm"
                      >
                        Password
                      </Label>
                      <div className="relative mt-1">
                        <Input
                          id="register-password"
                          type={showPassword ? "text" : "password"}
                          required
                          value={registerData.password}
                          onChange={(e) => {
                            setRegisterData((prev) => ({
                              ...prev,
                              password: e.target.value,
                            }));
                            setErrorsRegister({
                              ...errorsRegister,
                              password: "",
                            });
                          }}
                          className="bg-green-200 border-0 text-gray-700 placeholder-gray-500 rounded-lg pr-10"
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
                      {errorsRegister.password && (
                        <p className="text-red-500 text-sm">
                          {errorsRegister.password}
                        </p>
                      )}
                    </div>

                    <div className="text-left">
                      <Label
                        htmlFor="confirm-password"
                        className="text-white text-sm"
                      >
                        Confirm Password
                      </Label>
                      <div className="relative mt-1">
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          value={registerData.confirmPassword}
                          onChange={(e) => {
                            setRegisterData((prev) => ({
                              ...prev,
                              confirmPassword: e.target.value,
                            }));
                            setErrorsRegister({
                              ...errorsRegister,
                              confirmPassword: "",
                            });
                          }}
                          className="bg-green-200 border-0 text-gray-700 placeholder-gray-500 rounded-lg pr-10"
                          placeholder="Confirm your password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 text-gray-600 hover:bg-transparent"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      {errorsRegister.confirmPassword && (
                        <p className="text-red-500 text-sm">
                          {errorsRegister.confirmPassword}
                        </p>
                      )}
                    </div>

                    <div className="text-left flex items-center gap-2">
                      <Checkbox
                        id="register-terms"
                        checked={registerData.terms}
                        onCheckedChange={() => {
                          setRegisterData((prev) => ({
                            ...prev,
                            terms: !prev.terms,
                          }));
                        }}
                        required
                        className="data-[state=checked]:bg-green-700 data-[state=checked]:text-white"
                      />
                      <Label
                        htmlFor="register-terms"
                        className="text-white text-xs flex items-center gap-1 text-nowrap"
                      >
                        I accept the{" "}
                        <div
                          onClick={() => {
                            window.open(
                              "https://holisticare.io/legal/patients-privacy-policy/",
                              "_blank"
                            );
                          }}
                          // href="https://holisticare.io/legal/patients-privacy-policy/"
                          style={{ textDecoration: "underline",cursor: "pointer" }}
                        >
                          Privacy Policy
                        </div>
                        and{" "}
                        <div
                          onClick={() => {
                            window.open(
                              "https://holisticare.io/legal/patients-terms-of-service/",
                              "_blank"
                            );
                          }}
                          // href="https://holisticare.io/legal/patients-terms-of-service/"
                          style={{ textDecoration: "underline",cursor: "pointer" }}
                        >
                          Terms of Service
                        </div>
                      </Label>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-white text-green-600 hover:bg-white/90 font-semibold py-4 rounded-full mt-6 cursor-pointer"
                      disabled={isLoadingRegister}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      {isLoadingRegister
                        ? "Creating account..."
                        : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </div>

      {/* Forgot Password Dialog */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent className="max-w-sm bg-gradient-to-br from-white/95 via-white/90 to-green-50/60 dark:from-gray-800/95 dark:via-gray-800/90 dark:to-green-900/20 backdrop-blur-xl border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-medium bg-gradient-to-r from-gray-900 to-green-800 dark:from-white dark:to-green-200 bg-clip-text text-transparent flex items-center gap-2">
              <Key className="w-5 h-5 text-green-600" />
              Reset Password
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Step 1: Email */}
            {forgotPasswordStep === 1 && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Enter your email address and we'll send you a verification code.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="forgot-email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="forgot-email"
                      type="email"
                      value={forgotPasswordData.email}
                      onChange={(e) =>
                        setForgotPasswordData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="pl-10 bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700"
                      placeholder="your@email.com"
                      data-testid="input-forgot-email"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleForgotPasswordStep1}
                  disabled={isLoadingForgotPassword}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
                  data-testid="button-send-code"
                >
                  {isLoadingForgotPassword ? "Sending..." : "Send Verification Code"}
                </Button>
              </div>
            )}

            {/* Step 2: Verification Code */}
            {forgotPasswordStep === 2 && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  We sent a verification code to <span className="font-semibold">{forgotPasswordData.email}</span>
                </p>
                
                {timeRemaining > 0 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 bg-green-50 dark:bg-green-900/20 p-2 rounded">
                    Code expires in {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="reset-code" className="text-sm font-medium">
                    Verification Code
                  </Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="reset-code"
                      type="text"
                      value={forgotPasswordData.resetCode}
                      onChange={(e) =>
                        setForgotPasswordData((prev) => ({
                          ...prev,
                          resetCode: e.target.value.replace(/\D/g, ''),
                        }))
                      }
                      className="pl-10 bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700"
                      placeholder="Enter 4-digit code"
                      maxLength={4}
                      data-testid="input-reset-code"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={handleForgotPasswordStep2}
                    disabled={isLoadingForgotPassword}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
                    data-testid="button-verify-code"
                  >
                    {isLoadingForgotPassword ? "Verifying..." : "Verify Code"}
                  </Button>
                  <Button
                    onClick={handleResendCode}
                    disabled={isLoadingForgotPassword || timeRemaining > 540}
                    variant="outline"
                    className="flex-1"
                    data-testid="button-resend-code"
                  >
                    Resend Code
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: New Password */}
            {forgotPasswordStep === 3 && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Create a new password for your account.
                </p>
                
                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-sm font-medium">
                    New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      value={forgotPasswordData.newPassword}
                      onChange={(e) =>
                        setForgotPasswordData((prev) => ({
                          ...prev,
                          newPassword: e.target.value,
                        }))
                      }
                      className="pl-10 pr-10 bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700"
                      placeholder="Enter new password"
                      data-testid="input-new-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 text-gray-600 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={handleForgotPasswordStep3}
                  disabled={isLoadingForgotPassword}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
                  data-testid="button-reset-password"
                >
                  {isLoadingForgotPassword ? "Resetting..." : "Reset Password"}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
