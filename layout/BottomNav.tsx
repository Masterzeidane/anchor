"use client";
import { motion } from "framer-motion";

type Tab = "today" | "stats" | "reflect" | "history";

interface Props {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "today", label: "Today", icon: "◈" },
  { id: "stats", label: "Progress", icon: "↗" },
  { id: "reflect", label: "Reflect", icon: "✦" },
  { id: "history", label: "History", icon: "◷" },
];

export default function BottomNav({ activeTab, onTabChange }: Props) {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex safe-bottom">
      {TABS.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex-1 flex flex-col items-center gap-1 py-3 relative"
          >
            {active && (
              <motion.div
                layoutId="bottom-nav-indicator"
                className="absolute top-0 inset-x-3 h-0.5 rounded-full bg-violet-500"
              />
            )}
            <span
              className={`text-lg transition-colors ${
                active
                  ? "text-violet-600 dark:text-violet-400"
                  : "text-gray-400 dark:text-gray-500"
              }`}
            >
              {tab.icon}
            </span>
            <span
              className={`text-[10px] font-medium transition-colors ${
                active
                  ? "text-violet-600 dark:text-violet-400"
                  : "text-gray-400 dark:text-gray-500"
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
