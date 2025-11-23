import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { UseMutationResult } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ShowPasswords {
  current: boolean;
  new: boolean;
  confirm: boolean;
}

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isPasswordChangeRequired: boolean;
  passwordData: PasswordData;
  setPasswordData: React.Dispatch<React.SetStateAction<PasswordData>>;
  showPasswords: ShowPasswords;
  setShowPasswords: React.Dispatch<React.SetStateAction<ShowPasswords>>;
  changePasswordMutation: UseMutationResult<
    any,
    any,
    PasswordData,
    unknown
  >;
}

interface ValidationErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const ChangePasswordDialog = ({
  open,
  onOpenChange,
  isPasswordChangeRequired,
  passwordData,
  setPasswordData,
  showPasswords,
  setShowPasswords,
  changePasswordMutation,
}: ChangePasswordDialogProps) => {
  const { toast } = useToast();
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Validation functions
  const validateCurrentPassword = (value: string): string | undefined => {
    if (!value || value.trim() === "") {
      return "This field is required";
    }
    return undefined;
  };

  const validateNewPassword = (value: string): string | undefined => {
    if (!value || value.trim() === "") {
      return "This field is required";
    }
    if (value.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (!/[a-z]/.test(value)) {
      return "Password must contain lowercase letters";
    }
    if (!/[A-Z]/.test(value)) {
      return "Password must contain uppercase letters";
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
      return "Password must contain special characters";
    }
    return undefined;
  };

  const validateConfirmPassword = (
    value: string,
    newPassword: string
  ): string | undefined => {
    if (!value || value.trim() === "") {
      return "This field is required";
    }
    if (value !== newPassword) {
      return "Passwords do not match";
    }
    return undefined;
  };

  // Reset errors when dialog closes
  useEffect(() => {
    if (!open) {
      setErrors({});
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        // Prevent closing if password change is required
        if (!open && isPasswordChangeRequired) {
          toast({
            title: "Password Change Required",
            description: "Please change your password before continuing.",
            variant: "destructive",
          });
          return;
        }
        onOpenChange(open);
      }}
    >
      <DialogContent className="max-w-sm bg-gradient-to-br from-white/95 via-white/90 to-red-50/60 dark:from-gray-800/95 dark:via-gray-800/90 dark:to-red-900/20 backdrop-blur-xl border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium bg-gradient-to-r from-gray-900 to-red-800 dark:from-white dark:to-red-200 bg-clip-text text-transparent">
            Change Password
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
            Enter your current password and choose a new one
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label
              htmlFor="currentPassword"
              className="text-gray-700 dark:text-gray-300 font-medium"
            >
              Current Password
            </Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPasswords.current ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) => {
                  setPasswordData((prev) => ({
                    ...prev,
                    currentPassword: e.target.value,
                  }));
                  // Clear error when user starts typing
                  if (errors.currentPassword) {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.currentPassword;
                      return newErrors;
                    });
                  }
                }}
                onBlur={() => {
                  const error = validateCurrentPassword(passwordData.currentPassword);
                  setErrors((prev) => ({
                    ...prev,
                    currentPassword: error,
                  }));
                }}
                className={`bg-gradient-to-r from-white/80 to-red-50/50 dark:from-gray-700/80 dark:to-red-900/20 border-red-200/50 dark:border-red-800/30 backdrop-blur-sm shadow-inner pr-10 ${
                  errors.currentPassword ? "border-red-500 dark:border-red-500" : ""
                }`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 text-gray-600 hover:bg-transparent"
                onClick={() =>
                  setShowPasswords((prev) => ({
                    ...prev,
                    current: !prev.current,
                  }))
                }
              >
                {showPasswords.current ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.currentPassword && (
              <p className="text-sm text-red-500 mt-1">{errors.currentPassword}</p>
            )}
          </div>
          <div>
            <Label
              htmlFor="newPassword"
              className="text-gray-700 dark:text-gray-300 font-medium"
            >
              New Password
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPasswords.new ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={(e) => {
                  setPasswordData((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }));
                  // Clear error when user starts typing
                  if (errors.newPassword) {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.newPassword;
                      return newErrors;
                    });
                  }
                }}
                onBlur={() => {
                  const error = validateNewPassword(passwordData.newPassword);
                  setErrors((prev) => ({
                    ...prev,
                    newPassword: error,
                  }));
                }}
                className={`bg-gradient-to-r from-white/80 to-red-50/50 dark:from-gray-700/80 dark:to-red-900/20 border-red-200/50 dark:border-red-800/30 backdrop-blur-sm shadow-inner pr-10 ${
                  errors.newPassword ? "border-red-500 dark:border-red-500" : ""
                }`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 text-gray-600 hover:bg-transparent"
                onClick={() =>
                  setShowPasswords((prev) => ({
                    ...prev,
                    new: !prev.new,
                  }))
                }
              >
                {showPasswords.new ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.newPassword && (
              <p className="text-sm text-red-500 mt-1">{errors.newPassword}</p>
            )}
          </div>
          <div>
            <Label
              htmlFor="confirmPassword"
              className="text-gray-700 dark:text-gray-300 font-medium"
            >
              Confirm New Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPasswords.confirm ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={(e) => {
                  setPasswordData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }));
                  // Clear error when user starts typing
                  if (errors.confirmPassword) {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.confirmPassword;
                      return newErrors;
                    });
                  }
                }}
                onBlur={() => {
                  const error = validateConfirmPassword(
                    passwordData.confirmPassword,
                    passwordData.newPassword
                  );
                  setErrors((prev) => ({
                    ...prev,
                    confirmPassword: error,
                  }));
                }}
                className={`bg-gradient-to-r from-white/80 to-red-50/50 dark:from-gray-700/80 dark:to-red-900/20 border-red-200/50 dark:border-red-800/30 backdrop-blur-sm shadow-inner pr-10 ${
                  errors.confirmPassword ? "border-red-500 dark:border-red-500" : ""
                }`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 text-gray-600 hover:bg-transparent"
                onClick={() =>
                  setShowPasswords((prev) => ({
                    ...prev,
                    confirm: !prev.confirm,
                  }))
                }
              >
                {showPasswords.confirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
            )}
          </div>
          <Button
            onClick={() => {
              // Validate all fields
              const currentPasswordError = validateCurrentPassword(
                passwordData.currentPassword
              );
              const newPasswordError = validateNewPassword(
                passwordData.newPassword
              );
              const confirmPasswordError = validateConfirmPassword(
                passwordData.confirmPassword,
                passwordData.newPassword
              );

              const validationErrors: ValidationErrors = {};
              if (currentPasswordError) {
                validationErrors.currentPassword = currentPasswordError;
              }
              if (newPasswordError) {
                validationErrors.newPassword = newPasswordError;
              }
              if (confirmPasswordError) {
                validationErrors.confirmPassword = confirmPasswordError;
              }

              if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                toast({
                  title: "Validation Error",
                  description: "Please fill all fields correctly",
                  variant: "destructive",
                });
                return;
              }

              if (
                passwordData.newPassword !== passwordData.confirmPassword
              ) {
                toast({
                  title: "Passwords don't match",
                  description: "Please ensure both password fields match.",
                  variant: "destructive",
                });
                return;
              }
              changePasswordMutation.mutate(passwordData);
            }}
            disabled={changePasswordMutation.isPending}
            className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {changePasswordMutation.isPending
              ? "Changing..."
              : "Change Password"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialog;

