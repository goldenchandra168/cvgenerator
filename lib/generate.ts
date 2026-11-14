import { Anthropic } from "@anthropic-ai/sdk";
import { JobInfo, UserData, GeneratedContent } from "../types/resume";

export async function generateContent(
  jobInfo: JobInfo,
  userData: UserData
): Promise<GeneratedContent> {
  const prompt = `Anda adalah Career Coach AI. Buat konten berikut berdasarkan data yang diberikan:

JOB INFO:
- Position: ${jobInfo.jobTitle}
- Company: ${jobInfo.companyName}
- Skills Required: ${jobInfo.requiredSkills.join(", ")}
- Key Words: ${jobInfo.keywords.join(", ")}

USER DATA:
- Name: ${userData.name}
- Current Title: ${userData.title}
- Skills: ${userData.skills.join(", ")}
- Experience: ${JSON.stringify(userData.experience, null, 2)}
- Education: ${JSON.stringify(userData.education, null, 2)}
- Links: ${JSON.stringify(userData.links, null, 2)}

Hasilkan dalam format JSON:
{
  "resume": "Markdown resume yang dioptimalkan ATS dengan keyword dari lowongan",
  "coverLetter": "Markdown cover letter yang personal dengan nama perusahaan",
  "interviewPrep": [
    {"question": "Tell me about yourself", "answer": "..." },
    {"question": "Why do you want to work at X?", "answer": "..."},
    {"question": "What is your greatest strength?", "answer": "..."}
  ]
}

Pastikan resume mengandung keyword ATS dari lowongan. Cover letter harus ramah tapi profesional.`;

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
  const result = await client.messages.create({
    model: "claude-3-7-sonnet-20250219",
    max_tokens: 2000,
    messages: [{ role: "user", content: prompt }],
  });

  const responseText = result.content[0].type === "text" ? result.content[0].text : "";
  return JSON.parse(responseText);
}