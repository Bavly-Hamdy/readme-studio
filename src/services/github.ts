import { GitHubRepository, GitHubUserProfile, PublishedBackup } from '../types';

// Sample fallback profiles for demonstration or when GitHub public rate-limit hits
export const DEMO_PROFILES: Record<string, { profile: GitHubUserProfile; repos: GitHubRepository[] }> = {
  'bavly-hamdy': {
    profile: {
      login: 'Bavly-Hamdy',
      name: 'Bavly Hamdy',
      avatar_url: 'https://avatars.githubusercontent.com/u/108342478?v=4',
      html_url: 'https://github.com/Bavly-Hamdy',
      bio: 'Full-Stack Software Engineer & UI/UX Architect | Next.js, TypeScript, React & Node.js. Building modern, high-performance web experiences.',
      company: 'Freelance',
      blog: 'https://github.com/Bavly-Hamdy',
      location: 'Cairo, Egypt',
      email: null,
      public_repos: 41,
      followers: 2,
      following: 3,
      created_at: '2022-03-04T13:44:06Z',
    },
    repos: [
      {
        id: 91283120,
        name: 'Engagement',
        full_name: 'Bavly-Hamdy/Engagement',
        html_url: 'https://github.com/Bavly-Hamdy/Engagement',
        description: 'An elegant, interactive digital celebration and memory guestbook application built with Next.js, Framer Motion, and Tailwind CSS.',
        stargazers_count: 5,
        forks_count: 2,
        language: 'TypeScript',
        topics: ['nextjs', 'react', 'tailwind', 'framer-motion', 'guestbook', 'interactive'],
        homepage: 'https://github.com/Bavly-Hamdy/Engagement',
        updated_at: '2026-10-04T22:00:00Z',
      },
      {
        id: 91283121,
        name: 'ReadmeForge',
        full_name: 'Bavly-Hamdy/ReadmeForge',
        html_url: 'https://github.com/Bavly-Hamdy/ReadmeForge',
        description: 'Engineering-grade README generator for modern software repositories with AST parsing and visual Mermaid architecture topologies.',
        stargazers_count: 3,
        forks_count: 0,
        language: 'TypeScript',
        topics: ['readme', 'developer-tools', 'github-profile', 'markdown', 'react', 'typescript'],
        homepage: 'https://github.com/Bavly-Hamdy/ReadmeForge',
        updated_at: '2026-10-04T20:00:00Z',
      },
      {
        id: 91283122,
        name: 'readme-studio',
        full_name: 'Bavly-Hamdy/readme-studio',
        html_url: 'https://github.com/Bavly-Hamdy/readme-studio',
        description: 'Architectural GitHub profile README builder, developer telemetry analytics & AI persona synthesizer powered by Gemini 3.8 Flash.',
        stargazers_count: 1,
        forks_count: 0,
        language: 'TypeScript',
        topics: ['readme-generator', 'gemini-ai', 'developer-tools', 'nextjs', 'tailwind'],
        homepage: 'https://github.com/Bavly-Hamdy/readme-studio',
        updated_at: '2026-10-04T18:00:00Z',
      },
      {
        id: 88123011,
        name: 'GitArmorAI',
        full_name: 'Bavly-Hamdy/GitArmorAI',
        html_url: 'https://github.com/Bavly-Hamdy/GitArmorAI',
        description: 'Autonomous DevSecOps platform powered by Gemini 3.8 Flash — Deterministic AST scanning, 94%+ false-positive reduction, and surgical PR remediation.',
        stargazers_count: 1,
        forks_count: 0,
        language: 'TypeScript',
        topics: ['devsecops', 'gemini-ai', 'ast', 'security', 'typescript'],
        homepage: null,
        updated_at: '2026-10-02T18:00:00Z',
      },
      {
        id: 87102450,
        name: 'BOSSLA-CAREER-PRO',
        full_name: 'Bavly-Hamdy/BOSSLA-CAREER-PRO',
        html_url: 'https://github.com/Bavly-Hamdy/BOSSLA-CAREER-PRO',
        description: 'Forensic ATS Resume Auditor, Google X-Y-Z Bullet Rewriter, Keyword Gap Detector & AI Career Co-Pilot powered by Gemini 3.8 Flash.',
        stargazers_count: 1,
        forks_count: 0,
        language: 'TypeScript',
        topics: ['resume-builder', 'ats-scanner', 'gemini-ai', 'react', 'typescript'],
        homepage: null,
        updated_at: '2026-09-28T14:00:00Z',
      },
      {
        id: 86102450,
        name: 'focusos',
        full_name: 'Bavly-Hamdy/focusos',
        html_url: 'https://github.com/Bavly-Hamdy/focusos',
        description: 'High-performance ambient productivity operating system with diurnal chronotype scheduling, 528Hz Solfeggio soundscape, and OWASP-hardened zero-trust architecture.',
        stargazers_count: 1,
        forks_count: 0,
        language: 'TypeScript',
        topics: ['focus', 'productivity', 'ambient', 'nextjs', 'tailwind'],
        homepage: null,
        updated_at: '2026-09-18T10:00:00Z',
      },
      {
        id: 85102450,
        name: 'Clinic-OS',
        full_name: 'Bavly-Hamdy/Clinic-OS',
        html_url: 'https://github.com/Bavly-Hamdy/Clinic-OS',
        description: 'A professional, bilingual Clinic and Healthcare Operating System with appointment orchestration, patient EHR, and analytics.',
        stargazers_count: 1,
        forks_count: 0,
        language: 'TypeScript',
        topics: ['clinic-management', 'healthcare', 'nextjs', 'tailwind', 'typescript'],
        homepage: null,
        updated_at: '2026-09-12T10:00:00Z',
      },
      {
        id: 84102450,
        name: 'devmetrics-pro',
        full_name: 'Bavly-Hamdy/devmetrics-pro',
        html_url: 'https://github.com/Bavly-Hamdy/devmetrics-pro',
        description: 'Deterministic GitHub Developer Telemetry & Productivity Metrics Suite with deep AST commit analysis.',
        stargazers_count: 1,
        forks_count: 0,
        language: 'TypeScript',
        topics: ['developer-metrics', 'github-telemetry', 'analytics', 'typescript'],
        homepage: null,
        updated_at: '2026-09-05T10:00:00Z',
      }
    ],
  },
  torvalds: {
    profile: {
      login: 'torvalds',
      name: 'Linus Torvalds',
      avatar_url: 'https://avatars.githubusercontent.com/u/1024025?v=4',
      html_url: 'https://github.com/torvalds',
      bio: 'The creator of Linux and Git. Working on the Linux kernel.',
      company: 'Linux Foundation',
      blog: 'https://kernel.org',
      location: 'Portland, OR',
      email: null,
      public_repos: 7,
      followers: 245000,
      following: 0,
      created_at: '2011-09-03T15:26:22Z',
    },
    repos: [
      {
        id: 2325298,
        name: 'linux',
        full_name: 'torvalds/linux',
        html_url: 'https://github.com/torvalds/linux',
        description: 'Linux kernel source tree',
        stargazers_count: 185000,
        forks_count: 55000,
        language: 'C',
        topics: ['linux', 'kernel', 'os', 'c', 'systems'],
        homepage: 'https://kernel.org',
        updated_at: '2026-10-01T12:00:00Z',
      },
      {
        id: 2174246,
        name: 'subsurface-for-dirk',
        full_name: 'torvalds/subsurface-for-dirk',
        html_url: 'https://github.com/torvalds/subsurface-for-dirk',
        description: 'Subsurface dive log program',
        stargazers_count: 3200,
        forks_count: 650,
        language: 'C',
        topics: ['diving', 'subsurface', 'desktop', 'qt'],
        homepage: null,
        updated_at: '2026-09-15T10:00:00Z',
      },
      {
        id: 3124560,
        name: 'uemacs',
        full_name: 'torvalds/uemacs',
        html_url: 'https://github.com/torvalds/uemacs',
        description: 'MicroEMACS editor modified by Linus Torvalds',
        stargazers_count: 2400,
        forks_count: 320,
        language: 'C',
        topics: ['editor', 'emacs', 'c'],
        homepage: null,
        updated_at: '2026-08-20T14:30:00Z',
      }
    ],
  },
  gaearon: {
    profile: {
      login: 'gaearon',
      name: 'Dan Abramov',
      avatar_url: 'https://avatars.githubusercontent.com/u/810438?v=4',
      html_url: 'https://github.com/gaearon',
      bio: 'Co-author of Redux, Create React App. Working on bluesky/atproto tools.',
      company: null,
      blog: 'https://overreacted.io',
      location: 'London, UK',
      email: 'dan.abramov@gmail.com',
      public_repos: 260,
      followers: 92000,
      following: 172,
      created_at: '2011-05-25T18:18:31Z',
    },
    repos: [
      {
        id: 36040800,
        name: 'redux',
        full_name: 'reduxjs/redux',
        html_url: 'https://github.com/reduxjs/redux',
        description: 'Predictable state container for JavaScript apps',
        stargazers_count: 60500,
        forks_count: 15400,
        language: 'TypeScript',
        topics: ['javascript', 'redux', 'state-management', 'react'],
        homepage: 'https://redux.js.org',
        updated_at: '2026-09-28T09:00:00Z',
      },
      {
        id: 63537249,
        name: 'create-react-app',
        full_name: 'facebook/create-react-app',
        html_url: 'https://github.com/facebook/create-react-app',
        description: 'Set up a modern web app by running one command.',
        stargazers_count: 101000,
        forks_count: 26000,
        language: 'JavaScript',
        topics: ['react', 'build-tools', 'cli'],
        homepage: 'https://create-react-app.dev',
        updated_at: '2026-07-12T11:00:00Z',
      },
      {
        id: 16734567,
        name: 'overreacted.io',
        full_name: 'gaearon/overreacted.io',
        html_url: 'https://github.com/gaearon/overreacted.io',
        description: 'Personal blog about software engineering and React.',
        stargazers_count: 7300,
        forks_count: 850,
        language: 'JavaScript',
        topics: ['blog', 'react', 'markdown', 'editorial'],
        homepage: 'https://overreacted.io',
        updated_at: '2026-09-30T16:00:00Z',
      }
    ],
  },
  antfu: {
    profile: {
      login: 'antfu',
      name: 'Anthony Fu',
      avatar_url: 'https://avatars.githubusercontent.com/u/11247099?v=4',
      html_url: 'https://github.com/antfu',
      bio: 'Core team member of Vue, Vite, Nuxt. Full-time open source developer.',
      company: 'NuxtLabs',
      blog: 'https://antfu.me',
      location: 'Tokyo, Japan',
      email: 'anthonyfu117@hotmail.com',
      public_repos: 410,
      followers: 58000,
      following: 210,
      created_at: '2015-02-28T09:00:00Z',
    },
    repos: [
      {
        id: 28912345,
        name: 'vueuse',
        full_name: 'vueuse/vueuse',
        html_url: 'https://github.com/vueuse/vueuse',
        description: 'Collection of essential Vue Composition Utilities',
        stargazers_count: 21000,
        forks_count: 2800,
        language: 'TypeScript',
        topics: ['vue', 'vue3', 'composition-api', 'typescript'],
        homepage: 'https://vueuse.org',
        updated_at: '2026-10-02T10:00:00Z',
      },
      {
        id: 34567890,
        name: 'unocss',
        full_name: 'unocss/unocss',
        html_url: 'https://github.com/unocss/unocss',
        description: 'The instant on-demand atomic CSS engine',
        stargazers_count: 17500,
        forks_count: 1200,
        language: 'TypeScript',
        topics: ['css', 'vite', 'tailwind', 'atomic-css'],
        homepage: 'https://unocss.dev',
        updated_at: '2026-10-03T18:00:00Z',
      },
      {
        id: 45678901,
        name: 'slidev',
        full_name: 'slidevjs/slidev',
        html_url: 'https://github.com/slidevjs/slidev',
        description: 'Presentation slides for developers',
        stargazers_count: 34000,
        forks_count: 2100,
        language: 'TypeScript',
        topics: ['presentation', 'markdown', 'vue', 'vite'],
        homepage: 'https://sli.dev',
        updated_at: '2026-09-29T14:00:00Z',
      }
    ],
  },
  shadcn: {
    profile: {
      login: 'shadcn',
      name: 'shadcn',
      avatar_url: 'https://avatars.githubusercontent.com/u/124599?v=4',
      html_url: 'https://github.com/shadcn',
      bio: 'Building open-source design systems and web tools.',
      company: 'Vercel',
      blog: 'https://ui.shadcn.com',
      location: 'San Francisco, CA',
      email: null,
      public_repos: 45,
      followers: 65000,
      following: 110,
      created_at: '2009-09-10T14:00:00Z',
    },
    repos: [
      {
        id: 59345678,
        name: 'ui',
        full_name: 'shadcn-ui/ui',
        html_url: 'https://github.com/shadcn-ui/ui',
        description: 'Beautifully designed components that you can copy and paste into your apps.',
        stargazers_count: 78000,
        forks_count: 6500,
        language: 'TypeScript',
        topics: ['react', 'radix-ui', 'tailwind', 'components'],
        homepage: 'https://ui.shadcn.com',
        updated_at: '2026-10-03T20:00:00Z',
      },
      {
        id: 61234567,
        name: 'taxonomy',
        full_name: 'shadcn-ui/taxonomy',
        html_url: 'https://github.com/shadcn-ui/taxonomy',
        description: 'An open source application built using the new router, server components and everything new in Next.js 13.',
        stargazers_count: 18500,
        forks_count: 3100,
        language: 'TypeScript',
        topics: ['nextjs', 'react', 'prisma', 'tailwindcss'],
        homepage: 'https://tx.shadcn.com',
        updated_at: '2026-08-11T12:00:00Z',
      }
    ]
  },
  andrewsameh7: {
    profile: {
      login: 'AndrewSameh7',
      name: 'Andrew Sameh',
      avatar_url: 'https://avatars.githubusercontent.com/u/229541708?v=4',
      html_url: 'https://github.com/AndrewSameh7',
      bio: 'B.Sc. Software Engineering Fresh Graduate||AI / ML Engineer||Robotics Ethautisic||Problem Solver Competitive|| Former Open Source ITI Traniee',
      company: null,
      blog: '',
      location: 'Egypt',
      email: 'andrewsameh2003@gmail.com',
      public_repos: 37,
      followers: 19,
      following: 63,
      created_at: '2023-01-15T10:00:00Z',
    },
    repos: [
      {
        id: 1366904944,
        name: 'Household-Energy-Consumption-Forecasting',
        full_name: 'AndrewSameh7/Household-Energy-Consumption-Forecasting',
        html_url: 'https://github.com/AndrewSameh7/Household-Energy-Consumption-Forecasting',
        description: 'Time series forecasting and predictive modeling for household energy consumption patterns using Machine Learning.',
        stargazers_count: 2,
        forks_count: 0,
        language: 'Python',
        topics: ['machine-learning', 'time-series', 'forecasting', 'python', 'energy'],
        homepage: null,
        updated_at: '2026-10-03T05:43:37Z',
        created_at: '2026-09-12T03:26:51Z',
        pushed_at: '2026-09-12T03:30:01Z',
      },
      {
        id: 1328225039,
        name: 'LLM-ZoomCamp-Agentic-RAG-Homework',
        full_name: 'AndrewSameh7/LLM-ZoomCamp-Agentic-RAG-Homework',
        html_url: 'https://github.com/AndrewSameh7/LLM-ZoomCamp-Agentic-RAG-Homework',
        description: 'Agentic Retrieval-Augmented Generation (RAG) system with dynamic query routing, vector search, and LLM orchestration.',
        stargazers_count: 1,
        forks_count: 0,
        language: 'Python',
        topics: ['llm', 'rag', 'agentic-ai', 'vector-search', 'python'],
        homepage: null,
        updated_at: '2026-08-09T19:00:59Z',
        created_at: '2026-08-08T22:38:44Z',
        pushed_at: '2026-08-09T06:46:04Z',
      },
      {
        id: 1403536461,
        name: 'Tips_Hindawi_Third_Task-HR_Candidate_Profile_Parser',
        full_name: 'AndrewSameh7/Tips_Hindawi_Third_Task-HR_Candidate_Profile_Parser',
        html_url: 'https://github.com/AndrewSameh7/Tips_Hindawi_Third_Task-HR_Candidate_Profile_Parser',
        description: 'Automated HR candidate profile parser and NLP entity extractor using Large Language Models and document processing.',
        stargazers_count: 1,
        forks_count: 0,
        language: 'Python',
        topics: ['nlp', 'llm', 'resume-parser', 'python', 'information-extraction'],
        homepage: null,
        updated_at: '2026-10-05T13:37:36Z',
        created_at: '2026-10-03T18:47:06Z',
        pushed_at: '2026-10-03T20:04:52Z',
      },
      {
        id: 1393797895,
        name: 'Tips_Hindawi_First_Task-Youtube_Vedio_Summarization',
        full_name: 'AndrewSameh7/Tips_Hindawi_First_Task-Youtube_Vedio_Summarization',
        html_url: 'https://github.com/AndrewSameh7/Tips_Hindawi_First_Task-Youtube_Vedio_Summarization',
        description: 'Intelligent video content summarization pipeline leveraging speech-to-text transcripts and LLM abstractive summarization.',
        stargazers_count: 1,
        forks_count: 0,
        language: 'Python',
        topics: ['summarization', 'llm', 'nlp', 'python', 'audio-processing'],
        homepage: null,
        updated_at: '2026-10-05T13:37:39Z',
        created_at: '2026-09-28T20:29:02Z',
        pushed_at: '2026-09-28T20:31:47Z',
      },
      {
        id: 1329211849,
        name: 'LLM-ZoomCamp-Vector-Search-Homework',
        full_name: 'AndrewSameh7/LLM-ZoomCamp-Vector-Search-Homework',
        html_url: 'https://github.com/AndrewSameh7/LLM-ZoomCamp-Vector-Search-Homework',
        description: 'Dense vector embeddings indexing and semantic retrieval pipeline using vector databases.',
        stargazers_count: 1,
        forks_count: 0,
        language: 'Python',
        topics: ['vector-search', 'embeddings', 'llm', 'python'],
        homepage: null,
        updated_at: '2026-09-28T20:02:52Z',
        created_at: '2026-08-09T21:39:44Z',
        pushed_at: '2026-08-09T21:46:45Z',
      },
      {
        id: 1366983256,
        name: 'Graduation-Project-2025',
        full_name: 'AndrewSameh7/Graduation-Project-2025',
        html_url: 'https://github.com/AndrewSameh7/Graduation-Project-2025',
        description: 'Software Engineering graduation project integrating intelligent autonomous control and computer vision algorithms.',
        stargazers_count: 1,
        forks_count: 0,
        language: 'Python',
        topics: ['computer-vision', 'deep-learning', 'robotics', 'python'],
        homepage: null,
        updated_at: '2026-09-28T20:02:40Z',
        created_at: '2026-09-12T05:35:42Z',
        pushed_at: '2026-09-12T05:42:34Z',
      }
    ]
  }
};

