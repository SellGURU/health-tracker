import { CardContent } from "@/components/ui/card";
import { resolveAnalyseIcon } from "@/help";
import * as React from "react";

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

const CATEGORY_META: Record<
  string,
  {
    label: string;
  }
> = {
  Blood: {
    label: "Blood",
  },
  "Cardiovascular Risk": {
    label: "Cardiovascular Risk",
  },
  "Diabetes & Glucose": {
    label: "Diabetes & Glucose",
  },
  "Essential Minerals": {
    label: "Essential Minerals",
  },
  "Hormone Health": {
    label: "Hormone Health",
  },
  "Liver Function": {
    label: "Liver Function",
  },
  "Sex Hormones": {
    label: "Sex Hormones",
  },
  "Thyroid Function": {
    label: "Thyroid Function",
  },
  Vitamins: {
    label: "Vitamins",
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
      <div className="grid grid-cols-1 gap-3">
        {orderedKeys.map((key) => {
          const items = groups[key];
          const { biomarkers, needsFocus } = formatCounts(items);
          const meta = CATEGORY_META[key];
          const label = meta?.label ?? key;

          return (
            <div
              key={key}
              className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 shadow-sm"
            >
              <div
                className={`w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0`}
                style={{ boxShadow: `0 0 10px 0 rgba(0, 0, 0, 0.3)` }}
              >
                <img src={resolveAnalyseIcon(label)} className="w-5 h-5" />
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
