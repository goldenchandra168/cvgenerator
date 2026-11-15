import { writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve } from "path";
import puppeteer from "puppeteer";

interface CVResultInput {
  html: string;
  markdown: string;
  skillsMatchAnalysis: string;
  improvementTips: string[];
  branding?: { headline?: string; summary?: string };
}

export async function exportCVWithPDF(
  data: CVResultInput,
  outputDir: string
): Promise<void> {
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const branding = data.branding;

  // HTML untuk PDF
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${branding?.headline || "CV"}</title>
  <style>
    body {
      font-family: 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 40px;
      line-height: 1.6;
      color: #333;
    }
    .container { max-width: 800px; margin: 0 auto; }
    .header { border-bottom: 2px solid #0070f3; padding-bottom: 20px; margin-bottom: 30px; }
    .name { font-size: 36px; font-weight: bold; margin: 0; color: #0070f3; }
    .title { font-size: 18px; color: #666; margin: 10px 0; }
    .section { margin-bottom: 30px; }
    .section h2 { font-size: 20px; color: #0070f3; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 15px; }
    .experience-item { margin-bottom: 20px; }
    .experience-item h4 { margin: 0 0 5px 0; }
    .experience-item h5 { margin: 0 0 10px 0; color: #666; font-size: 14px; }
    .skills-grid { display: flex; flex-wrap: wrap; gap: 8px; }
    .skill-tag { background: #e8f4fd; color: #0070f3; padding: 5px 12px; border-radius: 20px; font-size: 13px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="name">${branding?.headline || ""}</h1>
      <p class="title">${branding?.summary.split('\n')[0] || ""}</p>
    </div>
    <div class="section">
      <h2>SUMMARY</h2>
      <p>${branding?.summary || ""}</p>
    </div>
    <div class="section">
      <h2>KEY SKILLS</h2>
      <div class="skills-grid">
        ${data.markdown.match(/## Skills[\s\S]*?(?=##|$)/)?.[0]?.split('\n')
          ?.filter(l => l.includes('-'))
          ?.map(l => `<span class="skill-tag">${l.replace('- ', '')}</span>`).join('') || ''}
      </div>
    </div>
    <div class="section">
      <h2>EXPERIENCE</h2>
      ${data.markdown.includes('## Experience') ? data.markdown.split('## Experience')[1]?.split('##')[0]?.replace('###', '') : ''}
    </div>
    <div class="section">
      <h2>EDUCATION</h2>
      ${data.markdown.includes('## Education') ? data.markdown.split('## Education')[1]?.split('##')[0] : ''}
    </div>
  </div>
</body>
</html>`;

  // Simpan HTML
  writeFileSync(resolve(outputDir, "cv.html"), htmlContent);

  // Simpan Markdown
  writeFileSync(resolve(outputDir, "cv.md"), data.markdown);

  // Simpan analysis
  writeFileSync(
    resolve(outputDir, "skills-analysis.md"),
    `# Skills Match Analysis\n\n${data.skillsMatchAnalysis}\n\n## Improvement Tips\n\n${data.improvementTips.map(t => `- ${t}`).join('\n')}`
  );

  // Simpan branding
  if (branding) {
    writeFileSync(
      resolve(outputDir, "personal-branding.json"),
      JSON.stringify(branding, null, 2)
    );
  }

  // Generate PDF with Puppeteer
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      margin: {
        top: "20mm",
        right: "20mm",
        bottom: "20mm",
        left: "20mm",
      },
    });

    await browser.close();
    writeFileSync(resolve(outputDir, "cv.pdf"), pdfBuffer);
  } catch (error) {
    console.error("PDF generation failed:", error);
  }
}