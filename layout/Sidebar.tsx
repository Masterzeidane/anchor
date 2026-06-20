"use client";
import { motion } from "framer-motion";
import { slideInLeft } from "@/lib/motion";
import { AppData } from "@/lib/types";
import {
  computeTotalXP,
  computeLevel,
  getRank,
  xpForCurrentLevel,
  xpForNextLevel,
} from "@/lib/xp";

type Tab = "today" | "stats" | "reflect" | "history";

interface Props {
  data: AppData;
  userName?: string;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const NAV_ITEMS: { id: Tab; label: string; icon: string }[] = [
  { id: "today", label: "Today", icon: "◈" },
  { id: "stats", label: "Progress", icon: "↗" },
  { id: "reflect", label: "Reflect", icon: "✦" },
  { id: "history", label: "History", icon: "◷" },
];

export default function Sidebar({ data, userName, activeTab, onTabChange }: Props) {
  const xp = computeTotalXP(data);
  const level = computeLevel(xp);
  const rank = getRank(level);
  const xpMin = xpForCurrentLevel(level);
  const xpMax = xpForNextLevel(level);
  const xpPct = xpMax > xpMin ? Math.round(((xp - xpMin) / (xpMax - xpMin)) * 100) : 100;

  return (
    <motion.aside
      variants={slideInLeft}
      initial="hidden"
      animate="visible"
      className="hidden lg:flex flex-col w-60 shrink-0 sticky top-0 h-screen border-r border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 py-6 px-4"
    >
      {/* brand */}
      <div className="mb-8 px-2">
        <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
          Growth<span className="text-violet-500">OS</span>
        </span>
      </div>

      {/* nav */}
      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? "bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* user + XP */}
      <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mt-4">
        <div className="px-2 mb-3">
          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {userName ?? "Grower"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {rank} · Level {level}
          </p>
        </div>
        <div className="px-2">
          <div className="flex justify-between text-[10px] text-gray-400 mb-1">
            <span>{xp} XP</span>
            <span>{xpPct}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-violet-400 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${xpPct}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
            />
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
