import { JobInfo } from "../types/resume";

export async function scrapeJobListing(url: string): Promise<JobInfo> {
  // Gunakan Jina AI Reader untuk scrape
  let cleanUrl = url;
  if (url.startsWith("http://")) {
    cleanUrl = url.replace("http://", "").replace("https://", "");
  } else if (url.startsWith("https://")) {
    cleanUrl = url.replace("https://", "");
  }

  const jinaUrl = `https://r.jina.ai/${cleanUrl}`;

  const response = await fetch(jinaUrl, {
    headers: {
      "Authorization": `Bearer ${process.env.JINA_API_KEY || ""}`,
      "Accept": "text/plain",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to scrape job listing: ${response.status}`);
  }

  const text = await response.text();

  const prompt = `Parse the following job posting and extract:
    - Job Title
    - Company Name
    - Required Skills
    - Responsibilities
    - Keywords (ATS-friendly)

    Return as JSON:
    {
      "jobTitle": "...",
      "companyName": "...",
      "requiredSkills": [...],
      "responsibilities": [...],
      "keywords": [...]
    }

    Job Posting Content:
    ${text.substring(0, 15000)}`;

  const client = new (require("@anthropic-ai/sdk").Anthropic)({
    apiKey: process.env.ANTHROPIC_API_KEY!
  });

  const result = await client.messages.create({
    model: "claude-3-7-sonnet-20250219",
    max_tokens: 1000,
    messages: [{ role: "user", content: prompt }],
  });

  const responseText = result.content[0].type === "text" ? result.content[0].text : "";
  return JSON.parse(responseText);
}