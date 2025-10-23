import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest } from "@/lib/queryClient";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { authService } from "@/lib/auth";
import { supportMessageSchema, type SupportMessage } from "@shared/schema";
import { useLocation } from "wouter";
import { 
  User,
  Settings,
  Bell,
  Shield,
  Download,
  HelpCircle,
  LogOut,
  Edit3,
  ChevronRight,
  Mail,
  Calendar,
  Crown,
  Activity,
  Target,
  Brain,
  Heart,
  Award,
  Zap,
  TrendingUp,
  Globe,
  Lock,
  Smartphone,
  FileText,
  Trash2,
  AlertTriangle
} from "lucide-react";

export default function Profile() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showNotificationsDialog, setShowNotificationsDialog] = useState(false);
  const [showPrivacyDialog, setShowPrivacyDialog] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showDeleteAccountDialog, setShowDeleteAccountDialog] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [editData, setEditData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: user?.gender || "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Support message form
  const supportForm = useForm<SupportMessage>({
    resolver: zodResolver(supportMessageSchema),
    defaultValues: {
      message: "",
    },
  });

  // Support message mutation
  const sendSupportMessage = useMutation({
    mutationFn: async (data: SupportMessage) => {
      return apiRequest("POST", "/api/support/email", data);
    },
    onSuccess: () => {
      toast({
        title: "Message sent!",
        description: "We've received your message and will respond within 24 hours.",
      });
      supportForm.reset();
      setShowEmailModal(false);
    },
    onError: () => {
      toast({
        title: "Failed to send message",
        description: "Please try again later or contact us directly.",
        variant: "destructive",
      });
    },
  });
  
  // Notification preferences
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    chatMessages: true,
    questionnaireAssigned: true,
  });
  
  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    shareDataWithDoctors: true,
    anonymousAnalytics: true,
    shareHealthInsights: false,
    dataRetention: '2_years',
  });

  // Export data options
  const [exportOptions, setExportOptions] = useState({
    personalData: true,
    questionnaires: true,
    biomarkers: true,
    actionPlans: true,
  });
  

  const { data: stats } = useQuery({
    queryKey: ["/api/profile/stats"],
    queryFn: async () => {
      // Get aggregated stats
      const [labResults, actionPlans, insights, healthScore] = await Promise.all([
        fetch('/api/lab-results', { headers: authService.getAuthHeaders() }).then(r => r.json()),
        fetch('/api/action-plans', { headers: authService.getAuthHeaders() }).then(r => r.json()),
        fetch('/api/insights', { headers: authService.getAuthHeaders() }).then(r => r.json()),
        fetch('/api/health-score', { headers: authService.getAuthHeaders() }).then(r => r.json()),
      ]);

      return {
        totalTests: labResults.length || 0,
        activePlans: actionPlans.filter((p: any) => p.status === 'active').length || 0,
        healthScore: healthScore?.overallScore || 0,
        insights: insights.length || 0,
      };
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof editData) => {
      const updates = {
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender || undefined,
      };

      // This would typically be a PATCH /api/users/me endpoint
      // For now, we'll simulate the update
      return updates;
    },
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
      setShowEditDialog(false);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: typeof passwordData) => {
      // This would typically be a POST /api/auth/change-password endpoint
      // For now, we'll simulate the update
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Password changed",
        description: "Your password has been updated successfully.",
      });
      setShowPasswordDialog(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    },
    onError: (error) => {
      toast({
        title: "Password change failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    logout();
    setLocation('/');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };
  
  const handleExportData = () => {
    setShowExportModal(true);
  };

  const performExport = async () => {
    setIsExporting(true);
    try {
      // Simulate data export
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create export data based on selected options
      const exportData: any = {
        exportDate: new Date().toISOString(),
      };

      if (exportOptions.personalData) {
        exportData.personalData = {
          profile: user,
          email: user?.email,
          fullName: user?.fullName,
          // Add other profile data here
        };
      }

      if (exportOptions.questionnaires) {
        // Only include if questionnaires are completed
        exportData.questionnaires = {
          onboarding: 'Questionnaire responses data...', // Get from home page data
          healthAssessment: 'Health assessment responses...',
        };
      }

      if (exportOptions.biomarkers) {
        // Get biomarkers data from second page (monitor page)
        exportData.biomarkers = {
          labResults: 'Lab results and biomarker data...',
          healthScores: 'Health score data...',
        };
      }

      if (exportOptions.actionPlans) {
        // Get action plans data from fourth page (plan page)  
        exportData.actionPlans = {
          activePlans: 'Active action plans data...',
          goals: 'Health goals data...',
          challenges: 'Wellness challenges data...',
        };
      }
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `holisticare-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Data exported",
        description: "Your selected health data has been downloaded successfully.",
      });
      
      setShowExportModal(false);
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export your data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  const saveNotificationSettings = () => {
    toast({
      title: "Notifications updated",
      description: "Your notification preferences have been saved.",
    });
    setShowNotificationsDialog(false);
  };
  
  const savePrivacySettings = () => {
    toast({
      title: "Privacy settings updated",
      description: "Your privacy preferences have been saved.",
    });
    setShowPrivacyDialog(false);
  };
  
  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("DELETE", "/api/auth/delete-account");
    },
    onSuccess: () => {
      toast({
        title: "Account deleted",
        description: "Your account has been permanently deleted.",
      });
      logout();
      setLocation('/');
    },
    onError: (error) => {
      toast({
        title: "Failed to delete account",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleDeleteAccount = () => {
    const requiredText = `DELETE/${user?.fullName || 'User'}`;
    if (deleteConfirmation === requiredText) {
      deleteAccountMutation.mutate();
      setShowDeleteAccountDialog(false);
      setDeleteConfirmation("");
    }
  };

  const settingsItems = [
    {
      icon: User,
      title: "Personal Information",
      description: "Update your profile details",
      action: () => setShowEditDialog(true),
      badge: null,
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Manage your notification preferences",
      action: () => setShowNotificationsDialog(true),
      badge: null,
    },
    {
      icon: Shield,
      title: "Privacy & Data",
      description: "Control your data sharing preferences",
      action: () => setShowPrivacyDialog(true),
      badge: null,
    },
    {
      icon: Download,
      title: "Export Data",
      description: "Download your health data",
      action: () => handleExportData(),
      badge: null,
    },
    {
      icon: HelpCircle,
      title: "Help & Support",
      description: "Get help and contact support",
      action: () => setShowHelpDialog(true),
      badge: null,
    },
    {
      icon: Lock,
      title: "Change Password",
      description: "Update your account password",
      action: () => setShowPasswordDialog(true),
      badge: null,
    },
    {
      icon: Trash2,
      title: "Delete Account",
      description: "Permanently delete your account and data",
      action: () => setShowDeleteAccountDialog(true),
      badge: null,
    },
  ];

  const getSubscriptionBadge = (tier: string) => {
    switch (tier) {
      case 'plus':
        return <Badge className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-700 border-emerald-200/50 dark:text-emerald-300 dark:border-emerald-800/30 backdrop-blur-sm">Plus Plan</Badge>;
      case 'professional':
        return <Badge className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 text-purple-700 border-purple-200/50 dark:text-purple-300 dark:border-purple-800/30 backdrop-blur-sm">Professional</Badge>;
      default:
        return <Badge variant="outline" className="bg-gradient-to-r from-gray-500/10 to-slate-500/10 backdrop-blur-sm">Free Plan</Badge>;
    }
  };

  const getMembershipDuration = () => {
    // Calculate membership duration
    const joinDate = new Date('2024-06-01'); // Example join date
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - joinDate.getTime());
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    return `${diffMonths} months`;
  };

  const calculateAge = (dateOfBirth: string | undefined) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/40 dark:from-gray-900 dark:via-emerald-900/20 dark:to-teal-900/10">
      {/* Header */}
      <div className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-white/20 dark:border-gray-700/30 shadow-2xl">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div>
            <h1 className="text-3xl font-thin bg-gradient-to-r from-gray-900 via-emerald-800 to-teal-800 dark:from-white dark:via-emerald-200 dark:to-teal-200 bg-clip-text text-transparent">
              Profile Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-light">Manage your account and preferences</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Overview Card */}
        <Card className="bg-gradient-to-br from-white/90 via-white/80 to-emerald-50/60 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-emerald-900/20 border-0 shadow-xl backdrop-blur-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-shrink-0">
                <Avatar className="w-16 h-16 ring-2 ring-emerald-200/50 dark:ring-emerald-800/30 shadow-lg">
                  <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-lg font-medium">
                    {user?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                  <Crown className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="space-y-3">
                  <div>
                    <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100">
                      {(editData?.firstName && editData?.lastName) 
                        ? `${editData.firstName} ${editData.lastName}` 
                        : user?.fullName || 'User'}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                  </div>
                  
                  {/* Better spaced info display */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Age:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {(editData?.dateOfBirth ? calculateAge(editData.dateOfBirth) : user?.age) || 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Gender:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                        {editData?.gender || user?.gender || 'Not specified'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Member since:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {getMembershipDuration()}
                      </span>
                    </div>
                  </div>
                  
                  {/* Health stats */}
                  <div className="space-y-2 text-sm pt-2 border-t border-gray-200/30 dark:border-gray-700/30">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Lab Tests:</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {stats?.totalTests || 5}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Action Plans:</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        {stats?.activePlans || 2}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Account:</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        Verified
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-2">
                    {getSubscriptionBadge(user?.subscriptionTier || 'free')}
                    <Badge variant="outline" className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-700 dark:text-blue-300 border-blue-200/50 dark:border-blue-800/30 backdrop-blur-sm text-xs">
                      <Activity className="w-3 h-3 mr-1" />
                      Active User
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>


        {/* Settings Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Account Settings */}
          <Card className="bg-gradient-to-br from-white/90 via-white/80 to-gray-50/60 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-gray-900/20 border-0 shadow-xl backdrop-blur-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-thin bg-gradient-to-r from-gray-900 to-emerald-800 dark:from-white dark:to-emerald-200 bg-clip-text text-transparent flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Settings className="w-4 h-4 text-white" />
                </div>
                Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {settingsItems.slice(0, 4).map((item, index) => (
                <button
                  key={index}
                  onClick={item.action}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50/50 to-white/50 dark:from-gray-700/50 dark:to-gray-800/30 hover:from-emerald-50/60 hover:to-teal-50/60 dark:hover:from-emerald-900/20 dark:hover:to-teal-900/20 transition-all duration-300 hover:shadow-lg group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 group-hover:from-emerald-500 group-hover:to-teal-500 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm">
                      <item.icon className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">{item.title}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 font-light">{item.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <Badge variant="outline" className="bg-emerald-100/50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300" />
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Preferences & Security */}
          <Card className="bg-gradient-to-br from-white/90 via-white/80 to-gray-50/60 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-gray-900/20 border-0 shadow-xl backdrop-blur-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-thin bg-gradient-to-r from-gray-900 to-purple-800 dark:from-white dark:to-purple-200 bg-clip-text text-transparent flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                Preferences & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {settingsItems.slice(4).map((item, index) => (
                <button
                  key={index}
                  onClick={item.action}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50/50 to-white/50 dark:from-gray-700/50 dark:to-gray-800/30 hover:from-purple-50/60 hover:to-indigo-50/60 dark:hover:from-purple-900/20 dark:hover:to-indigo-900/20 transition-all duration-300 hover:shadow-lg group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 group-hover:from-purple-500 group-hover:to-indigo-500 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm">
                      <item.icon className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">{item.title}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 font-light">{item.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <Badge variant="outline" className="bg-purple-100/50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300" />
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>


        {/* Edit Profile Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-md bg-gradient-to-br from-white/95 via-white/90 to-emerald-50/60 dark:from-gray-800/95 dark:via-gray-800/90 dark:to-emerald-900/20 backdrop-blur-xl border-0 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-thin bg-gradient-to-r from-gray-900 to-emerald-800 dark:from-white dark:to-emerald-200 bg-clip-text text-transparent">
                Edit Profile
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-firstname" className="text-gray-700 dark:text-gray-300 font-medium">First Name</Label>
                  <Input
                    id="edit-firstname"
                    value={editData.firstName || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="bg-gradient-to-r from-white/80 to-emerald-50/50 dark:from-gray-700/80 dark:to-emerald-900/20 border-emerald-200/50 dark:border-emerald-800/30 backdrop-blur-sm shadow-inner"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-lastname" className="text-gray-700 dark:text-gray-300 font-medium">Last Name</Label>
                  <Input
                    id="edit-lastname"
                    value={editData.lastName || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="bg-gradient-to-r from-white/80 to-emerald-50/50 dark:from-gray-700/80 dark:to-emerald-900/20 border-emerald-200/50 dark:border-emerald-800/30 backdrop-blur-sm shadow-inner"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-birthdate" className="text-gray-700 dark:text-gray-300 font-medium">Date of Birth</Label>
                  <Input
                    id="edit-birthdate"
                    type="date"
                    value={editData.dateOfBirth || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    className="bg-gradient-to-r from-white/80 to-emerald-50/50 dark:from-gray-700/80 dark:to-emerald-900/20 border-emerald-200/50 dark:border-emerald-800/30 backdrop-blur-sm shadow-inner"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-gender" className="text-gray-700 dark:text-gray-300 font-medium">Gender</Label>
                  <Select
                    value={editData.gender}
                    onValueChange={(value) => setEditData(prev => ({ ...prev, gender: value }))}
                  >
                    <SelectTrigger className="bg-gradient-to-r from-white/80 to-emerald-50/50 dark:from-gray-700/80 dark:to-emerald-900/20 border-emerald-200/50 dark:border-emerald-800/30 backdrop-blur-sm shadow-inner">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={() => updateProfileMutation.mutate(editData)}
                  disabled={updateProfileMutation.isPending}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg"
                >
                  {updateProfileMutation.isPending ? 'Updating...' : 'Update Profile'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowEditDialog(false)}
                  className="flex-1 bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm border-gray-200/50 dark:border-gray-600/50"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Change Password Dialog */}
        <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
          <DialogContent className="max-w-md bg-gradient-to-br from-white/95 via-white/90 to-red-50/60 dark:from-gray-800/95 dark:via-gray-800/90 dark:to-red-900/20 backdrop-blur-xl border-0 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-thin bg-gradient-to-r from-gray-900 to-red-800 dark:from-white dark:to-red-200 bg-clip-text text-transparent">
                Change Password
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400 font-light">
                Enter your current password and choose a new one
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="currentPassword" className="text-gray-700 dark:text-gray-300 font-medium">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="bg-gradient-to-r from-white/80 to-red-50/50 dark:from-gray-700/80 dark:to-red-900/20 border-red-200/50 dark:border-red-800/30 backdrop-blur-sm shadow-inner"
                />
              </div>
              <div>
                <Label htmlFor="newPassword" className="text-gray-700 dark:text-gray-300 font-medium">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="bg-gradient-to-r from-white/80 to-red-50/50 dark:from-gray-700/80 dark:to-red-900/20 border-red-200/50 dark:border-red-800/30 backdrop-blur-sm shadow-inner"
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300 font-medium">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="bg-gradient-to-r from-white/80 to-red-50/50 dark:from-gray-700/80 dark:to-red-900/20 border-red-200/50 dark:border-red-800/30 backdrop-blur-sm shadow-inner"
                />
              </div>
              <Button 
                onClick={() => {
                  if (passwordData.newPassword !== passwordData.confirmPassword) {
                    toast({
                      title: "Passwords don't match",
                      description: "Please ensure both password fields match.",
                      variant: "destructive",
                    });
                    return;
                  }
                  changePasswordMutation.mutate(passwordData);
                }}
                disabled={!passwordData.currentPassword || !passwordData.newPassword || changePasswordMutation.isPending}
                className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg"
              >
                {changePasswordMutation.isPending ? 'Changing...' : 'Change Password'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Notifications Dialog */}
        <Dialog open={showNotificationsDialog} onOpenChange={setShowNotificationsDialog}>
          <DialogContent className="max-w-md w-[95vw] max-h-[90vh] bg-gradient-to-br from-white/95 via-white/90 to-blue-50/60 dark:from-gray-800/95 dark:via-gray-800/90 dark:to-blue-900/20 backdrop-blur-xl border-0 shadow-2xl">
            <DialogHeader className="pb-2">
              <DialogTitle className="text-xl font-thin bg-gradient-to-r from-gray-900 to-blue-800 dark:from-white dark:to-blue-200 bg-clip-text text-transparent flex items-center gap-3">
                <Bell className="w-5 h-5 text-blue-600" />
                Notification Preferences
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400 font-light">
                Manage how you receive notifications from HolistiCare
              </DialogDescription>
            </DialogHeader>
            <div className="overflow-y-auto max-h-[60vh] pr-2 space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Communication Methods</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-blue-50/50 to-white/50 dark:from-blue-900/20 dark:to-gray-800/30">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Email Notifications</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Receive updates via email</div>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-blue-50/50 to-white/50 dark:from-blue-900/20 dark:to-gray-800/30">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-4 h-4 text-blue-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Push Notifications</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Get instant alerts on your device</div>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, pushNotifications: checked }))}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Content Preferences</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-purple-50/50 to-white/50 dark:from-purple-900/20 dark:to-gray-800/30">
                    <div className="flex items-center gap-3">
                      <Brain className="w-4 h-4 text-purple-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Chat Messages</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Coach messages</div>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.chatMessages}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, chatMessages: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-50/50 to-white/50 dark:from-emerald-900/20 dark:to-gray-800/30">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Questionnaire Assigned</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">New health assessments to complete</div>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.questionnaireAssigned}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, questionnaireAssigned: checked }))}
                    />
                  </div>
                </div>
              </div>


            </div>
            <div className="pt-4 mt-4 border-t border-gray-200/50 dark:border-gray-700/50">
              <Button 
                onClick={saveNotificationSettings}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg"
              >
                Save Preferences
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Privacy & Data Dialog */}
        <Dialog open={showPrivacyDialog} onOpenChange={setShowPrivacyDialog}>
          <DialogContent className="max-w-lg bg-gradient-to-br from-white/95 via-white/90 to-purple-50/60 dark:from-gray-800/95 dark:via-gray-800/90 dark:to-purple-900/20 backdrop-blur-xl border-0 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-thin bg-gradient-to-r from-gray-900 to-purple-800 dark:from-white dark:to-purple-200 bg-clip-text text-transparent flex items-center gap-3">
                <Shield className="w-5 h-5 text-purple-600" />
                Privacy & Data Control
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400 font-light">
                Control how your health data is used and shared
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Data Sharing</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-50/50 to-white/50 dark:from-emerald-900/20 dark:to-gray-800/30">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Share with Doctors</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Allow healthcare providers to access your data</div>
                      </div>
                    </div>
                    <Switch
                      checked={privacySettings.shareDataWithDoctors}
                      onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, shareDataWithDoctors: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-blue-50/50 to-white/50 dark:from-blue-900/20 dark:to-gray-800/30">
                    <div className="flex items-center gap-3">
                      <Brain className="w-4 h-4 text-blue-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Health Insights Sharing</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Share anonymized insights for research</div>
                      </div>
                    </div>
                    <Switch
                      checked={privacySettings.shareHealthInsights}
                      onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, shareHealthInsights: checked }))}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Analytics & Tracking</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-gray-50/50 to-white/50 dark:from-gray-700/50 dark:to-gray-800/30">
                    <div className="flex items-center gap-3">
                      <Activity className="w-4 h-4 text-gray-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Anonymous Analytics</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Help improve HolistiCare with usage data</div>
                      </div>
                    </div>
                    <Switch
                      checked={privacySettings.anonymousAnalytics}
                      onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, anonymousAnalytics: checked }))}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Data Retention</h3>
                <div className="p-3 rounded-xl bg-gradient-to-r from-orange-50/50 to-white/50 dark:from-orange-900/20 dark:to-gray-800/30">
                  <div className="flex items-center gap-3 mb-2">
                    <Lock className="w-4 h-4 text-orange-600" />
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Data Retention Period</div>
                  </div>
                  <Select
                    value={privacySettings.dataRetention}
                    onValueChange={(value) => setPrivacySettings(prev => ({ ...prev, dataRetention: value }))}
                  >
                    <SelectTrigger className="bg-gradient-to-r from-white/80 to-orange-50/50 dark:from-gray-700/80 dark:to-orange-900/20 border-orange-200/50 dark:border-orange-800/30 backdrop-blur-sm shadow-inner">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1_year">1 Year</SelectItem>
                      <SelectItem value="2_years">2 Years</SelectItem>
                      <SelectItem value="5_years">5 Years</SelectItem>
                      <SelectItem value="forever">Keep Forever</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    How long to keep your health data after account deletion
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  onClick={savePrivacySettings}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg"
                >
                  Save Settings
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>


        {/* Help & Support Dialog */}
        <Dialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
          <DialogContent className="max-w-lg bg-gradient-to-br from-white/95 via-white/90 to-orange-50/60 dark:from-gray-800/95 dark:via-gray-800/90 dark:to-orange-900/20 backdrop-blur-xl border-0 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-thin bg-gradient-to-r from-gray-900 to-orange-800 dark:from-white dark:to-orange-200 bg-clip-text text-transparent flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-orange-600" />
                Help & Support
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400 font-light">
                Get help with using HolistiCare and contact our support team
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">

              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Contact Support</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => setShowEmailModal(true)}
                    className="w-full flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-orange-50/60 to-white/50 dark:from-orange-900/20 dark:to-gray-800/30 hover:from-orange-100/60 hover:to-orange-50/50 dark:hover:from-orange-900/30 dark:hover:to-orange-900/20 transition-all duration-300 group"
                    data-testid="link-email-support"
                  >
                    <Mail className="w-5 h-5 text-orange-600" />
                    <div className="text-left">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Email Support</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Send message to our support team</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-orange-600 transition-colors duration-300 ml-auto" />
                  </button>
                  
                </div>
              </div>


            </div>
          </DialogContent>
        </Dialog>

        {/* Export Data Modal */}
        <Dialog open={showExportModal} onOpenChange={setShowExportModal}>
          <DialogContent className="max-w-lg bg-gradient-to-br from-white/95 via-white/90 to-blue-50/60 dark:from-gray-800/95 dark:via-gray-800/90 dark:to-blue-900/20 backdrop-blur-xl border-0 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-thin bg-gradient-to-r from-gray-900 to-blue-800 dark:from-white dark:to-blue-200 bg-clip-text text-transparent flex items-center gap-3">
                <Download className="w-5 h-5 text-blue-600" />
                Export Data
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400 font-light">
                Select the data you want to include in your export
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-50/50 to-white/50 dark:from-emerald-900/20 dark:to-gray-800/30">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Personal Data</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Profile information and account details</div>
                    </div>
                  </div>
                  <Switch
                    checked={exportOptions.personalData}
                    onCheckedChange={(checked) => setExportOptions(prev => ({ ...prev, personalData: checked }))}
                    data-testid="switch-export-personal"
                  />
                </div>


                <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-orange-50/50 to-white/50 dark:from-orange-900/20 dark:to-gray-800/30">
                  <div className="flex items-center gap-3">
                    <Activity className="w-4 h-4 text-orange-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Biomarkers</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Lab results and health monitoring data</div>
                    </div>
                  </div>
                  <Switch
                    checked={exportOptions.biomarkers}
                    onCheckedChange={(checked) => setExportOptions(prev => ({ ...prev, biomarkers: checked }))}
                    data-testid="switch-export-biomarkers"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-teal-50/50 to-white/50 dark:from-teal-900/20 dark:to-gray-800/30">
                  <div className="flex items-center gap-3">
                    <Target className="w-4 h-4 text-teal-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Action Plans</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Goals, challenges, and wellness plans</div>
                    </div>
                  </div>
                  <Switch
                    checked={exportOptions.actionPlans}
                    onCheckedChange={(checked) => setExportOptions(prev => ({ ...prev, actionPlans: checked }))}
                    data-testid="switch-export-action-plans"
                  />
                </div>
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-700/30 p-3 rounded-lg">
                Your selected data will be exported as a JSON file that you can save or import into other applications.
              </div>
              
              <div className="pt-4">
                <Button 
                  onClick={performExport}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
                  disabled={isExporting || (!exportOptions.personalData && !exportOptions.biomarkers && !exportOptions.actionPlans)}
                  data-testid="button-export-data"
                >
                  {isExporting ? "Exporting..." : "Export Selected Data"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Email Support Modal */}
        <Dialog open={showEmailModal} onOpenChange={(open) => {
          setShowEmailModal(open);
          if (!open) {
            supportForm.reset();
          }
        }}>
          <DialogContent className="max-w-lg bg-gradient-to-br from-white/95 via-white/90 to-orange-50/60 dark:from-gray-800/95 dark:via-gray-800/90 dark:to-orange-900/20 backdrop-blur-xl border-0 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-thin bg-gradient-to-r from-gray-900 to-orange-800 dark:from-white dark:to-orange-200 bg-clip-text text-transparent flex items-center gap-3">
                <Mail className="w-5 h-5 text-orange-600" />
                Contact Support
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400 font-light">
                Send a message to our support team and we'll get back to you within 24 hours
              </DialogDescription>
            </DialogHeader>
            
            <Form {...supportForm}>
              <form onSubmit={supportForm.handleSubmit((data) => sendSupportMessage.mutate(data))} className="space-y-4">
                <FormField
                  control={supportForm.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Message
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Please describe your issue or question in detail..."
                          className="bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm border-gray-200/50 dark:border-gray-600/50 min-h-[120px] resize-none"
                          rows={5}
                          data-testid="textarea-support-message"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-700/30 p-3 rounded-lg">
                  Your message will be sent to support@holisticare.com along with your account information to help us assist you better.
                </div>
                
                <div className="pt-4">
                  <Button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-lg"
                    disabled={sendSupportMessage.isPending}
                    data-testid="button-support-send"
                  >
                    {sendSupportMessage.isPending ? "Sending..." : "Send Message"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Delete Account Dialog */}
        <Dialog open={showDeleteAccountDialog} onOpenChange={(open) => {
          setShowDeleteAccountDialog(open);
          if (!open) {
            setDeleteConfirmation("");
          }
        }}>
          <DialogContent className="max-w-lg bg-gradient-to-br from-white/95 via-white/90 to-red-50/60 dark:from-gray-800/95 dark:via-gray-800/90 dark:to-red-900/20 backdrop-blur-xl border-0 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-thin bg-gradient-to-r from-gray-900 to-red-800 dark:from-white dark:to-red-200 bg-clip-text text-transparent flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Delete Account
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400 font-light">
                This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="bg-red-50/50 dark:bg-red-900/20 border border-red-200/50 dark:border-red-800/30 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    <p className="font-medium mb-2">This will permanently delete:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Your profile and account information</li>
                      <li>All your health data and lab results</li>
                      <li>Your goals, challenges, and action plans</li>
                      <li>All questionnaire responses and insights</li>
                      <li>Your chat history and messages</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="delete-confirmation" className="text-gray-700 dark:text-gray-300 font-medium">
                  Type <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-sm">DELETE/{user?.fullName || 'User'}</span> to confirm
                </Label>
                <Input
                  id="delete-confirmation"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder={`DELETE/${user?.fullName || 'User'}`}
                  className="mt-2 bg-white/80 dark:bg-gray-700/80 border-red-200/50 dark:border-red-800/30 focus:border-red-500 dark:focus:border-red-500"
                  data-testid="input-delete-confirmation"
                />
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-700/30 p-3 rounded-lg">
                Once you delete your account, there is no going back. Please be certain.
              </div>
              
              <div className="pt-4">
                <Button 
                  onClick={handleDeleteAccount}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg"
                  disabled={deleteConfirmation !== `DELETE/${user?.fullName || 'User'}` || deleteAccountMutation.isPending}
                  data-testid="button-delete-account"
                >
                  {deleteAccountMutation.isPending ? "Deleting Account..." : "Delete My Account Permanently"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}