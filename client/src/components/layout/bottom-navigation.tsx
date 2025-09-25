import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  Home,
  TrendingUp,
  MessageCircle,
  BookOpen,
  Target,
} from "lucide-react";
import { subscribe } from "@/lib/event";
import { useState } from "react";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/monitor", icon: TrendingUp, label: "Monitor" },
  { path: "/chat", icon: MessageCircle, label: "Chat", isSpecial: true },
  { path: "/plan", icon: Target, label: "Plan" },
  { path: "/educational", icon: BookOpen, label: "Educational" },
];

export default function BottomNavigation() {
  const [location] = useLocation();
  const [brandInfo, setBrandInfo] = useState<{
    last_update: string;
    logo: string;
    name: string;
    headline: string;
    primary_color: string;
    secondary_color: string;
    tone: string;
    focus_area: string;
  }>();
  subscribe("brand_info", (data: any) => {
    setBrandInfo(data.detail.information);
  });

  return (
    <div className="bg-gradient-to-r fixed bottom-0 left-0 right-0 z-50 from-gray-50/90 via-white/90 to-gray-50/90 dark:from-gray-900/90 dark:via-gray-800/90 dark:to-gray-900/90 backdrop-blur-lg border-t border-gray-200/30 dark:border-gray-700/30 shadow-lg max-w-md w-full mx-auto">
      <div className="px-2 sm:px-6 py-2 sm:py-3">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;

            return (
              <Link key={item.path} href={item.path}>
                <button
                  className={cn(
                    "flex flex-col items-center py-2 sm:py-3 px-1 sm:px-2 rounded-2xl transition-all duration-300",
                    isActive
                      ? "bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm shadow-lg transform scale-105"
                      : "hover:bg-gray-100/50 dark:hover:bg-gray-700/30 hover:shadow-md",
                    item.isSpecial && "transform scale-110"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-full p-1.5 sm:p-2 mb-1 transition-all duration-300",
                      isActive
                        ? `shadow-lg`
                        : "bg-gray-200/50 dark:bg-gray-700/50"
                    )}
                    style={{
                      background: isActive
                        ? `linear-gradient(to right, ${
                            brandInfo ? brandInfo?.primary_color : `#3b82f6`
                          }, ${
                            brandInfo
                              ? brandInfo?.secondary_color
                              : `#a855f7`
                          })`
                        : "",
                    }}
                  >
                    <Icon
                      className={cn(
                        isActive
                          ? "text-white"
                          : "text-gray-600 dark:text-gray-400",
                        item.isSpecial
                          ? "w-5 h-5 sm:w-6 sm:h-6"
                          : "w-4 h-4 sm:w-5 sm:h-5"
                      )}
                    />
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium transition-colors hidden sm:block",
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-600 dark:text-gray-400"
                    )}
                  >
                    {item.label}
                  </span>
                </button>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
