import Application from "@/api/app";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { RookConfig, RookHealthConnect, RookPermissions, RookSamsungHealth } from "capacitor-rook-sdk";
import { registerPlugin } from "@capacitor/core";
import type { BoolResult, StringResult, RookSDKPlugin } from "capacitor-rook-sdk";

// Register Rook SDK plugin to access connectHealth method
const Rook = registerPlugin<RookSDKPlugin & { connectHealth?: (props: { providers: string[] }) => Promise<any> }>('RookSDK');
import { Capacitor } from "@capacitor/core";
import { Watch, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function Devices() {
  const { fetchClientInformation } = useAuth();
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  
  const [clientInformation, setClientInformation] = useState<{
    id: string;
    name: string;
  }>();

  const handleGetClientInformation = async () => {
    Application.getClientInformation()
      .then((res) => {
        setClientInformation(res.data);
      })
      .catch((res) => {
        toast({
          title: "Error",
          description: res?.response?.data?.detail,
          variant: "destructive",
        });
      });
  };

  useEffect(() => {
    handleGetClientInformation();
    
    // Check if device is Samsung using Rook SDK availability check
    const checkSamsungDevice = async () => {
      if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android') {
        try {
          // Initialize SDK first to check availability
          await RookConfig.initRook({
            environment: "production",
            clientUUID: "c2f4961b-9d3c-4ff0-915e-f70655892b89",
            password: "QH8u18OjLofsSRvmEDmGBgjv1frp3fapdbDA",
            enableBackgroundSync: true,
            enableEventsBackgroundSync: true,
          });
          
          const availability = await RookSamsungHealth.checkSamsungHealthAvailability();
          // If availability is NOT_SUPPORTED, it means device is not Samsung
          const isSamsung = availability.result !== 'NOT_SUPPORTED';
          setIsSamsungDevice(isSamsung);
          console.log("Samsung device check:", { availability: availability.result, isSamsung });
        } catch (error) {
          console.error("Error checking Samsung device:", error);
          // Default to false if we can't determine
          setIsSamsungDevice(false);
        }
      } else {
        setIsSamsungDevice(false);
      }
    };
    
    checkSamsungDevice();
  }, []);

  useEffect(() => {
    if (clientInformation?.id) {
      fetchDevicesData();
    }
  }, [clientInformation?.id]);

  // Helper function to detect platform
  const getPlatformInfo = () => {
    if (Capacitor.isNativePlatform()) {
      const platform = Capacitor.getPlatform();
      return {
        isIOS: platform === 'ios',
        isAndroid: platform === 'android',
        googleDescription: `
        Google Health lets you track and analyze your health and fitness activities. It works seamlessly with compatible devices, such as smartwatches and activity trackers. Monitor your workouts, steps, heart rate, and other health metrics, and instantly see your progress. All your data syncs wirelessly to Google Health so you can access it anytime, anywhere.
        `,
        appleDescription: `
         Connect with Apple Health
Enable integration with Apple Health to sync your health and activity data.
This app uses Apple Health (HealthKit) to read and write your health data securely.

        `,
        name: platform === 'ios' ? 'Apple Health' : 'Google Health',
        icon: platform === 'ios' 
          ? "AppleHealth.png"
          : "googleHealth.png"
      };
    } else {
      return {
        isIOS: false,
        isAndroid: true,
        googleDescription: `
        Google Health lets you track and analyze your health and fitness activities. It works seamlessly with compatible devices, such as smartwatches and activity trackers. Monitor your workouts, steps, heart rate, and other health metrics, and instantly see your progress. All your data syncs wirelessly to Google Health so you can access it anytime, anywhere.
        `,        
        name: 'Google Health',
        icon: "googleHealth.png"
      };
    }
  };

  const [devicesData, setDevicesData] = useState<any>(null);
  const [isLoadingDevices, setIsLoadingDevices] = useState(false);
  const [isConnecting, setIsConnecting] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [samsungHealthConnected, setSamsungHealthConnected] = useState(false);
  const [isConnectingSamsung, setIsConnectingSamsung] = useState(false);
  const [isSamsungDevice, setIsSamsungDevice] = useState<boolean | null>(null);

  // Restore connection state from localStorage on component mount
  useEffect(() => {
    const savedConnectionState = localStorage.getItem('health_device_connection_state');
    if (savedConnectionState) {
      if(savedConnectionState != 'connecting'){
        setIsConnecting(savedConnectionState as 'disconnected' | 'connecting' | 'connected');
      }
    }
    
    // Restore Samsung Health connection state
    const savedSamsungState = localStorage.getItem('samsung_health_connection_state');
    if (savedSamsungState === 'connected') {
      setSamsungHealthConnected(true);
    }
  }, []);

  // Save connection state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('health_device_connection_state', isConnecting);
  }, [isConnecting]);

  // Save Samsung Health connection state
  useEffect(() => {
    localStorage.setItem('samsung_health_connection_state', samsungHealthConnected ? 'connected' : 'disconnected');
  }, [samsungHealthConnected]);

  // Function to clear connection state (for testing or manual reset)
  const clearConnectionState = () => {
    setIsConnecting('disconnected');
    localStorage.removeItem('health_device_connection_state');
    toast({
      title: "Connection Reset",
      description: "Device connection state has been cleared.",
    });
  };

  const fetchDevicesData = async () => {
    if (!clientInformation?.id) {
      toast({
        title: "Error",
        description: "User id not found",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingDevices(true);
    try {
      const response = await fetch(
        `https://api.rook-connect.com/api/v1/client_uuid/c2f4961b-9d3c-4ff0-915e-f70655892b89/user_id/${clientInformation.id}/data_sources/authorizers`,
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

      // Initialize Rook SDK for device data fetching
      // Note: This is a lightweight initialization for fetching device list
      // Full connection happens in executeConnection()
      try {
        await RookConfig.initRook({
          environment: "production",
          clientUUID: "c2f4961b-9d3c-4ff0-915e-f70655892b89",
          password: "QH8u18OjLofsSRvmEDmGBgjv1frp3fapdbDA",
          enableBackgroundSync: false,
          enableEventsBackgroundSync: false,
        });
        console.log("✅ Rook SDK initialized for device list");
      } catch (e: any) {
        console.warn("⚠️ Rook SDK initialization warning (non-critical):", e);
        // Don't throw error here as this is just for fetching device list
      }
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

  async function revokeRookDataSource(sourceOrId: string) {
    const encodedCreds = btoa(`c2f4961b-9d3c-4ff0-915e-f70655892b89:QH8u18OjLofsSRvmEDmGBgjv1frp3fapdbDA`);
    const body = { data_source: sourceOrId };
    // TODO: Implement revoke API call
  }

  const executeSamsungConnection = () => {
    console.log("🔵 executeSamsungConnection called", { userId: clientInformation?.id });
    
    if (!clientInformation?.id) {
      toast({
        title: "Error",
        description: "User ID not found. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsConnectingSamsung(true);

    const initSamsungHealth = async (userId: string) => {
      console.log("🔵 initSamsungHealth started", { userId });
      try {
        // 1. Initialize Rook SDK
        try {
          await RookConfig.initRook({
            environment: "production",
            clientUUID: "c2f4961b-9d3c-4ff0-915e-f70655892b89",
            password: "QH8u18OjLofsSRvmEDmGBgjv1frp3fapdbDA",
            enableBackgroundSync: true,
            enableEventsBackgroundSync: true,
          });
          console.log("✅ Initialized Rook SDK for Samsung Health");
        } catch (initError: any) {
          console.error("❌ Error initializing Rook SDK:", initError);
          toast({
            title: "Initialize Error",
            description: `Failed to initialize SDK: ${initError?.message || initError?.toString() || "Unknown error"}`,
            variant: "destructive",
          });
          throw initError;
        }

        // 2. Update User ID
        try {
          if (RookConfig.updateUserId) {
            await RookConfig.updateUserId({
              userId: userId,
            });
            console.log("✅ User ID updated for Samsung Health:", userId);
          }
        } catch (userIdError: any) {
          console.error("❌ Error updating User ID:", userIdError);
          toast({
            title: "Update User ID Error",
            description: `Failed to update User ID: ${userIdError?.message || userIdError?.toString() || "Unknown error"}`,
            variant: "destructive",
          });
          throw userIdError;
        }
        
        // 3. Check Samsung Health availability
        try {
          const availability = await RookSamsungHealth.checkSamsungHealthAvailability();
          console.log("✅ Samsung Health availability:", availability);
          
          if (availability.result !== 'INSTALLED') {
            const errorMsg = availability.result === 'NOT_INSTALLED' 
              ? "Samsung Health is not installed on your device. Please install it from Samsung Galaxy Store."
              : "Samsung Health is not supported on this device.";
            
            toast({
              title: "Samsung Health Not Available",
              description: errorMsg,
              variant: "destructive",
            });
            throw new Error(errorMsg);
          }
        } catch (availabilityError: any) {
          console.error("❌ Error checking Samsung Health availability:", availabilityError);
          if (!availabilityError.message.includes("not installed") && !availabilityError.message.includes("not supported")) {
            toast({
              title: "Availability Check Error",
              description: `Failed to check Samsung Health availability: ${availabilityError?.message || availabilityError?.toString() || "Unknown error"}`,
              variant: "destructive",
            });
          }
          throw availabilityError;
        }

        // 4. Request Android permissions
        try {
          const androidPerms = await RookPermissions.requestAndroidPermissions();
          console.log("✅ Android permissions for Samsung Health:", androidPerms);
        } catch (androidPermError: any) {
          console.error("❌ Error requesting Android permissions:", androidPermError);
          toast({
            title: "Android Permissions Error",
            description: `Failed to request Android permissions: ${androidPermError?.message || androidPermError?.toString() || "Unknown error"}`,
            variant: "destructive",
          });
          throw androidPermError;
        }

        // 5. Request Samsung Health permissions
        try {
          const samsungPerms = await RookPermissions.requestSamsungHealthPermissions({
            types: ['STEPS', 'HEART_RATE', 'SLEEP', 'EXERCISE', 'BLOOD_PRESSURE', 'BLOOD_GLUCOSE', 'BODY_COMPOSITION']
          });
          console.log("✅ Samsung Health permissions:", samsungPerms);
        } catch (samsungPermError: any) {
          console.error("❌ Error requesting Samsung Health permissions:", samsungPermError);
          toast({
            title: "Samsung Health Permissions Error",
            description: `Failed to request Samsung Health permissions: ${samsungPermError?.message || samsungPermError?.toString() || "Unknown error"}`,
            variant: "destructive",
          });
          throw samsungPermError;
        }

        // 6. Enable Samsung Health background updates
        try {
          const bgResult = await RookSamsungHealth.enableBackGroundUpdates();
          console.log("✅ Samsung Health background updates enabled:", bgResult);
        } catch (bgError: any) {
          console.error("❌ Error enabling background updates:", bgError);
          toast({
            title: "Background Updates Error",
            description: `Failed to enable background updates: ${bgError?.message || bgError?.toString() || "Unknown error"}`,
            variant: "destructive",
          });
          throw bgError;
        }

        // 7. Set connected state after all operations succeed
        setSamsungHealthConnected(true);
        setIsConnectingSamsung(false);
        
        toast({
          title: "Connected Successfully",
          description: "Samsung Health has been connected successfully.",
        });
      } catch (e: any) {
        console.error("❌ Error connecting Samsung Health:", e);
        setSamsungHealthConnected(false);
        setIsConnectingSamsung(false);
        
        // Show final error message if not already shown
        const errorMessage = e?.message || e?.toString() || "Unknown error occurred";
        // Only show if error message doesn't already contain specific error text (to avoid duplicate notifications)
        if (!errorMessage.includes("not installed") && !errorMessage.includes("not supported") && !errorMessage.includes("Failed to")) {
          toast({
            title: "Connection Failed",
            description: `Failed to connect to Samsung Health: ${errorMessage}`,
            variant: "destructive",
          });
        }
      }
    };

    initSamsungHealth(clientInformation.id);
  };

  const connectSamsungHealth = () => {
    console.log("🔵 connectSamsungHealth called");
    executeSamsungConnection();
  };

  const disconnectSamsungHealth = async () => {
    try {
      setSamsungHealthConnected(false);
      Application.disConnectVariable('Samsung Health').catch((err) => {
        console.error("Failed to disconnect Samsung Health variable:", err);
      });
      toast({
        title: "Disconnected",
        description: "Samsung Health has been disconnected.",
      });
    } catch (error: any) {
      console.error("Error disconnecting Samsung Health:", error);
      toast({
        title: "Error",
        description: "Failed to disconnect Samsung Health.",
        variant: "destructive",
      });
    }
  };

  const connectSdk = () => {
    setShowPermissionModal(true);
  };

  const executeConnection = () => {
    setIsConnecting("connecting");

    const initRook = async (userId: string) => {
      try {
        // 1. Initialize Rook SDK
        await RookConfig.initRook({
          environment: "production",
          clientUUID: "c2f4961b-9d3c-4ff0-915e-f70655892b89",
          password: "QH8u18OjLofsSRvmEDmGBgjv1frp3fapdbDA",
          enableBackgroundSync: true,
          enableEventsBackgroundSync: true,
        });
        console.log("✅ Initialized Rook SDK");

        // 2. Update User ID
        if (RookConfig.updateUserId) {
          await RookConfig.updateUserId({
            userId: userId,
          });
          console.log("✅ User ID updated:", userId);
        }

        // 3. Request Android permissions first (required for Health Connect)
        const androidPerms = await RookPermissions.requestAndroidPermissions();
        console.log("✅ Android permissions:", androidPerms);
        // 4. Request Health Connect permissions
        const perms = await RookPermissions.requestAllHealthConnectPermissions();
        console.log("✅ HealthConnect permissions:", perms);

        // 5. Schedule sync
        // await RookHealthConnect.scheduleYesterdaySync({ doOnEnd: "oldest" });
        // console.log("✅ Yesterday sync scheduled");

        // 6. Set connected state only after all operations succeed
        setIsConnecting("connected");
        
        toast({
          title: "Connected Successfully",
          description: "Google Health has been connected successfully.",
        });
      } catch (e: any) {
        console.error("❌ Error initializing Rook:", e);
        setIsConnecting("disconnected");
        
        // Show user-friendly error message
        const errorMessage = e?.message || e?.toString() || "Unknown error occurred";
        toast({
          title: "Connection Failed",
          description: `Failed to connect to Google Health: ${errorMessage}`,
          variant: "destructive",
        });
      }
    };

    if (clientInformation?.id) {
      initRook(clientInformation.id);
    } else {
      toast({
        title: "Error",
        description: "User ID not found. Please try again.",
        variant: "destructive",
      });
      setIsConnecting("disconnected");
    }
  };

  useEffect(() => {
    // Sync connection state with backend
    if(isConnecting === "connected"){
      const platformInfo = getPlatformInfo();
      if(platformInfo.isIOS){
        Application.connectVariable('Apple Health').catch((err) => {
          console.error("Failed to connect Apple Health variable:", err);
        });
      } else {
        Application.connectVariable('Google Health').catch((err) => {
          console.error("Failed to connect Google Health variable:", err);
        });
      }
    } else if(isConnecting === "disconnected") {
      const platformInfo = getPlatformInfo();
      if(!platformInfo.isIOS){
        Application.disConnectVariable('Google Health').catch((err) => {
          console.error("Failed to disconnect Google Health variable:", err);
        });
      }
    }
    
    // Sync Samsung Health
    if (samsungHealthConnected) {
      Application.connectVariable('Samsung Health').catch((err) => {
        console.error("Failed to connect Samsung Health variable:", err);
      });
    } else {
      Application.disConnectVariable('Samsung Health').catch((err) => {
        console.error("Failed to disconnect Samsung Health variable:", err);
      });
    }
    
    // Sync other devices
    if (devicesData?.data_sources) {
      devicesData.data_sources.forEach((el:any) => {
        if (el.connected) {
          Application.connectVariable(el.name).catch((err) => {
            console.error(`Failed to connect ${el.name} variable:`, err);
          });
        } else {
          Application.disConnectVariable(el.name).catch((err) => {
            console.error(`Failed to disconnect ${el.name} variable:`, err);
          });
        }
      });
    }
  }, [devicesData?.data_sources, isConnecting, samsungHealthConnected]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/40 dark:from-gray-900 dark:via-emerald-900/20 dark:to-teal-900/10">
      {/* Header */}
      <div className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-white/20 dark:border-gray-700/30 ">
        <div className="max-w-4xl mx-auto px-3 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/profile")}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-medium bg-gradient-to-r from-gray-900 via-emerald-800 to-teal-800 dark:from-white dark:via-emerald-200 dark:to-teal-200 bg-clip-text text-transparent">
                Wearable Devices
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Connect and manage your health devices
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3 py-4 space-y-4">
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
            <div className="space-y-2">
              {/* Platform Health (Apple Health / Google Health) */}
              <div
                key={'-1'}
                className="bg-gradient-to-r from-white/80 to-gray-50/60 dark:from-gray-700/80 dark:to-gray-800/60 rounded-lg p-3 border border-gray-200/50 dark:border-gray-600/50"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <img
                      src={getPlatformInfo().icon}
                      alt={getPlatformInfo().name}
                      className="w-10 h-10 rounded-lg object-cover border border-gray-200/50 dark:border-gray-600/50"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iOCIgZmlsbD0iI0YzRjRGNiIvPgo8cGF0aCBkPSJNMjQgMTJMMjggMjBIMjBMMjQgMTJaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0yNCAzNkwyMCAyOEgyOEwyNCAzNloiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+";
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                        {getPlatformInfo().name}
                      </h4>
                      <Badge
                        variant={
                          isConnecting === 'connected' ? "default" : "outline"
                        }
                        className={`text-xs ${
                          isConnecting === 'connected'
                            ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
                            : "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600"
                        }`}
                      >
                        {isConnecting === 'connected'
                          ? "Connected"
                          :
                            isConnecting === 'connecting' ? "Connecting" : "Not Connected"}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-2 text-justify">
                      {getPlatformInfo().isAndroid ? getPlatformInfo().googleDescription : getPlatformInfo().appleDescription}
                    </p>
                    <Button
                      size="sm"
                      variant={
                        isConnecting === 'connected' ? "outline" : "default"
                      }
                      className={`text-xs h-7 ${
                        isConnecting === 'connected'
                          ? "border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                      onClick={() => {
                        if (isConnecting === 'connected') {
                          clearConnectionState();
                        } else {
                          connectSdk();
                        }
                      }}
                    >
                      {isConnecting === 'connected' ? "Disconnect" : "Connect"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Samsung Health - Only show for Samsung devices */}
              {getPlatformInfo().isAndroid && isSamsungDevice === true && (
                <div
                  key={'samsung-health'}
                  className="bg-gradient-to-r from-white/80 to-gray-50/60 dark:from-gray-700/80 dark:to-gray-800/60 rounded-lg p-3 border border-gray-200/50 dark:border-gray-600/50"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <img
                        src="https://www.samsung.com/etc/designs/smg/global/imgs/logo-square-256.png"
                        alt="Samsung Health"
                        className="w-10 h-10 rounded-lg object-cover border border-gray-200/50 dark:border-gray-600/50"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iOCIgZmlsbD0iIzAwNzNDQiIvPgo8cGF0aCBkPSJNMjQgMTJMMjggMjBIMjBMMjQgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMjQgMzZMMjAgMjhIMjhMMjQgMzZaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4=";
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                          Samsung Health
                        </h4>
                        <Badge
                          variant={
                            samsungHealthConnected ? "default" : "outline"
                          }
                          className={`text-xs ${
                            samsungHealthConnected
                              ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
                              : isConnectingSamsung
                              ? "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
                              : "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600"
                          }`}
                        >
                          {samsungHealthConnected
                            ? "Connected"
                            : isConnectingSamsung
                            ? "Connecting..."
                            : "Not Connected"}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-2 text-justify">
                        Connect with Samsung Health to sync your health and fitness data from Samsung devices. Track your workouts, steps, heart rate, sleep, and other health metrics seamlessly.
                      </p>
                      <Button
                        size="sm"
                        variant={
                          samsungHealthConnected ? "outline" : "default"
                        }
                        disabled={isConnectingSamsung}
                        className={`text-xs h-7 ${
                          samsungHealthConnected
                            ? "border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                        onClick={() => {
                          if (samsungHealthConnected) {
                            disconnectSamsungHealth();
                          } else {
                            connectSamsungHealth();
                          }
                        }}
                      >
                        {isConnectingSamsung 
                          ? "Connecting..." 
                          : samsungHealthConnected 
                          ? "Disconnect" 
                          : "Connect"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Other Devices */}
              {devicesData.data_sources?.map(
                (source: any, index: number) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-white/80 to-gray-50/60 dark:from-gray-700/80 dark:to-gray-800/60 rounded-lg p-3 border border-gray-200/50 dark:border-gray-600/50"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <img
                          src={source.image}
                          alt={source.name}
                          className="w-10 h-10 rounded-lg object-cover border border-gray-200/50 dark:border-gray-600/50"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src =
                              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iOCIgZmlsbD0iI0YzRjRGNiIvPgo8cGF0aCBkPSJNMjQgMTJMMjggMjBIMjBMMjQgMTJaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0yNCAzNkwyMCAyOEgyOEwyNCAzNloiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+";
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                            {source.name}
                          </h4>
                          <Badge
                            variant={
                              source.connected ? "default" : "outline"
                            }
                            className={`text-xs ${
                              source.connected
                                ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
                                : "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600"
                            }`}
                          >
                            {source.connected
                              ? "Connected"
                              : "Not Connected"}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-2 text-justify">
                          {source.description}
                        </p>
                        <Button
                          size="sm"
                          variant={
                            source.connected ? "outline" : "default"
                          }
                          className={`text-xs h-7 ${
                            source.connected
                              ? "border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                              : "bg-blue-600 hover:bg-blue-700 text-white"
                          }`}
                          onClick={() => {
                            if (source.connected) {
                              revokeRookDataSource(source.name).then(() => {
                                toast({
                                  title: "Disconnect",
                                  description: `Disconnect from ${source.name}`,
                                });
                                fetchDevicesData();
                              });
                            } else {
                              window.open(
                                source.authorization_url,
                                "_blank"
                              );
                              toast({
                                title: "Connecting",
                                description: `Opening ${source.name} authorization...`,
                              });
                            }
                          }}
                        >
                          {source.connected ? "Disconnect" : "Connect"}
                        </Button>
                      </div>
                    </div>
                  </div>
                )
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

      {/* Permission Modal */}
      <Dialog open={showPermissionModal} onOpenChange={setShowPermissionModal}>
        <DialogContent className="max-w-sm bg-gradient-to-br from-white/95 via-white/90 to-blue-50/60 dark:from-gray-800/95 dark:via-gray-800/90 dark:to-blue-900/20 backdrop-blur-xl border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-medium bg-gradient-to-r from-gray-900 to-blue-800 dark:from-white dark:to-blue-200 bg-clip-text text-transparent flex items-center gap-2">
              <Watch className="w-4 h-4 text-blue-600" />
              Allow Health Access
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
              {getPlatformInfo().isIOS 
                ? "This app uses Apple Health (HealthKit) to read your health and fitness data. Your data will be shared with ROOK to provide personalized wellness insights. Do you want to allow access?"
                : "This app uses Google Health to read your health and fitness data. Your data will be shared with ROOK to provide personalized wellness insights. Do you want to allow access?"
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Watch className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => {
                  executeConnection();
                  setShowPermissionModal(false);
                }}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg"
              >
                Allow Access
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowPermissionModal(false)}
                className="flex-1 bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm border-gray-200/50 dark:border-gray-600/50"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

