const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const DEFAULT_MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6";

export class LlmConfigError extends Error {}

interface ClaudeMessageResponse {
  content: { type: string; text?: string }[];
}

/**
 * Calls the Anthropic Messages API server-side. Requires ANTHROPIC_API_KEY
 * to be set in the deployment environment (never exposed to the client).
 */
export async function callClaude(params: {
  system: string;
  user: string;
  maxTokens?: number;
}): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new LlmConfigError(
      "ANTHROPIC_API_KEY is not set. Add it to your environment before generating."
    );
  }

  const response = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      max_tokens: params.maxTokens ?? 1024,
      system: params.system,
      messages: [{ role: "user", content: params.user }],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Anthropic API error (${response.status}): ${detail}`);
  }

  const data = (await response.json()) as ClaudeMessageResponse;
  const textBlock = data.content.find((c) => c.type === "text");
  if (!textBlock?.text) {
    throw new Error("Anthropic API returned no text content.");
  }
  return textBlock.text;
}

/** Strips ```json fences a model sometimes wraps structured output in. */
export function parseJsonResponse<T>(raw: string): T {
  const cleaned = raw.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
  return JSON.parse(cleaned) as T;
}
