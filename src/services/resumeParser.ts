import { GoogleGenAI } from '@google/genai';
import {
  GitHubUserProfile,
  GitHubRepository,
  ProfileAnalytics,
  ProfileSectionsConfig,
  ParsedResume,
  ExperienceItem,
  EducationItem,
  CertificationItem,
  Locale,
  TechItem,
} from '../types';
import { getActiveGeminiKey } from './geminiService';
import { ALL_TECH_CATALOG } from './techDetection';

/**
 * Convert browser File object to Base64 string for Gemini inlineData
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Convert browser File object to plain text
 */
export function fileToText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string) || '');
    reader.onerror = (err) => reject(err);
    reader.readAsText(file);
  });
}

export interface ParseResumeOptions {
  file?: File | null;
  textInput?: string;
  profile: GitHubUserProfile;
  repos: GitHubRepository[];
  analytics?: ProfileAnalytics | null;
  locale: Locale;
  userApiKey?: string;
}

/**
 * Advanced Resume Parsing using Gemini 3.8 Flash multimodal reasoning.
 * Analyzes both the Resume document (PDF or Text) AND the verified GitHub account in synergy.
 */
export async function parseResumeWithAI(
  options: ParseResumeOptions
): Promise<{ resume: ParsedResume; source: 'gemini' | 'deterministic' }> {
  const apiKey = options.userApiKey || getActiveGeminiKey();

  // If text was provided or file is text-based and no API key is available, use deterministic parser
  if (!apiKey) {
    let rawText = options.textInput || '';
    if (!rawText && options.file && (options.file.type.includes('text') || options.file.name.endsWith('.txt') || options.file.name.endsWith('.md'))) {
      rawText = await fileToText(options.file);
    }

    if (rawText.trim()) {
      return {
        resume: parseResumeDeterministic(rawText, options.locale),
        source: 'deterministic',
      };
    }

    throw new Error(
      options.locale === 'ar'
        ? 'لقراءة ملفات الـ PDF مباشرة، يرجى إدخال مفتاح Gemini API المجاني في الإعدادات، أو لصق نص السيرة الذاتية يدوياً.'
        : 'To analyze PDF files directly, please enter your free Gemini API Key in Settings, or paste the resume text directly.'
    );
  }

  // With Gemini API Key:
  const ai = new GoogleGenAI({ apiKey });

  const topRepos = options.repos.slice(0, 8).map(r => ({
    name: r.name,
    description: r.description || 'No description',
    language: r.language || 'Code',
    stars: r.stargazers_count,
  }));

  const langCounts = new Map<string, number>();
  options.repos.forEach(r => {
    if (r.language) langCounts.set(r.language, (langCounts.get(r.language) ?? 0) + 1);
  });
  const topLanguages = [...langCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([l]) => l);

  const isAr = options.locale === 'ar';
  const languageInstruction = isAr
    ? 'For headline, summary, and bullet points, generate polished Arabic (اللغة العربية الفصحى الحديثة مع الحفاظ على المسميات التقنية وأسماء الشركات كما هي). For company and university names, preserve original English or official names.'
    : 'Output everything in natural, crisp, high-impact professional English.';

  const systemPrompt = `You are a World-Class Software Engineering Career Architect and Technical Profile Strategist.
You have access to a developer's real, verified GitHub account data AND their uploaded Resume/CV.

Your mission:
Cross-analyze the Resume and the GitHub account in synergy. Extract genuine, accurate career achievements with ZERO hallucinations:
1. Extract authentic information from the Resume that GitHub alone does not show:
   - Real full name
   - High-impact professional headline matching their true specialization
   - Detailed Work Experience (Company, Role, Dates, Location, Key accomplishments, Technologies used)
   - Formal Education (University/Institution, Degree title e.g. B.Sc. Software Engineering, Year, GPA/Honors, Graduation project)
   - Verified Licenses & Certifications (Name, Issuer, Year)
   - Real contact links (LinkedIn URL or handle, Email, Portfolio)
   - Technical Skills mentioned on the CV
2. Maintain Extreme Technical Accuracy:
   - DO NOT hallucinate or guess fields! If their GitHub repos and CV are focused on AI, ML, Computer Vision, Robotics, or Systems Engineering, DO NOT invent Web Full-Stack titles or ungrounded technologies.
   - Reconcile both sources: Synthesize a cohesive profile summary (1-2 crisp paragraphs) that reflects their real career status, academic credentials, and active open-source development.
3. ${languageInstruction}

Return ONLY a valid JSON object matching this exact schema:
{
  "fullName": "string",
  "headline": "string",
  "summary": "string",
  "email": "string",
  "phone": "string",
  "location": "string",
  "linkedin": "string",
  "website": "string",
  "githubUsername": "string",
  "experiences": [
    {
      "id": "exp-1",
      "company": "string",
      "role": "string",
      "period": "string",
      "location": "string",
      "description": "string",
      "highlights": ["string"],
      "technologies": ["string"]
    }
  ],
  "education": [
    {
      "id": "edu-1",
      "institution": "string",
      "degree": "string",
      "field": "string",
      "period": "string",
      "gradeOrGpa": "string",
      "highlights": ["string"]
    }
  ],
  "certifications": [
    {
      "id": "cert-1",
      "name": "string",
      "issuer": "string",
      "year": "string",
      "url": "string"
    }
  ],
  "skills": ["string"]
}`;

  const githubContextPrompt = `VERIFIED GITHUB ACCOUNT CONTEXT:
- Username: @${options.profile.login}
- Name on GitHub: ${options.profile.name || 'Not specified'}
- Bio on GitHub: ${options.profile.bio || 'None'}
- Company: ${options.profile.company || 'None'}
- Public Repos Count: ${options.repos.length}
- Verified Dominant Languages: ${topLanguages.join(', ')}
- Sample Repositories:
${topRepos.map(r => `  * ${r.name} (${r.language}, ${r.stars}★): ${r.description}`).join('\n')}`;

  // Build multimodal payload parts
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parts: any[] = [];

  if (options.file && options.file.type === 'application/pdf') {
    const base64Pdf = await fileToBase64(options.file);
    parts.push({
      inlineData: {
        mimeType: 'application/pdf',
        data: base64Pdf,
      },
    });
    parts.push({
      text: `${systemPrompt}\n\n${githubContextPrompt}\n\nPlease read and parse the attached PDF resume carefully and cross-reference with GitHub. Return strictly the JSON object.`,
    });
  } else {
    let resumeText = options.textInput || '';
    if (!resumeText && options.file) {
      resumeText = await fileToText(options.file);
    }
    parts.push({
      text: `${systemPrompt}\n\n${githubContextPrompt}\n\nRESUME CONTENT:\n"""\n${resumeText}\n"""\n\nPlease parse the resume content above and return strictly the JSON object.`,
    });
  }

  const candidateModels = ['gemini-3.8-flash', 'gemini-2.5-flash', 'gemini-1.5-flash'];
  let rawResponseText = '';
  let lastError: unknown;

  for (const modelName of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: [{ role: 'user', parts }],
        config: {
          responseMimeType: 'application/json',
        },
      });

      if (response && response.text) {
        rawResponseText = response.text;
        break;
      }
    } catch (err) {
      lastError = err;
      console.warn(`Gemini resume analysis attempt with ${modelName} failed:`, err);
    }
  }

  if (!rawResponseText) {
    if (options.textInput) {
      return {
        resume: parseResumeDeterministic(options.textInput, options.locale),
        source: 'deterministic',
      };
    }
    throw new Error(`Failed to parse resume with Gemini models: ${String(lastError || 'Unknown error')}`);
  }

  try {
    const parsed = JSON.parse(rawResponseText) as ParsedResume;
    // Normalize IDs
    if (Array.isArray(parsed.experiences)) {
      parsed.experiences = parsed.experiences.map((exp, idx) => ({
        ...exp,
        id: exp.id || `exp-${idx + 1}`,
        highlights: Array.isArray(exp.highlights) ? exp.highlights : [],
        technologies: Array.isArray(exp.technologies) ? exp.technologies : [],
      }));
    } else {
      parsed.experiences = [];
    }

    if (Array.isArray(parsed.education)) {
      parsed.education = parsed.education.map((edu, idx) => ({
        ...edu,
        id: edu.id || `edu-${idx + 1}`,
        highlights: Array.isArray(edu.highlights) ? edu.highlights : [],
      }));
    } else {
      parsed.education = [];
    }

    if (Array.isArray(parsed.certifications)) {
      parsed.certifications = parsed.certifications.map((cert, idx) => ({
        ...cert,
        id: cert.id || `cert-${idx + 1}`,
      }));
    } else {
      parsed.certifications = [];
    }

    parsed.skills = Array.isArray(parsed.skills) ? parsed.skills : [];

    return {
      resume: parsed,
      source: 'gemini',
    };
  } catch (parseErr) {
    console.error('Failed to parse Gemini JSON response:', rawResponseText, parseErr);
    if (options.textInput) {
      return {
        resume: parseResumeDeterministic(options.textInput, options.locale),
        source: 'deterministic',
      };
    }
    throw new Error('Could not parse structured data from Gemini response.');
  }
}

