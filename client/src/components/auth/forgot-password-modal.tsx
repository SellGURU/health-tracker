import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { validateEmail } from "@/lib/utils";
import { Eye, EyeOff, Key, Lock, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import Application from "@/api/app";

interface ForgotPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialEmail?: string;
  onSuccess?: () => void;
}

export default function ForgotPasswordModal({
  open,
  onOpenChange,
  initialEmail = "",
  onSuccess,
}: ForgotPasswordModalProps) {
  const { toast } = useToast();
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1);
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: initialEmail,
    resetCode: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoadingForgotPassword, setIsLoadingForgotPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [codeExpireTime, setCodeExpireTime] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (open) {
      setForgotPasswordData({
        email: initialEmail,
        resetCode: "",
        newPassword: "",
        confirmPassword: "",
      });
      setForgotPasswordStep(1);
      setCodeExpireTime(null);
      setTimeRemaining(0);
    }
  }, [open, initialEmail]);

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
      await Application.forgetPasswordSendVerification(forgotPasswordData.email);
      
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
      await Application.forgetPasswordVerifyResetCode(forgotPasswordData.email, parseInt(forgotPasswordData.resetCode));
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
    if (!forgotPasswordData.newPassword) {
      toast({
        title: "Password required",
        description: "Please enter a new password.",
        variant: "destructive",
      });
      return;
    }

    if (forgotPasswordData.newPassword !== forgotPasswordData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingForgotPassword(true);
    try {
      await Application.forgetPasswordResetPassword(forgotPasswordData.email, forgotPasswordData.newPassword);
      toast({
        title: "Password reset successful",
        description: "Your password has been updated. Please sign in with your new password.",
      });
      
      // Reset forgot password state
      onOpenChange(false);
      setForgotPasswordStep(1);
      setForgotPasswordData({
        email: "",
        resetCode: "",
        newPassword: "",
        confirmPassword: "",
      });
      setCodeExpireTime(null);
      setTimeRemaining(0);
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
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
    <Dialog open={open} onOpenChange={onOpenChange}>
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

              <div className="space-y-2">
                <Label htmlFor="confirm-new-password" className="text-sm font-medium">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="confirm-new-password"
                    type={showNewPassword ? "text" : "password"}
                    value={forgotPasswordData.confirmPassword}
                    onChange={(e) =>
                      setForgotPasswordData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    className="pl-10 bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700"
                    placeholder="Confirm new password"
                    data-testid="input-confirm-password"
                  />
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
  );
}

