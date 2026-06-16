import Link from "next/link";

const modules = [
  {
    n: "01",
    href: "/reminders",
    title: "Reminders",
    description:
      "Retrieves the closest matching entries from a curated source corpus, then drafts a short reminder post grounded only in what was retrieved — with every line traceable to a cited source.",
    tag: "Retrieval + citation",
  },
  {
    n: "02",
    href: "/storyboard",
    title: "Storyboard",
    description:
      "Turns a scene topic into a structured shot list — setting, action, camera note, duration — for the cinematic production pipeline.",
    tag: "Structured generation",
  },
  {
    n: "03",
    href: "/shopify",
    title: "Ad copy",
    description:
      "Takes a product name and a few real details and drafts a headline, body, and three benefit-led bullets, without inventing claims.",
    tag: "Structured generation",
  },
];

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <p className="text-evidence text-sm font-mono mb-4 tracking-wide">
        ONE ENGINE — THREE LEDGERS
      </p>
      <h1 className="font-display text-4xl sm:text-5xl leading-tight max-w-2xl">
        Content that shows its working.
      </h1>
      <p className="text-parchment-dim mt-6 max-w-xl leading-relaxed">
        Anchor is a small content engine that powers three real, separate
        workflows: an Islamic reminders account, a cinematic YouTube series,
        and an e-commerce store. Every module shares the same retrieval and
        generation core underneath.
      </p>

      <div className="mt-16 border-t border-hairline">
        {modules.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className="group grid grid-cols-[64px_1fr_auto] sm:grid-cols-[80px_1fr_140px] items-start gap-4 py-8 border-b border-hairline hover:bg-panel/50 transition-colors px-2"
          >
            <span className="numeral text-3xl text-gold-dim group-hover:text-gold transition-colors">
              {m.n}
            </span>
            <span>
              <span className="font-display text-xl block mb-1">{m.title}</span>
              <span className="text-parchment-dim text-sm leading-relaxed block max-w-md">
                {m.description}
              </span>
            </span>
            <span className="text-xs font-mono text-evidence self-center justify-self-end sm:justify-self-start">
              {m.tag}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
