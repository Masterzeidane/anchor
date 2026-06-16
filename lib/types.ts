export interface SourceEntry {
  id: string;
  topic: string;
  title: string;
  summary: string;
  reference: string;
  tags: string[];
}

export interface RetrievedSource extends SourceEntry {
  score: number;
}

export interface Citation {
  index: number;
  id: string;
  title: string;
  reference: string;
  snippet: string;
}

export type GenerateMode = "reminders" | "storyboard" | "shopify";

export interface RemindersInput {
  topic: string;
  audienceNote?: string;
}

export interface RemindersOutput {
  text: string;
  citations: Citation[];
}

export interface StoryboardScene {
  sceneNumber: number;
  setting: string;
  action: string;
  cameraNote: string;
  durationSeconds: number;
}

export interface StoryboardInput {
  topic: string;
  sceneCount: number;
}

export interface StoryboardOutput {
  scenes: StoryboardScene[];
}

export interface ShopifyInput {
  productName: string;
  productDetails: string;
  tone: string;
}

export interface ShopifyOutput {
  headline: string;
  body: string;
  bullets: string[];
}
