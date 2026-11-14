import { readFileSync } from "fs";
import { resolve } from "path";
import { Anthropic } from "@anthropic-ai/sdk";
import { UserData } from "../types/resume";

export async function parseResume(filePath: string): Promise<UserData> {
  let content = "";

  // Jika URL, fetch dulu
  if (filePath.startsWith("http")) {
    const response = await fetch(filePath);
    content = await response.text();
  } else {
    content = readFileSync(resolve(filePath), "utf-8");
  }

  const prompt = `Ringkas data berikut menjadi JSON dengan pola berikut:
  {
    "name": "...",
    "title": "...",
    "skills": ["...", "..."],
    "experience": [{"role": "...", "company": "...", "duration": "...", "description": "..."}],
    "education": [{"degree": "...", "institution": "...", "year": "..."}],
    "links": [{"type": "GitHub", "url": "..."}]
  }

  Data: ${content.substring(0, 10000)}`;

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
  const result = await client.messages.create({
    model: "claude-3-7-sonnet-20250219",
    max_tokens: 1500,
    messages: [{ role: "user", content: prompt }],
  });

  const responseText = result.content[0].type === "text" ? result.content[0].text : "";
  return JSON.parse(responseText);
}