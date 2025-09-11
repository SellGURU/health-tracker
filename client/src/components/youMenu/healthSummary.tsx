import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Droplets,
  Heart,
  Activity,
  Shield,
  Zap,
  Users,
  Waves,
  Pill,
} from "lucide-react";

// ————————————————————————————————————————————
// Types
// ————————————————————————————————————————————
export type Biomarker = {
  chart_bounds: [
    {
      high: string;
      low: null;
      label: string;
      status: string;
      color: string;
    }
  ];
  date: string[];
  duration: string;
  gene_insight: null;
  how_to_improve: string;
  insight: string;
  more_info: string;
  name: string;
  outofref: boolean;
  status: string[];
  subcategory: string;
  subcategory_biomarker_count: number;
  subcategory_needs_focus: number;
  unit: string;
  values: string[];
  what_body_says: string;
  what_it_means: string;
};

// ————————————————————————————————————————————
// Category meta (label, icon, gradient)
// Keys MUST match the `subcategory` values in your data.
// If your data uses different labels, add them here.
// ————————————————————————————————————————————
const CATEGORY_META: Record<
  string,
  {
    label: string;
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    gradient: string;
  }
> = {
  Blood: {
    label: "Blood",
    Icon: Droplets,
    gradient: "from-red-500 to-pink-500",
  },
  "Cardiovascular Risk": {
    label: "Cardiovascular Risk",
    Icon: Heart,
    gradient: "from-emerald-500 to-teal-500",
  },
  "Diabetes & Glucose": {
    label: "Diabetes & Glucose",
    Icon: Activity,
    gradient: "from-yellow-500 to-orange-500",
  },
  "Essential Minerals": {
    label: "Essential Minerals",
    Icon: Shield,
    gradient: "from-blue-500 to-indigo-500",
  },
  "Hormone Health": {
    label: "Hormone Health",
    Icon: Zap,
    gradient: "from-purple-500 to-pink-500",
  },
  "Liver Function": {
    label: "Liver Function",
    Icon: Shield,
    gradient: "from-green-500 to-emerald-500",
  },
  "Sex Hormones": {
    label: "Sex Hormones",
    Icon: Users,
    gradient: "from-indigo-500 to-purple-500",
  },
  "Thyroid Function": {
    label: "Thyroid Function",
    Icon: Waves,
    gradient: "from-cyan-500 to-blue-500",
  },
  Vitamins: {
    label: "Vitamins",
    Icon: Pill,
    gradient: "from-orange-500 to-red-500",
  },
};

// Choose a fixed order for rendering the cards (optional)
const CATEGORY_ORDER = [
  "Blood",
  "Cardiovascular Risk",
  "Diabetes & Glucose",
  "Essential Minerals",
  "Hormone Health",
  "Liver Function",
  "Sex Hormones",
  "Thyroid Function",
  "Vitamins",
];

// ————————————————————————————————————————————
// Utilities
// ————————————————————————————————————————————
function groupBySubcategory(data: Biomarker[]) {
  return data.reduce<Record<string, Biomarker[]>>((acc, item) => {
    const key = item.subcategory || "Unknown";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}

function formatCounts(items: Biomarker[]) {
  const biomarkers = items.length;
  const needsFocus = items.filter((i) => i.outofref === true).length;
  return { biomarkers, needsFocus };
}

// ————————————————————————————————————————————
// Component: CategoryCards
// ————————————————————————————————————————————
export default function CategoryCards({ data }: { data: Biomarker[] }) {
  // Group input data by subcategory
  const groups = React.useMemo(() => groupBySubcategory(data), [data]);

  // Build a list of categories to render: use CATEGORY_ORDER first, then any unknowns
  const known = CATEGORY_ORDER.filter((key) => groups[key]);
  const unknown = Object.keys(groups).filter(
    (k) => !CATEGORY_ORDER.includes(k)
  );
  const orderedKeys = [...known, ...unknown];

  return (
    <CardContent>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {orderedKeys.map((key) => {
          const items = groups[key];
          const { biomarkers, needsFocus } = formatCounts(items);
          const meta = CATEGORY_META[key];
          const Icon = meta?.Icon ?? Shield; // fallback icon
          const gradient = meta?.gradient ?? "from-gray-400 to-gray-600";
          const label = meta?.label ?? key;

          return (
            <div
              key={key}
              className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 shadow-sm"
            >
              <div
                className={`w-8 h-8 bg-gradient-to-br ${gradient} rounded-full flex items-center justify-center flex-shrink-0`}
              >
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {label}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {biomarkers} Biomarker{biomarkers !== 1 ? "s" : ""} ·{" "}
                  {needsFocus} Needs Focus
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </CardContent>
  );
}

// ————————————————————————————————————————————
// Example usage
// ————————————————————————————————————————————
// const exampleData: Biomarker[] = [
//   { id: 1, name: "Hemoglobin", subcategory: "Blood", outofref: false },
//   { id: 2, name: "WBC", subcategory: "Blood", outofref: false },
//   { id: 3, name: "Platelets", subcategory: "Blood", outofref: true },
//   { id: 4, name: "HDL", subcategory: "Cardiovascular Risk", outofref: false },
//   { id: 5, name: "LDL", subcategory: "Cardiovascular Risk", outofref: true },
//   { id: 6, name: "A1C", subcategory: "Diabetes & Glucose", outofref: false },
// ];
//
// <CategoryCards data={exampleData} />
