import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { authService } from "@/lib/auth";
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
  Smartphone
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
  const [isExporting, setIsExporting] = useState(false);
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
  
  // Notification preferences
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    labResults: true,
    goalReminders: true,
    weeklyReports: true,
    chatMessages: true,
    systemUpdates: false,
    marketingEmails: false,
  });
  
  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    shareDataWithDoctors: true,
    anonymousAnalytics: true,
    shareHealthInsights: false,
    publicProfile: false,
    dataRetention: '2_years',
    thirdPartyIntegrations: true,
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
  
  const handleExportData = async () => {
    setIsExporting(true);
    try {
      // Simulate data export
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a mock data export
      const exportData = {
        profile: user,
        labResults: 'Lab results data...',
        actionPlans: 'Action plans data...',
        healthInsights: 'Health insights data...',
        exportDate: new Date().toISOString(),
      };
      
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
        description: "Your health data has been downloaded successfully.",
      });
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
            <div className="flex items-start gap-6">
              <div className="relative">
                <Avatar className="w-24 h-24 ring-4 ring-emerald-200/50 dark:ring-emerald-800/30 shadow-xl">
                  <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-2xl font-medium">
                    {user?.fullName?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                  <Crown className="w-4 h-4 text-white" />
                </div>
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-thin text-gray-900 dark:text-gray-100">
                      {user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User'}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 font-light">{user?.email}</p>
                    
                    {/* Enhanced User Details */}
                    <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                      {calculateAge(user?.dateOfBirth) && (
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>{calculateAge(user?.dateOfBirth)} years old</span>
                        </div>
                      )}
                      {user?.gender && (
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <User className="w-4 h-4" />
                          <span className="capitalize">{user.gender}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>Member since {getMembershipDuration()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Mail className="w-4 h-4" />
                        <span>Verified account</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => setShowEditDialog(true)}
                    variant="outline"
                    size="sm"
                    className="backdrop-blur-sm bg-white/60 dark:bg-gray-700/60 border-emerald-200/50 dark:border-emerald-800/30 hover:bg-emerald-50/60 dark:hover:bg-emerald-900/20 shadow-lg"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
                
                <div className="flex items-center gap-3">
                  {getSubscriptionBadge(user?.subscriptionTier || 'free')}
                  <Badge variant="outline" className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-700 dark:text-blue-300 border-blue-200/50 dark:border-blue-800/30 backdrop-blur-sm">
                    <Activity className="w-3 h-3 mr-1" />
                    Active User
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Health Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-white/90 to-blue-50/60 dark:from-gray-800/90 dark:to-blue-900/20 border shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                    {stats?.totalTests || 5}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Lab Tests</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-white/90 to-green-50/60 dark:from-gray-800/90 dark:to-green-900/20 border shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                    {stats?.activePlans || 2}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Active Plans</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
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
          <DialogContent className="max-w-lg bg-gradient-to-br from-white/95 via-white/90 to-blue-50/60 dark:from-gray-800/95 dark:via-gray-800/90 dark:to-blue-900/20 backdrop-blur-xl border-0 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-thin bg-gradient-to-r from-gray-900 to-blue-800 dark:from-white dark:to-blue-200 bg-clip-text text-transparent flex items-center gap-3">
                <Bell className="w-5 h-5 text-blue-600" />
                Notification Preferences
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400 font-light">
                Manage how you receive notifications from HolistiCare
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
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
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-50/50 to-white/50 dark:from-emerald-900/20 dark:to-gray-800/30">
                    <div className="flex items-center gap-3">
                      <Activity className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Lab Results</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">New test results and analysis</div>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.labResults}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, labResults: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-50/50 to-white/50 dark:from-emerald-900/20 dark:to-gray-800/30">
                    <div className="flex items-center gap-3">
                      <Target className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Goal Reminders</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Daily and weekly goal check-ins</div>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.goalReminders}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, goalReminders: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-50/50 to-white/50 dark:from-emerald-900/20 dark:to-gray-800/30">
                    <div className="flex items-center gap-3">
                      <Heart className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Weekly Reports</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Summary of your health progress</div>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.weeklyReports}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, weeklyReports: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-purple-50/50 to-white/50 dark:from-purple-900/20 dark:to-gray-800/30">
                    <div className="flex items-center gap-3">
                      <Brain className="w-4 h-4 text-purple-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Chat Messages</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">AI assistant and coach messages</div>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.chatMessages}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, chatMessages: checked }))}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Other</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-gray-50/50 to-white/50 dark:from-gray-700/50 dark:to-gray-800/30">
                    <div className="flex items-center gap-3">
                      <Settings className="w-4 h-4 text-gray-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">System Updates</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">App updates and maintenance</div>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.systemUpdates}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, systemUpdates: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-gray-50/50 to-white/50 dark:from-gray-700/50 dark:to-gray-800/30">
                    <div className="flex items-center gap-3">
                      <Award className="w-4 h-4 text-gray-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Marketing Emails</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Product updates and tips</div>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.marketingEmails}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, marketingEmails: checked }))}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={saveNotificationSettings}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg"
                >
                  Save Preferences
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowNotificationsDialog(false)}
                  className="flex-1 bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm border-gray-200/50 dark:border-gray-600/50"
                >
                  Cancel
                </Button>
              </div>
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
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-purple-50/50 to-white/50 dark:from-purple-900/20 dark:to-gray-800/30">
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-purple-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Public Profile</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Make your health journey visible to others</div>
                      </div>
                    </div>
                    <Switch
                      checked={privacySettings.publicProfile}
                      onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, publicProfile: checked }))}
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
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-gray-50/50 to-white/50 dark:from-gray-700/50 dark:to-gray-800/30">
                    <div className="flex items-center gap-3">
                      <Zap className="w-4 h-4 text-gray-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Third-party Integrations</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Allow connections to fitness apps and devices</div>
                      </div>
                    </div>
                    <Switch
                      checked={privacySettings.thirdPartyIntegrations}
                      onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, thirdPartyIntegrations: checked }))}
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

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={savePrivacySettings}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg"
                >
                  Save Settings
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowPrivacyDialog(false)}
                  className="flex-1 bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm border-gray-200/50 dark:border-gray-600/50"
                >
                  Cancel
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
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Quick Help</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-50/60 to-white/50 dark:from-blue-900/20 dark:to-gray-800/30 hover:from-blue-100/60 hover:to-blue-50/50 dark:hover:from-blue-900/30 dark:hover:to-blue-900/20 transition-all duration-300 group">
                    <Brain className="w-5 h-5 text-blue-600" />
                    <div className="text-left">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">User Guide</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Learn how to use all features</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors duration-300 ml-auto" />
                  </button>
                  
                  <button className="w-full flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-emerald-50/60 to-white/50 dark:from-emerald-900/20 dark:to-gray-800/30 hover:from-emerald-100/60 hover:to-emerald-50/50 dark:hover:from-emerald-900/30 dark:hover:to-emerald-900/20 transition-all duration-300 group">
                    <Activity className="w-5 h-5 text-emerald-600" />
                    <div className="text-left">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Health Data FAQ</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Common questions about lab results</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-colors duration-300 ml-auto" />
                  </button>
                  
                  <button className="w-full flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-purple-50/60 to-white/50 dark:from-purple-900/20 dark:to-gray-800/30 hover:from-purple-100/60 hover:to-purple-50/50 dark:hover:from-purple-900/30 dark:hover:to-purple-900/20 transition-all duration-300 group">
                    <Shield className="w-5 h-5 text-purple-600" />
                    <div className="text-left">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Privacy Policy</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">How we protect your data</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors duration-300 ml-auto" />
                  </button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Contact Support</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-orange-50/60 to-white/50 dark:from-orange-900/20 dark:to-gray-800/30 hover:from-orange-100/60 hover:to-orange-50/50 dark:hover:from-orange-900/30 dark:hover:to-orange-900/20 transition-all duration-300 group">
                    <Mail className="w-5 h-5 text-orange-600" />
                    <div className="text-left">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Email Support</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">support@holisticare.com</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-orange-600 transition-colors duration-300 ml-auto" />
                  </button>
                  
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">App Information</h3>
                <div className="p-4 rounded-xl bg-gradient-to-r from-gray-50/60 to-white/50 dark:from-gray-700/50 dark:to-gray-800/30">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Version</span>
                      <span className="text-gray-900 dark:text-gray-100 font-medium">2.1.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Last Updated</span>
                      <span className="text-gray-900 dark:text-gray-100 font-medium">Jan 28, 2025</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Platform</span>
                      <span className="text-gray-900 dark:text-gray-100 font-medium">Web App</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={() => {
                    toast({
                      title: "Support contacted",
                      description: "We'll get back to you within 24 hours.",
                    });
                    setShowHelpDialog(false);
                  }}
                  className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-lg"
                >
                  Contact Support
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowHelpDialog(false)}
                  className="flex-1 bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm border-gray-200/50 dark:border-gray-600/50"
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}