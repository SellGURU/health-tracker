import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
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
// import logoImage from "@assets/Logo5 2_1753791920091_1757240780580.png";

export default function ProfileHeader() {
  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const { logout } = useAuth();
  const [, navigate] = useLocation();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isUnReadNotif, setIsUnReadNotif] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);
  const [clientInformation, setClientInformation] = useState<{
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
          fetchNotifications()
        }
      } catch (error) {
        console.error('Error checking for new notifications:', error);
      }
    };

    checkNewNotifications();

    const intervalId = setInterval(checkNewNotifications, 12000);

    return () => clearInterval(intervalId);
  }, []);
  useEffect(() => {
    const unreadCount = notifications.filter((n) => !n.read_status).length;
    setNotificationCount(unreadCount);
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
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);
  useEffect(() => {
    if(notifications.filter((n) => n.read_status === false).length == 0) {
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
        notifications.map((n) => NotificationApi.mark_read({ notification_id: n.id }))
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
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  const getColorClasses = (color: string, read: boolean) => {
    const baseOpacity = read ? "30" : "60";
    const hoverOpacity = read ? "40" : "80";

    switch (color) {
      case "emerald":
        return `bg-gradient-to-r from-emerald-50/${baseOpacity} to-teal-50/${baseOpacity} dark:from-emerald-900/20 dark:to-teal-900/20 hover:from-emerald-100/${hoverOpacity} hover:to-teal-100/${hoverOpacity} dark:hover:from-emerald-900/30 dark:hover:to-teal-900/30`;
      case "blue":
        return `bg-gradient-to-r from-blue-50/${baseOpacity} to-cyan-50/${baseOpacity} dark:from-blue-900/20 dark:to-cyan-900/20 hover:from-blue-100/${hoverOpacity} hover:to-cyan-100/${hoverOpacity} dark:hover:from-blue-900/30 dark:hover:to-cyan-900/30`;
      case "purple":
        return `bg-gradient-to-r from-purple-50/${baseOpacity} to-indigo-50/${baseOpacity} dark:from-purple-900/20 dark:to-indigo-900/20 hover:from-purple-100/${hoverOpacity} hover:to-indigo-100/${hoverOpacity} dark:hover:from-purple-900/30 dark:hover:to-indigo-900/30`;
      case "orange":
        return `bg-gradient-to-r from-orange-50/${baseOpacity} to-amber-50/${baseOpacity} dark:from-orange-900/20 dark:to-amber-900/20 hover:from-orange-100/${hoverOpacity} hover:to-amber-100/${hoverOpacity} dark:hover:from-orange-900/30 dark:hover:to-amber-900/30`;
      case "green":
        return `bg-gradient-to-r from-green-50/${baseOpacity} to-emerald-50/${baseOpacity} dark:from-green-900/20 dark:to-emerald-900/20 hover:from-green-100/${hoverOpacity} hover:to-emerald-100/${hoverOpacity} dark:hover:from-green-900/30 dark:hover:to-emerald-900/30`;
      default:
        return `bg-gradient-to-r from-gray-50/${baseOpacity} to-white/${baseOpacity} dark:from-gray-700/20 dark:to-gray-800/20 hover:from-gray-100/${hoverOpacity} hover:to-white/${hoverOpacity} dark:hover:from-gray-700/30 dark:hover:to-gray-800/30`;
    }
  };

  const getIconColor = (color: string) => {
    switch (color) {
      case "emerald":
        return "text-emerald-600 dark:text-emerald-400";
      case "blue":
        return "text-blue-600 dark:text-blue-400";
      case "purple":
        return "text-purple-600 dark:text-purple-400";
      case "orange":
        return "text-orange-600 dark:text-orange-400";
      case "green":
        return "text-green-600 dark:text-green-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  return (
    <div className="flex relative items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-gray-50/90 via-white/90 to-gray-50/90 dark:from-gray-900/90 dark:via-gray-800/90 dark:to-gray-900/90 backdrop-blur-lg border-b border-gray-200/30 dark:border-gray-700/30  shadow-lg">
      <div className="flex items-center gap-2 ">
        <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
          <img
            src={"./logo.png"}
            alt="HolistiCare Logo"
            className="w-8 h-8 rounded-full object-cover"
          />
        </div>
        <h1 className="text-lg sm:text-xl font-thin bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          HolistiCare
        </h1>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 pt-4">
        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setShowNotifications(!showNotifications)
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

        {/* Notification Portal */}
        {showNotifications &&
          createPortal(
            <>
              {/* Background Overlay */}
              <div
                className="absolute inset-0 bg-black/20 backdrop-blur-sm z-[999998]"
                onClick={() => setShowNotifications(false)}
              />
              {/* Notification Panel */}
              <div className="absolute right-[15%] md:right-[28%] xl:right-[35%] 2xl:right-[39%] top-16 w-[280px] sm:w-[320px]  bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-gray-200/20 dark:border-gray-700/20 shadow-2xl rounded-2xl max-h-96 overflow-hidden z-[999999]">
                {/* Header */}
                <div className="p-3 sm:p-4 border-b border-gray-200/30 dark:border-gray-700/30">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100">
                      Notifications 
                    </h3>
                    <div className="flex items-center gap-2">
                      {isUnReadNotif &&
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={markAllAsRead}
                          className="text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50/60 dark:hover:bg-blue-900/20"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Mark all read
                        </Button>
                      }
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowNotifications(false)}
                        className="w-6 h-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {(notificationCount > 0 || isUnReadNotif) && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      You have {notificationCount} unread notification
                      {notificationCount !== 1 ? "s" : ""}
                    </div>
                  )}
                </div>

                {/* Notifications List */}
                <div className="max-h-72 sm:max-h-[200px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 dark:text-gray-400">
                        No notifications
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                        You're all caught up!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1  p-2">
                      {notifications.map((notification) => {
                        const IconComponent = notification.icon;
                        return (
                          <div
                            key={notification.id}
                            className={`p-2 sm:p-3 rounded-xl transition-all duration-300 cursor-pointer group ${getColorClasses(
                              notification.color,
                              notification.read_status
                            )} ${
                              !notification.read_status
                                ? "border-l-4 border-blue-500"
                                : ""
                            }`}
                            onClick={() =>
                              !notification.read_status && markAsRead(notification.id)
                            }
                          >
                            <div className="flex items-start gap-2 sm:gap-3">
                              <div
                                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                  notification.read_status
                                    ? "bg-gray-200/50 dark:bg-gray-700/50"
                                    : `bg-gradient-to-br from-${notification.color}-500/20 to-${notification.color}-600/20 dark:from-${notification.color}-400/20 dark:to-${notification.color}-500/20`
                                }`}
                              >
                                <IconComponent
                                  className={`w-3 h-3 sm:w-4 sm:h-4 ${
                                    notification.read_status
                                      ? "text-gray-500"
                                      : getIconColor(notification.color)
                                  }`}
                                />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1">
                                    <h4
                                      className={`text-xs sm:text-sm font-medium mb-1 ${
                                        notification.read_status
                                          ? "text-gray-600 dark:text-gray-400"
                                          : "text-gray-900 dark:text-gray-100"
                                      }`}
                                    >
                                      {notification.title}
                                    </h4>
                                    <div
                                      className={`text-xs leading-relaxed ${
                                      notification.read_status
                                          ? "text-gray-500 dark:text-gray-500"
                                          : "text-gray-700 dark:text-gray-300"
                                      }`}
                                    >
                                      {notification.message}
                                    </div>
                                    {/* <div className="text-xs text-gray-500 dark:text-gray-500 mt-2 flex items-center gap-1">
                                      <div
                                        className={`w-1 h-1 rounded-full ${
                                        notification.read_status
                                            ? "bg-gray-400"
                                            : "bg-blue-500 animate-pulse"
                                        }`}
                                      />
                                      {notification.time}
                                    </div> */}
                                  </div>

                                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    {!notification.read_status&& (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          markAsRead(notification.id);
                                        }}
                                        className="w-6 h-6 text-blue-600 dark:text-blue-400 hover:bg-blue-100/60 dark:hover:bg-blue-900/30"
                                      >
                                        <Check className="w-3 h-3" />
                                      </Button>
                                    )}
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        removeNotification(notification.id);
                                      }}
                                      className="w-6 h-6 text-red-500 hover:bg-red-100/60 dark:hover:bg-red-900/30"
                                    >
                                      <X className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Footer */}
                {/* {notifications.length > 0 && (
                  <div className="p-3 border-t border-gray-200/30 dark:border-gray-700/30">
                    <Button
                      variant="ghost"
                      className="w-full text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50/60 dark:hover:bg-blue-900/20"
                      onClick={() => {
                        setShowNotifications(false);
                        // Navigate to notifications page if it exists
                      }}
                    >
                      View all notifications
                    </Button>
                  </div>
                )} */}
              </div>
            </>,
            document.body
          )}

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-10 w-10 rounded-full p-0 hover:shadow-lg transition-all duration-300"
            >
              <Avatar className="h-10 w-10 shadow-lg">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-medium">
                  U
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

            <DropdownMenuItem onTouchEnd={handleLogout} onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
