import Application from "@/api/app";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { validateEmail } from "@/lib/utils";
import { Eye, EyeOff, Info, Key, Lock, Mail } from "lucide-react";
import { useEffect, useState } from "react";

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
  const [isLoadingForgotPasswordResend, setIsLoadingForgotPasswordResend] =
    useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [codeExpireTime, setCodeExpireTime] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [errorsForgotPassword, setErrorsForgotPassword] = useState({
    email: "",
    resetCode: "",
    newPassword: "",
    confirmPassword: "",
  });

  const fieldInputClass =
    "h-11 rounded-xl border-gray-200 bg-gray-50/80 pl-10 pr-11 shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500/40 dark:border-gray-700 dark:bg-gray-800/60";
  const fieldLabelClass = "text-sm font-medium text-gray-700 dark:text-gray-300";
  const toggleClass =
    "absolute right-1 top-1/2 h-9 w-9 -translate-y-1/2 rounded-lg p-0 text-gray-500 hover:bg-gray-200/70 dark:hover:bg-gray-700/70";

  useEffect(() => {
    if (open) {
      setForgotPasswordData({
        email: initialEmail,
        resetCode: "",
        newPassword: "",
        confirmPassword: "",
      });
      setCodeExpireTime(null);
      setTimeRemaining(0);
      setErrorsForgotPassword({
        email: "",
        resetCode: "",
        newPassword: "",
        confirmPassword: "",
      });
      setForgotPasswordStep(1);
    }
  }, [open, initialEmail]);

  useEffect(() => {
    if (codeExpireTime && forgotPasswordStep === 2) {
      const interval = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(
          0,
          Math.floor((codeExpireTime - now) / 1000)
        );
        setTimeRemaining(remaining);
        if (remaining === 0) clearInterval(interval);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [codeExpireTime, forgotPasswordStep]);

  const handleForgotPasswordStep1 = async ({ resend = false }: { resend?: boolean }) => {
    if (!forgotPasswordData.email?.trim()) {
      setErrorsForgotPassword({ ...errorsForgotPassword, email: "This field is required." });
      return;
    }
    if (!validateEmail(forgotPasswordData.email)) {
      setErrorsForgotPassword({
        ...errorsForgotPassword,
        email: "Invalid email address. Please try again.",
      });
      return;
    }

    if (resend) setIsLoadingForgotPasswordResend(true);
    else setIsLoadingForgotPassword(true);

    try {
      await Application.forgetPasswordSendVerification(forgotPasswordData.email);
      setCodeExpireTime(Date.now() + 10 * 60 * 1000);
      toast({
        title: "Verification code sent",
        description: "Please check your email for the verification code.",
      });
      setForgotPasswordStep(2);
    } catch (error: any) {
      setErrorsForgotPassword({
        ...errorsForgotPassword,
        email:
          error.response?.data?.detail ||
          "Failed to send verification code. Please try again.",
      });
    } finally {
      setIsLoadingForgotPassword(false);
      setIsLoadingForgotPasswordResend(false);
    }
  };

  const handleForgotPasswordStep2 = async () => {
    if (!forgotPasswordData.resetCode) {
      setErrorsForgotPassword({ ...errorsForgotPassword, resetCode: "This field is required." });
      return;
    }

    setIsLoadingForgotPassword(true);
    try {
      await Application.forgetPasswordVerifyResetCode(
        forgotPasswordData.email,
        parseInt(forgotPasswordData.resetCode)
      );
      toast({ title: "Code verified", description: "Please enter your new password." });
      setForgotPasswordStep(3);
    } catch (error: any) {
      const detail = error.response?.data?.detail;
      setErrorsForgotPassword({
        ...errorsForgotPassword,
        resetCode: detail || "Failed to verify code. Please try again.",
      });
    } finally {
      setIsLoadingForgotPassword(false);
    }
  };

  const handleForgotPasswordStep3 = async () => {
    if (!forgotPasswordData.newPassword) {
      setErrorsForgotPassword({ ...errorsForgotPassword, newPassword: "This field is required." });
      return;
    }
    if (!forgotPasswordData.confirmPassword?.trim()) {
      setErrorsForgotPassword({
        ...errorsForgotPassword,
        confirmPassword: "Please confirm your password",
      });
      return;
    }
    if (forgotPasswordData.newPassword !== forgotPasswordData.confirmPassword) {
      setErrorsForgotPassword({
        ...errorsForgotPassword,
        confirmPassword: "Passwords do not match. Please try again.",
      });
      return;
    }

    setIsLoadingForgotPassword(true);
    try {
      await Application.forgetPasswordResetPassword(
        forgotPasswordData.email,
        forgotPasswordData.newPassword
      );
      toast({
        title: "Password reset successful",
        description: "Your password has been updated. Please sign in.",
      });
      onOpenChange(false);
      setForgotPasswordStep(1);
      setForgotPasswordData({ email: "", resetCode: "", newPassword: "", confirmPassword: "" });
      setCodeExpireTime(null);
      setTimeRemaining(0);
      onSuccess?.();
    } catch (error: any) {
      setErrorsForgotPassword({
        ...errorsForgotPassword,
        confirmPassword:
          error.response?.data?.detail || "Failed to reset password. Please try again.",
      });
    } finally {
      setIsLoadingForgotPassword(false);
    }
  };

  const stepTitles = ["Reset Password", "Enter Code", "New Password"];
  const stepDescriptions = [
    "We'll send a verification code to your email.",
    "Enter the code we sent to your inbox.",
    "Create a new secure password.",
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="mx-auto flex max-h-[92dvh] w-full max-w-md flex-col gap-0 rounded-t-3xl border-x-0 border-t border-gray-200/50 bg-white/95 p-0 backdrop-blur-xl dark:border-gray-700/50 dark:bg-gray-900/95 [&>button]:hidden"
      >
        <div className="flex flex-shrink-0 justify-center pb-1 pt-3">
          <span className="h-1.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700" />
        </div>

        <SheetHeader className="flex-shrink-0 space-y-0 px-5 pb-3 pt-1 text-left">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/15">
              <Key className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </span>
            <div>
              <SheetTitle className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {stepTitles[forgotPasswordStep - 1]}
              </SheetTitle>
              <SheetDescription className="text-xs text-gray-500 dark:text-gray-400">
                {stepDescriptions[forgotPasswordStep - 1]}
              </SheetDescription>
            </div>
          </div>
          <div className="mt-3 flex gap-1.5">
            {[1, 2, 3].map((step) => (
              <span
                key={step}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  forgotPasswordStep >= step
                    ? "bg-emerald-500"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              />
            ))}
          </div>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)]">
          {forgotPasswordStep === 1 && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="forgot-email" className={fieldLabelClass}>
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="forgot-email"
                    type="email"
                    value={forgotPasswordData.email}
                    onChange={(e) => {
                      setForgotPasswordData((prev) => ({ ...prev, email: e.target.value }));
                      setErrorsForgotPassword({ ...errorsForgotPassword, email: "" });
                    }}
                    className={fieldInputClass}
                    placeholder="your@email.com"
                    data-testid="input-forgot-email"
                  />
                </div>
                {errorsForgotPassword.email && (
                  <p className="text-xs text-red-500">{errorsForgotPassword.email}</p>
                )}
              </div>
              <Button
                onClick={() => handleForgotPasswordStep1({ resend: false })}
                disabled={isLoadingForgotPassword}
                className="h-11 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 font-medium text-white hover:from-emerald-700 hover:to-teal-700"
                data-testid="button-send-code"
              >
                {isLoadingForgotPassword ? "Sending..." : "Send Verification Code"}
              </Button>
            </>
          )}

          {forgotPasswordStep === 2 && (
            <>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Code sent to{" "}
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {forgotPasswordData.email}
                </span>
              </p>
              {timeRemaining > 0 && (
                <div className="rounded-xl bg-emerald-50 px-3 py-2 text-xs text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                  Code expires in {Math.floor(timeRemaining / 60)}:
                  {String(timeRemaining % 60).padStart(2, "0")}
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="reset-code" className={fieldLabelClass}>
                  Verification Code
                </Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="reset-code"
                    type="text"
                    value={forgotPasswordData.resetCode}
                    onChange={(e) => {
                      setForgotPasswordData((prev) => ({
                        ...prev,
                        resetCode: e.target.value.replace(/\D/g, ""),
                      }));
                      setErrorsForgotPassword({ ...errorsForgotPassword, resetCode: "" });
                    }}
                    className={fieldInputClass}
                    placeholder="Enter 4-digit code"
                    maxLength={4}
                    data-testid="input-reset-code"
                  />
                </div>
                {errorsForgotPassword.resetCode && (
                  <p className="text-xs text-red-500">{errorsForgotPassword.resetCode}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleForgotPasswordStep2}
                  disabled={isLoadingForgotPassword}
                  className="h-11 flex-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 font-medium text-white"
                  data-testid="button-verify-code"
                >
                  {isLoadingForgotPassword ? "Verifying..." : "Verify Code"}
                </Button>
                <Button
                  onClick={() => handleForgotPasswordStep1({ resend: true })}
                  disabled={isLoadingForgotPasswordResend || timeRemaining > 540}
                  variant="outline"
                  className="h-11 flex-1 rounded-xl border-gray-200 dark:border-gray-700"
                  data-testid="button-resend-code"
                >
                  Resend
                </Button>
              </div>
            </>
          )}

          {forgotPasswordStep === 3 && (
            <>
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <Label htmlFor="new-password" className={fieldLabelClass}>
                    New Password
                  </Label>
                  <Popover open={isInfoOpen} onOpenChange={setIsInfoOpen}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="rounded-full p-0.5 hover:bg-gray-100 dark:hover:bg-gray-700"
                        aria-label="Password requirements"
                      >
                        <Info className="h-3.5 w-3.5 text-gray-500" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-3 text-sm" side="top">
                      <p className="text-gray-700 dark:text-gray-300">
                        At least 8 characters with uppercase, lowercase, numbers and special
                        characters.
                      </p>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    value={forgotPasswordData.newPassword}
                    onChange={(e) => {
                      setForgotPasswordData((prev) => ({ ...prev, newPassword: e.target.value }));
                      setErrorsForgotPassword({ ...errorsForgotPassword, newPassword: "" });
                    }}
                    className={fieldInputClass}
                    placeholder="Enter new password"
                    data-testid="input-new-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={toggleClass}
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errorsForgotPassword.newPassword && (
                  <p className="text-xs text-red-500">{errorsForgotPassword.newPassword}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirm-new-password" className={fieldLabelClass}>
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="confirm-new-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={forgotPasswordData.confirmPassword}
                    onChange={(e) => {
                      setForgotPasswordData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }));
                      setErrorsForgotPassword({ ...errorsForgotPassword, confirmPassword: "" });
                    }}
                    className={fieldInputClass}
                    placeholder="Confirm new password"
                    data-testid="input-confirm-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={toggleClass}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errorsForgotPassword.confirmPassword && (
                  <p className="text-xs text-red-500">{errorsForgotPassword.confirmPassword}</p>
                )}
              </div>

              <Button
                onClick={handleForgotPasswordStep3}
                disabled={isLoadingForgotPassword}
                className="h-11 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 font-medium text-white hover:from-emerald-700 hover:to-teal-700"
                data-testid="button-reset-password"
              >
                {isLoadingForgotPassword ? "Resetting..." : "Reset Password"}
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
