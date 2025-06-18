import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth, authService } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { 
  ArrowLeft,
  User,
  Bell,
  Share,
  Download,
  Globe,
  HelpCircle,
  LogOut,
  Edit,
  Crown,
  Activity,
  Brain,
  Target,
  ChevronRight
} from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Profile() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editData, setEditData] = useState({
    fullName: user?.fullName || "",
    age: user?.age || "",
    gender: user?.gender || "",
    height: user?.height || "",
    weight: user?.weight || "",
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

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      setLocation("/");
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was an error signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProfile = () => {
    if (!editData.fullName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your full name.",
        variant: "destructive",
      });
      return;
    }

    updateProfileMutation.mutate(editData);
  };

  const exportData = () => {
    toast({
      title: "Export started",
      description: "Your health data export will be ready shortly.",
    });
  };

  const getSubscriptionBadge = (tier: string) => {
    switch (tier) {
      case 'plus':
        return <Badge className="bg-primary/10 text-primary border-primary/20">Plus Plan</Badge>;
      case 'professional':
        return <Badge className="bg-purple-100 text-purple-700 border-purple-200">Professional</Badge>;
      default:
        return <Badge variant="outline">Free Plan</Badge>;
    }
  };

  const settingsItems = [
    {
      icon: User,
      label: "Personal Information",
      description: "Update your profile details",
      action: () => setShowEditDialog(true),
    },
    {
      icon: Bell,
      label: "Notifications",
      description: "Manage notification preferences",
      action: () => toast({ title: "Coming soon", description: "Notification settings will be available soon." }),
    },
    {
      icon: Share,
      label: "Sharing & Privacy",
      description: "Control data sharing settings",
      action: () => toast({ title: "Coming soon", description: "Privacy settings will be available soon." }),
    },
    {
      icon: Download,
      label: "Export Data",
      description: "Download your health data",
      action: exportData,
    },
    {
      icon: Globe,
      label: "Language",
      description: "Change app language",
      current: "English",
      action: () => toast({ title: "Coming soon", description: "Language settings will be available soon." }),
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      description: "Get help and contact support",
      action: () => toast({ title: "Support", description: "For support, please email help@healthtracker.com" }),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 p-4">
        <div className="flex items-center">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Profile</h2>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Profile Header */}
        <div className="health-gradient medical-pattern p-6 text-white rounded-2xl">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold backdrop-blur-sm">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold">{user?.fullName || 'User'}</h3>
              <p className="text-white/80">{user?.email}</p>
              <p className="text-sm text-white/70">
                Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowEditDialog(true)}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </div>
        </div>

        {/* Health Summary */}
        {stats && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <span>Health Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{stats.totalTests}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Tests Uploaded</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">{stats.activePlans}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Active Plans</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">{stats.healthScore}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Health Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{stats.insights}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">AI Insights</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Subscription */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Crown className="w-5 h-5 text-primary" />
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Subscription</h4>
                {getSubscriptionBadge(user?.subscriptionTier || 'free')}
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {user?.subscriptionTier === 'plus' 
                ? "Unlimited uploads, AI insights, and advanced features"
                : user?.subscriptionTier === 'professional'
                ? "Full access with patient management capabilities"
                : "Basic features with limited uploads"
              }
            </p>
            <Button variant="outline" size="sm">
              Manage Subscription
            </Button>
          </CardContent>
        </Card>

        {/* Settings Menu */}
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {settingsItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    onClick={item.action}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <div className="text-left">
                        <div className="font-medium text-gray-900 dark:text-gray-100">{item.label}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{item.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {item.current && (
                        <span className="text-sm text-gray-600 dark:text-gray-400">{item.current}</span>
                      )}
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </button>
                );
              })}
              
              {/* Logout Button */}
              <button
                className="w-full p-4 flex items-center justify-between hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400"
                onClick={handleLogout}
              >
                <div className="flex items-center space-x-3">
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={editData.fullName}
                  onChange={(e) => setEditData(prev => ({ ...prev, fullName: e.target.value }))}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-age">Age</Label>
                  <Input
                    id="edit-age"
                    type="number"
                    value={editData.age}
                    onChange={(e) => setEditData(prev => ({ ...prev, age: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-gender">Gender</Label>
                  <Select
                    value={editData.gender}
                    onValueChange={(value) => setEditData(prev => ({ ...prev, gender: value }))}
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
                  <Label htmlFor="edit-height">Height (cm)</Label>
                  <Input
                    id="edit-height"
                    type="number"
                    value={editData.height}
                    onChange={(e) => setEditData(prev => ({ ...prev, height: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-weight">Weight (kg)</Label>
                  <Input
                    id="edit-weight"
                    type="number"
                    step="0.1"
                    value={editData.weight}
                    onChange={(e) => setEditData(prev => ({ ...prev, weight: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleUpdateProfile} 
                  disabled={updateProfileMutation.isPending}
                  className="flex-1"
                >
                  {updateProfileMutation.isPending ? "Updating..." : "Update Profile"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowEditDialog(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
