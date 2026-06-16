import type { RetrievedSource, SourceEntry } from "./types";

/**
 * Lightweight TF-IDF + cosine similarity retrieval.
 *
 * Why TF-IDF instead of a dense embedding model: this project runs without
 * any external embedding API or downloaded model weights, which keeps it
 * deployable with zero extra infrastructure and zero extra cost. For a small,
 * curated corpus (tens to low hundreds of entries) sparse retrieval performs
 * well and is fully inspectable. If the corpus grows past a few hundred
 * entries, swap this module for a dense embedding + vector store (e.g.
 * Voyage AI embeddings + pgvector) behind the same `retrieveTopK` signature.
 */

const STOPWORDS = new Set([
  "the", "a", "an", "of", "to", "in", "on", "for", "and", "or", "is", "are",
  "be", "with", "that", "this", "it", "as", "at", "by", "from", "your", "you",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

function termFrequency(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
  return tf;
}

function buildDocumentText(entry: SourceEntry): string {
  return [entry.title, entry.summary, entry.tags.join(" "), entry.topic].join(" ");
}

/** Builds an IDF map across the full corpus, computed once per request. */
function buildIdf(documents: string[][]): Map<string, number> {
  const docCount = documents.length;
  const containing = new Map<string, number>();
  for (const doc of documents) {
    const seen = new Set(doc);
    for (const term of seen) {
      containing.set(term, (containing.get(term) ?? 0) + 1);
    }
  }
  const idf = new Map<string, number>();
  for (const [term, count] of containing) {
    idf.set(term, Math.log((docCount + 1) / (count + 1)) + 1);
  }
  return idf;
}

function tfidfVector(
  tokens: string[],
  idf: Map<string, number>
): Map<string, number> {
  const tf = termFrequency(tokens);
  const vec = new Map<string, number>();
  for (const [term, freq] of tf) {
    vec.set(term, freq * (idf.get(term) ?? 0));
  }
  return vec;
}

function cosineSimilarity(a: Map<string, number>, b: Map<string, number>): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (const v of a.values()) normA += v * v;
  for (const v of b.values()) normB += v * v;
  for (const [term, va] of a) {
    const vb = b.get(term);
    if (vb) dot += va * vb;
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function retrieveTopK(
  query: string,
  corpus: SourceEntry[],
  k: number
): RetrievedSource[] {
  const docTokens = corpus.map((entry) => tokenize(buildDocumentText(entry)));
  const idf = buildIdf(docTokens);
  const queryVec = tfidfVector(tokenize(query), idf);

  const scored = corpus.map((entry, i) => ({
    ...entry,
    score: cosineSimilarity(queryVec, tfidfVector(docTokens[i], idf)),
  }));

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}
