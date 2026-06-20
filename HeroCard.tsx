"use client";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { fadeIn } from "@/lib/motion";
import ProgressRing from "./ProgressRing";
import BranchCard from "./BranchCard";
import { AppData, DeedCategory } from "@/lib/types";
import {
  computeTotalXP,
  computeLevel,
  getRank,
  xpForCurrentLevel,
  xpForNextLevel,
  getBranchStats,
  computeDailyScore,
  getGreeting,
  getMotivationalMessage,
} from "@/lib/xp";

const CATEGORIES: DeedCategory[] = ["health", "work", "personal", "social", "learning", "other"];

interface Props {
  data: AppData;
  userId: string;
  date: string;
  hasReflection: boolean;
  userName?: string;
  onBranchClick?: (cat: DeedCategory) => void;
}

export default function HeroCard({
  data,
  userId,
  date,
  hasReflection,
  userName,
  onBranchClick,
}: Props) {
  const xp = computeTotalXP(data);
  const level = computeLevel(xp);
  const rank = getRank(level);
  const xpMin = xpForCurrentLevel(level);
  const xpMax = xpForNextLevel(level);
  const xpPct = xpMax > xpMin ? Math.round(((xp - xpMin) / (xpMax - xpMin)) * 100) : 100;
  const dailyScore = computeDailyScore(data, date, hasReflection);
  const branchStats = getBranchStats(data, date);
  const greeting = getGreeting();
  const message = getMotivationalMessage(dailyScore, data.streak ?? 0);

  const scoreColor =
    dailyScore >= 85
      ? "#34d399"
      : dailyScore >= 60
      ? "#60a5fa"
      : dailyScore >= 40
      ? "#fbbf24"
      : "#f87171";

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 md:p-8"
    >
      {/* top row: greeting + score ring */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{greeting}</p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white truncate">
            {userName ?? "Grower"}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {rank} · Level {level}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 italic">"{message}"</p>
        </div>

        <div className="relative flex-shrink-0">
          <ProgressRing
            percentage={dailyScore}
            size={96}
            strokeWidth={8}
            trackColor={scoreColor}
            progressColor={scoreColor}
          />
          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ color: scoreColor }}
          >
            <span className="text-xl font-bold leading-none">{dailyScore}</span>
            <span className="text-[10px] font-medium opacity-70">score</span>
          </div>
        </div>
      </div>

      {/* XP bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1.5">
          <span>XP {xp.toLocaleString()}</span>
          <span>Next level: {xpMax.toLocaleString()}</span>
        </div>
        <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-violet-400 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${xpPct}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          />
        </div>
      </div>

      {/* branch grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-3 gap-3"
      >
        {CATEGORIES.map((cat) => (
          <BranchCard
            key={cat}
            category={cat}
            stat={branchStats[cat]}
            onClick={() => onBranchClick?.(cat)}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
