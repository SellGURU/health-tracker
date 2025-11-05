import React, { useEffect, useRef, useState } from "react";
import { Bot, User, ChevronDown, Check } from "lucide-react";

type ChatMode = "ai" | "coach";

export default function SimpleModeSelect({
  activeMode,
  setActiveMode,
  disabled = false,
}: {
  activeMode: ChatMode;
  setActiveMode: (mode: ChatMode) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const optionsRef = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (disabled) {
      setOpen(false);
    }
  }, [disabled]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return;
      const focused = document.activeElement;
      const idx = optionsRef.current.findIndex((el) => el === focused);
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = Math.min(idx + 1, optionsRef.current.length - 1);
        optionsRef.current[next]?.focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = Math.max(idx - 1, 0);
        optionsRef.current[prev]?.focus();
      } else if (e.key === "Tab") {
        // let default tab behavior
      } else if (e.key === "Enter" && idx >= 0) {
        e.preventDefault();
        const el = optionsRef.current[idx];
        el?.click();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const items: { value: ChatMode; title: string; desc: string }[] = [
    {
      value: "ai",
      title: "AI Copilot",
      desc: "Instant responses",
    },
    {
      value: "coach",
      title: "Coach",
      desc: "Expert guidance",
    },
  ];

  return (
    <div ref={rootRef} className="mb-2 w-full relative">
      {/* Trigger */}
      <button
        ref={triggerRef}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => {
          if (!disabled) {
            setOpen((v) => !v);
          }
        }}
        disabled={disabled}
        className={`w-full group relative min-h-[56px] px-3 py-2 flex items-center gap-3 bg-gradient-to-r from-gray-100/80 to-blue-100/50 dark:from-gray-800/80 dark:to-blue-900/30 border border-gray-200/30 dark:border-gray-700/20 shadow-inner rounded-xl ${
          disabled ? "opacity-60 cursor-not-allowed" : ""
        }`}
      >
        <div
          className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center ${
            activeMode === "ai"
              ? "bg-gradient-to-br from-blue-500 to-cyan-500"
              : "bg-gradient-to-br from-emerald-500 to-teal-500"
          }`}
        >
          {activeMode === "ai" ? (
            <Bot className="w-4 h-4 text-white" />
          ) : (
            <User className="w-4 h-4 text-white" />
          )}
        </div>

        <div className="flex-1 text-left">
          <div className="font-medium text-sm whitespace-normal break-words">
            {activeMode === "ai" ? "AI Copilot" : "Coach"}
          </div>
          <div className="text-xs text-gray-500 whitespace-normal break-words">
            {activeMode === "ai" ? "Instant responses" : "Expert guidance"}
          </div>
        </div>

        {!disabled && (
          <div className="flex items-center ml-3">
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </div>
        )}
      </button>

      {/* Dropdown */}
      {open && !disabled && (
        <div
          role="listbox"
          aria-label="Select mode"
          className="absolute z-50 mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
        >
          <div className="flex flex-col">
            {items.map((it, i) => (
              <div
                key={it.value}
                role="option"
                tabIndex={0}
                ref={(el) => (optionsRef.current[i] = el)}
                onClick={() => {
                  if (!disabled) {
                    setActiveMode(it.value);
                    setOpen(false);
                    triggerRef.current?.focus();
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !disabled) {
                    setActiveMode(it.value);
                    setOpen(false);
                    triggerRef.current?.focus();
                  }
                }}
                className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-200 cursor-pointer ${
                  activeMode === it.value ? "bg-orange-300" : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center ${
                    it.value === "ai"
                      ? "bg-gradient-to-br from-blue-500 to-cyan-500"
                      : "bg-gradient-to-br from-emerald-500 to-teal-500"
                  }`}
                >
                  {it.value === "ai" ? (
                    <Bot className="w-4 h-4 text-white" />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium">{it.title}</div>
                  <div className="text-xs text-gray-500">{it.desc}</div>
                </div>
                {activeMode === it.value && (
                  <Check className="w-4 h-4 text-black" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
