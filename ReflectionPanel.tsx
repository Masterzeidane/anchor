"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp, scaleIn } from "@/lib/motion";
import { useReflection } from "@/hooks/useReflection";

const PROMPTS = [
  "What went well today and why?",
  "What would I do differently?",
  "What am I most grateful for today?",
  "What did I learn about myself?",
  "What's one thing I want to carry into tomorrow?",
];

interface Props {
  userId: string;
  date: string;
}

export default function ReflectionPanel({ userId, date }: Props) {
  const { todayReflection, saveReflection, reflectionStreak, reflections } =
    useReflection(userId, date);

  const [selectedPrompt, setSelectedPrompt] = useState(PROMPTS[0]);
  const [text, setText] = useState(todayReflection?.text ?? "");
  const [saved, setSaved] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  function handleSave() {
    if (!text.trim()) return;
    saveReflection(selectedPrompt, text.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Daily Reflection</h3>
          {reflectionStreak > 0 && (
            <p className="text-xs text-violet-500 dark:text-violet-400 mt-0.5">
              {reflectionStreak} day streak ✦
            </p>
          )}
        </div>
        {reflections.length > 0 && (
          <button
            onClick={() => setShowHistory((v) => !v)}
            className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            {showHistory ? "Hide history" : `History (${reflections.length})`}
          </button>
        )}
      </div>

      {/* prompt selector */}
      <div className="flex gap-2 flex-wrap mb-4">
        {PROMPTS.map((p) => (
          <button
            key={p}
            onClick={() => setSelectedPrompt(p)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              selectedPrompt === p
                ? "border-violet-400 bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300"
                : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            {p.length > 32 ? p.slice(0, 30) + "…" : p}
          </button>
        ))}
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 font-medium">
        {selectedPrompt}
      </p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your reflection here…"
        rows={4}
        className="w-full resize-none rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm p-3 focus:outline-none focus:ring-2 focus:ring-violet-400 transition"
      />

      <div className="flex items-center justify-between mt-3">
        <span className="text-xs text-gray-400">{text.length} chars</span>
        <AnimatePresence mode="wait">
          {saved ? (
            <motion.span
              key="saved"
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="text-xs text-emerald-500 font-medium"
            >
              Saved ✓
            </motion.span>
          ) : (
            <motion.button
              key="btn"
              onClick={handleSave}
              disabled={!text.trim()}
              className="px-4 py-1.5 rounded-full text-xs font-semibold bg-violet-500 hover:bg-violet-600 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors"
              whileTap={{ scale: 0.96 }}
            >
              Save reflection
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* history */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-5 space-y-3 border-t border-gray-100 dark:border-gray-800 pt-4">
              {reflections.slice(0, 10).map((r) => (
                <div key={r.createdAt} className="text-sm">
                  <p className="text-xs text-gray-400 mb-1">{r.date} · {r.prompt.slice(0, 40)}…</p>
                  <p className="text-gray-700 dark:text-gray-300 line-clamp-2">{r.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
