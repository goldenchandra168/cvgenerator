import { Anthropic } from "@anthropic-ai/sdk";
import { UserData, JobInfo, PersonalBrandingOutput } from "../types/resume";

export async function createPersonalBranding(
  userData: UserData,
  jobInfo: JobInfo
): Promise<PersonalBrandingOutput> {
  const prompt = `Anda adalah Personal Branding Expert. Buatlah strategi personal branding untuk profesional yang sedang mencari kerja.

USER DATA:
${JSON.stringify(userData, null, 2)}

TARGET JOB:
${JSON.stringify(jobInfo, null, 2)}

Hasilkan dalam format JSON:
{
  "headline": "Judul LinkedIn profesional yang menarik (maks 120 karakter)",
  "summary": "Ringkasan profil LinkedIn (150-300 kata) yang menonjolkan value proposition",
  "skillPrioritization": ["skill1: alasan", "skill2: alasan"],
  "contentIdeas": ["ideo postingan 1", "ideo postingan 2", "ideo postingan 3"],
  "networkingScript": "Script untuk mengajak orang untuk network (untuk DM/LinkedIn)",
  "interviewStoryTemplates": ["story 1", "story 2", "story 3"]
}

Tips:
- Headline harus menonjolkan niche dan value
- Summary harus mengandung keywords dari lowongan
- Skill prioritization berdasarkan skill gap dari lowongan
- Content ideas untuk membangun personal brand di LinkedIn

Konten harus dalam bahasa Indonesia yang profesional`;

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
  const result = await client.messages.create({
    model: "claude-3-7-sonnet-20250219",
    max_tokens: 1500,
    messages: [{ role: "user", content: prompt }],
  });

  const responseText = result.content[0].type === "text" ? result.content[0].text : "";
  return JSON.parse(responseText);
}