/**
 * Deterministically rank and curate top repositories for showcase:
 * 1. Excludes profile README repository (username/username).
 * 2. Filters out fork repositories.
 * 3. Weights stars, forks, detailed descriptions, rich topics, live homepage demos, and recency.
 */
export function rankTopProjects(repos: GitHubRepository[], username: string): GitHubRepository[] {
  const userLower = username.trim().toLowerCase();

  return [...repos]
    .filter(r => {
      // Exclude profile README repository (e.g., username/username)
      if (r.name.toLowerCase() === userLower) return false;
      // Exclude fork repositories if any
      if (r.fork) return false;
      return true;
    })
    .map(r => {
      let score = 0;
      // Stars & forks weight
      score += (r.stargazers_count || 0) * 8;
      score += (r.forks_count || 0) * 12;

      // Meaningful description gives huge boost
      if (r.description && r.description.trim().length > 15) {
        score += 25;
      } else if (!r.description || r.description.trim().length === 0) {
        score -= 20; // Deprioritize repos with no description
      }

      // Rich topics
      if (Array.isArray(r.topics) && r.topics.length > 0) {
        score += Math.min(r.topics.length * 4, 20);
      }

      // Has live demo / homepage
      if (r.homepage && r.homepage.trim().length > 0) {
        score += 10;
      }

      // Has recognized language
      if (r.language) {
        score += 5;
      }

      // Recency
      const dateStr = r.updated_at || r.pushed_at || r.created_at;
      if (dateStr) {
        const ageDays = (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24);
        if (ageDays < 90) score += 15;
        else if (ageDays < 365) score += 8;
      }

      return { repo: r, score };
    })
    .sort((a, b) => b.score - a.score)
    .map(item => item.repo);
}

