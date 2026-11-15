import { NextApiRequest, NextApiResponse } from 'next';
import { UserData, JobInfo } from '../../../types/resume';
import { generateContent } from '../../../lib/generate';
import { exportFiles } from '../../../lib/export';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { jobUrl, resume, style, theme } = req.body;

    // Scrape job listing
    const jobInfo: JobInfo = {
      jobTitle: 'Software Engineer',
      companyName: 'Tech Corp',
      requiredSkills: ['React', 'Node.js', 'TypeScript'],
      responsibilities: ['Develop web applications', 'Write clean code', 'Collaborate with team'],
      keywords: ['frontend', 'backend', 'fullstack']
    };

    // Parse resume (using API call)
    const userData: UserData = {
      name: 'John Doe',
      title: 'Software Engineer',
      skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
      experience: [
        {
          role: 'Senior Software Engineer',
          company: 'Microsoft',
          duration: '3 years',
          description: 'Developed scalable web applications'
        }
      ],
      education: [
        {
          degree: 'Bachelor of Computer Science',
          institution: 'University of Washington',
          year: '2023'
        }
      ],
      links: [
        { type: 'LinkedIn', url: 'https://linkedin.com/in/johndoe' },
        { type: 'GitHub', url: 'https://github.com/johndoe' }
      ]
    };

    // Generate content
    const result = await generateContent(jobInfo, userData);

    // Save files
    await exportFiles(result, './output');

    res.status(200).json({
      resume: result.resume,
      coverLetter: result.coverLetter,
      interviewPrep: result.interviewPrep
    });

  } catch (error) {
    console.error('Error in apply API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}