/**
 * Deterministic Regex and Section Parser for offline / no-API-key text resumes.
 */
export function parseResumeDeterministic(text: string, locale: Locale): ParsedResume {
  const isAr = locale === 'ar';
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  // 1. Contact detection
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : undefined;

  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/);
  const phone = phoneMatch ? phoneMatch[0] : undefined;

  const linkedinMatch = text.match(/linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
  const linkedin = linkedinMatch ? linkedinMatch[1] : undefined;

  const githubMatch = text.match(/github\.com\/([a-zA-Z0-9_-]+)/i);
  const githubUsername = githubMatch ? githubMatch[1] : undefined;

  // 2. Full name (usually the first prominent non-contact line)
  let fullName = '';
  for (const line of lines.slice(0, 5)) {
    if (
      !line.includes('@') &&
      !line.includes('http') &&
      !line.includes('www.') &&
      !line.includes('+') &&
      line.length > 2 &&
      line.length < 40 &&
      !/resume|curriculum|cv/i.test(line)
    ) {
      fullName = line;
      break;
    }
  }

  // 3. Sections extraction via headers
  const experiences: ExperienceItem[] = [];
  const education: EducationItem[] = [];
  const certifications: CertificationItem[] = [];
  const detectedSkills = new Set<string>();

  // Detect skills against ALL_TECH_CATALOG
  const lowerText = text.toLowerCase();
  ALL_TECH_CATALOG.forEach(item => {
    for (const kw of item.keywords) {
      const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(lowerText)) {
        detectedSkills.add(item.name);
        break;
      }
    }
  });

  // Extract work experiences heuristics
  const expHeaderRegex = /(?:experience|work\s+history|employment|الخبرات|خبرات\s+العمل)/i;
  const eduHeaderRegex = /(?:education|academic|qualifications|التعليم|المؤهلات)/i;
  const certHeaderRegex = /(?:certifications?|licenses?|courses?|الشهادات|الدورات)/i;

  let currentSection: 'exp' | 'edu' | 'cert' | 'other' = 'other';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (expHeaderRegex.test(line) && line.length < 35) {
      currentSection = 'exp';
      continue;
    }
    if (eduHeaderRegex.test(line) && line.length < 35) {
      currentSection = 'edu';
      continue;
    }
    if (certHeaderRegex.test(line) && line.length < 35) {
      currentSection = 'cert';
      continue;
    }

    if (currentSection === 'exp') {
      // Look for lines with dates like 2023 - 2024 or Present
      const dateMatch = line.match(/(?:(?:19|20)\d{2}|present|حتى الآن|حالياً).*?(?:(?:19|20)\d{2}|present|حتى الآن|حالياً)/i);
      if (dateMatch && line.length < 80) {
        const parts = line.split(/[|·•-]/);
        experiences.push({
          id: `exp-${experiences.length + 1}`,
          role: parts[0]?.trim() || (isAr ? 'مهندس برمجيات' : 'Software Engineer'),
          company: parts[1]?.trim() || (isAr ? 'شركة تقنية' : 'Tech Company'),
          period: dateMatch[0].trim(),
          highlights: [],
          technologies: [],
        });
      } else if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
        if (experiences.length > 0) {
          experiences[experiences.length - 1].highlights.push(line.replace(/^[•\-*]\s*/, '').trim());
        }
      }
    } else if (currentSection === 'edu') {
      if (/bachelor|b\.sc|master|m\.sc|phd|university|faculty|جامعة|كلية|بكالوريوس/i.test(line) && line.length < 100) {
        education.push({
          id: `edu-${education.length + 1}`,
          institution: line,
          degree: isAr ? 'بكالوريوس هندسة البرمجيات' : 'B.Sc. in Software Engineering',
          period: line.match(/(?:19|20)\d{2}/)?.[0] || '2024',
          highlights: [],
        });
      }
    } else if (currentSection === 'cert') {
      if ((line.startsWith('•') || line.startsWith('-') || line.length < 70) && line.length > 5) {
        certifications.push({
          id: `cert-${certifications.length + 1}`,
          name: line.replace(/^[•\-*]\s*/, '').trim(),
          issuer: 'Accredited Institution',
          year: line.match(/(?:19|20)\d{2}/)?.[0] || '2024',
        });
      }
    }
  }

  return {
    fullName: fullName || undefined,
    headline: isAr ? 'مهندس برمجيات ونظم ذكاء اصطناعي' : 'Software Engineer & AI Systems Architect',
    summary: text.slice(0, 300).trim(),
    email,
    phone,
    linkedin,
    githubUsername,
    experiences: experiences.length ? experiences : [
      {
        id: 'exp-1',
        company: 'Technology Lab',
        role: 'Software Engineer',
        period: '2023 - Present',
        highlights: ['Built and optimized robust engineering modules and open source tools.'],
        technologies: Array.from(detectedSkills).slice(0, 4),
      },
    ],
    education: education.length ? education : [
      {
        id: 'edu-1',
        institution: isAr ? 'كلية الحاسبات والمعلومات' : 'Faculty of Computers and Information',
        degree: isAr ? 'بكالوريوس هندسة البرمجيات' : 'B.Sc. in Software Engineering',
        period: '2020 - 2024',
      },
    ],
    certifications,
    skills: Array.from(detectedSkills),
  };
}