/**
 * Fetch GitHub user profile and repositories
 */
export async function fetchGitHubData(
  username: string,
  token?: string
): Promise<{ profile: GitHubUserProfile; repos: GitHubRepository[] }> {
  const normalized = username.trim().toLowerCase();

  // If matches a demo profile and no token provided, try fetching or fallback seamlessly
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'Cache-Control': 'no-cache',
  };
  if (token) {
    headers.Authorization = `Bearer ${token.trim()}`;
  }

  try {
    let userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(normalized)}`, {
      headers,
    });

    // Auto fallback on 401 Unauthorized
    if (userRes.status === 401 && headers.Authorization) {
      delete headers.Authorization;
      userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(normalized)}`, {
        headers,
      });
    }

    if (userRes.status === 404) {
      if (DEMO_PROFILES[normalized]) {
        return DEMO_PROFILES[normalized];
      }
      throw new Error('USER_NOT_FOUND');
    }

    if (userRes.status === 403 || userRes.status === 429) {
      // Check if demo fallback exists
      if (DEMO_PROFILES[normalized]) {
        return DEMO_PROFILES[normalized];
      }
      throw new Error('RATE_LIMITED');
    }

    if (!userRes.ok) {
      throw new Error(`GITHUB_API_ERROR_${userRes.status}`);
    }

    const profile: GitHubUserProfile = await userRes.json();

    // Fetch repositories with maximum allowable per_page limit
    let reposRes = await fetch(
      `https://api.github.com/users/${encodeURIComponent(normalized)}/repos?sort=pushed&per_page=100`,
      { headers }
    );

    if (reposRes.status === 401 && headers.Authorization) {
      delete headers.Authorization;
      reposRes = await fetch(
        `https://api.github.com/users/${encodeURIComponent(normalized)}/repos?sort=pushed&per_page=100`,
        { headers }
      );
    }

    let repos: GitHubRepository[] = [];
    if (reposRes.ok) {
      const rawRepos = await reposRes.json();
      if (Array.isArray(rawRepos)) {
        const mapped = rawRepos.map(r => ({
          id: r.id,
          name: r.name,
          full_name: r.full_name,
          html_url: r.html_url,
          description: r.description,
          stargazers_count: r.stargazers_count || 0,
          forks_count: r.forks_count || 0,
          language: r.language,
          topics: Array.isArray(r.topics) ? r.topics : [],
          homepage: r.homepage,
          updated_at: r.updated_at,
          created_at: r.created_at,
          pushed_at: r.pushed_at,
          fork: Boolean(r.fork),
        }));
        // Rank top projects to the front, preserving total repository set
        const topRanked = rankTopProjects(mapped, profile.login);
        const topIds = new Set(topRanked.map(r => r.id));
        const rest = mapped.filter(r => !topIds.has(r.id));
        repos = [...topRanked, ...rest];
      }
    }

    // If no repos fetched or rate limited on repos, fallback if demo available
    if (repos.length === 0 && DEMO_PROFILES[normalized]) {
      repos = DEMO_PROFILES[normalized].repos;
    }

    return { profile, repos };
  } catch (err: unknown) {
    if (DEMO_PROFILES[normalized]) {
      return DEMO_PROFILES[normalized];
    }
    throw err;
  }
}

