import { Anthropic } from "@anthropic-ai/sdk";
import { UserData, JobInfo, InterviewPrepOutput } from "../types/resume";

export async function prepareInterview(
  userData: UserData,
  jobInfo: JobInfo
): Promise<InterviewPrepOutput> {
  const prompt = `Anda adalah Interview Coach AI yang ahli dalam persiapan wawancara. Buat strategi lengkap untuk wawancara kerja.

USER DATA:
${JSON.stringify(userData, null, 2)}

TARGET JOB:
${JSON.stringify(jobInfo, null, 2)}

Hasilkan dalam format JSON:
{
  "questions": [
    {
      "category": "General/Experience/Strengths/Weaknesses/Case Study",
      "question": "Pertanyaan wawancara",
      "sampleAnswer": "Contoh jawaban singkat dengan STAR format",
      "followUpQuestions": ["pertanyaan lanjutan 1", "pertanyaan lanjutan 2"],
      "behaviorIndicator": "Kompetensi yang ditunjukkan"
    }
  ],
  "companyResearchKeyPoints": ["poin 1 tentang company", "poin 2 tentang company"],
  "talkingPoints": ["topik untuk dibicarakan", "nilai yang akan disampaikan"],
  "faqHandling": [
    {"question": "Pertanyaan umum", "answer": "Jawaban yang tepat"}
  ]
}

Buat minimal 8 pertanyaan berbeda untuk job yang dituju.
Fokus pada kata kunci dan skill dari lowongan.
Sertakan jawaban dalam format STAR (Situation, Task, Action, Result).`;

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
  const result = await client.messages.create({
    model: "claude-3-7-sonnet-20250219",
    max_tokens: 2000,
    messages: [{ role: "user", content: prompt }],
  });

  const responseText = result.content[0].type === "text" ? result.content[0].text : "";
  return JSON.parse(responseText);
}