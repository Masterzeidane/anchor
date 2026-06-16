import { NextRequest, NextResponse } from "next/server";
import { generateAdCopy, generateReminder, generateStoryboard } from "@/lib/generators";
import { LlmConfigError } from "@/lib/llm";
import type { GenerateMode } from "@/lib/types";

export async function POST(req: NextRequest) {
  let body: { mode?: GenerateMode; input?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { mode, input } = body;
  if (!mode || !input) {
    return NextResponse.json({ error: "Missing mode or input." }, { status: 400 });
  }

  try {
    switch (mode) {
      case "reminders":
        return NextResponse.json(await generateReminder(input as never));
      case "storyboard":
        return NextResponse.json(await generateStoryboard(input as never));
      case "shopify":
        return NextResponse.json(await generateAdCopy(input as never));
      default:
        return NextResponse.json({ error: `Unknown mode: ${mode}` }, { status: 400 });
    }
  } catch (err) {
    if (err instanceof LlmConfigError) {
      return NextResponse.json({ error: err.message }, { status: 503 });
    }
    const message = err instanceof Error ? err.message : "Unknown error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