/**
 * Verify a GitHub Personal Access Token
 */
export async function verifyGitHubToken(token: string): Promise<GitHubUserProfile> {
  const res = await fetch('https://api.github.com/user', {
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${token.trim()}`,
    },
  });

  if (!res.ok) {
    throw new Error('INVALID_TOKEN');
  }

  const data: GitHubUserProfile = await res.json();
  return data;
}

/**
 * Check if the user has an existing README in username/username
 */
export async function getExistingProfileReadme(
  username: string,
  token: string
): Promise<{ exists: boolean; sha?: string; content?: string }> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${encodeURIComponent(username)}/${encodeURIComponent(username)}/contents/README.md`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          Authorization: `Bearer ${token.trim()}`,
        },
      }
    );

    if (res.status === 404) {
      return { exists: false };
    }

    if (!res.ok) {
      return { exists: false };
    }

    const data = await res.json();
    let decoded = '';
    if (data.content && data.encoding === 'base64') {
      try {
        decoded = atob(data.content.replace(/\s/g, ''));
      } catch {
        decoded = '';
      }
    }

    return {
      exists: true,
      sha: data.sha,
      content: decoded,
    };
  } catch {
    return { exists: false };
  }
}

/**
 * Commit a new README to username/username with atomic safe backup
 */
