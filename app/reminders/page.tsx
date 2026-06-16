"use client";

import { useState } from "react";
import type { Citation } from "@/lib/types";

export default function RemindersPage() {
  const [topic, setTopic] = useState("");
  const [audienceNote, setAudienceNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState<string | null>(null);
  const [citations, setCitations] = useState<Citation[]>([]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setText(null);
    setCitations([]);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          mode: "reminders",
          input: { topic, audienceNote: audienceNote || undefined },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Generation failed.");
      setText(data.text);
      setCitations(data.citations);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <p className="text-evidence text-sm font-mono mb-2 tracking-wide">MODULE 01</p>
      <h1 className="font-display text-3xl mb-3">Reminders</h1>
      <p className="text-parchment-dim max-w-xl mb-10 leading-relaxed">
        Retrieves the closest entries from the source corpus for a topic, then
        drafts a short reminder grounded only in those entries. Every line is
        traceable below.
      </p>

      <form onSubmit={handleSubmit} className="max-w-md space-y-4 mb-12">
        <div>
          <label className="block text-sm text-parchment-dim mb-1">Topic</label>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. tawakkul, backbiting, tahajjud"
            required
            className="w-full bg-panel border border-hairline rounded px-3 py-2 text-parchment placeholder:text-parchment-dim/60 focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <div>
          <label className="block text-sm text-parchment-dim mb-1">
            Audience note (optional)
          </label>
          <input
            value={audienceNote}
            onChange={(e) => setAudienceNote(e.target.value)}
            placeholder="e.g. write for someone scrolling late at night"
            className="w-full bg-panel border border-hairline rounded px-3 py-2 text-parchment placeholder:text-parchment-dim/60 focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !topic}
          className="bg-gold text-ink font-medium px-5 py-2 rounded hover:bg-gold/90 disabled:opacity-50 transition-colors"
        >
          {loading ? "Drafting…" : "Draft reminder"}
        </button>
      </form>

      {error && (
        <div className="border border-hairline rounded p-4 text-sm text-parchment-dim mb-8">
          Couldn&apos;t generate that. {error}
        </div>
      )}

      {text && (
        <div className="grid sm:grid-cols-[1fr_280px] gap-8">
          <div className="border border-hairline rounded p-6 font-display text-lg leading-relaxed">
            {text}
          </div>
          <div>
            <p className="text-xs font-mono text-parchment-dim mb-3 tracking-wide">
              SOURCES USED
            </p>
            <div className="space-y-3">
              {citations.map((c) => {
                const unverified = c.reference.startsWith("REPLACE_WITH");
                return (
                  <div key={c.id} className="border-l-2 border-evidence pl-3">
                    <p className="text-sm">
                      <span className="numeral text-evidence">[{c.index}]</span>{" "}
                      <span className="font-medium">{c.title}</span>
                    </p>
                    <p className="text-xs text-parchment-dim mt-1 leading-relaxed">
                      {c.snippet}
                    </p>
                    <p
                      className={`text-xs font-mono mt-1 ${
                        unverified ? "text-gold" : "text-parchment-dim"
                      }`}
                    >
                      {unverified ? "NEEDS VERIFICATION" : c.reference}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
