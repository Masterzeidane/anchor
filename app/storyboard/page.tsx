"use client";

import { useState } from "react";
import type { StoryboardScene } from "@/lib/types";

export default function StoryboardPage() {
  const [topic, setTopic] = useState("");
  const [sceneCount, setSceneCount] = useState(4);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scenes, setScenes] = useState<StoryboardScene[]>([]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setScenes([]);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mode: "storyboard", input: { topic, sceneCount } }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Generation failed.");
      setScenes(data.scenes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <p className="text-evidence text-sm font-mono mb-2 tracking-wide">MODULE 02</p>
      <h1 className="font-display text-3xl mb-3">Storyboard</h1>
      <p className="text-parchment-dim max-w-xl mb-10 leading-relaxed">
        Turns a scene topic into a structured shot list for the production
        pipeline — setting, action, camera note, and duration per scene.
      </p>

      <form onSubmit={handleSubmit} className="max-w-md space-y-4 mb-12">
        <div>
          <label className="block text-sm text-parchment-dim mb-1">Scene topic</label>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Ibrahim leaving the idols' temple"
            required
            className="w-full bg-panel border border-hairline rounded px-3 py-2 text-parchment placeholder:text-parchment-dim/60 focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <div>
          <label className="block text-sm text-parchment-dim mb-1">Number of scenes</label>
          <input
            type="number"
            min={1}
            max={10}
            value={sceneCount}
            onChange={(e) => setSceneCount(Number(e.target.value))}
            className="w-32 bg-panel border border-hairline rounded px-3 py-2 text-parchment focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !topic}
          className="bg-gold text-ink font-medium px-5 py-2 rounded hover:bg-gold/90 disabled:opacity-50 transition-colors"
        >
          {loading ? "Building shot list…" : "Build shot list"}
        </button>
      </form>

      {error && (
        <div className="border border-hairline rounded p-4 text-sm text-parchment-dim mb-8">
          Couldn&apos;t generate that. {error}
        </div>
      )}

      {scenes.length > 0 && (
        <div className="space-y-4">
          {scenes.map((s) => (
            <div
              key={s.sceneNumber}
              className="grid grid-cols-[48px_1fr] gap-4 border-b border-hairline pb-4"
            >
              <span className="numeral text-2xl text-gold-dim">
                {String(s.sceneNumber).padStart(2, "0")}
              </span>
              <div>
                <p className="font-medium">{s.setting}</p>
                <p className="text-sm text-parchment-dim mt-1 leading-relaxed">
                  {s.action}
                </p>
                <p className="text-xs font-mono text-evidence mt-2">
                  {s.cameraNote} · {s.durationSeconds}s
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
