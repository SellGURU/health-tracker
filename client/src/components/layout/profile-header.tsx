import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  User,
  Settings,
  LogOut,
  Crown,
  Heart,
  Check,
  X,
  Activity,
  Target,
  Brain,
  Calendar,
  TrendingUp,
  AlertCircle,
  Info,
  CheckCircle,
} from "lucide-react";
import Auth from "@/api/auth";
import Application from "@/api/app";
import { toast } from "@/hooks/use-toast";
import NotificationApi from "@/api/notification";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from "../ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "../ui/sheet";
import { subscribe, unsubscribe } from "@/lib/event";
import { Capacitor } from "@capacitor/core";
import { App as CapacitorApp } from "@capacitor/app";
// import logoImage from "@assets/Logo5 2_1753791920091_1757240780580.png";

type BrandInfo = {
  last_update: string;
  logo: string;
  name: string;
  headline: string;
  primary_color: string;
  secondary_color: string;
  tone: string;
  focus_area: string;
};

type ClientInformation = {
  action_plan: number;
  age: number;
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
  has_changed_password?: boolean;
};

const readStored = <T,>(key: string): T | undefined => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : undefined;
  } catch {
    return undefined;
  }
};

export default function ProfileHeader() {
  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const { logout } = useAuth();
  const [location, navigate] = useLocation();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isUnReadNotif, setIsUnReadNotif] = useState(false);
  const [hadNotifications, setHadNotifications] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [clientInformation, setClientInformation] = useState<
    ClientInformation | undefined
  >(() => readStored<ClientInformation>("client_information"));

  const handleGetClientInformation = async () => {
    Application.getClientInformation()
      .then((res) => {
        setClientInformation(res.data);
        try {
          localStorage.setItem("client_information", JSON.stringify(res.data));
        } catch {
          // ignore storage write failures (private mode, quota, etc.)
        }
        // Check if password change is required
        if (res.data?.has_changed_password === false) {
          // Store flag to open password dialog
          localStorage.setItem("requirePasswordChange", "true");
          // Redirect to profile page only if not already there
          if (location !== "/profile") {
            navigate("/profile");
          }
          // Show toast notification
          toast({
            title: "Password Change Required",
            description: "Please change your password for account security.",
            variant: "destructive",
          });
        }
      })
      .catch((err) => {
        // Keep any cached value; don't blank the header on transient errors
        // (e.g. network not ready right after resuming from background).
        console.error("Failed to fetch client information", err);
      });
  };

  const handleGetBrandInfo = async () => {
    Application.getBrandInfo()
      .then((res) => {
        const info: BrandInfo | undefined = res?.data?.brand_elements;
        if (info) {
          setBrandInfo(info);
          try {
            localStorage.setItem("brand_info", JSON.stringify(info));
          } catch {
            // ignore storage write failures
          }
        }
      })
      .catch((err) => {
        console.error("Failed to fetch brand info", err);
      });
  };

  useEffect(() => {
    handleGetClientInformation();
  }, []);

  // Refetch user + brand info whenever the app returns to the foreground.
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let listener: { remove: () => void } | undefined;
    let cancelled = false;

    CapacitorApp.addListener("appStateChange", (state) => {
      if (state.isActive) {
        handleGetClientInformation();
        handleGetBrandInfo();
      }
    }).then((handle) => {
      if (cancelled) {
        handle.remove();
      } else {
        listener = handle;
      }
    });

    return () => {
      cancelled = true;
      listener?.remove();
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        // setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    const checkNewNotifications = async () => {
      try {
        const response = await NotificationApi.checkNotification();
        if (response && response.data && response.data.new_notifications) {
          setIsUnReadNotif(true);
          fetchNotifications();
        }
      } catch (error) {
        console.error("Error checking for new notifications:", error);
      }
    };

    checkNewNotifications();

    const intervalId = setInterval(checkNewNotifications, 12000);

    return () => clearInterval(intervalId);
  }, []);
  useEffect(() => {
    const unreadCount = notifications.filter((n) => !n.read_status).length;
    setNotificationCount(unreadCount);
    if (notifications.length > 0) {
      setHadNotifications(true);
    }
  }, [notifications]);
  const fetchNotifications = async () => {
    try {
      const res = await NotificationApi.getNotification();
      const notifData = res.data.map((n: any) => ({
        ...n,
        read_status: n.read_status || false,
        icon:
          n.type === "lab_result"
            ? Activity
            : n.type === "goal"
            ? Target
            : n.type === "insight"
            ? Brain
            : n.type === "reminder"
            ? Calendar
            : n.type === "trend"
            ? TrendingUp
            : Activity,
        color: n.color || "blue",
      }));
      setNotifications(notifData);
      if (notifData.length > 0) {
        setHadNotifications(true);
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);
  useEffect(() => {
    if (notifications.filter((n) => n.read_status === false).length == 0) {
      setIsUnReadNotif(false);
    }
  }, [notifications]);
  const markAsRead = async (id: string | number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read_status: true } : n))
    );
    try {
      await NotificationApi.mark_read({ notification_id: id });
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const markAllAsRead = async () => {
    setIsUnReadNotif(false);
    setNotifications((prev) => prev.map((n) => ({ ...n, read_status: true })));
    try {
      await Promise.all(
        notifications.map((n) =>
          NotificationApi.mark_read({ notification_id: n.id })
        )
      );
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleLogout = async () => {
    Auth.logOut();
    const brandInfo = localStorage.getItem("brand_info");
    const biometricEnabled = localStorage.getItem("biometric_enabled");
    localStorage.clear();
    // Restore brand_info if it existed
    if (brandInfo) {
      localStorage.setItem("brand_info", brandInfo);
    }
    if (biometricEnabled) {
      localStorage.setItem("biometric_enabled", biometricEnabled);
    }
    navigate("/");
    window.location.reload();
  };

  // Static class map so Tailwind doesn't purge dynamically built color classes.
  const getNotifColor = (color: string) => {
    const map: Record<string, { chip: string; icon: string; bar: string }> = {
      emerald: {
        chip: "bg-emerald-100 dark:bg-emerald-900/40",
        icon: "text-emerald-600 dark:text-emerald-400",
        bar: "bg-emerald-500",
      },
      blue: {
        chip: "bg-blue-100 dark:bg-blue-900/40",
        icon: "text-blue-600 dark:text-blue-400",
        bar: "bg-blue-500",
      },
      purple: {
        chip: "bg-purple-100 dark:bg-purple-900/40",
        icon: "text-purple-600 dark:text-purple-400",
        bar: "bg-purple-500",
      },
      orange: {
        chip: "bg-orange-100 dark:bg-orange-900/40",
        icon: "text-orange-600 dark:text-orange-400",
        bar: "bg-orange-500",
      },
      green: {
        chip: "bg-green-100 dark:bg-green-900/40",
        icon: "text-green-600 dark:text-green-400",
        bar: "bg-green-500",
      },
    };
    return (
      map[color] ?? {
        chip: "bg-gray-100 dark:bg-gray-700/50",
        icon: "text-gray-600 dark:text-gray-400",
        bar: "bg-gray-400",
      }
    );
  };
  const [brandInfo, setBrandInfo] = useState<BrandInfo | undefined>(() =>
    readStored<BrandInfo>("brand_info")
  );

  useEffect(() => {
    const handler = (data: any) => {
      const info = data?.detail?.information;
      if (!info) return;
      setBrandInfo(info);
      try {
        localStorage.setItem("brand_info", JSON.stringify(info));
      } catch {
        // ignore storage write failures
      }
    };
    subscribe("brand_info", handler);
    return () => unsubscribe("brand_info", handler);
  }, []);

  return (
    <div className="flex relative items-center justify-between p-3 sm:p-4 pt-[calc(env(safe-area-inset-top)+0.75rem)] sm:pt-[calc(env(safe-area-inset-top)+1rem)] bg-gradient-to-r from-gray-50/90 via-white/90 to-gray-50/90 dark:from-gray-900/90 dark:via-gray-800/90 dark:to-gray-900/90 backdrop-blur-lg border-b border-gray-200/30 dark:border-gray-700/30 shadow-lg">
      <div className="flex items-center gap-2 ">
        <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
          <img
            src={brandInfo ? brandInfo?.logo : "./logo.png"}
            alt="HolistiCare Logo"
            className="w-8 h-8 rounded-full object-cover"
          />
        </div>
        <h1 className="text-lg sm:text-xl font-thin bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {brandInfo ? brandInfo?.name || "HolistiCare" : "HolistiCare"}
        </h1>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 ">
        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setShowNotifications(!showNotifications);
            }}
            className="relative w-10 h-10 rounded-full bg-gray-100/50 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-gray-200/50 dark:hover:bg-gray-700/50 hover:shadow-lg transition-all duration-300"
          >
            <Bell className="w-5 h-5" />
            {(notificationCount > 0 || isUnReadNotif) && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-xs font-medium text-white shadow-lg animate-pulse">
                {notificationCount || 1}
              </div>
            )}
          </Button>
        </div>

        {/* Notifications Sheet */}
        <Sheet open={showNotifications} onOpenChange={setShowNotifications}>
          <SheetContent
            side="bottom"
            className="mx-auto w-full max-w-md sm:max-w-lg flex max-h-[85dvh] flex-col gap-0 rounded-t-3xl border-x-0 border-t border-gray-200/50 bg-white/95 p-0 backdrop-blur-xl dark:border-gray-700/50 dark:bg-gray-900/95 [&>button]:hidden"
          >
            {/* Drag handle */}
            <div className="flex flex-shrink-0 justify-center pb-1 pt-3">
              <span className="h-1.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700" />
            </div>

            {/* Header */}
            <SheetHeader className="flex-shrink-0 space-y-0 px-5 pb-3 pt-1 text-left">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/15 to-purple-500/15">
                    <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </span>
                  <div className="min-w-0">
                    <SheetTitle className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      Notifications
                    </SheetTitle>
                    <SheetDescription className="text-xs text-gray-500 dark:text-gray-400">
                      {notificationCount > 0
                        ? `${notificationCount} unread notification${
                            notificationCount !== 1 ? "s" : ""
                          }`
                        : "You're all caught up"}
                    </SheetDescription>
                  </div>
                </div>
                <div className="flex flex-shrink-0 items-center gap-1">
                  {isUnReadNotif && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="h-8 rounded-full px-3 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                    >
                      <CheckCircle className="mr-1 h-3.5 w-3.5" />
                      Mark all read
                    </Button>
                  )}
                  <SheetClose asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Close notifications"
                      className="h-8 w-8 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </SheetClose>
                </div>
              </div>
            </SheetHeader>

            {/* List */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-3 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-1">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
                  <div className="relative mb-4">
                    <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30">
                      <Bell className="h-9 w-9 text-blue-500/70 dark:text-blue-400/70" />
                    </span>
                    <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 shadow-lg ring-4 ring-white dark:ring-gray-900">
                      <Check className="h-4 w-4 text-white" />
                    </span>
                  </div>
                  <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    No notifications
                  </h4>
                  <p className="mt-1 max-w-[16rem] text-sm text-gray-500 dark:text-gray-400">
                    {hadNotifications
                      ? "You're all caught up! New updates will show up here."
                      : "We'll let you know when something needs your attention."}
                  </p>
                </div>
              ) : (
                <div className="space-y-2 py-2">
                  {notifications.map((notification, index) => {
                    const IconComponent = notification.icon;
                    const colors = getNotifColor(notification.color);
                    const unread = !notification.read_status;
                    return (
                      <div
                        key={notification.id}
                        onClick={() => unread && markAsRead(notification.id)}
                        style={{
                          animationDelay: `${Math.min(index * 40, 240)}ms`,
                          animationFillMode: "backwards",
                        }}
                        className={`group relative flex animate-in cursor-pointer items-start gap-3 rounded-2xl p-3 transition-colors duration-200 fade-in slide-in-from-bottom-1 ${
                          unread
                            ? "bg-blue-50/70 hover:bg-blue-100/70 dark:bg-blue-950/30 dark:hover:bg-blue-950/50"
                            : "bg-gray-50/70 hover:bg-gray-100/70 dark:bg-gray-800/40 dark:hover:bg-gray-800/60"
                        }`}
                      >
                        {unread && (
                          <span
                            className={`absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full ${colors.bar}`}
                          />
                        )}
                        <span
                          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                            unread
                              ? colors.chip
                              : "bg-gray-200/70 dark:bg-gray-700/50"
                          }`}
                        >
                          <IconComponent
                            className={`h-5 w-5 ${
                              unread
                                ? colors.icon
                                : "text-gray-500 dark:text-gray-400"
                            }`}
                          />
                        </span>

                        <div className="min-w-0 flex-1 py-0.5">
                          <div className="flex items-start justify-between gap-2">
                            <h4
                              className={`break-words text-sm font-semibold ${
                                unread
                                  ? "text-gray-900 dark:text-gray-100"
                                  : "text-gray-600 dark:text-gray-400"
                              }`}
                            >
                              {notification.title}
                            </h4>
                            {unread && (
                              <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                            )}
                          </div>
                          <p
                            className={`mt-0.5 break-words text-xs leading-relaxed ${
                              unread
                                ? "text-gray-600 dark:text-gray-300"
                                : "text-gray-500 dark:text-gray-500"
                            }`}
                          >
                            {notification.message}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            {unread && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                }}
                                className="h-7 rounded-full px-2.5 text-xs text-blue-600 hover:bg-blue-100/70 dark:text-blue-400 dark:hover:bg-blue-900/30"
                              >
                                <Check className="mr-1 h-3 w-3" />
                                Mark read
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeNotification(notification.id);
                              }}
                              className="h-7 rounded-full px-2.5 text-xs text-gray-500 hover:bg-red-100/70 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                            >
                              <X className="mr-1 h-3 w-3" />
                              Dismiss
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-10 w-10 rounded-full p-0 hover:shadow-lg transition-all duration-300"
            >
              <Avatar className="h-10 w-10 shadow-lg">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback
                  className="text-white font-medium text-[10px]"
                  style={{
                    background: `linear-gradient(to right, ${
                      brandInfo ? brandInfo?.primary_color : `#3b82f6`
                    }, ${brandInfo ? brandInfo?.secondary_color : `#a855f7`})`,
                  }}
                >
                  {(
                    clientInformation?.name?.split(" ")[0] || ""
                  ).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-64 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-0 shadow-2xl rounded-2xl"
            align="end"
            forceMount
          >
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {clientInformation?.name}
                </p>
                <p className="w-[200px] truncate text-sm text-gray-600 dark:text-gray-400">
                  {clientInformation?.email}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Member since Jan 2025
                </p>
              </div>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link href="/profile" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Profile & Settings
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            {/* <DropdownMenuItem asChild>
              <Link href="/monitor" className="cursor-pointer">
                <Activity className="mr-2 h-4 w-4" />
                Results
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />             */}

            <DropdownMenuItem
              onTouchEnd={() => setShowLogoutDialog(true)}
              onClick={() => setShowLogoutDialog(true)}
              className="cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
          <DialogContent className="max-w-sm bg-gradient-to-br from-white/95 via-white/90 to-red-50/60 dark:from-gray-800/95 dark:via-gray-800/90 dark:to-red-900/20 backdrop-blur-xl border-0 shadow-2xl">
            <DialogHeader>
              <DialogTitle>Are you sure you want to sign out?</DialogTitle>
            </DialogHeader>
            <DialogFooter className="flex items-center justify-center gap-2">
              <Button onClick={handleLogout} className="bg-red-500 text-white">
                Sign out
              </Button>
              <Button
                onClick={() => setShowLogoutDialog(false)}
                className="bg-gray-500 text-white"
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
