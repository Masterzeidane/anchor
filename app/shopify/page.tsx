"use client";

import { useState } from "react";
import type { ShopifyOutput } from "@/lib/types";

export default function ShopifyPage() {
  const [productName, setProductName] = useState("");
  const [productDetails, setProductDetails] = useState("");
  const [tone, setTone] = useState("warm, modest, confident");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<ShopifyOutput | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOutput(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          mode: "shopify",
          input: { productName, productDetails, tone },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Generation failed.");
      setOutput(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <p className="text-evidence text-sm font-mono mb-2 tracking-wide">MODULE 03</p>
      <h1 className="font-display text-3xl mb-3">Ad copy</h1>
      <p className="text-parchment-dim max-w-xl mb-10 leading-relaxed">
        Drafts a headline, body, and three benefit-led bullets from real
        product details. It won&apos;t invent claims you didn&apos;t give it.
      </p>

      <form onSubmit={handleSubmit} className="max-w-md space-y-4 mb-12">
        <div>
          <label className="block text-sm text-parchment-dim mb-1">Product name</label>
          <input
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="e.g. Nur Oud Eau de Parfum"
            required
            className="w-full bg-panel border border-hairline rounded px-3 py-2 text-parchment placeholder:text-parchment-dim/60 focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <div>
          <label className="block text-sm text-parchment-dim mb-1">Product details</label>
          <textarea
            value={productDetails}
            onChange={(e) => setProductDetails(e.target.value)}
            placeholder="Real notes, ingredients, longevity, size, price — whatever is true"
            required
            rows={4}
            className="w-full bg-panel border border-hairline rounded px-3 py-2 text-parchment placeholder:text-parchment-dim/60 focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <div>
          <label className="block text-sm text-parchment-dim mb-1">Tone</label>
          <input
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full bg-panel border border-hairline rounded px-3 py-2 text-parchment focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !productName || !productDetails}
          className="bg-gold text-ink font-medium px-5 py-2 rounded hover:bg-gold/90 disabled:opacity-50 transition-colors"
        >
          {loading ? "Drafting…" : "Draft copy"}
        </button>
      </form>

      {error && (
        <div className="border border-hairline rounded p-4 text-sm text-parchment-dim mb-8">
          Couldn&apos;t generate that. {error}
        </div>
      )}

      {output && (
        <div className="border border-hairline rounded p-6 max-w-xl space-y-4">
          <h2 className="font-display text-2xl">{output.headline}</h2>
          <p className="text-parchment-dim leading-relaxed">{output.body}</p>
          <ul className="space-y-1">
            {output.bullets.map((b, i) => (
              <li key={i} className="text-sm flex gap-2">
                <span className="text-evidence numeral">{String(i + 1).padStart(2, "0")}</span>
                {b}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
