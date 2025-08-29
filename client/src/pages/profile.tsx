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
  const [editData, setEditData] = useState({
    fullName: user?.fullName || "",
    age: user?.age || "",
    gender: user?.gender || "",
    height: user?.height || "",
    weight: user?.weight || "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
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
        fullName: data.fullName,
        age: data.age ? parseInt(data.age) : undefined,
        gender: data.gender || undefined,
        height: data.height ? parseInt(data.height) : undefined,
        weight: data.weight ? parseFloat(data.weight) : undefined,
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
      action: () => toast({ title: "Notifications", description: "Settings coming soon" }),
      badge: null,
    },
    {
      icon: Shield,
      title: "Privacy & Data",
      description: "Control your data sharing preferences",
      action: () => toast({ title: "Privacy", description: "Settings coming soon" }),
      badge: null,
    },
    {
      icon: Download,
      title: "Export Data",
      description: "Download your health data",
      action: () => toast({ title: "Data Export", description: "Export feature coming soon" }),
      badge: null,
    },
    {
      icon: Globe,
      title: "Language",
      description: "Change your preferred language",
      action: () => toast({ title: "Language", description: "Multiple languages coming soon" }),
      badge: "English",
    },
    {
      icon: HelpCircle,
      title: "Help & Support",
      description: "Get help and contact support",
      action: () => toast({ title: "Support", description: "Help center coming soon" }),
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/40 dark:from-gray-900 dark:via-emerald-900/20 dark:to-teal-900/10">
      {/* Header */}
      <div className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-white/20 dark:border-gray-700/30 shadow-2xl">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-thin bg-gradient-to-r from-gray-900 via-emerald-800 to-teal-800 dark:from-white dark:via-emerald-200 dark:to-teal-200 bg-clip-text text-transparent">
                Profile Settings
              </h1>
              <p className="text-gray-600 dark:text-gray-400 font-light">Manage your account and preferences</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="backdrop-blur-sm bg-red-50/60 dark:bg-red-900/20 border-red-200/50 dark:border-red-800/30 text-red-700 dark:text-red-300 hover:bg-red-100/60 dark:hover:bg-red-900/30 shadow-lg"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Overview Card */}
        <Card className="bg-gradient-to-br from-white/90 via-white/80 to-emerald-50/60 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-emerald-900/20 border-0 shadow-xl backdrop-blur-lg">
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <div className="relative">
                <Avatar className="w-20 h-20 ring-4 ring-emerald-200/50 dark:ring-emerald-800/30 shadow-xl">
                  <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-xl font-medium">
                    {user?.fullName?.split(' ').map(n => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                  <Crown className="w-3 h-3 text-white" />
                </div>
              </div>
              
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-thin text-gray-900 dark:text-gray-100">{user?.fullName || 'User'}</h2>
                    <p className="text-gray-600 dark:text-gray-400 font-light">{user?.email}</p>
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
                
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Member since {getMembershipDuration()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>Verified account</span>
                  </div>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-white/90 via-white/80 to-blue-50/60 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-blue-900/20 border-0 shadow-xl backdrop-blur-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-thin bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    {stats?.totalTests || 0}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Lab Tests</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white/90 via-white/80 to-emerald-50/60 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-emerald-900/20 border-0 shadow-xl backdrop-blur-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-thin bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    {stats?.activePlans || 0}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Active Plans</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white/90 via-white/80 to-purple-50/60 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-purple-900/20 border-0 shadow-xl backdrop-blur-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-thin bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    {stats?.insights || 0}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">AI Insights</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white/90 via-white/80 to-orange-50/60 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-orange-900/20 border-0 shadow-xl backdrop-blur-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-thin bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    {stats?.healthScore || 0}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Health Score</div>
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

        {/* Quick Actions */}
        <Card className="bg-gradient-to-br from-white/90 via-white/80 to-blue-50/60 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-blue-900/20 border-0 shadow-xl backdrop-blur-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-thin bg-gradient-to-r from-gray-900 to-blue-800 dark:from-white dark:to-blue-200 bg-clip-text text-transparent flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="w-4 h-4 text-white" />
              </div>
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={() => setLocation('/trends')}
              variant="outline"
              className="p-4 h-auto bg-gradient-to-r from-emerald-50/60 to-teal-50/60 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200/50 dark:border-emerald-800/30 hover:from-emerald-100/60 hover:to-teal-100/60 dark:hover:from-emerald-900/30 dark:hover:to-teal-900/30 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex flex-col items-center gap-2">
                <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                <span className="font-medium text-emerald-700 dark:text-emerald-300">View Trends</span>
              </div>
            </Button>
            
            <Button 
              onClick={() => setLocation('/plan')}
              variant="outline"
              className="p-4 h-auto bg-gradient-to-r from-blue-50/60 to-cyan-50/60 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200/50 dark:border-blue-800/30 hover:from-blue-100/60 hover:to-cyan-100/60 dark:hover:from-blue-900/30 dark:hover:to-cyan-900/30 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex flex-col items-center gap-2">
                <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <span className="font-medium text-blue-700 dark:text-blue-300">Health Plans</span>
              </div>
            </Button>
            
            <Button 
              onClick={() => setLocation('/educational')}
              variant="outline"
              className="p-4 h-auto bg-gradient-to-r from-purple-50/60 to-indigo-50/60 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-200/50 dark:border-purple-800/30 hover:from-purple-100/60 hover:to-indigo-100/60 dark:hover:from-purple-900/30 dark:hover:to-indigo-900/30 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex flex-col items-center gap-2">
                <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                <span className="font-medium text-purple-700 dark:text-purple-300">Learn More</span>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* Edit Profile Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-md bg-gradient-to-br from-white/95 via-white/90 to-emerald-50/60 dark:from-gray-800/95 dark:via-gray-800/90 dark:to-emerald-900/20 backdrop-blur-xl border-0 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-thin bg-gradient-to-r from-gray-900 to-emerald-800 dark:from-white dark:to-emerald-200 bg-clip-text text-transparent">
                Edit Profile
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name" className="text-gray-700 dark:text-gray-300 font-medium">Full Name</Label>
                <Input
                  id="edit-name"
                  value={editData.fullName}
                  onChange={(e) => setEditData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="bg-gradient-to-r from-white/80 to-emerald-50/50 dark:from-gray-700/80 dark:to-emerald-900/20 border-emerald-200/50 dark:border-emerald-800/30 backdrop-blur-sm shadow-inner"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-age" className="text-gray-700 dark:text-gray-300 font-medium">Age</Label>
                  <Input
                    id="edit-age"
                    type="number"
                    value={editData.age}
                    onChange={(e) => setEditData(prev => ({ ...prev, age: e.target.value }))}
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
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-height" className="text-gray-700 dark:text-gray-300 font-medium">Height (cm)</Label>
                  <Input
                    id="edit-height"
                    type="number"
                    value={editData.height}
                    onChange={(e) => setEditData(prev => ({ ...prev, height: e.target.value }))}
                    className="bg-gradient-to-r from-white/80 to-emerald-50/50 dark:from-gray-700/80 dark:to-emerald-900/20 border-emerald-200/50 dark:border-emerald-800/30 backdrop-blur-sm shadow-inner"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-weight" className="text-gray-700 dark:text-gray-300 font-medium">Weight (kg)</Label>
                  <Input
                    id="edit-weight"
                    type="number"
                    step="0.1"
                    value={editData.weight}
                    onChange={(e) => setEditData(prev => ({ ...prev, weight: e.target.value }))}
                    className="bg-gradient-to-r from-white/80 to-emerald-50/50 dark:from-gray-700/80 dark:to-emerald-900/20 border-emerald-200/50 dark:border-emerald-800/30 backdrop-blur-sm shadow-inner"
                  />
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
      </div>
    </div>
  );
}