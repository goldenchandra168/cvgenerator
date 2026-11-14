import { Anthropic } from "@anthropic-ai/sdk";
import { UserData, JobInfo, CVDesignOptions, CVResult } from "../types/resume";

export async function designCV(
  userData: UserData,
  jobInfo: JobInfo,
  options: CVDesignOptions
): Promise<CVResult> {
  const prompt = `Anda adalah Career Designer AI yang ahli dalam membuat CV portfolio yang menarik. Buatlah output berikut berdasarkan data pengguna dan lowongan kerja:

USER DATA:
${JSON.stringify(userData, null, 2)}

JOB INFO:
${JSON.stringify(jobInfo, null, 2)}

DESIGN OPTIONS:
Style: ${options.style}
Format: ${options.format}
Theme: ${options.theme}

Hasilkan dalam format JSON:
{
  "html": "HTML CV lengkap dengan styling CSS yang indah, siap diekspor ke PDF",
  "markdown": "Markdown versi ringkas",
  "skillsMatchAnalysis": "Analisis seberapa cocok skill pengguna dengan lowongan (hitung persentase), sebutkan skill yang kurang",
  "improvementTips": ["tip 1", "tip 2", "tip 3"],
  "portfolioSuggestions": ["suggestion 1", "suggestion 2"]
}

Panduan:
1. Sertakan semua skill yang cocok dari lowongan
2. Letakkan skill teratas di bagian paling penting
3. Buat timeline pengalaman kerja yang kronologis
4. Tambahkan warna yang professional sesuai tema
5. Sertakan portfolio links jika ada`;

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
  const result = await client.messages.create({
    model: "claude-3-7-sonnet-20250219",
    max_tokens: 2500,
    messages: [{ role: "user", content: prompt }],
  });

  const responseText = result.content[0].type === "text" ? result.content[0].text : "";
  return JSON.parse(responseText);
}