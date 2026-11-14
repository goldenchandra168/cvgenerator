export interface UserData {
  name: string;
  title: string;
  skills: string[];
  experience: Array<{
    role: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  links: Array<{ type: string; url: string }>;
}

export interface JobInfo {
  jobTitle: string;
  companyName: string;
  requiredSkills: string[];
  responsibilities: string[];
  keywords: string[];
}

export interface GeneratedContent {
  resume: string;
  coverLetter: string;
  interviewPrep: Array<{
    question: string;
    answer: string;
  }>;
}

export interface CVDesignOptions {
  style: "modern" | "classic" | "creative";
  format: "pdf" | "html" | "markdown";
  theme: "dark" | "light" | "colored";
  showProjects?: boolean;
  customSections?: string[];
}

export interface CVResult {
  html: string;
  markdown: string;
  skillsMatchAnalysis: string;
  improvementTips: string[];
  portfolioSuggestions: string[];
  branding?: PersonalBrandingOutput;
}

export interface PersonalBrandingOutput {
  headline: string;
  summary: string;
  skillPrioritization: string[];
  contentIdeas: string[];
  networkingScript: string;
  interviewStoryTemplates: string[];
}

export interface InterviewPrepOutput {
  questions: Array<{
    category: string;
    question: string;
    sampleAnswer: string;
    followUpQuestions: string[];
    behaviorIndicator: string;
  }>;
  companyResearchKeyPoints: string[];
  talkingPoints: string[];
  faqHandling: Array<{ question: string; answer: string }>;
}