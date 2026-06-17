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

const CATEGORY_META: Record<string, { label: string }> = {
  Blood: { label: "Blood" },
  "Cardiovascular Risk": { label: "Cardiovascular Risk" },
  "Diabetes & Glucose": { label: "Diabetes & Glucose" },
  "Essential Minerals": { label: "Essential Minerals" },
  "Hormone Health": { label: "Hormone Health" },
  "Liver Function": { label: "Liver Function" },
  "Sex Hormones": { label: "Sex Hormones" },
  "Thyroid Function": { label: "Thyroid Function" },
  Vitamins: { label: "Vitamins" },
};

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
  const groups = React.useMemo(() => groupBySubcategory(data), [data]);

  const known = CATEGORY_ORDER.filter((key) => groups[key]);
  const unknown = Object.keys(groups).filter(
    (k) => !CATEGORY_ORDER.includes(k)
  );
  const orderedKeys = [...known, ...unknown];

  return (
    <div className="space-y-2">
      {orderedKeys.map((key) => {
        const items = groups[key];
        const { biomarkers, needsFocus } = formatCounts(items);
        const label = CATEGORY_META[key]?.label ?? key;

        return (
          <div
            key={key}
            className="flex items-center gap-3 rounded-2xl bg-gray-50/80 px-3 py-2.5 dark:bg-gray-800/50"
          >
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-white shadow-sm dark:bg-gray-700">
              <img
                src={resolveAnalyseIcon(label)}
                alt=""
                className="h-5 w-5"
              />
            </span>
            <div className="min-w-0 flex-1">
              <p
                className="truncate text-xs font-medium text-gray-900 dark:text-gray-100"
                title={label}
              >
                {label}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                {biomarkers} biomarker{biomarkers !== 1 ? "s" : ""} ·{" "}
                <span
                  className={
                    needsFocus > 0
                      ? "font-medium text-amber-600 dark:text-amber-400"
                      : ""
                  }
                >
                  {needsFocus} needs focus
                </span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
