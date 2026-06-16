import sourcesData from "@/data/sources.json";
import { retrieveTopK } from "./retrieval";
import { callClaude, parseJsonResponse } from "./llm";
import type {
  Citation,
  RemindersInput,
  RemindersOutput,
  ShopifyInput,
  ShopifyOutput,
  SourceEntry,
  StoryboardInput,
  StoryboardOutput,
} from "./types";

const sources = sourcesData as SourceEntry[];

export async function generateReminder(input: RemindersInput): Promise<RemindersOutput> {
  const retrieved = retrieveTopK(input.topic, sources, 3);

  if (retrieved.length === 0) {
    throw new Error(
      "No sources matched this topic. Add more entries to data/sources.json or try a broader topic."
    );
  }

  const context = retrieved
    .map(
      (r, i) =>
        `[${i + 1}] Title: ${r.title}\nReference: ${r.reference}\nNote: ${r.summary}`
    )
    .join("\n\n");

  const system =
    "You write short, sincere Islamic reminder posts in a self-accountability voice: " +
    "firm, no emojis, no hashtags, no motivational filler, written as someone reminding " +
    "themselves first, not lecturing others. You must ground every claim ONLY in the " +
    "numbered sources provided. Cite a source inline using its bracket number, e.g. [1]. " +
    "If the provided sources are placeholder/sample text, do not invent specific Quran " +
    "ayah wording or hadith wording yourself -- write generally and flag clearly that the " +
    "underlying source needs to be verified before publishing.";

  const user =
    `Topic: ${input.topic}\n` +
    (input.audienceNote ? `Audience note: ${input.audienceNote}\n` : "") +
    `\nSources:\n${context}\n\n` +
    "Write one reminder post (3-6 sentences) grounded only in these sources, with inline " +
    "bracket citations.";

  const text = await callClaude({ system, user, maxTokens: 400 });

  const citations: Citation[] = retrieved.map((r, i) => ({
    index: i + 1,
    id: r.id,
    title: r.title,
    reference: r.reference,
    snippet: r.summary,
  }));

  return { text, citations };
}

export async function generateStoryboard(input: StoryboardInput): Promise<StoryboardOutput> {
  const system =
    "You are a storyboard assistant for a cinematic, no-talking-head Islamic narrative " +
    "YouTube series. Given a scene topic, output a structured shot list as strict JSON " +
    "matching this TypeScript type, and nothing else (no markdown fences, no commentary): " +
    '{ "scenes": [{ "sceneNumber": number, "setting": string, "action": string, ' +
    '"cameraNote": string, "durationSeconds": number }] }. Keep depictions tasteful and ' +
    "avoid depicting any Prophet's face or form directly; favor symbolic, landscape, and " +
    "object-focused shots consistent with respectful Islamic visual conventions.";

  const user = `Scene topic: ${input.topic}\nNumber of scenes: ${input.sceneCount}`;

  const raw = await callClaude({ system, user, maxTokens: 800 });
  return parseJsonResponse<StoryboardOutput>(raw);
}

export async function generateAdCopy(input: ShopifyInput): Promise<ShopifyOutput> {
  const system =
    "You write concise e-commerce ad copy. Output strict JSON matching this TypeScript " +
    'type, and nothing else: { "headline": string, "body": string, "bullets": string[] }. ' +
    "Bullets should be 3 short benefit-led phrases. Do not invent product claims that " +
    "weren't provided.";

  const user =
    `Product name: ${input.productName}\n` +
    `Product details: ${input.productDetails}\n` +
    `Tone: ${input.tone}`;

  const raw = await callClaude({ system, user, maxTokens: 500 });
  return parseJsonResponse<ShopifyOutput>(raw);
}
