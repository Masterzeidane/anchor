import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anchor — Grounded content, three businesses, one engine",
  description:
    "A retrieval-grounded content assistant powering an Islamic reminders account, a cinematic YouTube series, and an e-commerce store.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-body bg-ink text-parchment min-h-screen flex flex-col">
        <header className="border-b border-hairline">
          <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
            <Link href="/" className="font-display text-xl tracking-wide text-parchment">
              Anchor
            </Link>
            <nav className="flex gap-6 text-sm text-parchment-dim">
              <Link href="/reminders" className="hover:text-gold transition-colors">
                Reminders
              </Link>
              <Link href="/storyboard" className="hover:text-gold transition-colors">
                Storyboard
              </Link>
              <Link href="/shopify" className="hover:text-gold transition-colors">
                Ad copy
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-hairline">
          <div className="max-w-5xl mx-auto px-6 py-6 text-xs text-parchment-dim">
            Anchor is a personal project. Generated content should be reviewed before publishing.
          </div>
        </footer>
      </body>
    </html>
  );
}