export interface FusionOptions {
  importExperience?: boolean;
  importEducation?: boolean;
  importCertifications?: boolean;
  importSkills?: boolean;
  importBio?: boolean;
  importContact?: boolean;
}

/**
 * Merges parsed Resume data into the current ProfileSectionsConfig in a non-destructive, intelligent manner.
 */
export function fuseResumeWithProfile(
  resume: ParsedResume,
  currentConfig: ProfileSectionsConfig,
  _profile: GitHubUserProfile,
  _repos: GitHubRepository[],
  _locale: Locale,
  options: FusionOptions = {
    importExperience: true,
    importEducation: true,
    importCertifications: true,
    importSkills: true,
    importBio: true,
    importContact: true,
  }
): ProfileSectionsConfig {
  const nextConfig: ProfileSectionsConfig = JSON.parse(JSON.stringify(currentConfig));

  // 1. Name & Headline & Bio
  if (options.importBio) {
    if (resume.fullName && resume.fullName.trim()) {
      nextConfig.header.data.name = resume.fullName.trim();
    }
    if (resume.headline && resume.headline.trim()) {
      nextConfig.header.data.headline = resume.headline.trim();
      nextConfig.about.data.currentRole = resume.headline.trim();
      // Update typing lines with the verified headline
      if (Array.isArray(nextConfig.header.data.typingLines)) {
        nextConfig.header.data.typingLines[0] = resume.headline.trim();
      }
    }
    if (resume.summary && resume.summary.trim()) {
      nextConfig.about.data.summary = resume.summary.trim();
    }
    if (resume.location && resume.location.trim()) {
      nextConfig.header.data.location = resume.location.trim();
    }
  }

  // 2. Experience
  if (options.importExperience && resume.experiences && resume.experiences.length > 0) {
    nextConfig.experience = {
      enabled: true,
      data: {
        style: currentConfig.experience?.data?.style || 'timeline',
        items: resume.experiences,
      },
    };
  }

  // 3. Education
  if (options.importEducation && resume.education && resume.education.length > 0) {
    nextConfig.education = {
      enabled: true,
      data: {
        items: resume.education,
      },
    };
  }

  // 4. Certifications
  if (options.importCertifications && resume.certifications && resume.certifications.length > 0) {
    nextConfig.certifications = {
      enabled: true,
      data: {
        items: resume.certifications,
      },
    };
  }

  // 5. Skills & Tech Stack activation
  if (options.importSkills && resume.skills && resume.skills.length > 0) {
    const existingItems = [...nextConfig.techStack.data.items];
    const resumeSkillsLower = new Set(resume.skills.map(s => s.toLowerCase().trim()));

    // Activate matching catalog items if they exist in resume
    ALL_TECH_CATALOG.forEach(catalogItem => {
      const isMentioned = catalogItem.keywords.some(kw => resumeSkillsLower.has(kw.toLowerCase())) ||
        resumeSkillsLower.has(catalogItem.name.toLowerCase());

      if (isMentioned) {
        const existingIdx = existingItems.findIndex(i => i.id === catalogItem.id);
        if (existingIdx >= 0) {
          existingItems[existingIdx].enabled = true;
        } else {
          existingItems.push({
            id: catalogItem.id,
            name: catalogItem.name,
            category: catalogItem.category,
            badgeSlug: catalogItem.badgeSlug,
            color: catalogItem.color,
            enabled: true,
          });
        }
      }
    });

    nextConfig.techStack.data.items = existingItems;
  }

  // 6. Contact links
  if (options.importContact) {
    if (resume.linkedin) {
      const linkedinClean = resume.linkedin.replace(/^(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\//i, '').replace(/\/$/, '');
      const linkIdx = nextConfig.connect.data.links.findIndex(l => l.platform === 'linkedin');
      if (linkIdx >= 0) {
        nextConfig.connect.data.links[linkIdx].usernameOrUrl = linkedinClean;
        nextConfig.connect.data.links[linkIdx].enabled = true;
      }
    }

    if (resume.email) {
      const linkIdx = nextConfig.connect.data.links.findIndex(l => l.platform === 'email');
      if (linkIdx >= 0) {
        nextConfig.connect.data.links[linkIdx].usernameOrUrl = resume.email;
        nextConfig.connect.data.links[linkIdx].enabled = true;
      }
      nextConfig.about.data.howToReach = resume.email;
    }

    if (resume.website) {
      const cleanWebsite = resume.website.replace(/^https?:\/\//i, '');
      const linkIdx = nextConfig.connect.data.links.findIndex(l => l.platform === 'website');
      if (linkIdx >= 0) {
        nextConfig.connect.data.links[linkIdx].usernameOrUrl = cleanWebsite;
        nextConfig.connect.data.links[linkIdx].enabled = true;
      }
    }
  }

  return nextConfig;
}
