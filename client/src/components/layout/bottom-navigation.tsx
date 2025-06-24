import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Home,
  TrendingUp,
  Plus,
  Brain,
  User
} from "lucide-react";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/trends", icon: TrendingUp, label: "Monitor" },
  { path: "/lab-upload", icon: Plus, label: "Add Data", isSpecial: true },
  { path: "/holistic-plans", icon: Brain, label: "AI Plans" },
  { path: "/you", icon: User, label: "You" },
];

export default function BottomNavigation() {
  const [location] = useLocation();

  return (
    <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <Link key={item.path} href={item.path}>
              <button
                className={cn(
                  "flex flex-col items-center py-2 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors",
                  isActive && "text-primary",
                  item.isSpecial && "transform scale-110"
                )}
              >
                <Icon 
                  className={cn(
                    "mb-1",
                    item.isSpecial ? "w-7 h-7" : "w-5 h-5"
                  )} 
                />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
