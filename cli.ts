#!/usr/bin/env node

import { Command } from "commander";
import dotenv from "dotenv";
import { scrapeJobListing } from "./lib/scrape-job.js";
import { parseResume } from "./lib/parse-resume.js";
import { generateContent } from "./lib/generate.js";
import { exportFiles } from "./lib/export.js";
import { designCV } from "./lib/design-cv.js";
import { createPersonalBranding } from "./lib/personal-branding.js";
import { prepareInterview } from "./lib/interview-prep.js";
import { exportCVWithPDF } from "./lib/export-cv.js";

dotenv.config();

const program = new Command();

program
  .name("autoapply")
  .description("AI Job Match & Portfolio Customizer CLI")
  .version("2.0.0");

// Command 1: Apply - Generate basic files
program
  .command("apply")
  .description("Generate resume and cover letter from job URL")
  .requiredOption("-u, --url <url>", "Job listing URL")
  .requiredOption("-r, --resume <file>", "Path to resume PDF or URL")
  .option("-o, --output <dir>", "Output directory", "./output")
  .action(async (options) => {
    console.log("🔍 Mengambil info lowongan...");
    const jobInfo = await scrapeJobListing(options.url);
    console.log("📄 Menganalisis resume pengguna...");
    const userData = await parseResume(options.resume);
    console.log("🤖 Menghasilkan konten AI...");
    const result = await generateContent(jobInfo, userData);
    console.log("💾 Menyimpan file...");
    await exportFiles(result, options.output);
    console.log(`✅ Selesai! File tersimpan di ${options.output}`);
  });

// Command 2: CV - Design professional CV
program
  .command("cv")
  .description("Generate professional CV with design options")
  .requiredOption("-u, --url <url>", "Job listing URL")
  .requiredOption("-r, --resume <file>", "Path to resume PDF or URL")
  .option("-o, --output <dir>", "Output directory", "./cv-output")
  .option("-s, --style <style>", "CV style (modern|classic|creative)", "modern")
  .option("-t, --theme <theme>", "Theme (light|dark|colored)", "light")
  .action(async (options) => {
    console.log("🔍 Mengambil info lowongan...");
    const jobInfo = await scrapeJobListing(options.url);
    console.log("📄 Menganalisis resume pengguna...");
    const userData = await parseResume(options.resume);
    console.log("🎨 Mendesain CV profesional...");
    const cvResult = await designCV(userData, jobInfo, {
      style: options.style,
      format: "html",
      theme: options.theme,
    });
    console.log("✨ Membuat branding untuk CV...");
    const branding = await createPersonalBranding(userData, jobInfo);
    console.log("💾 Menyimpan CV...");
    await exportCVWithPDF({ ...cvResult, branding } as any, options.output);
    console.log(`✅ CV lengkap! File tersimpan di ${options.output}`);
  });

// Command 3: Brand - Create personal branding
program
  .command("brand")
  .description("Generate personal branding strategy")
  .requiredOption("-u, --url <url>", "Job listing URL")
  .requiredOption("-r, --resume <file>", "Path to resume PDF or URL")
  .option("-o, --output <dir>", "Output directory", "./branding-output")
  .action(async (options) => {
    console.log("🔍 Mengambil info lowongan...");
    const jobInfo = await scrapeJobListing(options.url);
    console.log("📄 Menganalisis resume pengguna...");
    const userData = await parseResume(options.resume);
    console.log("✍️ Membuat strategi personal branding...");
    const branding = await createPersonalBranding(userData, jobInfo);
    console.log("💾 Menyimpan branding strategy...");
    const fs = await import("fs");
    if (!fs.existsSync(options.output)) {
      fs.mkdirSync(options.output, { recursive: true });
    }
    fs.writeFileSync(
      `${options.output}/personal-branding.json`,
      JSON.stringify(branding, null, 2)
    );
    console.log(`✅ Branding strategy lengkap! File tersimpan di ${options.output}`);
    console.log(`💡 Headline: ${branding.headline}`);
    console.log(`💬 Summary: ${branding.summary.split('\n')[0]}...`);
  });

// Command 4: Interview - Prepare for interview
program
  .command("interview")
  .description("Generate interview preparation guide")
  .requiredOption("-u, --url <url>", "Job listing URL")
  .requiredOption("-r, --resume <file>", "Path to resume PDF or URL")
  .option("-o, --output <dir>", "Output directory", "./interview-output")
  .action(async (options) => {
    console.log("🔍 Mengambil info lowongan...");
    const jobInfo = await scrapeJobListing(options.url);
    console.log("📄 Menganalisis resume pengguna...");
    const userData = await parseResume(options.resume);
    console.log("🎯 Menyiapkan persiapan wawancara...");
    const interviewPrep = await prepareInterview(userData, jobInfo);
    console.log("💾 Menyimpan interview guide...");
    const fs = await import("fs");
    if (!fs.existsSync(options.output)) {
      fs.mkdirSync(options.output, { recursive: true });
    }
    fs.writeFileSync(
      `${options.output}/interview-prep.json`,
      JSON.stringify(interviewPrep, null, 2)
    );
    console.log(`✅ Persiapan wawancara lengkap! File tersimpan di ${options.output}`);
    console.log(`📋 Pertanyaan: ${interviewPrep.questions.length} pertanyaan`);
    console.log(`📌 Talking Points: ${interviewPrep.talkingPoints.length} poin`);
  });

// All-in-one command
program
  .command("full")
  .description("Generate everything: CV, branding, interview prep")
  .requiredOption("-u, --url <url>", "Job listing URL")
  .requiredOption("-r, --resume <file>", "Path to resume PDF or URL")
  .option("-o, --output <dir>", "Base output directory", "./autoapply-output")
  .action(async (options) => {
    console.log("🚀 Memulai proses lengkap...");
    console.log("\n=== Langkah 1: Scrape Lowongan ===");
    const jobInfo = await scrapeJobListing(options.url);
    console.log(`✅ Ditemukan: ${jobInfo.jobTitle} di ${jobInfo.companyName}`);

    console.log("\n=== Langkah 2: Analisis Resume ===");
    const userData = await parseResume(options.resume);
    console.log(`✅ Dengan nama: ${userData.name}`);

    console.log("\n=== Langkah 3: Generate CV ===");
    const cvResult = await designCV(userData, jobInfo, {
      style: "modern",
      format: "html",
      theme: "light",
    });

    console.log("\n=== Langkah 4: Personal Branding ===");
    const branding = await createPersonalBranding(userData, jobInfo);
    
    await exportCVWithPDF({ ...cvResult, branding } as any, `${options.output}/cv`);
    await exportFiles({ resume: cvResult.markdown, coverLetter: "", interviewPrep: [] }, `${options.output}/branding`);
    const fs = await import("fs");
    fs.mkdirSync(`${options.output}/branding`, { recursive: true });
    fs.writeFileSync(`${options.output}/branding/personal-branding.json`, JSON.stringify(branding, null, 2));

    console.log("\n=== Langkah 5: Interview Prep ===");
    const interviewPrep = await prepareInterview(userData, jobInfo);
    fs.mkdirSync(`${options.output}/interview`, { recursive: true });
    fs.writeFileSync(`${options.output}/interview/interview-prep.json`, JSON.stringify(interviewPrep, null, 2));

    console.log("\n✅ SEMUA SELASA! Semua file dihasilkan:");
    console.log(`   - CV: ${options.output}/cv/`);
    console.log(`   - Branding: ${options.output}/branding/`);
    console.log(`   - Interview: ${options.output}/interview/`);
  });

program.parse(process.argv);