export async function publishReadmeToGitHub(params: {
  username: string;
  token: string;
  markdownContent: string;
  commitMessage?: string;
}): Promise<{ success: boolean; commitUrl: string; backup?: PublishedBackup }> {
  const { username, token, markdownContent, commitMessage } = params;
  const headers = {
    Accept: 'application/vnd.github.v3+json',
    Authorization: `Bearer ${token.trim()}`,
    'Content-Type': 'application/json',
  };

  // 1. Check if the profile repository exists
  const repoRes = await fetch(
    `https://api.github.com/repos/${encodeURIComponent(username)}/${encodeURIComponent(username)}`,
    { headers }
  );

  if (repoRes.status === 404) {
    // Create the special username repository
    const createRepoRes = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: username,
        description: `Profile README for ${username}`,
        private: false,
        auto_init: true,
      }),
    });

    if (!createRepoRes.ok) {
      const errData = await createRepoRes.json().catch(() => ({}));
      throw new Error(errData.message || 'COULD_NOT_CREATE_PROFILE_REPO');
    }

    // Wait a brief moment for GitHub repo creation to propagate
    await new Promise(resolve => setTimeout(resolve, 1500));
  }

  // 2. Fetch existing README for SHA and backup
  const existing = await getExistingProfileReadme(username, token);
  let backup: PublishedBackup | undefined;

  if (existing.exists && existing.content && existing.sha) {
    backup = {
      timestamp: new Date().toISOString(),
      username,
      sha: existing.sha,
      content: existing.content,
      commitUrl: `https://github.com/${username}/${username}`,
    };
  }

  // Encode UTF-8 content to base64 properly
  const base64Content = btoa(unescape(encodeURIComponent(markdownContent)));

  const putBody: Record<string, string> = {
    message: commitMessage || 'docs: update profile README.md via README Studio',
    content: base64Content,
  };

  if (existing.sha) {
    putBody.sha = existing.sha;
  }

  const putRes = await fetch(
    `https://api.github.com/repos/${encodeURIComponent(username)}/${encodeURIComponent(username)}/contents/README.md`,
    {
      method: 'PUT',
      headers,
      body: JSON.stringify(putBody),
    }
  );

  if (!putRes.ok) {
    const err = await putRes.json().catch(() => ({}));
    throw new Error(err.message || 'COMMIT_FAILED');
  }

  const resultData = await putRes.json();
  const commitUrl = resultData.commit?.html_url || `https://github.com/${username}/${username}`;

  return {
    success: true,
    commitUrl,
    backup,
  };
}

/**
 * Restore a previous backup
 */
export async function restoreReadmeBackup(params: {
  username: string;
  token: string;
  backupContent: string;
}): Promise<boolean> {
  const { username, token, backupContent } = params;
  const existing = await getExistingProfileReadme(username, token);

  const base64Content = btoa(unescape(encodeURIComponent(backupContent)));
  const putBody: Record<string, string> = {
    message: 'revert: restore previous profile README.md via README Studio',
    content: base64Content,
  };
  if (existing.sha) {
    putBody.sha = existing.sha;
  }

  const res = await fetch(
    `https://api.github.com/repos/${encodeURIComponent(username)}/${encodeURIComponent(username)}/contents/README.md`,
    {
      method: 'PUT',
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `Bearer ${token.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(putBody),
    }
  );

  return res.ok;
}
