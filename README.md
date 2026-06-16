# Anchor

A retrieval-grounded content engine powering three real, separate workflows
from one shared core:

- **Reminders** — retrieves the closest matching entries from a curated
  source corpus via TF-IDF + cosine similarity, then drafts a short reminder
  post grounded only in what was retrieved, with inline citations back to the
  exact source used.
- **Storyboard** — turns a scene topic into a structured shot list (setting,
  action, camera note, duration) for a cinematic video production pipeline.
- **Ad copy** — drafts a headline, body, and three benefit-led bullets for an
  e-commerce product from real product details, without inventing claims.

## Why this architecture

All three modules share two pieces of infrastructure:

1. `lib/retrieval.ts` — a small TF-IDF + cosine similarity retriever. No
   external embedding API, no vector database, no downloaded model weights.
   This keeps the project deployable with zero extra infrastructure. It's
   used by the Reminders module; the other two modules call the LLM directly
   since they don't need a corpus to ground against.
2. `lib/llm.ts` — a single wrapper around the Anthropic Messages API, called
   server-side only (the API key never reaches the browser).

Each module is a thin page + prompt on top of that shared core, defined in
`lib/generators.ts`.

## ⚠️ Important: the source corpus is placeholder data

`data/sources.json` contains **placeholder entries only** — each one is
clearly marked `PLACEHOLDER ENTRY` with `reference: "REPLACE_WITH_VERIFIED_REFERENCE"`.
This is intentional: the actual Quran ayah / hadith text and its exact
reference needs to come from you (or be checked against a source you trust),
not be generated. The app will visibly flag any citation still using the
placeholder reference with a "NEEDS VERIFICATION" badge in the UI, so it's
obvious which entries still need real sourcing before you publish anything
generated from them.

To extend the corpus, add more objects to `data/sources.json` following the
existing shape:

```json
{
  "id": "src-009",
  "topic": "ikhlas",
  "title": "Short, accurate title",
  "summary": "The actual verified note, ayah, or hadith summary.",
  "reference": "Surah :, Ayah  — or the verified hadith reference",
  "tags": ["ikhlas", "sincerity"]
}
```

## Running locally

```bash
npm install
cp .env.example .env.local   # add your ANTHROPIC_API_KEY
npm run dev
```

## Deploying

This is a standard Next.js 14 App Router project — it deploys to Vercel with
no extra configuration. Set `ANTHROPIC_API_KEY` as an environment variable in
your Vercel project settings before deploying.

## Possible next steps

- Swap `lib/retrieval.ts` for dense embeddings (e.g. Voyage AI) + a vector
  store if the corpus grows past a few hundred entries.
- Add a lightweight auth gate if this is deployed somewhere public, since
  each generation call costs API credits.
- Persist generated drafts (a database, or even `window.storage` if this
  were rebuilt as a Claude artifact) instead of losing them on refresh.
