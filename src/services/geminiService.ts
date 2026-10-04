import { GoogleGenAI } from '@google/genai';
import { GitHubUserProfile, GitHubRepository, ProfileAnalytics, Locale } from '../types';
import { BioVariation, generateBioVariations } from './aiBio';

export interface GeminiBioOptions {
  profile: GitHubUserProfile;
  repos: GitHubRepository[];
  analytics?: ProfileAnalytics | null;
  locale: Locale;
  userApiKey?: string;
  tone?: 'formal' | 'friendly' | 'direct';
}

/**
 * Get active Gemini API Key from user settings or Vite environment variables
 */
export function getActiveGeminiKey(): string | null {
  const fromStorage = localStorage.getItem('readme_studio_gemini_key');
  if (fromStorage && fromStorage.trim().length > 0) {
    return fromStorage.trim();
  }

  const fromEnv = (import.meta as { env?: Record<string, string> }).env?.VITE_GEMINI_API_KEY;
  if (fromEnv && fromEnv.trim().length > 0) {
    return fromEnv.trim();
  }

  return null;
}

/**
 * Generate bespoke, production-grade developer bios and headlines using Gemini 2.5 Flash.
 * Falls back to deterministic rule-based generation if no API key is available or on network failure.
 */
export async function generateDeveloperBioWithGemini(
  options: GeminiBioOptions
): Promise<{ variations: BioVariation[]; source: 'gemini' | 'rules' }> {
  const apiKey = options.userApiKey || getActiveGeminiKey();

  // If no Gemini key is provided, fallback cleanly to deterministic generator
  if (!apiKey) {
    return {
      variations: generateBioVariations(options.profile, options.repos, options.locale),
      source: 'rules',
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const topRepos = options.repos.slice(0, 5).map(r => ({
      name: r.name,
      description: r.description || 'No description',
      language: r.language || 'Code',
      stars: r.stargazers_count,
    }));

    const languages = Array.from(new Set(options.repos.map(r => r.language).filter(Boolean))).slice(0, 6);
    const archetype = options.analytics?.archetype || 'generalist';

    const isAr = options.locale === 'ar';
    const languageInstruction = isAr
      ? 'Output exclusively in high-standard, professional modern Arabic (اللغة العربية الفصحى الحديثة والمصطلحات التقنية الاحترافية).'
      : 'Output exclusively in natural, high-impact, professional English.';

    const systemPrompt = `You are a world-class technical copywriter and senior developer branding expert.
Your job is to generate 3 distinct developer profile summaries for a developer's GitHub profile README:
1. "formal" — Executive, Senior/Architect tone tailored for tech recruiters and high-tier engineering teams.
2. "friendly" — Approachable, community-centric, open-source enthusiast tone.
3. "direct" — Minimalist, crisp, no-fluff, pure engineering systems and stack focus.

Guidelines:
- Ground every claim strictly in the user's real public GitHub data. Do not invent imaginary achievements.
- Highlight real projects (${topRepos.map(r => r.name).join(', ')}) and actual technologies (${languages.join(', ')}).
- Avoid corporate buzzwords and robotic AI clichés (e.g. avoid phrases like "passionate visionary", "synergizing", etc.).
- ${languageInstruction}

Return ONLY a valid JSON array of 3 objects with this exact structure:
[
  {
    "tone": "formal",
    "summary": "...",
    "focus": "...",
    "learning": "..."
  },
  {
    "tone": "friendly",
    "summary": "...",
    "focus": "...",
    "learning": "..."
  },
  {
    "tone": "direct",
    "summary": "...",
    "focus": "...",
    "learning": "..."
  }
]`;

    const userPrompt = `Developer Profile:
- Name: ${options.profile.name || options.profile.login} (@${options.profile.login})
- Bio: ${options.profile.bio || 'None provided'}
- Company: ${options.profile.company || 'Independent'}
- Location: ${options.profile.location || 'Global'}
- Archetype: ${archetype}
- Public Repos: ${options.repos.length}
- Primary Languages: ${languages.join(', ') || 'Various'}
- Top Repositories:
${topRepos.map(r => `  * ${r.name} (${r.language}, ${r.stars} stars): ${r.description}`).join('\n')}

Generate the 3 variations now.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }
      ],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const rawText = response.text || '';
    if (!rawText.trim()) {
      throw new Error('Empty response from Gemini');
    }

    const parsed = JSON.parse(rawText) as BioVariation[];
    if (Array.isArray(parsed) && parsed.length > 0) {
      return {
        variations: parsed,
        source: 'gemini',
      };
    }

    throw new Error('Malformed JSON array from Gemini');
  } catch (error) {
    console.warn('Gemini Bio Generation fell back to rules:', error);
    return {
      variations: generateBioVariations(options.profile, options.repos, options.locale),
      source: 'rules',
    };
  }
}
