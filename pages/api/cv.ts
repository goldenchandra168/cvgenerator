import { NextApiRequest, NextApiResponse } from "next";
import { UserData, JobInfo } from "../../../types/resume";
import { designCV } from "../../../lib/design-cv";

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

  const { jobUrl, resume, style = "modern", theme = "light" } = req.body;

  if (!jobUrl || !resume) {
    return res.status(400).json({ error: "jobUrl dan resume wajib dikirim" });
  }

  try {
    const jobInfo: JobInfo = {
      jobTitle: "Software Engineer",
      companyName: "Tech Corp",
      requiredSkills: ["React", "Node.js", "TypeScript"],
      responsibilities: ["Develop web applications", "Write clean code", "Collaborate with team"],
      keywords: ["frontend", "backend", "fullstack"]
    };

    const userData: UserData = {
      name: "John Doe",
      title: "Software Engineer",
      skills: ["React", "Node.js", "TypeScript", "AWS"],
      experience: [
        {
          role: "Senior Software Engineer",
          company: "Microsoft",
          duration: "3 years",
          description: "Developed scalable web applications"
        }
      ],
      education: [
        {
          degree: "Bachelor of Computer Science",
          institution: "University of Washington",
          year: "2023"
        }
      ],
      links: [
        { type: "LinkedIn", url: "https://linkedin.com/in/johndoe" },
        { type: "GitHub", url: "https://github.com/johndoe" }
      ]
    };

    const cvResult = await designCV(userData, jobInfo, {
      style,
      format: "html",
      theme,
    });

    return res.status(200).json(cvResult);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Gagal memproses permintaan CV" });
  }
}