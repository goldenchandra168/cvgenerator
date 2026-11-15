import { NextApiRequest, NextApiResponse } from "next";
import { UserData, JobInfo } from "../../types/resume";
import { scrapeJobListing } from "../../lib/scrape-job";
import { parseResume } from "../../lib/parse-resume";
import { designCV } from "../../lib/design-cv";
import { createPersonalBranding } from "../../lib/personal-branding";
import { prepareInterview } from "../../lib/interview-prep";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { jobUrl, resume } = req.body;

  if (!jobUrl || !resume) {
    return res.status(400).json({ error: "jobUrl dan resume wajib dikirim" });
  }

  try {
    const jobInfo = await scrapeJobListing(jobUrl);
    const userData = await parseResume(resume);

    const cvResult = await designCV(userData, jobInfo, {
      style: "modern",
      format: "html",
      theme: "light",
    });

    const branding = await createPersonalBranding(userData, jobInfo);

    const interviewPrep = await prepareInterview(userData, jobInfo);

    return res.status(200).json({
      cv: cvResult,
      branding,
      interview: interviewPrep,
      jobInfo,
      message: "Semua hasilagal dihasilkan!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Gagal memproses permintaan lengkap" });
  }
}