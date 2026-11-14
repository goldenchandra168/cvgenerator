import { writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { GeneratedContent } from "../types/resume";

export async function exportFiles(data: GeneratedContent, outputDir: string) {
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Resume.md
  writeFileSync(resolve(outputDir, "resume.md"), data.resume);

  // Cover Letter.md
  writeFileSync(resolve(outputDir, "cover-letter.md"), data.coverLetter);

  // Interview Prep.json
  writeFileSync(
    resolve(outputDir, "interview-prep.json"),
    JSON.stringify(data.interviewPrep, null, 2)
  );
}