import { GitHubRepository, GitHubUserProfile, PublishedBackup } from '../types';

// Sample fallback profiles for demonstration or when GitHub public rate-limit hits
export const DEMO_PROFILES: Record<string, { profile: GitHubUserProfile; repos: GitHubRepository[] }> = {
  'bavly-hamdy': {
    profile: {
      login: 'Bavly-Hamdy',
      name: 'Bavly Hamdy',
      avatar_url: 'https://avatars.githubusercontent.com/u/100946403?v=4',
      html_url: 'https://github.com/Bavly-Hamdy',
      bio: 'Full-Stack Software Engineer & UI/UX Architect | Next.js, TypeScript, React & Node.js. Building modern, high-performance web experiences.',
      company: 'Freelance',
      blog: 'https://www.linkedin.com/in/bavly-hamdy',
      location: 'Cairo, Egypt',
      email: null,
      public_repos: 41,
      followers: 2,
      following: 3,
      created_at: '2022-03-04T13:44:06Z',
    },
    repos: [
      {
        id: 1104094943,
        name: "aistudio-repository-template",
        full_name: "Bavly-Hamdy/aistudio-repository-template",
        html_url: "https://github.com/Bavly-Hamdy/aistudio-repository-template",
        description: "This is a repository to be used when creating a repository template.",
        stargazers_count: 1,
        forks_count: 0,
        language: null,
        topics: [],
        homepage: "https://ai.studio",
        updated_at: "2026-08-20T19:28:45Z",
        created_at: "2025-11-25T18:40:57Z",
        pushed_at: "2025-11-25T18:41:18Z",
        fork: false,
        size: 10,
        languages: {},
      },
      {
        id: 1310536624,
        name: "bavly-ai-launchpad",
        full_name: "Bavly-Hamdy/bavly-ai-launchpad",
        html_url: "https://github.com/Bavly-Hamdy/bavly-ai-launchpad",
        description: "🚀 30-Day AI Engineering Challenge & Portfolio Platform | Built with React 19, TanStack Start, Tailwind CSS v4 & Gemini API",
        stargazers_count: 1,
        forks_count: 0,
        language: "TypeScript",
        topics: ["30-day-challenge","ai","fullstack","gemini-api","nitro","portfolio","react19","ssr","tailwindcss","tanstack-start","typescript","ui-ux"],
        homepage: "",
        updated_at: "2026-08-20T19:28:10Z",
        created_at: "2026-07-24T02:06:36Z",
        pushed_at: "2026-07-24T03:35:57Z",
        fork: false,
        size: 202,
        languages: {"TypeScript":199796,"CSS":3907,"JavaScript":2889},
      },
      {
        id: 1396583223,
        name: "Bavly-Hamdy",
        full_name: "Bavly-Hamdy/Bavly-Hamdy",
        html_url: "https://github.com/Bavly-Hamdy/Bavly-Hamdy",
        description: null,
        stargazers_count: 1,
        forks_count: 0,
        language: null,
        topics: [],
        homepage: null,
        updated_at: "2026-10-05T06:55:39Z",
        created_at: "2026-09-29T20:53:20Z",
        pushed_at: "2026-10-04T18:07:01Z",
        fork: false,
        size: 10,
        languages: {},
      },
      {
        id: 525297880,
        name: "BH-Tech",
        full_name: "Bavly-Hamdy/BH-Tech",
        html_url: "https://github.com/Bavly-Hamdy/BH-Tech",
        description: null,
        stargazers_count: 0,
        forks_count: 0,
        language: "HTML",
        topics: [],
        homepage: null,
        updated_at: "2024-08-21T18:35:00Z",
        created_at: "2022-08-16T08:44:46Z",
        pushed_at: "2024-08-21T18:34:56Z",
        fork: false,
        size: 11,
        languages: {"HTML":7363,"CSS":3677},
      },
      {
        id: 1367233252,
        name: "biopulse-health-app",
        full_name: "Bavly-Hamdy/biopulse-health-app",
        html_url: "https://github.com/Bavly-Hamdy/biopulse-health-app",
        description: "Clinical-grade health intelligence platform with biometric tracking, Gemini AI nutrition scanner, and Firestore database.",
        stargazers_count: 0,
        forks_count: 0,
        language: "TypeScript",
        topics: [],
        homepage: null,
        updated_at: "2026-09-12T11:27:58Z",
        created_at: "2026-09-12T11:27:20Z",
        pushed_at: "2026-09-12T11:27:54Z",
        fork: false,
        size: 479,
        languages: {"TypeScript":487819,"HTML":1332,"CSS":1033},
      },
      {
        id: 1104221787,
        name: "BIS-Smart-Grader-V2",
        full_name: "Bavly-Hamdy/BIS-Smart-Grader-V2",
        html_url: "https://github.com/Bavly-Hamdy/BIS-Smart-Grader-V2",
        description: "BIS-Smart-Grader-V2 is a modern web application built with React, TypeScript, and Tailwind CSS, integrated with Firebase for seamless grading and assessment workflows.",
        stargazers_count: 1,
        forks_count: 0,
        language: "TypeScript",
        topics: ["education-tech","firebase","grading-system","react","spa","tailwindcss","typescript"],
        homepage: "",
        updated_at: "2026-09-26T21:07:02Z",
        created_at: "2025-11-25T23:24:32Z",
        pushed_at: "2026-09-26T21:07:02Z",
        fork: false,
        size: 548,
        languages: {"TypeScript":557805,"HTML":1327,"JavaScript":1193,"CSS":1079},
      },
      {
        id: 1311348962,
        name: "BOSSLA-CAREER-PRO",
        full_name: "Bavly-Hamdy/BOSSLA-CAREER-PRO",
        html_url: "https://github.com/Bavly-Hamdy/BOSSLA-CAREER-PRO",
        description: "🧭 Forensic ATS Resume Auditor, Google X-Y-Z Bullet Rewriter, Keyword Gap Detector & AI Career Co-Pilot powered by Gemini 2.5 Flash.",
        stargazers_count: 1,
        forks_count: 0,
        language: "TypeScript",
        topics: ["ai-career-assistant","arabic-rtl","ats-resume-checker","framer-motion","gemini-api","nextjs","pdf-export","resume-analyzer","tailwindcss","typescript"],
        homepage: "https://bossla-career-pro.vercel.app/",
        updated_at: "2026-09-29T20:53:01Z",
        created_at: "2026-07-24T19:02:19Z",
        pushed_at: "2026-09-29T20:52:57Z",
        fork: false,
        size: 145,
        languages: {"TypeScript":144797,"CSS":3481,"JavaScript":559},
      },
      {
        id: 825737841,
        name: "Centralized-repository-shipping_calculations",
        full_name: "Bavly-Hamdy/Centralized-repository-shipping_calculations",
        html_url: "https://github.com/Bavly-Hamdy/Centralized-repository-shipping_calculations",
        description: "Centralized-repository-shipping_calculations",
        stargazers_count: 0,
        forks_count: 0,
        language: "Python",
        topics: [],
        homepage: null,
        updated_at: "2024-07-08T11:55:07Z",
        created_at: "2024-07-08T11:55:07Z",
        pushed_at: "2024-07-08T11:29:36Z",
        fork: false,
        size: 10,
        languages: {"Python":324},
      },
      {
        id: 1232104319,
        name: "Clinic-OS",
        full_name: "Bavly-Hamdy/Clinic-OS",
        html_url: "https://github.com/Bavly-Hamdy/Clinic-OS",
        description: "https://github.com/Bavly-Hamdy/ClinicOS.git",
        stargazers_count: 1,
        forks_count: 0,
        language: "TypeScript",
        topics: ["healthcare","clinic-management","firebase","gemini-ai","react","rtl","tailwindcss","typescript","vite"],
        homepage: null,
        updated_at: "2026-08-20T19:28:17Z",
        created_at: "2026-05-07T15:37:24Z",
        pushed_at: "2026-05-07T15:37:49Z",
        fork: false,
        size: 446,
        languages: {"TypeScript":454331,"CSS":1978,"HTML":311},
      },
      {
        id: 1232104101,
        name: "ClinicOS",
        full_name: "Bavly-Hamdy/ClinicOS",
        html_url: "https://github.com/Bavly-Hamdy/ClinicOS",
        description: "Professional, bilingual (AR/EN) medical clinic operating system with appointment orchestration, patient EHR, and analytics.",
        stargazers_count: 1,
        forks_count: 0,
        language: "TypeScript",
        topics: ["healthcare","clinic-management","firebase","gemini-ai","react","rtl","tailwindcss","typescript","vite"],
        homepage: null,
        updated_at: "2026-08-20T19:28:19Z",
        created_at: "2026-05-07T15:37:08Z",
        pushed_at: "2026-05-07T15:37:09Z",
        fork: false,
        size: 10,
        languages: {},
      },
      {
        id: 1234224330,
        name: "Clinic_OS",
        full_name: "Bavly-Hamdy/Clinic_OS",
        html_url: "https://github.com/Bavly-Hamdy/Clinic_OS",
        description: "Clinic OS: A professional, bilingual (AR/EN) clinic management system built with React, Firebase, and Gemini AI. Featuring real-time patient queue, AI-powered drug autocomplete, and glassmorphic UI.",
        stargazers_count: 1,
        forks_count: 0,
        language: "TypeScript",
        topics: ["bilingual","clinic-management","firebase","gemini-ai","medical-system","react","rtl","tailwindcss","typescript","vite","healthcare"],
        homepage: "https://clinic-os-beige.vercel.app/",
        updated_at: "2026-08-20T19:28:16Z",
        created_at: "2026-05-09T22:51:28Z",
        pushed_at: "2026-05-19T10:16:05Z",
        fork: false,
        size: 965,
        languages: {"TypeScript":974299,"CSS":8852,"HTML":3297,"JavaScript":846,"NSIS":503},
      },
      {
        id: 901606442,
        name: "Developmental",
        full_name: "Bavly-Hamdy/Developmental",
        html_url: "https://github.com/Bavly-Hamdy/Developmental",
        description: null,
        stargazers_count: 0,
        forks_count: 0,
        language: "JavaScript",
        topics: [],
        homepage: null,
        updated_at: "2024-12-11T01:32:27Z",
        created_at: "2024-12-11T01:20:47Z",
        pushed_at: "2024-12-11T01:32:23Z",
        fork: false,
        size: 11,
        languages: {"JavaScript":4964,"CSS":4232,"HTML":1757},
      },
      {
        id: 901605723,
        name: "Developmental-Anomalies",
        full_name: "Bavly-Hamdy/Developmental-Anomalies",
        html_url: "https://github.com/Bavly-Hamdy/Developmental-Anomalies",
        description: null,
        stargazers_count: 0,
        forks_count: 0,
        language: null,
        topics: [],
        homepage: null,
        updated_at: "2024-12-11T01:17:56Z",
        created_at: "2024-12-11T01:17:55Z",
        pushed_at: "2024-12-11T01:17:56Z",
        fork: false,
        size: 10,
        languages: {},
      },
      {
        id: 1338962533,
        name: "devmetrics-pro",
        full_name: "Bavly-Hamdy/devmetrics-pro",
        html_url: "https://github.com/Bavly-Hamdy/devmetrics-pro",
        description: "🚀 Deterministic GitHub Developer Persona Visualizer, 3D Card Studio & Dynamic Real-Time SVG Generation Engine built with React, TypeScript & Express.",
        stargazers_count: 1,
        forks_count: 0,
        language: "TypeScript",
        topics: ["developer-metrics","github-telemetry","analytics","typescript","react"],
        homepage: null,
        updated_at: "2026-08-19T00:57:30Z",
        created_at: "2026-08-19T00:54:36Z",
        pushed_at: "2026-08-19T00:56:26Z",
        fork: false,
        size: 247,
        languages: {"TypeScript":251131,"HTML":1636,"CSS":23},
      },
      {
        id: 826009443,
        name: "e-plantShopping",
        full_name: "Bavly-Hamdy/e-plantShopping",
        html_url: "https://github.com/Bavly-Hamdy/e-plantShopping",
        description: "e-plantShopping",
        stargazers_count: 0,
        forks_count: 0,
        language: "JavaScript",
        topics: [],
        homepage: null,
        updated_at: "2024-07-09T00:04:28Z",
        created_at: "2024-07-09T00:04:28Z",
        pushed_at: "2024-07-07T07:51:44Z",
        fork: false,
        size: 30,
        languages: {"JavaScript":18630,"CSS":11428,"HTML":574},
      },
      {
        id: 1263421260,
        name: "Engagement",
        full_name: "Bavly-Hamdy/Engagement",
        html_url: "https://github.com/Bavly-Hamdy/Engagement",
        description: "💍 An elegant, animated digital engagement invitation for Rashad & Esraa featuring audio player, 3D flip-book guestbook, countdown, RSVP, and gallery.",
        stargazers_count: 5,
        forks_count: 2,
        language: "TypeScript",
        topics: ["digital-invitation","engagement","framer-motion","github-pages","guestbook","invitation","react19","tailwindcss","typescript","vite"],
        homepage: "https://Bavly-Hamdy.github.io/Engagement/",
        updated_at: "2026-09-11T16:52:31Z",
        created_at: "2026-06-09T00:10:02Z",
        pushed_at: "2026-08-14T22:19:04Z",
        fork: false,
        size: 112,
        languages: {"TypeScript":109140,"CSS":3607,"HTML":1813},
      },
      {
        id: 1404752066,
        name: "Engagment-V2",
        full_name: "Bavly-Hamdy/Engagment-V2",
        html_url: "https://github.com/Bavly-Hamdy/Engagment-V2",
        description: null,
        stargazers_count: 0,
        forks_count: 0,
        language: "TypeScript",
        topics: [],
        homepage: "https://engagment-v2.vercel.app",
        updated_at: "2026-10-04T20:36:40Z",
        created_at: "2026-10-04T19:06:07Z",
        pushed_at: "2026-10-04T20:36:36Z",
        fork: false,
        size: 111,
        languages: {"TypeScript":108522,"CSS":3607,"HTML":1792},
      },
      {
        id: 1009567865,
        name: "FinalMobAPP",
        full_name: "Bavly-Hamdy/FinalMobAPP",
        html_url: "https://github.com/Bavly-Hamdy/FinalMobAPP",
        description: "Cross-platform mobile application combining real-time health intelligence and native biometric telemetry with Swift and Kotlin.",
        stargazers_count: 1,
        forks_count: 0,
        language: "TypeScript",
        topics: ["mobile","react-native","capacitor","swift","kotlin","typescript"],
        homepage: null,
        updated_at: "2026-08-20T19:28:57Z",
        created_at: "2025-06-27T10:44:38Z",
        pushed_at: "2025-06-27T11:10:40Z",
        fork: false,
        size: 449,
        languages: {"TypeScript":442836,"CSS":7079,"HTML":5974,"JavaScript":3571},
      },
      {
        id: 1009581756,
        name: "FinalWebApp",
        full_name: "Bavly-Hamdy/FinalWebApp",
        html_url: "https://github.com/Bavly-Hamdy/FinalWebApp",
        description: null,
        stargazers_count: 1,
        forks_count: 0,
        language: "TypeScript",
        topics: [],
        homepage: null,
        updated_at: "2026-08-20T19:28:56Z",
        created_at: "2025-06-27T11:14:08Z",
        pushed_at: "2025-06-27T11:14:08Z",
        fork: false,
        size: 10,
        languages: {},
      },
      {
        id: 1009582297,
        name: "FinalWebAppV2",
        full_name: "Bavly-Hamdy/FinalWebAppV2",
        html_url: "https://github.com/Bavly-Hamdy/FinalWebAppV2",
        description: null,
        stargazers_count: 1,
        forks_count: 0,
        language: "TypeScript",
        topics: [],
        homepage: null,
        updated_at: "2026-08-20T19:28:55Z",
        created_at: "2025-06-27T11:15:22Z",
        pushed_at: "2025-06-27T11:15:22Z",
        fork: false,
        size: 10,
        languages: {},
      },
      {
        id: 1355461948,
        name: "focusos",
        full_name: "Bavly-Hamdy/focusos",
        html_url: "https://github.com/Bavly-Hamdy/focusos",
        description: "🪐 High-performance ambient productivity operating system with diurnal chronotype scheduling, 528Hz Solfeggio soundscape, and OWASP-hardened zero-trust architecture.",
        stargazers_count: 1,
        forks_count: 0,
        language: "TypeScript",
        topics: ["ambient-sounds","capacitor","express","focus-timer","framer-motion","nextjs14","owasp-top-10","pomodoro","prisma","productivity","react","solfeggio-frequencies","sqlite","tailwind-css","typescript","web-audio-api","zero-trust","ambient","kotlin"],
        homepage: "https://focusos-woad.vercel.app/",
        updated_at: "2026-09-03T11:23:23Z",
        created_at: "2026-09-03T03:17:24Z",
        pushed_at: "2026-09-03T11:22:35Z",
        fork: false,
        size: 365,
        languages: {"TypeScript":206051,"Kotlin":160280,"JavaScript":5050,"CSS":2767},
      },
      {
        id: 1330974709,
        name: "gitarmor-ai",
        full_name: "Bavly-Hamdy/gitarmor-ai",
        html_url: "https://github.com/Bavly-Hamdy/gitarmor-ai",
        description: "Enterprise DevSecOps & AI Security Intelligence Platform powered by Gemini 2.5, featuring automated SAST scanning, live code sandbox remediation, OWASP compliance mapping, and CI/CD security gates.",
        stargazers_count: 1,
        forks_count: 0,
        language: "TypeScript",
        topics: ["devsecops","gemini-ai","ast","security","typescript","python","sast","github-actions","owasp"],
        homepage: null,
        updated_at: "2026-08-20T19:28:04Z",
        created_at: "2026-08-11T13:45:52Z",
        pushed_at: "2026-08-11T13:46:25Z",
        fork: false,
        size: 168,
        languages: {"TypeScript":169530,"CSS":2474,"HTML":455},
      },
      {
        id: 1396632197,
        name: "GitArmorAI",
        full_name: "Bavly-Hamdy/GitArmorAI",
        html_url: "https://github.com/Bavly-Hamdy/GitArmorAI",
        description: "Autonomous DevSecOps platform powered by Gemini 2.5 AI — Deterministic AST scanning, 94%+ false-positive reduction, and 1-click surgical Pull Request remediation. 100% Free & Open Source.",
        stargazers_count: 0,
        forks_count: 0,
        language: "TypeScript",
        topics: ["ast","code-remediation","cwe","devsecops","gemini-ai","github-actions","open-source","owasp","pull-request","react","sast","security","typescript","vulnerability-scanner","python"],
        homepage: "",
        updated_at: "2026-09-29T22:02:40Z",
        created_at: "2026-09-29T21:49:42Z",
        pushed_at: "2026-09-29T22:03:18Z",
        fork: false,
        size: 566,
        languages: {"TypeScript":553431,"Python":23051,"HTML":1575,"CSS":1425,"JavaScript":546},
      },
      {
        id: 900820634,
        name: "Graduation-Project",
        full_name: "Bavly-Hamdy/Graduation-Project",
        html_url: "https://github.com/Bavly-Hamdy/Graduation-Project",
        description: "AI Integrated Healthcare Assistant is a helpful web and mobile app 🌐📱 that supports better health management for the elderly and disabled. It applies artificial intelligence 🤖 to offer personalized support in reminding users to take their medications 💊 while monitoring their health trends 📈 to improve their general well-being. 😊",
        stargazers_count: 1,
        forks_count: 0,
        language: "JavaScript",
        topics: ["accessibility-in-technology","ai-in-healthcare","data-privacy-and-security","health-monitoring","mobile-and-web-applications"],
        homepage: "https://bavly-hamdy.github.io/Graduation-Project/",
        updated_at: "2026-08-20T19:28:22Z",
        created_at: "2024-12-09T14:30:46Z",
        pushed_at: "2026-03-11T22:55:45Z",
        fork: false,
        size: 121,
        languages: {"JavaScript":68900,"CSS":52684,"HTML":1839},
      },
      {
        id: 998430261,
        name: "Graduation-Project-V1",
        full_name: "Bavly-Hamdy/Graduation-Project-V1",
        html_url: "https://github.com/Bavly-Hamdy/Graduation-Project-V1",
        description: "AI-integrated healthcare assistant and patient monitoring platform with end-to-end data privacy.",
        stargazers_count: 1,
        forks_count: 0,
        language: "TypeScript",
        topics: [],
        homepage: null,
        updated_at: "2026-08-20T19:29:04Z",
        created_at: "2025-06-08T15:40:29Z",
        pushed_at: "2025-06-08T22:45:02Z",
        fork: false,
        size: 346,
        languages: {"TypeScript":344824,"CSS":7896,"HTML":1085,"JavaScript":869},
      },
      {
        id: 990324271,
        name: "HandWritten_OCR",
        full_name: "Bavly-Hamdy/HandWritten_OCR",
        html_url: "https://github.com/Bavly-Hamdy/HandWritten_OCR",
        description: "A lightweight Streamlit app for extracting handwritten text from images using Tesseract OCR. Includes image preprocessing (grayscale, denoising, thresholding), customizable settings via sidebar, and easy download of results as a text file.",
        stargazers_count: 1,
        forks_count: 0,
        language: "Python",
        topics: ["ocr","streamlit","python","machine-learning"],
        homepage: null,
        updated_at: "2026-08-20T19:29:07Z",
        created_at: "2025-05-26T00:10:33Z",
        pushed_at: "2025-05-26T00:10:33Z",
        fork: false,
        size: 10,
        languages: {},
      },
      {
        id: 1144940460,
        name: "Index",
        full_name: "Bavly-Hamdy/Index",
        html_url: "https://github.com/Bavly-Hamdy/Index",
        description: null,
        stargazers_count: 1,
        forks_count: 0,
        language: "HTML",
        topics: [],
        homepage: null,
        updated_at: "2026-08-20T19:28:25Z",
        created_at: "2026-01-29T08:18:54Z",
        pushed_at: "2026-01-29T08:29:28Z",
        fork: false,
        size: 26,
        languages: {"HTML":26161},
      },
      {
        id: 825765191,
        name: "jbbmo-Introduction-to-Git-and-GitHub",
        full_name: "Bavly-Hamdy/jbbmo-Introduction-to-Git-and-GitHub",
        html_url: "https://github.com/Bavly-Hamdy/jbbmo-Introduction-to-Git-and-GitHub",
        description: "Introduction to Git and GitHub",
        stargazers_count: 0,
        forks_count: 0,
        language: "Python",
        topics: [],
        homepage: null,
        updated_at: "2024-07-08T13:00:55Z",
        created_at: "2024-07-08T13:00:55Z",
        pushed_at: "2024-07-08T15:02:40Z",
        fork: false,
        size: 10,
        languages: {"Python":676,"Shell":571},
      },
      {
        id: 1002710574,
        name: "MobileApp",
        full_name: "Bavly-Hamdy/MobileApp",
        html_url: "https://github.com/Bavly-Hamdy/MobileApp",
        description: "An integrated health monitoring platform combining a portable wearable device, a responsive web dashboard, and a fully featured mobile application.",
        stargazers_count: 1,
        forks_count: 0,
        language: "TypeScript",
        topics: ["mobile","react-native","capacitor","swift","kotlin","typescript"],
        homepage: "https://mobile-app-pink.vercel.app",
        updated_at: "2026-09-03T09:55:52Z",
        created_at: "2025-06-16T02:48:31Z",
        pushed_at: "2026-07-01T23:26:41Z",
        fork: false,
        size: 536,
        languages: {"TypeScript":519095,"CSS":14622,"Swift":9563,"JavaScript":4269,"HTML":1069},
      },
      {
        id: 853927245,
        name: "My_REACT",
        full_name: "Bavly-Hamdy/My_REACT",
        html_url: "https://github.com/Bavly-Hamdy/My_REACT",
        description: null,
        stargazers_count: 0,
        forks_count: 0,
        language: "JavaScript",
        topics: [],
        homepage: null,
        updated_at: "2024-09-08T00:18:53Z",
        created_at: "2024-09-07T23:27:59Z",
        pushed_at: "2024-09-07T23:27:59Z",
        fork: false,
        size: 10,
        languages: {},
      },
      {
        id: 1006327439,
        name: "New_MobileApp",
        full_name: "Bavly-Hamdy/New_MobileApp",
        html_url: "https://github.com/Bavly-Hamdy/New_MobileApp",
        description: "Cross-platform mobile application combining real-time health intelligence and native biometric telemetry with Swift and Kotlin.",
        stargazers_count: 1,
        forks_count: 0,
        language: null,
        topics: ["mobile","react-native","capacitor","swift","kotlin","typescript"],
        homepage: null,
        updated_at: "2026-08-20T19:28:58Z",
        created_at: "2025-06-22T02:31:30Z",
        pushed_at: "2025-06-22T02:31:30Z",
        fork: false,
        size: 10,
        languages: {},
      },
      {
        id: 1194189500,
        name: "Portfolio-2026",
        full_name: "Bavly-Hamdy/Portfolio-2026",
        html_url: "https://github.com/Bavly-Hamdy/Portfolio-2026",
        description: null,
        stargazers_count: 1,
        forks_count: 0,
        language: "TypeScript",
        topics: [],
        homepage: null,
        updated_at: "2026-08-20T19:28:20Z",
        created_at: "2026-03-28T02:57:23Z",
        pushed_at: "2026-03-28T02:57:23Z",
        fork: false,
        size: 10,
        languages: {},
      },
      {
        id: 853111134,
        name: "Portfolio-Bavly-Hamdy",
        full_name: "Bavly-Hamdy/Portfolio-Bavly-Hamdy",
        html_url: "https://github.com/Bavly-Hamdy/Portfolio-Bavly-Hamdy",
        description: "Interactive personal portfolio showcase built with modern semantic web technologies and animations.",
        stargazers_count: 0,
        forks_count: 0,
        language: "CSS",
        topics: [],
        homepage: null,
        updated_at: "2024-09-06T02:45:30Z",
        created_at: "2024-09-06T02:36:34Z",
        pushed_at: "2024-09-06T02:45:27Z",
        fork: false,
        size: 24,
        languages: {"CSS":11075,"HTML":10281,"JavaScript":2736},
      },
      {
        id: 825753367,
        name: "Portfolio-Website",
        full_name: "Bavly-Hamdy/Portfolio-Website",
        html_url: "https://github.com/Bavly-Hamdy/Portfolio-Website",
        description: "Portfolio Website built using HTML5, CSS3, JavaScript and jQuery",
        stargazers_count: 0,
        forks_count: 0,
        language: "CSS",
        topics: [],
        homepage: "https://jigarsable.netlify.app/",
        updated_at: "2024-07-08T12:33:31Z",
        created_at: "2024-07-08T12:33:31Z",
        pushed_at: "2024-07-04T07:23:39Z",
        fork: false,
        size: 92,
        languages: {"CSS":45783,"HTML":30990,"JavaScript":17410},
      },
      {
        id: 853935386,
        name: "REACT_PORTFOLIO",
        full_name: "Bavly-Hamdy/REACT_PORTFOLIO",
        html_url: "https://github.com/Bavly-Hamdy/REACT_PORTFOLIO",
        description: null,
        stargazers_count: 1,
        forks_count: 0,
        language: "JavaScript",
        topics: [],
        homepage: null,
        updated_at: "2026-08-20T19:29:16Z",
        created_at: "2024-09-08T00:17:41Z",
        pushed_at: "2024-09-08T01:18:36Z",
        fork: false,
        size: 36,
        languages: {"JavaScript":20850,"CSS":14686,"HTML":1663},
      },
      {
        id: 1404887090,
        name: "readme-studio",
        full_name: "Bavly-Hamdy/readme-studio",
        html_url: "https://github.com/Bavly-Hamdy/readme-studio",
        description: "Architectural GitHub profile README engineering platform. Byte-accurate language DNA, non-sampled repo analytics, Gemini 2.5 Flash bio synthesis, and 1-click atomic publishing. 100% client-side privacy.",
        stargazers_count: 1,
        forks_count: 0,
        language: "TypeScript",
        topics: ["analytics","developer-tools","gemini-ai","github-profile","markdown-generator","open-source","portfolio","profile-readme","react19","readme","tailwind-css","typescript","vite","readme-generator","nextjs","tailwind","telemetry"],
        homepage: "https://readme-studio-ai.vercel.app/",
        updated_at: "2026-10-06T03:09:24Z",
        created_at: "2026-10-04T22:32:59Z",
        pushed_at: "2026-10-06T03:09:19Z",
        fork: false,
        size: 486,
        languages: {"TypeScript":485312,"CSS":6029,"Python":3943,"HTML":2544},
      },
      {
        id: 1324660174,
        name: "ReadmeForge",
        full_name: "Bavly-Hamdy/ReadmeForge",
        html_url: "https://github.com/Bavly-Hamdy/ReadmeForge",
        description: "Engineering-grade README generator for modern software repositories with AST parsing and visual Mermaid architecture topologies.",
        stargazers_count: 3,
        forks_count: 0,
        language: "TypeScript",
        topics: [],
        homepage: "https://readmeforge-sigma.vercel.app/",
        updated_at: "2026-10-05T00:18:04Z",
        created_at: "2026-08-06T02:39:17Z",
        pushed_at: "2026-09-26T21:01:40Z",
        fork: false,
        size: 377,
        languages: {"TypeScript":367181,"Python":16471,"CSS":1976,"JavaScript":748},
      },
      {
        id: 1140946865,
        name: "SinaiConnect",
        full_name: "Bavly-Hamdy/SinaiConnect",
        html_url: "https://github.com/Bavly-Hamdy/SinaiConnect",
        description: "SinaiConnect is a full-stack web application built with React, TypeScript, and Node.js, designed to connect users and streamline communication for Sinai-related services.",
        stargazers_count: 1,
        forks_count: 0,
        language: "TypeScript",
        topics: ["fullstack","javascript","nodejs","react","tailwindcss","typescript","express"],
        homepage: "",
        updated_at: "2026-09-26T20:10:34Z",
        created_at: "2026-01-24T01:13:09Z",
        pushed_at: "2026-09-26T20:09:52Z",
        fork: false,
        size: 205,
        languages: {"TypeScript":188152,"JavaScript":18379,"HTML":2292,"Batchfile":651},
      },
      {
        id: 1244839406,
        name: "SmartEdu-Platform",
        full_name: "Bavly-Hamdy/SmartEdu-Platform",
        html_url: "https://github.com/Bavly-Hamdy/SmartEdu-Platform",
        description: "Next-generation intelligent educational management system and interactive learning workspace.",
        stargazers_count: 1,
        forks_count: 0,
        language: "TypeScript",
        topics: [],
        homepage: null,
        updated_at: "2026-08-20T19:28:15Z",
        created_at: "2026-05-20T16:42:51Z",
        pushed_at: "2026-05-20T16:42:52Z",
        fork: false,
        size: 10,
        languages: {},
      },
      {
        id: 1244840219,
        name: "SmartEdu_Platform",
        full_name: "Bavly-Hamdy/SmartEdu_Platform",
        html_url: "https://github.com/Bavly-Hamdy/SmartEdu_Platform",
        description: "SmartEdu Platform",
        stargazers_count: 1,
        forks_count: 0,
        language: "TypeScript",
        topics: [],
        homepage: null,
        updated_at: "2026-08-20T19:28:14Z",
        created_at: "2026-05-20T16:43:43Z",
        pushed_at: "2026-05-20T16:44:29Z",
        fork: false,
        size: 90,
        languages: {"TypeScript":91402,"CSS":710,"HTML":311},
      },
      {
        id: 1017105670,
        name: "SmartTodo-Pro",
        full_name: "Bavly-Hamdy/SmartTodo-Pro",
        html_url: "https://github.com/Bavly-Hamdy/SmartTodo-Pro",
        description: "High-productivity task management application with keyboard shortcuts and local persistence.",
        stargazers_count: 0,
        forks_count: 0,
        language: "TypeScript",
        topics: [],
        homepage: null,
        updated_at: "2025-07-10T03:47:14Z",
        created_at: "2025-07-10T03:24:17Z",
        pushed_at: "2025-07-10T03:47:11Z",
        fork: false,
        size: 734,
        languages: {"TypeScript":723788,"JavaScript":13895,"CSS":12258,"HTML":1673},
      }
    ]
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
        id: 1337722080,
        name: "AI_Clinical_Decision_Support_AI_Hackathon_2026",
        full_name: "AndrewSameh7/AI_Clinical_Decision_Support_AI_Hackathon_2026",
        html_url: "https://github.com/AndrewSameh7/AI_Clinical_Decision_Support_AI_Hackathon_2026",
        description: "AI-powered clinical decision support system designed for medical diagnostics in AI Hackathon 2026.",
        stargazers_count: 1,
        forks_count: 2,
        language: "Python",
        topics: ["ai","gemini","healthcare"],
        homepage: null,
        updated_at: "2026-09-28T20:02:51Z",
        created_at: "2026-08-17T22:25:03Z",
        pushed_at: "2026-08-20T21:17:22Z",
        fork: false,
        size: 34,
        languages: {"Python":26057,"CSS":3327,"JavaScript":3145,"HTML":2412},
      },
      {
        id: 1406294062,
        name: "AndrewSameh7",
        full_name: "AndrewSameh7/AndrewSameh7",
        html_url: "https://github.com/AndrewSameh7/AndrewSameh7",
        description: null,
        stargazers_count: 0,
        forks_count: 0,
        language: null,
        topics: [],
        homepage: null,
        updated_at: "2026-10-05T19:43:01Z",
        created_at: "2026-10-05T19:34:38Z",
        pushed_at: "2026-10-05T19:42:57Z",
        fork: false,
        size: 10,
        languages: {},
      },
      {
        id: 1122963033,
        name: "chatbot-project",
        full_name: "AndrewSameh7/chatbot-project",
        html_url: "https://github.com/AndrewSameh7/chatbot-project",
        description: "Intelligent conversational agent and natural language processing chatbot system.",
        stargazers_count: 0,
        forks_count: 0,
        language: "Python",
        topics: [],
        homepage: null,
        updated_at: "2025-12-25T23:39:57Z",
        created_at: "2025-12-25T23:24:15Z",
        pushed_at: "2025-12-25T23:39:53Z",
        fork: false,
        size: 10,
        languages: {"Python":7695},
      },
      {
        id: 1121379213,
        name: "Color-Detector-Project",
        full_name: "AndrewSameh7/Color-Detector-Project",
        html_url: "https://github.com/AndrewSameh7/Color-Detector-Project",
        description: "Computer vision real-time color detection and RGB spectrum analysis using OpenCV and Python.",
        stargazers_count: 1,
        forks_count: 0,
        language: "Python",
        topics: ["opencv","computer-vision","python"],
        homepage: null,
        updated_at: "2026-08-09T19:01:26Z",
        created_at: "2025-12-22T22:36:54Z",
        pushed_at: "2025-12-22T23:33:55Z",
        fork: false,
        size: 10,
        languages: {"Python":6933},
      },
      {
        id: 1366868396,
        name: "Credit-Card-Approval-Prediction",
        full_name: "AndrewSameh7/Credit-Card-Approval-Prediction",
        html_url: "https://github.com/AndrewSameh7/Credit-Card-Approval-Prediction",
        description: "Machine learning predictive classification model for evaluating credit card applicant approvals.",
        stargazers_count: 1,
        forks_count: 0,
        language: "Jupyter Notebook",
        topics: ["scikit-learn","machine-learning","data-science"],
        homepage: null,
        updated_at: "2026-09-28T20:02:42Z",
        created_at: "2026-09-12T02:24:51Z",
        pushed_at: "2026-09-12T02:54:11Z",
        fork: false,
        size: 204,
        languages: {"Jupyter Notebook":208827},
      },
      {
        id: 1217289422,
        name: "Django_Labs",
        full_name: "AndrewSameh7/Django_Labs",
        html_url: "https://github.com/AndrewSameh7/Django_Labs",
        description: "Backend web service and database models implemented using Python and Django framework.",
        stargazers_count: 1,
        forks_count: 0,
        language: "Python",
        topics: ["django","python","backend"],
        homepage: null,
        updated_at: "2026-10-05T13:37:47Z",
        created_at: "2026-04-21T18:30:31Z",
        pushed_at: "2026-04-21T18:57:36Z",
        fork: false,
        size: 18,
        languages: {"Python":11652,"HTML":6242,"CSS":383},
      },
      {
        id: 1141582587,
        name: "ES6-_E-commerce_Website",
        full_name: "AndrewSameh7/ES6-_E-commerce_Website",
        html_url: "https://github.com/AndrewSameh7/ES6-_E-commerce_Website",
        description: "Interactive e-commerce web platform engineered with vanilla ES6 JavaScript, HTML5, and CSS3.",
        stargazers_count: 0,
        forks_count: 0,
        language: "JavaScript",
        topics: [],
        homepage: null,
        updated_at: "2026-01-25T03:55:43Z",
        created_at: "2026-01-25T03:30:20Z",
        pushed_at: "2026-01-25T03:55:39Z",
        fork: false,
        size: 24,
        languages: {"JavaScript":13116,"HTML":7056,"CSS":4207},
      },
      {
        id: 1267907005,
        name: "fishing-bugs-asyut",
        full_name: "AndrewSameh7/fishing-bugs-asyut",
        html_url: "https://github.com/AndrewSameh7/fishing-bugs-asyut",
        description: null,
        stargazers_count: 1,
        forks_count: 0,
        language: "HTML",
        topics: [],
        homepage: null,
        updated_at: "2026-09-28T20:02:57Z",
        created_at: "2026-06-13T00:54:02Z",
        pushed_at: "2026-06-13T02:35:19Z",
        fork: false,
        size: 79,
        languages: {"HTML":38271,"Ruby":35927,"Dockerfile":2857,"Shell":1933,"JavaScript":1680,"CSS":491},
      },
      {
        id: 1264873552,
        name: "Full-Stack-E-commerce-Frontend-",
        full_name: "AndrewSameh7/Full-Stack-E-commerce-Frontend-",
        html_url: "https://github.com/AndrewSameh7/Full-Stack-E-commerce-Frontend-",
        description: null,
        stargazers_count: 1,
        forks_count: 0,
        language: "TypeScript",
        topics: [],
        homepage: null,
        updated_at: "2026-09-28T20:02:59Z",
        created_at: "2026-06-10T08:56:50Z",
        pushed_at: "2026-06-10T09:22:37Z",
        fork: false,
        size: 58,
        languages: {"TypeScript":47122,"SCSS":12146,"HTML":344},
      },
      {
        id: 1366983256,
        name: "Graduation-Project-2025",
        full_name: "AndrewSameh7/Graduation-Project-2025",
        html_url: "https://github.com/AndrewSameh7/Graduation-Project-2025",
        description: "Autonomous robotics and computer vision control algorithms developed as Graduation Project 2025.",
        stargazers_count: 1,
        forks_count: 0,
        language: "Jupyter Notebook",
        topics: [],
        homepage: null,
        updated_at: "2026-09-28T20:02:40Z",
        created_at: "2026-09-12T05:35:42Z",
        pushed_at: "2026-09-12T05:42:34Z",
        fork: false,
        size: 377,
        languages: {"Jupyter Notebook":385890},
      },
      {
        id: 1366904944,
        name: "Household-Energy-Consumption-Forecasting",
        full_name: "AndrewSameh7/Household-Energy-Consumption-Forecasting",
        html_url: "https://github.com/AndrewSameh7/Household-Energy-Consumption-Forecasting",
        description: "Time series forecasting and predictive modeling for household energy consumption patterns using Machine Learning.",
        stargazers_count: 2,
        forks_count: 1,
        language: "Jupyter Notebook",
        topics: ["scikit-learn","machine-learning","data-science"],
        homepage: null,
        updated_at: "2026-10-03T05:43:37Z",
        created_at: "2026-09-12T03:26:51Z",
        pushed_at: "2026-09-12T03:30:01Z",
        fork: false,
        size: 291,
        languages: {"Jupyter Notebook":298362},
      },
      {
        id: 1142204111,
        name: "ITI-Intake-46--OOP_Course-Personal_Finance_Tracker_Project",
        full_name: "AndrewSameh7/ITI-Intake-46--OOP_Course-Personal_Finance_Tracker_Project",
        html_url: "https://github.com/AndrewSameh7/ITI-Intake-46--OOP_Course-Personal_Finance_Tracker_Project",
        description: "Object-Oriented Programming (OOP) financial ledger and expense management project in C++.",
        stargazers_count: 0,
        forks_count: 0,
        language: "C++",
        topics: ["cplusplus","oop"],
        homepage: null,
        updated_at: "2026-01-26T04:54:07Z",
        created_at: "2026-01-26T04:54:06Z",
        pushed_at: "2026-01-26T04:54:07Z",
        fork: false,
        size: 10,
        languages: {},
      },
      {
        id: 1138516729,
        name: "ITI-Intake-46-Bash-Course-DBMS-Project",
        full_name: "AndrewSameh7/ITI-Intake-46-Bash-Course-DBMS-Project",
        html_url: "https://github.com/AndrewSameh7/ITI-Intake-46-Bash-Course-DBMS-Project",
        description: "Bash shell scripted relational database management system (DBMS) with full CRUD operations.",
        stargazers_count: 0,
        forks_count: 0,
        language: "Shell",
        topics: ["bash","shell","linux"],
        homepage: null,
        updated_at: "2026-01-20T20:07:20Z",
        created_at: "2026-01-20T19:19:40Z",
        pushed_at: "2026-01-20T20:00:21Z",
        fork: false,
        size: 10,
        languages: {"Shell":8703},
      },
      {
        id: 1226781889,
        name: "ITI_Angular_Labs",
        full_name: "AndrewSameh7/ITI_Angular_Labs",
        html_url: "https://github.com/AndrewSameh7/ITI_Angular_Labs",
        description: "Full-stack frontend enterprise application labs built with Angular, RxJS, and TypeScript at ITI.",
        stargazers_count: 1,
        forks_count: 0,
        language: "TypeScript",
        topics: ["angular","typescript","frontend"],
        homepage: null,
        updated_at: "2026-10-05T13:37:45Z",
        created_at: "2026-05-01T20:34:46Z",
        pushed_at: "2026-05-01T21:12:58Z",
        fork: false,
        size: 10,
        languages: {},
      },
      {
        id: 1135512923,
        name: "lab1_repo",
        full_name: "AndrewSameh7/lab1_repo",
        html_url: "https://github.com/AndrewSameh7/lab1_repo",
        description: null,
        stargazers_count: 0,
        forks_count: 0,
        language: "HTML",
        topics: [],
        homepage: null,
        updated_at: "2026-01-16T08:13:41Z",
        created_at: "2026-01-16T07:48:14Z",
        pushed_at: "2026-01-16T08:13:38Z",
        fork: false,
        size: 10,
        languages: {"HTML":112},
      },
      {
        id: 1135527606,
        name: "lab2_repo",
        full_name: "AndrewSameh7/lab2_repo",
        html_url: "https://github.com/AndrewSameh7/lab2_repo",
        description: null,
        stargazers_count: 0,
        forks_count: 0,
        language: "JavaScript",
        topics: [],
        homepage: null,
        updated_at: "2026-01-16T08:42:38Z",
        created_at: "2026-01-16T08:16:46Z",
        pushed_at: "2026-01-16T08:42:35Z",
        fork: false,
        size: 10,
        languages: {},
      },
      {
        id: 1269528927,
        name: "lab_four_api",
        full_name: "AndrewSameh7/lab_four_api",
        html_url: "https://github.com/AndrewSameh7/lab_four_api",
        description: null,
        stargazers_count: 1,
        forks_count: 0,
        language: "Ruby",
        topics: [],
        homepage: null,
        updated_at: "2026-09-28T20:02:49Z",
        created_at: "2026-06-14T20:31:51Z",
        pushed_at: "2026-09-06T23:32:43Z",
        fork: false,
        size: 34,
        languages: {"Ruby":31401,"Dockerfile":2835,"Batchfile":392,"HTML":240,"Shell":203},
      },
      {
        id: 1218843426,
        name: "Laravel_Labs",
        full_name: "AndrewSameh7/Laravel_Labs",
        html_url: "https://github.com/AndrewSameh7/Laravel_Labs",
        description: "MVC web application and RESTful backend APIs developed with Laravel and PHP.",
        stargazers_count: 1,
        forks_count: 0,
        language: "Blade",
        topics: ["laravel","php","backend"],
        homepage: null,
        updated_at: "2026-10-05T13:37:46Z",
        created_at: "2026-04-23T09:13:38Z",
        pushed_at: "2026-04-29T13:24:59Z",
        fork: false,
        size: 126,
        languages: {"Blade":74195,"PHP":54180,"JavaScript":458,"CSS":390},
      },
      {
        id: 1328225039,
        name: "LLM-ZoomCamp-Agentic-RAG-Homework",
        full_name: "AndrewSameh7/LLM-ZoomCamp-Agentic-RAG-Homework",
        html_url: "https://github.com/AndrewSameh7/LLM-ZoomCamp-Agentic-RAG-Homework",
        description: "Agentic Retrieval-Augmented Generation (RAG) system with dynamic query routing and LLM orchestration.",
        stargazers_count: 1,
        forks_count: 0,
        language: "Python",
        topics: ["llm","rag","langchain","vector-search"],
        homepage: null,
        updated_at: "2026-08-09T19:00:59Z",
        created_at: "2026-08-08T22:38:44Z",
        pushed_at: "2026-08-09T06:46:04Z",
        fork: false,
        size: 18,
        languages: {"Python":17948},
      },
      {
        id: 1360706821,
        name: "LLM-ZoomCamp-Evaluation-Homework",
        full_name: "AndrewSameh7/LLM-ZoomCamp-Evaluation-Homework",
        html_url: "https://github.com/AndrewSameh7/LLM-ZoomCamp-Evaluation-Homework",
        description: null,
        stargazers_count: 1,
        forks_count: 0,
        language: "Python",
        topics: [],
        homepage: null,
        updated_at: "2026-09-28T20:02:46Z",
        created_at: "2026-09-07T22:21:54Z",
        pushed_at: "2026-09-07T22:21:55Z",
        fork: false,
        size: 10,
        languages: {},
      },
      {
        id: 1366845662,
        name: "LLM-ZoomCamp-Final-Project",
        full_name: "AndrewSameh7/LLM-ZoomCamp-Final-Project",
        html_url: "https://github.com/AndrewSameh7/LLM-ZoomCamp-Final-Project",
        description: null,
        stargazers_count: 1,
        forks_count: 0,
        language: "Python",
        topics: [],
        homepage: null,
        updated_at: "2026-09-28T20:02:43Z",
        created_at: "2026-09-12T01:44:12Z",
        pushed_at: "2026-09-12T01:44:13Z",
        fork: false,
        size: 10,
        languages: {},
      },
      {
        id: 1360707476,
        name: "LLM-ZoomCamp-Monitoring-Homework",
        full_name: "AndrewSameh7/LLM-ZoomCamp-Monitoring-Homework",
        html_url: "https://github.com/AndrewSameh7/LLM-ZoomCamp-Monitoring-Homework",
        description: null,
        stargazers_count: 1,
        forks_count: 0,
        language: "Python",
        topics: [],
        homepage: null,
        updated_at: "2026-09-28T20:02:45Z",
        created_at: "2026-09-07T22:23:08Z",
        pushed_at: "2026-09-07T22:23:08Z",
        fork: false,
        size: 10,
        languages: {},
      },
      {
        id: 1360706479,
        name: "LLM-ZoomCamp-Orchestration-Homework",
        full_name: "AndrewSameh7/LLM-ZoomCamp-Orchestration-Homework",
        html_url: "https://github.com/AndrewSameh7/LLM-ZoomCamp-Orchestration-Homework",
        description: null,
        stargazers_count: 1,
        forks_count: 0,
        language: "Python",
        topics: ["docker","orchestration"],
        homepage: null,
        updated_at: "2026-09-28T20:02:47Z",
        created_at: "2026-09-07T22:21:15Z",
        pushed_at: "2026-09-07T22:21:16Z",
        fork: false,
        size: 10,
        languages: {},
      },
      {
        id: 1329211849,
        name: "LLM-ZoomCamp-Vector-Search-Homework",
        full_name: "AndrewSameh7/LLM-ZoomCamp-Vector-Search-Homework",
        html_url: "https://github.com/AndrewSameh7/LLM-ZoomCamp-Vector-Search-Homework",
        description: "Dense vector embeddings indexing and semantic retrieval pipeline using vector databases.",
        stargazers_count: 1,
        forks_count: 0,
        language: "Python",
        topics: ["llm","rag","langchain","vector-search"],
        homepage: null,
        updated_at: "2026-09-28T20:02:52Z",
        created_at: "2026-08-09T21:39:44Z",
        pushed_at: "2026-08-09T21:46:45Z",
        fork: false,
        size: 28,
        languages: {"Python":28740},
      },
      {
        id: 1268322229,
        name: "migration_war",
        full_name: "AndrewSameh7/migration_war",
        html_url: "https://github.com/AndrewSameh7/migration_war",
        description: "This repo aims to learn more about rails migration, and how to create them while working with other developers.",
        stargazers_count: 1,
        forks_count: 0,
        language: "Ruby",
        topics: [],
        homepage: null,
        updated_at: "2026-09-28T20:02:55Z",
        created_at: "2026-06-13T11:51:53Z",
        pushed_at: "2026-06-13T11:56:18Z",
        fork: false,
        size: 130,
        languages: {"Ruby":123219,"HTML":5888,"Dockerfile":1934,"JavaScript":1293,"CSS":736,"Shell":199},
      },
      {
        id: 1261491346,
        name: "Nestjs---Labs",
        full_name: "AndrewSameh7/Nestjs---Labs",
        html_url: "https://github.com/AndrewSameh7/Nestjs---Labs",
        description: "Scalable modular backend REST API architecture built with NestJS, TypeScript, and Node.js.",
        stargazers_count: 1,
        forks_count: 0,
        language: "TypeScript",
        topics: ["nestjs","typescript","backend","api"],
        homepage: null,
        updated_at: "2026-09-28T20:03:00Z",
        created_at: "2026-06-06T18:59:39Z",
        pushed_at: "2026-06-06T20:16:08Z",
        fork: false,
        size: 16,
        languages: {"TypeScript":15908,"JavaScript":899},
      },
      {
        id: 1267715449,
        name: "new-rails-asyut",
        full_name: "AndrewSameh7/new-rails-asyut",
        html_url: "https://github.com/AndrewSameh7/new-rails-asyut",
        description: null,
        stargazers_count: 1,
        forks_count: 0,
        language: "HTML",
        topics: [],
        homepage: null,
        updated_at: "2026-09-28T20:02:54Z",
        created_at: "2026-06-12T19:51:35Z",
        pushed_at: "2026-06-14T21:02:07Z",
        fork: false,
        size: 79,
        languages: {"HTML":38218,"Ruby":35618,"Dockerfile":2848,"Shell":1933,"JavaScript":1680,"CSS":491},
      },
      {
        id: 1247762414,
        name: "Odoo_labs",
        full_name: "AndrewSameh7/Odoo_labs",
        html_url: "https://github.com/AndrewSameh7/Odoo_labs",
        description: null,
        stargazers_count: 1,
        forks_count: 0,
        language: "Python",
        topics: [],
        homepage: null,
        updated_at: "2026-10-05T13:37:44Z",
        created_at: "2026-05-23T18:41:48Z",
        pushed_at: "2026-05-23T19:00:56Z",
        fork: false,
        size: 76411,
        languages: {"Python":41261240,"JavaScript":35129944,"SCSS":1501379,"CSS":184680,"HTML":71817,"Shell":48341,"NSIS":22776,"XSLT":12668,"Sass":11811},
      },
      {
        id: 1142045808,
        name: "react-lab_1-app",
        full_name: "AndrewSameh7/react-lab_1-app",
        html_url: "https://github.com/AndrewSameh7/react-lab_1-app",
        description: "React state management and interactive component interfaces developed during ITI software track.",
        stargazers_count: 0,
        forks_count: 0,
        language: "JavaScript",
        topics: ["react","javascript","frontend"],
        homepage: null,
        updated_at: "2026-01-25T21:48:51Z",
        created_at: "2026-01-25T21:33:00Z",
        pushed_at: "2026-01-25T21:48:48Z",
        fork: false,
        size: 10,
        languages: {"JavaScript":5620,"CSS":1679,"HTML":620},
      },
      {
        id: 1142048909,
        name: "react-lab_2-app",
        full_name: "AndrewSameh7/react-lab_2-app",
        html_url: "https://github.com/AndrewSameh7/react-lab_2-app",
        description: "React state management and interactive component interfaces developed during ITI software track.",
        stargazers_count: 1,
        forks_count: 0,
        language: "JavaScript",
        topics: ["react","javascript","frontend"],
        homepage: null,
        updated_at: "2026-10-05T13:37:49Z",
        created_at: "2026-01-25T21:41:17Z",
        pushed_at: "2026-01-26T05:05:26Z",
        fork: false,
        size: 10,
        languages: {"JavaScript":4332,"CSS":452,"HTML":364},
      },
      {
        id: 1266630114,
        name: "Ruby_Labs",
        full_name: "AndrewSameh7/Ruby_Labs",
        html_url: "https://github.com/AndrewSameh7/Ruby_Labs",
        description: "Ruby and Ruby on Rails server-side architectures, REST APIs, and database migrations.",
        stargazers_count: 1,
        forks_count: 0,
        language: "Ruby",
        topics: ["ruby","backend"],
        homepage: null,
        updated_at: "2026-09-28T20:02:58Z",
        created_at: "2026-06-11T20:00:44Z",
        pushed_at: "2026-06-11T20:54:44Z",
        fork: false,
        size: 10,
        languages: {"Ruby":2951,"HTML":355},
      },
      {
        id: 1122538114,
        name: "Stock-Market-Prediction",
        full_name: "AndrewSameh7/Stock-Market-Prediction",
        html_url: "https://github.com/AndrewSameh7/Stock-Market-Prediction",
        description: "Financial time-series forecasting and algorithmic trend prediction on historical stock market data.",
        stargazers_count: 0,
        forks_count: 0,
        language: "Jupyter Notebook",
        topics: ["scikit-learn","machine-learning","data-science"],
        homepage: null,
        updated_at: "2025-12-25T21:48:26Z",
        created_at: "2025-12-25T00:54:01Z",
        pushed_at: "2025-12-25T21:48:23Z",
        fork: false,
        size: 218,
        languages: {"Jupyter Notebook":213821,"Python":9724},
      },
      {
        id: 1393797895,
        name: "Tips_Hindawi_First_Task-Youtube_Vedio_Summarization",
        full_name: "AndrewSameh7/Tips_Hindawi_First_Task-Youtube_Vedio_Summarization",
        html_url: "https://github.com/AndrewSameh7/Tips_Hindawi_First_Task-Youtube_Vedio_Summarization",
        description: "Intelligent video content summarization pipeline leveraging speech-to-text transcripts and LLM summarization.",
        stargazers_count: 1,
        forks_count: 0,
        language: "Jupyter Notebook",
        topics: [],
        homepage: null,
        updated_at: "2026-10-05T13:37:39Z",
        created_at: "2026-09-28T20:29:02Z",
        pushed_at: "2026-09-28T20:31:47Z",
        fork: false,
        size: 62,
        languages: {"Jupyter Notebook":63035},
      },
      {
        id: 1405962257,
        name: "Tips_Hindawi_Fourth_Task-Using_Streamlit_and_NGROK",
        full_name: "AndrewSameh7/Tips_Hindawi_Fourth_Task-Using_Streamlit_and_NGROK",
        html_url: "https://github.com/AndrewSameh7/Tips_Hindawi_Fourth_Task-Using_Streamlit_and_NGROK",
        description: "Interactive machine learning web application using Streamlit and ngrok tunneling.",
        stargazers_count: 0,
        forks_count: 0,
        language: "Jupyter Notebook",
        topics: ["streamlit","python","machine-learning"],
        homepage: null,
        updated_at: "2026-10-05T15:21:01Z",
        created_at: "2026-10-05T15:12:36Z",
        pushed_at: "2026-10-05T15:20:56Z",
        fork: false,
        size: 25,
        languages: {"Jupyter Notebook":19313,"Python":6453},
      },
      {
        id: 1403482729,
        name: "Tips_Hindawi_Second_Task-RAG",
        full_name: "AndrewSameh7/Tips_Hindawi_Second_Task-RAG",
        html_url: "https://github.com/AndrewSameh7/Tips_Hindawi_Second_Task-RAG",
        description: null,
        stargazers_count: 1,
        forks_count: 0,
        language: "Python",
        topics: ["llm","rag","langchain","vector-search"],
        homepage: null,
        updated_at: "2026-10-05T13:37:38Z",
        created_at: "2026-10-03T17:46:10Z",
        pushed_at: "2026-10-03T18:43:16Z",
        fork: false,
        size: 10,
        languages: {},
      },
      {
        id: 1403536461,
        name: "Tips_Hindawi_Third_Task-HR_Candidate_Profile_Parser",
        full_name: "AndrewSameh7/Tips_Hindawi_Third_Task-HR_Candidate_Profile_Parser",
        html_url: "https://github.com/AndrewSameh7/Tips_Hindawi_Third_Task-HR_Candidate_Profile_Parser",
        description: "Automated HR candidate profile parser and NLP entity extractor using Large Language Models.",
        stargazers_count: 1,
        forks_count: 0,
        language: "Python",
        topics: [],
        homepage: null,
        updated_at: "2026-10-05T13:37:36Z",
        created_at: "2026-10-03T18:47:06Z",
        pushed_at: "2026-10-03T20:04:52Z",
        fork: false,
        size: 10,
        languages: {},
      },
      {
        id: 1359849918,
        name: "Twitter-Sentiment-Analysis-using-Bi-LSTM",
        full_name: "AndrewSameh7/Twitter-Sentiment-Analysis-using-Bi-LSTM",
        html_url: "https://github.com/AndrewSameh7/Twitter-Sentiment-Analysis-using-Bi-LSTM",
        description: "Twitter sentiment analysis and text classification using bidirectional LSTM (Bi-LSTM) deep neural networks.",
        stargazers_count: 1,
        forks_count: 0,
        language: "Jupyter Notebook",
        topics: ["pytorch","deep-learning","nlp"],
        homepage: null,
        updated_at: "2026-09-28T20:02:48Z",
        created_at: "2026-09-07T06:29:38Z",
        pushed_at: "2026-09-07T07:13:03Z",
        fork: false,
        size: 51,
        languages: {"Jupyter Notebook":52001},
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
      const nameLower = r.name.toLowerCase();
      const topics = Array.isArray(r.topics) ? r.topics.map(t => t.toLowerCase()) : [];

      // Stars & forks weight
      score += (r.stargazers_count || 0) * 8;
      score += (r.forks_count || 0) * 12;

      // Heavy penalty on personal event/invitation/guestbook projects
      if (
        /\b(engagement|invitation|wedding|greeting|birthday|guestbook)\b/i.test(nameLower) ||
        topics.includes('engagement') ||
        topics.includes('invitation') ||
        topics.includes('guestbook')
      ) {
        score -= 50;
      }

      // Strong boost for substantive engineering systems, developer tools, and AI architectures
      const systemKeywords = [
        'developer-tools', 'readme-generator', 'devsecops', 'security', 'ast', 'sast',
        'gemini-ai', 'gemini-api', 'ai', 'machine-learning', 'healthcare', 'clinic-management',
        'productivity', 'ats-resume-checker', 'nextjs', 'react19', 'fullstack', 'compiler'
      ];
      if (topics.some(t => systemKeywords.includes(t)) || /\b(readme-studio|gitarmor|focusos|clinic|bossla|devmetrics)\b/i.test(nameLower)) {
        score += 40;
      }

      // Meaningful description gives huge boost
      if (r.description && r.description.trim().length > 15) {
        score += 25;
      } else if (!r.description || r.description.trim().length === 0) {
        score -= 20; // Deprioritize repos with no description
      }

      // Rich topics
      if (topics.length > 0) {
        score += Math.min(topics.length * 4, 20);
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
