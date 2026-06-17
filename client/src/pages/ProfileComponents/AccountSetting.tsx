import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface SettingsItem {
  icon: LucideIcon;
  title: string;
  description: string;
  action: () => void;
  badge?: string | null;
  variant?: "default" | "danger";
}

interface AccountSettingProps {
  settingsItems: SettingsItem[];
}

const SettingsRow = ({ item }: { item: SettingsItem }) => {
  const isDanger = item.variant === "danger";

  return (
    <button
      type="button"
      onClick={item.action}
      className={`group flex w-full min-h-[56px] items-center justify-between gap-3 rounded-2xl px-3.5 py-3 text-left transition-all active:scale-[0.99] ${
        isDanger
          ? "bg-red-50/60 hover:bg-red-100/70 dark:bg-red-950/20 dark:hover:bg-red-950/35"
          : "bg-gray-50/80 hover:bg-gray-100/80 dark:bg-gray-800/50 dark:hover:bg-gray-800/70"
      }`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span
          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-sm ${
            isDanger
              ? "from-red-500 to-rose-500"
              : "from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 group-hover:from-emerald-500 group-hover:to-teal-500"
          }`}
        >
          <item.icon
            className={`h-4 w-4 transition-colors ${
              isDanger
                ? "text-white"
                : "text-gray-600 group-hover:text-white dark:text-gray-300"
            }`}
          />
        </span>
        <div className="min-w-0">
          <div
            className={`text-sm font-medium ${
              isDanger
                ? "text-red-700 dark:text-red-400"
                : "text-gray-900 dark:text-gray-100"
            }`}
          >
            {item.title}
          </div>
          <div className="truncate text-xs text-gray-500 dark:text-gray-400">
            {item.description}
          </div>
        </div>
      </div>
      <div className="flex flex-shrink-0 items-center gap-1.5">
        {item.badge && (
          <Badge
            variant="outline"
            className="border-emerald-200/60 bg-emerald-50 text-emerald-700 dark:border-emerald-800/40 dark:bg-emerald-950/40 dark:text-emerald-300"
          >
            {item.badge}
          </Badge>
        )}
        <ChevronRight
          className={`h-4 w-4 transition-colors ${
            isDanger
              ? "text-red-400 group-hover:text-red-600"
              : "text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
          }`}
        />
      </div>
    </button>
  );
};

const AccountSetting = ({ settingsItems }: AccountSettingProps) => {
  return (
    <Card className="overflow-hidden border border-gray-200/60 bg-white/90 shadow-sm backdrop-blur-sm dark:border-gray-700/50 dark:bg-gray-900/90">
      <CardContent className="p-4">
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 shadow-sm">
            <Settings className="h-3.5 w-3.5 text-white" />
          </span>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Settings
          </h3>
        </div>
        <div className="space-y-2">
          {settingsItems.map((item) => (
            <SettingsRow key={item.title} item={item} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountSetting;
