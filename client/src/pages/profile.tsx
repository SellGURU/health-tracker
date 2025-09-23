import Application from "@/api/app";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { RookConfig, RookHealthConnect, RookPermissions, RookSummaries } from "capacitor-rook-sdk";
import {
  Activity,
  Award,
  Bell,
  Brain,
  ChevronRight,
  Crown,
  Download,
  Eye,
  EyeOff,
  Globe,
  Heart,
  HelpCircle,
  Lock,
  Mail,
  Settings,
  Shield,
  Smartphone,
  Target,
  User,
  Watch,
  Bluetooth,
  Wifi,
  Plus,
  Trash2,
  ClipboardList,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function Profile() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [clientInformation, setClientInformation] = useState<{
    action_plan: number;
    age: number;
    active_client:boolean;
    plan?:string;
    coach_username: [];
    connected_wearable: boolean;
    date_of_birth: string;
    email: string;
    id: string;
    lab_test: number;
    member_since: string;
    name: string;
    pheno_age: number;
    sex: string;
    verified_account: boolean;
    // plan:string
  }>();

  const handleGetClientInformation = async () => {
    Application.getClientInformation()
      .then((res) => {
        setClientInformation(res.data);
      })
      .catch((res) => {
        toast({
          title: "Error",
          description: res.response.data.detail,
          variant: "destructive",
        });
      });
  };
  useEffect(() => {
    handleGetClientInformation();
  }, []);

  const [showDevicesModal, setShowDevicesModal] = useState(false);
  // useEffect(() => {
  //   if (showDevicesModal) {
  //     // fetchDevicesData();
  //     // connectSdk();
  //   }
  // }, [showDevicesModal]);

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showNotificationsDialog, setShowNotificationsDialog] = useState(false);
  const [showPrivacyDialog, setShowPrivacyDialog] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [devicesData, setDevicesData] = useState<any>(true);
  const [isLoadingDevices, setIsLoadingDevices] = useState(false);
  const [isConnecting, setIsConnecting] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [editData, setEditData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
  });
  
  useEffect(() => {
    setEditData({
      firstName: clientInformation?.name?.split(" ")[0] || "",
      lastName: clientInformation?.name?.split(" ")[1] || "",
      dateOfBirth: clientInformation?.date_of_birth || "",
      gender: clientInformation?.sex || "",
    });
  }, [clientInformation]);

  // Restore connection state from localStorage on component mount
  useEffect(() => {
    const savedConnectionState = localStorage.getItem('health_device_connection_state');
    if (savedConnectionState) {
      setIsConnecting(savedConnectionState as 'disconnected' | 'connecting' | 'connected');
    }
  }, []);

  // Save connection state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('health_device_connection_state', isConnecting);
  }, [isConnecting]);

  // Function to clear connection state (for testing or manual reset)
  const clearConnectionState = () => {
    setIsConnecting('disconnected');
    localStorage.removeItem('health_device_connection_state');
    toast({
      title: "Connection Reset",
      description: "Device connection state has been cleared.",
    });
  };
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Notification preferences
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    labResults: true,
    goalReminders: true,
    weeklyReports: true,
    chatMessages: true,
    questionnaire_assigned: false,
    systemUpdates: false,
    marketingEmails: false,
  });

  // Load notification settings when dialog opens
  const loadNotificationSettings = async () => {
    try {
      const res = await Application.showNotifications({});
      const data = res?.data || {};
      const channels = data.channels || {};
      const content = data.content_types || {};
      setNotificationSettings((prev) => ({
        ...prev,
        emailNotifications: Boolean(channels.email),
        pushNotifications: Boolean(channels.push),
        chatMessages: Boolean(content.chat_messages),
        questionnaire_assigned: Boolean(content.questionnaire_assigned),
        // Map available content types to existing toggles if present
        // labResults: Boolean(content.lab_results ?? prev.labResults),
        // goalReminders: Boolean(content.goal_reminders ?? prev.goalReminders),
        // weeklyReports: Boolean(content.weekly_reports ?? prev.weeklyReports),
        // systemUpdates: Boolean(content.system_updates ?? prev.systemUpdates),
        // marketingEmails: Boolean(content.marketing_emails ?? prev.marketingEmails),
      }));
    } catch (error: any) {
      toast({
        title: "Failed to load notification settings",
        description:
          error?.response?.data?.detail ||
          (error instanceof Error ? error.message : "Please try again."),
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (showNotificationsDialog) {
      loadNotificationSettings();
    }
  }, [showNotificationsDialog]);

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    shareDataWithDoctors: true,
    anonymousAnalytics: true,
    shareHealthInsights: false,
    publicProfile: false,
    dataRetention: "2_years",
    thirdPartyIntegrations: true,
  });

  // Load privacy settings from API when dialog opens
  const loadPrivacySettings = async () => {
    try {
      const res = await Application.showPrivacy({});
      const data = res?.data || {};
      setPrivacySettings((prev) => ({
        ...prev,
        shareDataWithDoctors: Boolean(data.share_with_doctors),
        shareHealthInsights: Boolean(data.health_insights_sharing),
        anonymousAnalytics: Boolean(data.anonymous_analytics),
        dataRetention: data.data_retention_period || prev.dataRetention,
      }));
    } catch (error: any) {
      toast({
        title: "Failed to load privacy settings",
        description:
          error?.response?.data?.detail ||
          (error instanceof Error ? error.message : "Please try again."),
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (showPrivacyDialog) {
      loadPrivacySettings();
    }
  }, [showPrivacyDialog]);

  // Device settings with ROOK integration
  const [connectedDevices, setConnectedDevices] = useState<any[]>([]);

  const [isUpdatingPersonalInfo, setIsUpdatingPersonalInfo] = useState(false);

  const handleUpdatePersonalInfo = async () => {
    setIsUpdatingPersonalInfo(true);
    Application.updatePersonalInfo({
      first_name: editData.firstName,
      last_name: editData.lastName,
      date_of_birth: editData.dateOfBirth,
      gender: editData.gender,
    })
      .then(() => {
        toast({
          title: "Profile updated",
          description:
            "Your profile information has been updated successfully.",
        });
        setShowEditDialog(false);
        // Refresh client information so changes reflect immediately
        handleGetClientInformation();
      })
      .catch((res) => {
        toast({
          title: "Error",
          description: res.response.data.detail,
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsUpdatingPersonalInfo(false);
      });
  };

  const changePasswordMutation = useMutation({
    mutationFn: async (data: typeof passwordData) => {
      const payload = {
        current_password: data.currentPassword,
        new_password: data.newPassword,
        confirm_password: data.confirmPassword,
      };
      const res = await Application.changePassword(payload);
      return res;
    },
    onSuccess: (res: any) => {
      if (res?.status === 200) {
        toast({
          title: "Password changed",
          description: "Your password has been updated successfully.",
        });
        setShowPasswordDialog(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast({
          title: "Password change failed",
          description: res?.data?.detail || "Unexpected server response.",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data?.detail;
      toast({
        title: "Password change failed",
        description:
          serverMessage ||
          (error instanceof Error ? error.message : "Please try again."),
        variant: "destructive",
      });
    },
  });

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      // Simulate data export
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create a mock data export
      const exportData = {
        profile: user,
        labResults: "Lab results data...",
        actionPlans: "Action plans data...",
        healthInsights: "Health insights data...",
        exportDate: new Date().toISOString(),
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `holisticare-data-${
        new Date().toISOString().split("T")[0]
      }.json`;
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

  const saveNotificationSettings = async () => {
    try {
      const payload = {
        channels: {
          email: !!notificationSettings.emailNotifications,
          push: !!notificationSettings.pushNotifications,
        },
        content_types: {
          chat_messages: !!notificationSettings.chatMessages,
          questionnaire_assigned: !!notificationSettings.questionnaire_assigned,
          // lab_results: !!notificationSettings.labResults,
          // goal_reminders: !!notificationSettings.goalReminders,
          // weekly_reports: !!notificationSettings.weeklyReports,
          // system_updates: !!notificationSettings.systemUpdates,
          // marketing_emails: !!notificationSettings.marketingEmails,
        },
      };
      const res = await Application.saveNotifications(payload);
      if (res?.status === 200) {
        toast({
          title: "Notifications updated",
          description: "Your notification preferences have been saved.",
        });
        setShowNotificationsDialog(false);
      } else {
        toast({
          title: "Failed to save notifications",
          description: res?.data?.detail || "Unexpected server response.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Failed to save notifications",
        description:
          error?.response?.data?.detail ||
          (error instanceof Error ? error.message : "Please try again."),
        variant: "destructive",
      });
    }
  };

  const savePrivacySettings = async () => {
    try {
      const payload = {
        share_with_doctors: privacySettings.shareDataWithDoctors,
        health_insights_sharing: privacySettings.shareHealthInsights,
        anonymous_analytics: privacySettings.anonymousAnalytics,
        data_retention_period: privacySettings.dataRetention,
      };
      const res = await Application.savePrivacy(payload);
      if (res?.status === 200) {
        toast({
          title: "Privacy settings updated",
          description: "Your privacy preferences have been saved.",
        });
        setShowPrivacyDialog(false);
      } else {
        toast({
          title: "Failed to save privacy settings",
          description: res?.data?.detail || "Unexpected server response.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Failed to save privacy settings",
        description:
          error?.response?.data?.detail ||
          (error instanceof Error ? error.message : "Please try again."),
        variant: "destructive",
      });
    }
  };
  const fetchDevicesData = async () => {
    if (!clientInformation?.email) {
      toast({
        title: "Error",
        description: "User email not found",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingDevices(true);
    try {
      const response = await fetch(
        `https://api.rook-connect.com/api/v1/client_uuid/c2f4961b-9d3c-4ff0-915e-f70655892b89/user_id/${clientInformation.email}/data_sources/authorizers`,
        {
          method: "GET",
          headers: {
            Authorization:
              "Basic Y2xpZW50X3V1aWQ6UUg4dTE4T2pMb2ZzU1J2bUVEbUdCZ2p2MWZycDNmYXBkYkRB",
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setDevicesData(data);

      toast({
        title: "Success",
        description: "Devices data loaded successfully",
      });

      RookConfig.initRook({
        environment: "production",
        clientUUID: "c2f4961b-9d3c-4ff0-915e-f70655892b89",
        password: "QH8u18OjLofsSRvmEDmGBgjv1frp3fapdbDA",
        enableBackgroundSync: true,
        enableEventsBackgroundSync: true,
      })
        .then(() => {
          console.log("Initialized rook")
          RookPermissions.requestAllHealthConnectPermissions().then((e) => {
            console.log("e", e)
          });
          RookPermissions.requestAndroidPermissions().then((e) => console.log("e2", e));
          RookHealthConnect.scheduleYesterdaySync({
            doOnEnd:"oldest"
          });
        })
        .catch((e: any) => console.log("error", e));
    } catch (error) {
      console.error("Error fetching devices data:", error);
      toast({
        title: "Error",
        description: `Failed to load devices data: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        variant: "destructive",
      });
    } finally {
      setIsLoadingDevices(false);
    }
  };

  const connectSdk = () => {
    setIsConnecting("connecting");

    const initRook = async (userId: string) => {
      try {
        // 1. Init SDK
        await RookConfig.initRook({
          environment: "production", // یا "sandbox" برای تست
          clientUUID: "c2f4961b-9d3c-4ff0-915e-f70655892b89",
          password: "QH8u18OjLofsSRvmEDmGBgjv1frp3fapdbDA",
          enableBackgroundSync: true,
          enableEventsBackgroundSync: true,
        });
        console.log("✅ Initialized Rook SDK");

        // 2. آماده‌سازی User ID
        // let userId = clientInformation?.id // طول مجاز 1 تا 50
        // if (!userId) {
        //   console.error("❌ User ID is missing. Cannot register with Rook.");
        //   setIsConnecting("disconnected");
        //   return;
        // }
        setIsConnecting("connected");
        // 3. ایجاد کاربر (در صورت وجود نداشتن)
        if (RookConfig.updateUserId) {
          await RookConfig.updateUserId({
            userId: userId,
          });
          console.log("✅ User created:", userId);
        }
        // console.log("✅ User created2:", )


        // 5. درخواست مجوزهای Health Connect
        const perms = await RookPermissions.requestAllHealthConnectPermissions();
        console.log("✅ HealthConnect permissions:", perms);

        // 6. درخواست مجوزهای Android
        const androidPerms = await RookPermissions.requestAndroidPermissions();
        console.log("✅ Android permissions:", androidPerms);

        // 7. برنامه‌ریزی همگام‌سازی داده‌های دیروز
        await RookHealthConnect.scheduleYesterdaySync({ doOnEnd: "oldest" });
        console.log("✅ Yesterday sync scheduled");

        setIsConnecting("connected");
      } catch (e) {
        console.error("❌ Error initializing Rook:", e);
        setIsConnecting("disconnected");
      }
    };

    // اجرای initRook یکبار
    if (clientInformation?.id) {
      initRook(clientInformation?.id);
    }
  };


  const handleConnect = async () => {
    // setIsConnecting(true);
    try {
      await connectSdk();
      toast({
        title: "Success",
        description: "Successfully connected to health devices",
      });
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "Failed to connect to health devices. Please try again.",
        variant: "destructive",
      });
    } finally {
      // setIsConnecting(false);
    }
  };
  // Device management functions with ROOK integration

  // Check ROOK connection status

  const settingsItems = [
    // {
    //   icon: User,
    //   title: "Personal Information",
    //   description: "Update your profile details",
    //   action: () => setShowEditDialog(true),
    //   badge: null,
    // },
    {
      icon: Watch,
      title: "Wearable Devices",
      description: "Connect and manage your health devices",
      action: () => setShowDevicesModal(true),
      badge:
        connectedDevices.length > 0 ? connectedDevices.length.toString() : null,
    },
    // {
    //   icon: Bell,
    //   title: "Notifications",
    //   description: "Manage your notification preferences",
    //   action: () => setShowNotificationsDialog(true),
    //   badge: null,
    // },
    // {
    //   icon: Shield,
    //   title: "Privacy & Data",
    //   description: "Control your data sharing preferences",
    //   action: () => setShowPrivacyDialog(true),
    //   badge: null,
    // },
    // {
    //   icon: Download,
    //   title: "Export Data",
    //   description: "Download your health data",
    //   action: () => handleExportData(),
    //   badge: null,
    // },
    // {
    //   icon: HelpCircle,
    //   title: "Help & Support",
    //   description: "Get help and contact support",
    //   action: () => setShowHelpDialog(true),
    //   badge: null,
    // },
    {
      icon: Lock,
      title: "Change Password",
      description: "Update your account password",
      action: () => setShowPasswordDialog(true),
      badge: null,
    },
  ];
  useEffect(() => {
    if (devicesData?.data_sources) {
      devicesData?.data_sources?.forEach((el:any) => {
        if (el.connected) {
          Application.addEvent({
            event_name: el.name,
            event_type: "connected",
          });
        }else{
          Application.disConnectVariable(el.name);
        }
      });
    }
  }, [devicesData?.data_sources]);

  const getSubscriptionBadge = (tier: string) => {
    switch (tier) {
      case "plus":
        return (
          <Badge className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-700 border-emerald-200/50 dark:text-emerald-300 dark:border-emerald-800/30 backdrop-blur-sm">
            Plus Plan
          </Badge>
        );
      
      case "professional":
        return (
          <Badge className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 text-purple-700 border-purple-200/50 dark:text-purple-300 dark:border-purple-800/30 backdrop-blur-sm">
            Professional
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-gradient-to-r from-gray-500/10 capitalize to-slate-500/10 backdrop-blur-sm"
          >
            {tier} Plan
          </Badge>
        );
    }
  };

  const getMembershipDuration = () => {
    // Calculate membership duration
    const joinDate = new Date(clientInformation?.member_since || ""); // Example join date
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - joinDate.getTime());
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    return `${diffMonths} months`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/40 dark:from-gray-900 dark:via-emerald-900/20 dark:to-teal-900/10">
      {/* Header */}
      <div className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-white/20 dark:border-gray-700/30 shadow-2xl">
        <div className="max-w-4xl mx-auto px-3 py-4">
          <div>
            <h1 className="text-xl font-medium bg-gradient-to-r from-gray-900 via-emerald-800 to-teal-800 dark:from-white dark:via-emerald-200 dark:to-teal-200 bg-clip-text text-transparent">
              Profile Settings
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage your account and preferences
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3 py-4 space-y-4">
        {/* Profile Overview Card */}
        <Card className="bg-gradient-to-br from-white/90 via-white/80 to-emerald-50/60 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-emerald-900/20 border-0 shadow-xl backdrop-blur-lg">
          <CardContent className="p-4">
            <div className="flex-1 min-w-0">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {clientInformation?.name || "User"}
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {clientInformation?.email}
                    </p>
                  </div>
                  <div className="relative flex-shrink-0">
                    <Avatar className="w-12 h-12 ring-2 ring-emerald-200/50 dark:ring-emerald-800/30 shadow-lg">
                      <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-sm font-medium">
                        {(
                          clientInformation?.name?.split(" ")[0] || ""
                        ).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                      <Crown className="w-2 h-2 text-white" />
                    </div>
                  </div>
                </div>

                {/* Better spaced info display */}
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Age:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {clientInformation?.age || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Gender:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                      {clientInformation?.sex || "Not specified"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Member Since:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {getMembershipDuration()}
                    </span>
                  </div>
                </div>

                {/* Health stats */}
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Lab Tests:
                    </span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {clientInformation?.lab_test}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Action Plan:
                    </span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {clientInformation?.action_plan}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Account:
                    </span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {clientInformation?.verified_account
                        ? "Verified"
                        : "Unverified"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 pt-1">
                  {getSubscriptionBadge(clientInformation?.plan || "free")}
                  <Badge
                    variant="outline"
                    className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-700 dark:text-blue-300 border-blue-200/50 dark:border-blue-800/30 backdrop-blur-sm text-xs"
                  >
                    <Activity className="w-3 h-3 mr-1" />
                    Active User
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Sections */}
        <div className="flex flex-col gap-4">
          {/* Account Settings */}
          <Card className="bg-gradient-to-br from-white/90 via-white/80 to-gray-50/60 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-gray-900/20 border-0 shadow-xl backdrop-blur-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium bg-gradient-to-r from-gray-900 to-emerald-800 dark:from-white dark:to-emerald-200 bg-clip-text text-transparent flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center shadow-lg">
                  <Settings className="w-3 h-3 text-white" />
                </div>
                Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {settingsItems.slice(0, 5).map((item, index) => (
                <button
                  key={index}
                  onClick={item.action}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-gray-50/50 to-white/50 dark:from-gray-700/50 dark:to-gray-800/30 hover:from-emerald-50/60 hover:to-teal-50/60 dark:hover:from-emerald-900/20 dark:hover:to-teal-900/20 transition-all duration-300 hover:shadow-lg group min-h-[48px]"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 group-hover:from-emerald-500 group-hover:to-teal-500 rounded-lg flex items-center justify-center transition-all duration-300 shadow-sm">
                      <item.icon className="w-4 h-4 text-gray-600 dark:text-gray-300 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                        {item.title}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 font-light">
                        {item.description}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {item.badge && (
                      <Badge
                        variant="outline"
                        className="bg-emerald-100/50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 text-xs"
                      >
                        {item.badge}
                      </Badge>
                    )}
                    <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300" />
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Preferences & Security */}
          <div className="my-4"></div>
          {/* <Card className="bg-gradient-to-br from-white/90 via-white/80 to-gray-50/60 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-gray-900/20 border-0 shadow-xl backdrop-blur-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-thin bg-gradient-to-r from-gray-900 to-purple-800 dark:from-white dark:to-purple-200 bg-clip-text text-transparent flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                Preferences & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {settingsItems.slice(5).map((item, index) => (
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
                      <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                        {item.title}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 font-light">
                        {item.description}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <Badge
                        variant="outline"
                        className="bg-purple-100/50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 text-xs"
                      >
                        {item.badge}
                      </Badge>
                    )}
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300" />
                  </div>
                </button>
              ))}
            </CardContent>
          </Card> */}
        </div>

        {/* Edit Profile Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-sm bg-gradient-to-br from-white/95 via-white/90 to-emerald-50/60 dark:from-gray-800/95 dark:via-gray-800/90 dark:to-emerald-900/20 backdrop-blur-xl border-0 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-medium bg-gradient-to-r from-gray-900 to-emerald-800 dark:from-white dark:to-emerald-200 bg-clip-text text-transparent">
                Edit Profile
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <Label
                    htmlFor="edit-firstname"
                    className="text-gray-700 dark:text-gray-300 font-medium"
                  >
                    First Name
                  </Label>
                  <Input
                    id="edit-firstname"
                    value={editData.firstName || ""}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    className="bg-gradient-to-r from-white/80 to-emerald-50/50 dark:from-gray-700/80 dark:to-emerald-900/20 border-emerald-200/50 dark:border-emerald-800/30 backdrop-blur-sm shadow-inner"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="edit-lastname"
                    className="text-gray-700 dark:text-gray-300 font-medium"
                  >
                    Last Name
                  </Label>
                  <Input
                    id="edit-lastname"
                    value={editData.lastName || ""}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                    className="bg-gradient-to-r from-white/80 to-emerald-50/50 dark:from-gray-700/80 dark:to-emerald-900/20 border-emerald-200/50 dark:border-emerald-800/30 backdrop-blur-sm shadow-inner"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div>
                  <Label
                    htmlFor="edit-birthdate"
                    className="text-gray-700 dark:text-gray-300 font-medium"
                  >
                    Date of Birth
                  </Label>
                  <Input
                    id="edit-birthdate"
                    type="date"
                    value={editData.dateOfBirth || ""}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        dateOfBirth: e.target.value,
                      }))
                    }
                    className="bg-gradient-to-r from-white/80 to-emerald-50/50 dark:from-gray-700/80 dark:to-emerald-900/20 border-emerald-200/50 dark:border-emerald-800/30 backdrop-blur-sm shadow-inner"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="edit-gender"
                    className="text-gray-700 dark:text-gray-300 font-medium"
                  >
                    Gender
                  </Label>
                  <Select
                    value={editData.gender}
                    onValueChange={(value) =>
                      setEditData((prev) => ({ ...prev, gender: value }))
                    }
                  >
                    <SelectTrigger className="bg-gradient-to-r from-white/80 to-emerald-50/50 dark:from-gray-700/80 dark:to-emerald-900/20 border-emerald-200/50 dark:border-emerald-800/30 backdrop-blur-sm shadow-inner">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      {/* <SelectItem value="other">Other</SelectItem> */}
                      {/* <SelectItem value="prefer-not-to-say">
                        Prefer not to say
                      </SelectItem> */}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-3">
                <Button
                  onClick={handleUpdatePersonalInfo}
                  disabled={isUpdatingPersonalInfo}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg"
                >
                  {isUpdatingPersonalInfo ? "Updating..." : "Update Profile"}
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
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        currentPassword: e.target.value,
                      }))
                    }
                    className="bg-gradient-to-r from-white/80 to-red-50/50 dark:from-gray-700/80 dark:to-red-900/20 border-red-200/50 dark:border-red-800/30 backdrop-blur-sm shadow-inner pr-10"
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
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                    className="bg-gradient-to-r from-white/80 to-red-50/50 dark:from-gray-700/80 dark:to-red-900/20 border-red-200/50 dark:border-red-800/30 backdrop-blur-sm shadow-inner pr-10"
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
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    className="bg-gradient-to-r from-white/80 to-red-50/50 dark:from-gray-700/80 dark:to-red-900/20 border-red-200/50 dark:border-red-800/30 backdrop-blur-sm shadow-inner pr-10"
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
              </div>
              <Button
                onClick={() => {
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
                disabled={
                  !passwordData.currentPassword ||
                  !passwordData.newPassword ||
                  changePasswordMutation.isPending
                }
                className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg"
              >
                {changePasswordMutation.isPending
                  ? "Changing..."
                  : "Change Password"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Notifications Dialog */}
        <Dialog
          open={showNotificationsDialog}
          onOpenChange={setShowNotificationsDialog}
        >
          <DialogContent className="max-w-sm bg-gradient-to-br from-white/95 via-white/90 to-blue-50/60 dark:from-gray-800/95 dark:via-gray-800/90 dark:to-blue-900/20 backdrop-blur-xl border-0 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-medium bg-gradient-to-r from-gray-900 to-blue-800 dark:from-white dark:to-blue-200 bg-clip-text text-transparent flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-600" />
                Notification Preferences
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                Manage how you receive notifications from HolistiCare
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-[50vh] overflow-y-auto">
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Communication Methods
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-blue-50/50 to-white/50 dark:from-blue-900/20 dark:to-gray-800/30">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          Email Notifications
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Receive updates via email
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          emailNotifications: checked,
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-blue-50/50 to-white/50 dark:from-blue-900/20 dark:to-gray-800/30">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-blue-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          Push Notifications
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Get instant alerts on your device
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          pushNotifications: checked,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  Content Preferences
                </h3>
                <div className="space-y-3">
                  {/* <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-50/50 to-white/50 dark:from-emerald-900/20 dark:to-gray-800/30">
                    <div className="flex items-center gap-3">
                      <Activity className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          Lab Results
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          New test results and analysis
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.labResults}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          labResults: checked,
                        }))
                      }
                    />
                  </div> */}
                  {/* <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-50/50 to-white/50 dark:from-emerald-900/20 dark:to-gray-800/30">
                    <div className="flex items-center gap-3">
                      <Target className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          Goal Reminders
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Daily and weekly goal check-ins
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.goalReminders}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          goalReminders: checked,
                        }))
                      }
                    />
                  </div> */}
                  {/* <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-50/50 to-white/50 dark:from-emerald-900/20 dark:to-gray-800/30">
                    <div className="flex items-center gap-3">
                      <Heart className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          Weekly Reports
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Summary of your health progress
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.weeklyReports}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          weeklyReports: checked,
                        }))
                      }
                    />
                  </div> */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-purple-50/50 to-white/50 dark:from-purple-900/20 dark:to-gray-800/30">
                    <div className="flex items-center gap-3">
                      <Brain className="w-4 h-4 text-purple-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          Chat Messages
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          AI assistant and coach messages
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.chatMessages}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          chatMessages: checked,
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-50/50 to-white/50 dark:from-emerald-900/20 dark:to-gray-800/30">
                    <div className="flex items-center gap-3">
                      <ClipboardList className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          Questionnaire Assigned
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          New health assessments to complete
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.questionnaire_assigned}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          questionnaire_assigned: checked,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* <div className="space-y-4">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  Other
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-gray-50/50 to-white/50 dark:from-gray-700/50 dark:to-gray-800/30">
                    <div className="flex items-center gap-3">
                      <Settings className="w-4 h-4 text-gray-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          System Updates
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          App updates and maintenance
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.systemUpdates}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          systemUpdates: checked,
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-gray-50/50 to-white/50 dark:from-gray-700/50 dark:to-gray-800/30">
                    <div className="flex items-center gap-3">
                      <Award className="w-4 h-4 text-gray-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          Marketing Emails
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Product updates and tips
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.marketingEmails}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          marketingEmails: checked,
                        }))
                      }
                    />
                  </div>
                </div>
              </div> */}
            </div>
            <div className="flex flex-col gap-2 pt-3">
              <Button
                onClick={saveNotificationSettings}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg"
              >
                Save Preferences
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowNotificationsDialog(false)}
                className="w-full bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm border-gray-200/50 dark:border-gray-600/50"
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Privacy & Data Dialog */}
        <Dialog open={showPrivacyDialog} onOpenChange={setShowPrivacyDialog}>
          <DialogContent className="max-w-sm bg-gradient-to-br from-white/95 via-white/90 to-purple-50/60 dark:from-gray-800/95 dark:via-gray-800/90 dark:to-purple-900/20 backdrop-blur-xl border-0 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-medium bg-gradient-to-r from-gray-900 to-purple-800 dark:from-white dark:to-purple-200 bg-clip-text text-transparent flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-600" />
                Privacy & Data Control
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                Control how your health data is used and shared
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 max-h-[55vh] overflow-y-auto">
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  Data Sharing
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-50/50 to-white/50 dark:from-emerald-900/20 dark:to-gray-800/30">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          Share with Doctors
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Allow healthcare providers to access your data
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={privacySettings.shareDataWithDoctors}
                      onCheckedChange={(checked) =>
                        setPrivacySettings((prev) => ({
                          ...prev,
                          shareDataWithDoctors: checked,
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-blue-50/50 to-white/50 dark:from-blue-900/20 dark:to-gray-800/30">
                    <div className="flex items-center gap-3">
                      <Brain className="w-4 h-4 text-blue-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          Health Insights Sharing
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Share anonymized insights for research
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={privacySettings.shareHealthInsights}
                      onCheckedChange={(checked) =>
                        setPrivacySettings((prev) => ({
                          ...prev,
                          shareHealthInsights: checked,
                        }))
                      }
                    />
                  </div>
                  {/* <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-purple-50/50 to-white/50 dark:from-purple-900/20 dark:to-gray-800/30">
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-purple-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          Public Profile
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Make your health journey visible to others
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={privacySettings.publicProfile}
                      onCheckedChange={(checked) =>
                        setPrivacySettings((prev) => ({
                          ...prev,
                          publicProfile: checked,
                        }))
                      }
                    />
                  </div> */}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  Analytics & Tracking
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-gray-50/50 to-white/50 dark:from-gray-700/50 dark:to-gray-800/30">
                    <div className="flex items-center gap-3">
                      <Activity className="w-4 h-4 text-gray-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          Anonymous Analytics
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Help improve HolistiCare with usage data
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={privacySettings.anonymousAnalytics}
                      onCheckedChange={(checked) =>
                        setPrivacySettings((prev) => ({
                          ...prev,
                          anonymousAnalytics: checked,
                        }))
                      }
                    />
                  </div>
                  {/* <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-gray-50/50 to-white/50 dark:from-gray-700/50 dark:to-gray-800/30">
                    <div className="flex items-center gap-3">
                      <Zap className="w-4 h-4 text-gray-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          Third-party Integrations
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Allow connections to fitness apps and devices
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={privacySettings.thirdPartyIntegrations}
                      onCheckedChange={(checked) =>
                        setPrivacySettings((prev) => ({
                          ...prev,
                          thirdPartyIntegrations: checked,
                        }))
                      }
                    />
                  </div> */}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  Data Retention
                </h3>
                <div className="p-3 rounded-xl bg-gradient-to-r from-orange-50/50 to-white/50 dark:from-orange-900/20 dark:to-gray-800/30">
                  <div className="flex items-center gap-3 mb-2">
                    <Lock className="w-4 h-4 text-orange-600" />
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Data Retention Period
                    </div>
                  </div>
                  <Select
                    value={privacySettings.dataRetention}
                    onValueChange={(value) =>
                      setPrivacySettings((prev) => ({
                        ...prev,
                        dataRetention: value,
                      }))
                    }
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
            </div>
            <div className="flex flex-col gap-2 pt-3">
              <Button
                onClick={savePrivacySettings}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg"
              >
                Save Settings
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowPrivacyDialog(false)}
                className="w-full bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm border-gray-200/50 dark:border-gray-600/50"
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Help & Support Dialog */}
        <Dialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
          <DialogContent className="max-w-sm bg-gradient-to-br from-white/95 via-white/90 to-orange-50/60 dark:from-gray-800/95 dark:via-gray-800/90 dark:to-orange-900/20 backdrop-blur-xl border-0 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-medium bg-gradient-to-r from-gray-900 to-orange-800 dark:from-white dark:to-orange-200 bg-clip-text text-transparent flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-orange-600" />
                Help & Support
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                Get help with using HolistiCare and contact our support team
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 max-h-[55vh] overflow-y-auto">
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  Quick Help
                </h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-50/60 to-white/50 dark:from-blue-900/20 dark:to-gray-800/30 hover:from-blue-100/60 hover:to-blue-50/50 dark:hover:from-blue-900/30 dark:hover:to-blue-900/20 transition-all duration-300 group">
                    <Brain className="w-5 h-5 text-blue-600" />
                    <div className="text-left">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        User Guide
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Learn how to use all features
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors duration-300 ml-auto" />
                  </button>

                  <button className="w-full flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-emerald-50/60 to-white/50 dark:from-emerald-900/20 dark:to-gray-800/30 hover:from-emerald-100/60 hover:to-emerald-50/50 dark:hover:from-emerald-900/30 dark:hover:to-emerald-900/20 transition-all duration-300 group">
                    <Activity className="w-5 h-5 text-emerald-600" />
                    <div className="text-left">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Health Data FAQ
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Common questions about lab results
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-colors duration-300 ml-auto" />
                  </button>

                  <button className="w-full flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-purple-50/60 to-white/50 dark:from-purple-900/20 dark:to-gray-800/30 hover:from-purple-100/60 hover:to-purple-50/50 dark:hover:from-purple-900/30 dark:hover:to-purple-900/20 transition-all duration-300 group">
                    <Shield className="w-5 h-5 text-purple-600" />
                    <div className="text-left">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Privacy Policy
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        How we protect your data
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors duration-300 ml-auto" />
                  </button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  Contact Support
                </h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-orange-50/60 to-white/50 dark:from-orange-900/20 dark:to-gray-800/30 hover:from-orange-100/60 hover:to-orange-50/50 dark:hover:from-orange-900/30 dark:hover:to-orange-900/20 transition-all duration-300 group">
                    <Mail className="w-5 h-5 text-orange-600" />
                    <div className="text-left">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Email Support
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        support@holisticare.com
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-orange-600 transition-colors duration-300 ml-auto" />
                  </button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  App Information
                </h3>
                <div className="p-4 rounded-xl bg-gradient-to-r from-gray-50/60 to-white/50 dark:from-gray-700/50 dark:to-gray-800/30">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Version
                      </span>
                      <span className="text-gray-900 dark:text-gray-100 font-medium">
                        2.1.0
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Last Updated
                      </span>
                      <span className="text-gray-900 dark:text-gray-100 font-medium">
                        Jan 28, 2025
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Platform
                      </span>
                      <span className="text-gray-900 dark:text-gray-100 font-medium">
                        Web App
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 pt-3">
              <Button
                onClick={() => {
                  toast({
                    title: "Support contacted",
                    description: "We'll get back to you within 24 hours.",
                  });
                  setShowHelpDialog(false);
                }}
                className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-lg"
              >
                Contact Support
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowHelpDialog(false)}
                className="w-full bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm border-gray-200/50 dark:border-gray-600/50"
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Variable Devices Modal */}
        <Dialog open={showDevicesModal} onOpenChange={setShowDevicesModal}>
          <DialogContent className="max-w-sm bg-gradient-to-br from-white/95 via-white/90 to-blue-50/60 dark:from-gray-800/95 dark:via-gray-800/90 dark:to-blue-900/20 backdrop-blur-xl border-0 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-medium bg-gradient-to-r from-gray-900 to-blue-800 dark:from-white dark:to-blue-200 bg-clip-text text-transparent flex items-center gap-2">
                <Watch className="w-4 h-4 text-blue-600" />
                Wearable devices
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                Connect and manage your health devices
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {isLoadingDevices ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <Watch className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Loading devices data...
                  </p>
                </div>
              ) : devicesData ? (
                <div className="space-y-4">

                  <div className="space-y-3 my-8 max-h-96 overflow-y-auto">
                    {isConnecting === 'connected' ? (
                      // حالت کانکت شده - فقط نمایش وضعیت
                      <div className="w-full p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-400">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="font-medium">Connected</span>
                        </div>
                        <p className="text-sm text-green-600 dark:text-green-500 text-center mt-2">
                          Your health devices are connected and syncing data
                        </p>
                      </div>
                    ) : isConnecting === 'connecting' ? (
                      // حالت در حال اتصال
                      <Button
                        disabled
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg opacity-75"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Connecting...
                        </div>
                      </Button>
                    ) : (
                      // حالت قطع شده - دکمه اتصال
                      <Button
                        onClick={connectSdk}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg"
                      >
                        <div className="flex items-center gap-2">
                          <Bluetooth className="w-4 h-4" />
                          Connect Devices
                        </div>
                      </Button>
                    )}
                    
                    {isConnecting === 'connected' && (
                      <Button
                        onClick={clearConnectionState}
                        variant="outline"
                        className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                      >
                        <div className="flex items-center gap-2">
                          <Trash2 className="w-4 h-4" />
                          Disconnect
                        </div>
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Watch className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    No devices data available
                  </p>
                </div>
              )}
            </div>
            {/* <div className="flex gap-3 pt-4">
              <Button
                onClick={() => setShowDevicesModal(false)}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg"
              >
                Close
              </Button>
            </div> */}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
