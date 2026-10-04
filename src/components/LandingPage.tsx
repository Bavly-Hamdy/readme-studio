import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Locale,
  AppTheme,
  ReadmeTheme,
  GitHubUserProfile,
  GitHubRepository,
  TechItem,
} from '../types';
import { DEMO_PROFILES, fetchGitHubData } from '../services/github';
import { generateReadmeMarkdown } from '../services/markdownRenderer';
import { detectTechStack } from '../services/techDetection';
import { generateBioVariations, BioVariation } from '../services/aiBio';
import { getRateLimitInfo, subscribeRateLimit, RateLimitInfo } from '../services/githubAnalyzer';
import { marked } from 'marked';
import { LogoIcon } from './LogoIcon';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Github,
  Star,
  ShieldCheck,
  Code2,
  Terminal,
  Cpu,
  Layers,
  CheckCircle2,
  ExternalLink,
  Eye,
  FileCode,
  Copy,
  Check,
  Palette,
  Zap,
  Globe,
  Sun,
  Moon,
  Search,
  Loader2,
  Activity,
  FolderGit2,
  BookOpen,
  Lock,
  ServerOff,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  SlidersHorizontal,
  Database,
  Key,
  HelpCircle,
  Wand2,
  Info,
} from 'lucide-react';

interface LandingPageProps {
  locale: Locale;
  setLocale: (l: Locale) => void;
  appTheme: AppTheme;
  setAppTheme: (t: AppTheme) => void;
  onLaunchStudio: (initialUser?: string) => void;
  onOpenSettings: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  locale,
  setLocale,
  appTheme,
  setAppTheme,
  onLaunchStudio,
  onOpenSettings,
}) => {
  const isAr = locale === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  // Real GitHub API Rate Limit Subscription
  const [rateLimit, setRateLimit] = useState<RateLimitInfo | null>(getRateLimitInfo());
  useEffect(() => {
    return subscribeRateLimit(info => setRateLimit(info));
  }, []);

  // Creator's real profile state (dynamically fetched or initialized from real cached data)
  const [creatorProfile, setCreatorProfile] = useState<GitHubUserProfile>(DEMO_PROFILES['bavly-hamdy'].profile);
  const [creatorRepos, setCreatorRepos] = useState<GitHubRepository[]>(DEMO_PROFILES['bavly-hamdy'].repos);

  // Fetch real creator data from GitHub API on mount to ensure real data
  useEffect(() => {
    let isMounted = true;
    fetchGitHubData('Bavly-Hamdy')
      .then(res => {
        if (isMounted && res.profile) {
          setCreatorProfile(res.profile);
          if (res.repos && res.repos.length > 0) {
            setCreatorRepos(res.repos);
          }
        }
      })
      .catch(() => {
        // Fallback remains DEMO_PROFILES['bavly-hamdy'] which has real data
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Interactive Demo Sandbox State
  const [activeHandle, setActiveHandle] = useState<string>('Bavly-Hamdy');
  const [demoProfile, setDemoProfile] = useState<GitHubUserProfile>(DEMO_PROFILES['bavly-hamdy'].profile);
  const [demoRepos, setDemoRepos] = useState<GitHubRepository[]>(DEMO_PROFILES['bavly-hamdy'].repos);
  const [isFetchingDemo, setIsFetchingDemo] = useState<boolean>(false);
  const [fetchNotice, setFetchNotice] = useState<string | null>(null);
  const [demoTheme, setDemoTheme] = useState<ReadmeTheme>('minimal');
  const [demoTab, setDemoTab] = useState<'preview' | 'code' | 'dna' | 'stack'>('preview');
  const [customInput, setCustomInput] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [selectedDnaLang, setSelectedDnaLang] = useState<string | null>(null);

  // Sandbox section live toggles
  const [sandboxSections, setSandboxSections] = useState({
    header: true,
    techStack: true,
    projects: true,
    stats: true,
    connect: true,
  });

  // AI Bio Tone State for the comparator
  const [previewTone, setPreviewTone] = useState<'formal' | 'friendly' | 'direct'>('formal');

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Handle switching or fetching live sandbox profile
  const handleSelectDemoProfile = useCallback(async (handle: string) => {
    const cleanHandle = handle.trim();
    if (!cleanHandle) return;

    setActiveHandle(cleanHandle);
    setCustomInput(cleanHandle);
    setFetchNotice(null);

    // If matches static demo, load immediately first for instant tactile response
    const normalized = cleanHandle.toLowerCase();
    if (DEMO_PROFILES[normalized]) {
      setDemoProfile(DEMO_PROFILES[normalized].profile);
      setDemoRepos(DEMO_PROFILES[normalized].repos);
    }

    // Then attempt live fetch to ensure 100% real, fresh data from GitHub REST v3 API
    setIsFetchingDemo(true);
    try {
      const live = await fetchGitHubData(cleanHandle);
      if (live && live.profile) {
        setDemoProfile(live.profile);
        if (live.repos && live.repos.length > 0) {
          setDemoRepos(live.repos);
        }
        setFetchNotice(
          isAr
            ? `تم جلب بيانات @${live.profile.login} مباشرة من GitHub API (${live.repos.length} مستودع).`
            : `Live GitHub API data loaded for @${live.profile.login} (${live.repos.length} repos).`
        );
      }
    } catch {
      // Graceful fallback to cached
      setFetchNotice(
        isAr
          ? `تم استخدام النسخة الموثقة لـ @${cleanHandle} (حصة GitHub العامة بلغت حدها).`
          : `Using verified snapshot for @${cleanHandle} (public rate limit reached).`
      );
    } finally {
      setIsFetchingDemo(false);
    }
  }, [isAr]);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      handleSelectDemoProfile(customInput.trim());
    }
  };

  // Detected Tech Stack from current demo repos
  const detectedTech = useMemo(() => {
    return detectTechStack(demoRepos);
  }, [demoRepos]);

  // AI Bio Variations for current demo profile
  const bioVariations: BioVariation[] = useMemo(() => {
    return generateBioVariations(demoProfile, demoRepos, locale);
  }, [demoProfile, demoRepos, locale]);

  const activeBio = useMemo(() => {
    return bioVariations.find(v => v.tone === previewTone) || bioVariations[0];
  }, [bioVariations, previewTone]);

  // Generate markdown dynamically based on real profile & repos in sandbox
  const demoMarkdown = useMemo(() => {
    const prof = demoProfile;
    const reps = demoRepos;
    const detected = detectedTech;

    const config = {
      header: {
        enabled: sandboxSections.header,
        data: {
          greeting: isAr ? 'مرحباً، أنا' : "Hi there, I'm",
          name: prof.name || prof.login,
          headline: activeBio.summary || prof.bio || 'Software Engineer building reliable web systems',
          status: 'Building open-source tools',
          location: prof.location || 'Cairo, Egypt',
          showAvatar: true,
          avatarShape: 'circle' as const,
          headerStyle: 'capsule' as const,
          bannerPattern: 'waving' as const,
          bannerTheme: 'inkwash' as const,
          showTyping: true,
          typingLines: [
            prof.bio || 'Software Engineer',
            'Full-Stack Developer & UI/UX Architect',
            'Passionate about high-performance software',
          ],
          showViewsCounter: true,
          viewsCounterColor: '5a7188',
          badgeStyle: 'for-the-badge' as const,
        },
      },
      about: {
        enabled: sandboxSections.header,
        data: {
          summary: activeBio.summary || prof.bio || 'Senior engineer focused on resilient systems, clean code, and developer tooling.',
          currentRole: activeBio.focus || 'Distributed software architectures',
          currentWork: reps[0]?.name || 'developer tooling',
          currentLearning: activeBio.learning || 'Modern web architectures and system design patterns',
          askMeAbout: 'TypeScript, React, Next.js, System Architecture',
          howToReach: prof.email || `@${prof.login} on GitHub`,
          funFact: 'I design software with architectural precision and high-contrast typography.',
        },
      },
      techStack: {
        enabled: sandboxSections.techStack,
        data: {
          style: 'grouped-cards' as const,
          badgeStyle: 'for-the-badge' as const,
          items: detected,
        },
      },
      projects: {
        enabled: sandboxSections.projects,
        data: {
          showStars: true,
          showForks: true,
          showTopics: true,
          layout: 'table' as const,
          projects: reps.slice(0, 4).map(r => ({
            name: r.name,
            description: r.description || 'Open source software project.',
            url: r.html_url,
            language: r.language || 'Code',
            stars: r.stargazers_count,
            forks: r.forks_count,
            fullName: r.full_name,
          })),
        },
      },
      analytics: {
        enabled: false,
        data: {
          showSnapshot: true,
          showLanguages: true,
          showLanguagePie: true,
          showRhythm: true,
          showScores: true,
          showContributions: true,
          showTimeline: true,
          showTopics: true,
          showInsights: true,
          languageLimit: 6,
        },
      },
      stats: {
        enabled: sandboxSections.stats,
        data: {
          showStatsCard: true,
          showStreakCard: true,
          showTopLanguagesCard: true,
          showActivityGraph: false,
          showTrophies: false,
          showProfileViews: false,
          statsTheme: 'minimal' as const,
          hideBorder: true,
        },
      },
      connect: {
        enabled: sandboxSections.connect,
        data: {
          customCta: 'Always open to discussing exciting technical projects and open-source contributions.',
          links: [
            { platform: 'github' as const, usernameOrUrl: prof.login, enabled: true },
            { platform: 'website' as const, usernameOrUrl: prof.blog || '', enabled: !!prof.blog },
            { platform: 'email' as const, usernameOrUrl: prof.email || '', enabled: !!prof.email },
          ],
        },
      },
    };

    return generateReadmeMarkdown(config, demoTheme, prof.login, null, prof, locale);
  }, [demoProfile, demoRepos, detectedTech, activeBio, sandboxSections, demoTheme, locale, isAr]);

  // Parse HTML for real preview
  const demoHtml = useMemo(() => {
    try {
      return marked.parse(demoMarkdown, { gfm: true, breaks: true });
    } catch {
      return demoMarkdown;
    }
  }, [demoMarkdown]);

  const handleCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(demoMarkdown);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      /* ignore */
    }
  };

  // Compute actual language stats from currently active demo repositories
  const languageSummary = useMemo(() => {
    const counts: Record<string, { count: number; repos: string[] }> = {};
    demoRepos.forEach(r => {
      if (r.language) {
        if (!counts[r.language]) {
          counts[r.language] = { count: 0, repos: [] };
        }
        counts[r.language].count += 1;
        counts[r.language].repos.push(r.name);
      }
    });
    const total = Object.values(counts).reduce((a, b) => a + b.count, 0);
    return Object.entries(counts)
      .map(([lang, val]) => ({
        lang,
        count: val.count,
        percent: total > 0 ? Math.round((val.count / total) * 100) : 0,
        repos: val.repos,
      }))
      .sort((a, b) => b.count - a.count);
  }, [demoRepos]);

  // Markdown stats (characters, lines, bytes)
  const markdownMetrics = useMemo(() => {
    const lines = demoMarkdown.split('\n').length;
    const chars = demoMarkdown.length;
    const bytes = new Blob([demoMarkdown]).size;
    return { lines, chars, bytes };
  }, [demoMarkdown]);

  // Categorized tech summary
  const techByCategory = useMemo(() => {
    const grouped: Record<string, TechItem[]> = {};
    detectedTech.forEach(item => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });
    return grouped;
  }, [detectedTech]);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors flex flex-col font-sans selection:bg-[var(--accent)] selection:text-white">
      {/* 1. Global Navigation Bar */}
      <nav className="h-16 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40 transition-colors">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <LogoIcon size={34} className="shadow-xs" />
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-xl tracking-tight text-[var(--text)]">
              <span className="italic font-medium text-[var(--accent)]">README</span> Studio
            </span>
            <span className="hidden sm:inline text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
              Open Source MIT
            </span>
          </div>
        </div>

        {/* Quick Nav Anchor Links (Desktop) */}
        <div className="hidden xl:flex items-center gap-6 text-xs font-medium text-[var(--text-muted)]">
          <a href="#sandbox" className="hover:text-[var(--text)] transition-colors">
            {isAr ? 'المعاينة الحية' : 'Live Sandbox'}
          </a>
          <a href="#tone-engine" className="hover:text-[var(--text)] transition-colors">
            {isAr ? 'صياغة الذكاء الاصطناعي' : 'Gemini AI Bios'}
          </a>
          <a href="#creator-profile" className="hover:text-[var(--text)] transition-colors">
            {isAr ? 'المطور والمشاريع' : 'Creator & Repos'}
          </a>
          <a href="#architecture" className="hover:text-[var(--text)] transition-colors">
            {isAr ? 'المعمارية والأمان' : 'Architecture'}
          </a>
          <a href="#faq" className="hover:text-[var(--text)] transition-colors">
            {isAr ? 'الأسئلة الشائعة' : 'FAQ'}
          </a>
        </div>

        {/* Center / Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Real API Status */}
          {rateLimit && (
            <div
              title={
                isAr
                  ? `حصة GitHub API المتبقية: ${rateLimit.remaining} من ${rateLimit.limit} (تتجدد خلال ${Math.max(0, Math.round((rateLimit.resetTime - Date.now()) / 60000))} دقيقة)`
                  : `GitHub API Quota: ${rateLimit.remaining}/${rateLimit.limit} (resets in ${Math.max(0, Math.round((rateLimit.resetTime - Date.now()) / 60000))}m)`
              }
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono rounded-lg border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-muted)]"
            >
              <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
              <span>API: {rateLimit.remaining}/{rateLimit.limit}</span>
            </div>
          )}

          {/* GitHub Star Repo Link */}
          <a
            href="https://github.com/Bavly-Hamdy/README-Studio"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] hover:border-[var(--border-strong)] transition-all"
            title="View Source on GitHub"
          >
            <Github className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Star on GitHub</span>
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
          </a>

          {/* Language Switch */}
          <button
            type="button"
            onClick={() => {
              const next = locale === 'en' ? 'ar' : 'en';
              setLocale(next);
              localStorage.setItem('readme_studio_locale', next);
            }}
            className="px-2.5 py-1.5 text-xs font-mono font-semibold rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] hover:border-[var(--border-strong)] transition-all"
            title={locale === 'en' ? 'التحويل للعربية' : 'Switch to English'}
          >
            {locale === 'en' ? 'AR' : 'EN'}
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={() => {
              const next = appTheme === 'light' ? 'dark' : 'light';
              setAppTheme(next);
              localStorage.setItem('readme_studio_theme', next);
            }}
            className="p-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--border-strong)] transition-all"
            title={appTheme === 'light' ? 'Dark Mode' : 'Light Mode'}
          >
            {appTheme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Primary Launch CTA */}
          <button
            type="button"
            onClick={() => onLaunchStudio(activeHandle)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--text)] text-[var(--bg)] text-xs sm:text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all shadow-xs"
          >
            <span>{isAr ? 'دخول الاستوديو' : 'Launch Studio'}</span>
            <ArrowIcon className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="pt-14 pb-8 sm:pt-20 sm:pb-12 px-4 sm:px-8 max-w-6xl mx-auto w-full text-center space-y-5">
        {/* Creator Attribution Ribbon */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--border)] bg-[var(--surface-2)] text-xs text-[var(--text-muted)] shadow-2xs hover:border-[var(--accent)]/40 transition-colors">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{isAr ? 'مشروع مفتوح المصدر تم تصميمه وهندسته بواسطة' : 'Engineered & Designed by'}</span>
          <a
            href="https://github.com/Bavly-Hamdy"
            target="_blank"
            rel="noreferrer"
            className="font-bold text-[var(--text)] hover:text-[var(--accent)] inline-flex items-center gap-1 underline decoration-dotted"
          >
            <span>Bavly Hamdy</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-normal tracking-tight max-w-4xl mx-auto leading-[1.15] text-[var(--text)]">
          {isAr ? (
            <>
              صمّم ملفك الشخصي على <span className="italic font-medium text-[var(--accent)]">GitHub</span> بذكاء وأناقة تفوق القوالب الجاهزة.
            </>
          ) : (
            <>
              Craft your authentic <span className="italic font-medium text-[var(--accent)]">GitHub</span> profile README with architectural clarity.
            </>
          )}
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-base text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
          {isAr
            ? 'تحليل مباشر لمستودعاتك الحقيقية بدقة البايت، استكشاف دقيق لمجموعة تقنياتك، صياغة ذكية بالـ Gemini 3.8 Flash، ونشر ذري مباشر لمستودعك بضغطة زر. مجاني 100% وبدون خوادم وسيطة.'
            : 'Live non-sampled repository analytics, byte-accurate language DNA, Gemini 3.8 Flash developer bios, and 1-click atomic publishing. Zero tracking, 100% client-side privacy.'}
        </p>

        {/* Real Live Ingestion Search Input */}
        <div className="max-w-xl mx-auto pt-3">
          <form onSubmit={handleCustomSubmit} className="flex items-center gap-2 p-1.5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-lg shadow-black/5">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 start-0 flex items-center ps-3.5 text-[var(--text-muted)] font-mono text-xs sm:text-sm pointer-events-none">
                github.com/
              </span>
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Bavly-Hamdy"
                className="w-full h-11 ps-26 sm:ps-28 pe-3 text-xs sm:text-sm font-mono bg-transparent text-[var(--text)] outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={isFetchingDemo}
              className="h-11 px-5 rounded-xl bg-[var(--accent)] text-white text-xs sm:text-sm font-semibold hover:bg-[var(--accent-hover)] active:scale-[0.98] disabled:opacity-50 transition-all flex items-center gap-2 shrink-0 shadow-xs"
            >
              {isFetchingDemo ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isAr ? 'جلب البيانات...' : 'Fetching...'}</span>
                </>
              ) : (
                <>
                  <span>{isAr ? 'معاينة حية' : 'Live Preview'}</span>
                  <ArrowIcon className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Select Profile Chips */}
          <div className="flex items-center justify-center gap-2 mt-3 text-xs text-[var(--text-muted)] flex-wrap">
            <span className="font-serif italic">{isAr ? 'أو تصفح مطورين حقيقيين:' : 'Or preview real developers:'}</span>
            {[
              { id: 'Bavly-Hamdy', label: '@Bavly-Hamdy (Creator · 40 Repos)' },
              { id: 'torvalds', label: '@torvalds (Linux & Git)' },
              { id: 'gaearon', label: '@gaearon (Redux & React)' },
              { id: 'antfu', label: '@antfu (Vite & Vue)' },
            ].map(demo => (
              <button
                key={demo.id}
                type="button"
                onClick={() => handleSelectDemoProfile(demo.id)}
                className={`px-2.5 py-0.5 rounded-full text-xs font-mono border transition-all ${
                  activeHandle.toLowerCase() === demo.id.toLowerCase()
                    ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)] font-bold'
                    : 'border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                {demo.label}
              </button>
            ))}
          </div>

          {fetchNotice && (
            <div className="mt-2 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1.5 animate-fadeIn">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{fetchNotice}</span>
            </div>
          )}
        </div>
      </section>

      {/* 3. Live Interactive Demo Sandbox with REAL Data (Anchor: #sandbox) */}
      <section id="sandbox" className="py-8 px-4 sm:px-8 max-w-5xl mx-auto w-full scroll-mt-20">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl overflow-hidden flex flex-col">
          {/* Top Window Bar */}
          <div className="p-3 sm:p-4 border-b border-[var(--border)] bg-[var(--surface-2)] flex flex-wrap items-center justify-between gap-3">
            {/* Left Profile Info */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-400/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-400/80 inline-block" />
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-[var(--text)]">
                <img
                  src={demoProfile.avatar_url}
                  alt={demoProfile.login}
                  className="w-5 h-5 rounded-full border border-[var(--border)]"
                />
                <span className="font-bold">@{demoProfile.login}</span>
                <span className="text-[var(--text-muted)] hidden sm:inline">
                  • {demoProfile.public_repos} {isAr ? 'مستودع عام' : 'public repos'}
                </span>
                {isFetchingDemo && <Loader2 className="w-3 h-3 animate-spin text-[var(--accent)]" />}
              </div>
            </div>

            {/* Middle: Theme Switcher */}
            <div className="flex items-center gap-1 p-0.5 rounded-lg border border-[var(--border)] bg-[var(--surface)]">
              {(['minimal', 'showcase', 'paper', 'mono'] as const).map(th => (
                <button
                  key={th}
                  type="button"
                  onClick={() => setDemoTheme(th)}
                  className={`px-2 py-1 text-[11px] font-medium rounded capitalize transition-all ${
                    demoTheme === th
                      ? 'bg-[var(--surface-2)] text-[var(--text)] font-semibold shadow-2xs'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                  }`}
                >
                  {th}
                </button>
              ))}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              <div className="flex items-center p-0.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs">
                <button
                  type="button"
                  onClick={() => setDemoTab('preview')}
                  className={`px-2.5 py-1 rounded flex items-center gap-1 text-[11px] font-medium transition-colors ${
                    demoTab === 'preview'
                      ? 'bg-[var(--surface-2)] text-[var(--accent)] font-bold'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                  }`}
                >
                  <Eye className="w-3 h-3" />
                  <span>{isAr ? 'المعاينة' : 'Preview'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDemoTab('code')}
                  className={`px-2.5 py-1 rounded flex items-center gap-1 text-[11px] font-medium transition-colors ${
                    demoTab === 'code'
                      ? 'bg-[var(--surface-2)] text-[var(--accent)] font-bold'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                  }`}
                >
                  <FileCode className="w-3 h-3" />
                  <span>{isAr ? 'الكود' : 'Markdown'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDemoTab('dna')}
                  className={`px-2.5 py-1 rounded flex items-center gap-1 text-[11px] font-medium transition-colors ${
                    demoTab === 'dna'
                      ? 'bg-[var(--surface-2)] text-[var(--accent)] font-bold'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                  }`}
                >
                  <Code2 className="w-3 h-3" />
                  <span>{isAr ? 'شريط DNA' : 'DNA'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDemoTab('stack')}
                  className={`px-2.5 py-1 rounded flex items-center gap-1 text-[11px] font-medium transition-colors ${
                    demoTab === 'stack'
                      ? 'bg-[var(--surface-2)] text-[var(--accent)] font-bold'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                  }`}
                >
                  <Layers className="w-3 h-3" />
                  <span>{isAr ? 'التقنيات' : 'Stack'}</span>
                </button>
              </div>

              {demoTab === 'code' && (
                <button
                  type="button"
                  onClick={handleCopyMarkdown}
                  className="px-2.5 py-1 text-[11px] font-medium rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--border-strong)] transition-all flex items-center gap-1"
                >
                  {copiedCode ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCode ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ' : 'Copy')}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onLaunchStudio(demoProfile.login)}
                className="px-3 py-1 text-xs font-semibold rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-all flex items-center gap-1 shadow-xs"
              >
                <span>{isAr ? 'فتح في الاستوديو' : 'Open in Studio'}</span>
                <ArrowIcon className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Sandbox Live Section Toggles Bar */}
          <div className="px-4 py-2 border-b border-[var(--border)] bg-[var(--surface)]/80 flex items-center justify-between flex-wrap gap-2 text-xs">
            <span className="text-[11px] font-mono text-[var(--text-muted)] flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3" />
              <span>{isAr ? 'تخصيص مباشر للأقسام:' : 'Live Section Toggles:'}</span>
            </span>
            <div className="flex items-center gap-3 flex-wrap">
              {[
                { key: 'header', label: isAr ? 'الترويسة' : 'Header' },
                { key: 'techStack', label: isAr ? 'التقنيات' : 'Tech Stack' },
                { key: 'projects', label: isAr ? 'المشاريع' : 'Projects' },
                { key: 'stats', label: isAr ? 'الإحصائيات' : 'Stats' },
                { key: 'connect', label: isAr ? 'التواصل' : 'Connect' },
              ].map(sec => (
                <label key={sec.key} className="flex items-center gap-1.5 cursor-pointer text-[11px] select-none text-[var(--text-muted)] hover:text-[var(--text)]">
                  <input
                    type="checkbox"
                    checked={sandboxSections[sec.key as keyof typeof sandboxSections]}
                    onChange={() =>
                      setSandboxSections(prev => ({
                        ...prev,
                        [sec.key]: !prev[sec.key as keyof typeof sandboxSections],
                      }))
                    }
                    className="rounded border-[var(--border)] accent-[var(--accent)]"
                  />
                  <span>{sec.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sandbox Live Viewport */}
          <div className="p-6 sm:p-10 max-h-[520px] overflow-y-auto bg-[var(--surface)]">
            {demoTab === 'preview' && (
              <div
                className={`markdown-body ${appTheme === 'dark' ? 'gh-theme-dark' : 'gh-theme-light'}`}
                dangerouslySetInnerHTML={{ __html: demoHtml }}
              />
            )}

            {demoTab === 'code' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)] pb-2 border-b border-[var(--border)]">
                  <span>Lines: {markdownMetrics.lines} · Characters: {markdownMetrics.chars} · Size: {markdownMetrics.bytes} B</span>
                  <span className="text-emerald-500">100% GitHub Flavour Markdown</span>
                </div>
                <pre className="p-4 rounded-xl bg-[var(--surface-2)] text-[var(--text)] text-xs font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed border border-[var(--border)]">
                  {demoMarkdown}
                </pre>
              </div>
            )}

            {demoTab === 'dna' && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <h4 className="font-serif text-lg font-bold text-[var(--text)]">
                    {isAr ? 'شريط DNA للغات البرمجة (حساب دقيق بالبايت):' : 'Byte-Accurate Language DNA Composition:'}
                  </h4>
                  <p className="text-xs text-[var(--text-muted)]">
                    {isAr
                      ? `تم فحص كافة مستودعات @${demoProfile.login} العامة (${demoRepos.length} مستودع). يمكنك النقر على أي لغة لمعرفة المستودعات التابعة لها.`
                      : `Calculated from non-sampled analysis across @${demoProfile.login}'s public repositories (${demoRepos.length} repos). Click any language to view matching repositories.`}
                  </p>
                </div>

                {/* Multi-segmented DNA Bar */}
                <div className="h-4 w-full rounded-full overflow-hidden flex bg-[var(--surface-2)] border border-[var(--border)]">
                  {languageSummary.map(lang => (
                    <div
                      key={lang.lang}
                      style={{ width: `${lang.percent}%` }}
                      title={`${lang.lang}: ${lang.percent}%`}
                      className="h-full transition-all hover:opacity-80 cursor-pointer"
                      onClick={() => setSelectedDnaLang(lang.lang)}
                    />
                  ))}
                </div>

                {/* Language Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {languageSummary.map(lang => (
                    <div
                      key={lang.lang}
                      onClick={() => setSelectedDnaLang(selectedDnaLang === lang.lang ? null : lang.lang)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        selectedDnaLang === lang.lang
                          ? 'border-[var(--accent)] bg-[var(--accent-soft)] shadow-sm'
                          : 'border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--border-strong)]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-[var(--text)]">{lang.lang}</span>
                        <span className="text-xs font-mono font-semibold text-[var(--accent)]">{lang.percent}%</span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)] mt-1">
                        {lang.count} {isAr ? 'مستودع يستخدم هذه اللغة' : 'repositories'}
                      </p>

                      {selectedDnaLang === lang.lang && (
                        <div className="mt-2 pt-2 border-t border-[var(--border)] space-y-1">
                          <span className="text-[10px] font-mono text-[var(--text-subtle)] uppercase">
                            {isAr ? 'المستودعات:' : 'Repositories:'}
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {lang.repos.slice(0, 6).map(rName => (
                              <span
                                key={rName}
                                className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[var(--surface)] text-[var(--text)] border border-[var(--border)]"
                              >
                                {rName}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {demoTab === 'stack' && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <h4 className="font-serif text-lg font-bold text-[var(--text)]">
                    {isAr ? 'المصفوفة التقنية المستكشفة آلياً:' : 'Auto-Detected Technology Matrix:'}
                  </h4>
                  <p className="text-xs text-[var(--text-muted)]">
                    {isAr
                      ? `تم تحليل الكود المصدري ووسوم المستودعات (${detectedTech.length} أداة وتقنية تم التعرف عليها).`
                      : `Extracted deterministically from repository manifests, topics, and source languages (${detectedTech.length} technologies detected).`}
                  </p>
                </div>

                <div className="space-y-4">
                  {Object.entries(techByCategory).map(([cat, items]) => (
                    <div key={cat} className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--text)]">
                          {cat}
                        </span>
                        <span className="text-[11px] font-mono text-[var(--text-muted)]">
                          {items.length} {isAr ? 'عنصر' : 'items'}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {items.map(item => (
                          <span
                            key={item.id}
                            className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] flex items-center gap-1.5 shadow-2xs"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                            <span>{item.name}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sandbox Live DNA Footer Bar */}
          <div className="px-5 py-3 border-t border-[var(--border)] bg-[var(--surface-2)]/60 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-serif italic text-[var(--text-muted)]">
                {isAr ? 'أهم اللغات المكتشفة في المستودعات:' : 'Top Live Languages:'}
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {languageSummary.slice(0, 4).map(item => (
                  <span
                    key={item.lang}
                    className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border border-[var(--border)] bg-[var(--surface)] text-[var(--text)]"
                  >
                    {item.lang} ({item.percent}%)
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-[var(--text-muted)]">
                {demoRepos.length} {isAr ? 'مستودع تم تحليله' : 'repos parsed'}
              </span>
              <button
                type="button"
                onClick={() => onLaunchStudio(demoProfile.login)}
                className="text-[11px] font-semibold text-[var(--accent)] hover:underline inline-flex items-center gap-1"
              >
                <span>{isAr ? 'تعديل هذا الملف بالكامل' : 'Edit Full Profile'}</span>
                <ArrowIcon className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Interactive Gemini 3.8 Flash Bio Tone Comparator (Anchor: #tone-engine) */}
      <section id="tone-engine" className="py-16 px-4 sm:px-8 border-y border-[var(--border)] bg-[var(--surface-2)]/30 scroll-mt-20">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gemini 3.8 Flash Developer Bio Synthesis</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif tracking-tight text-[var(--text)]">
              {isAr ? 'صياغة تعريفية ذكية تعكس هويتك الهندسية الحقيقية' : 'AI-synthesized bios grounded in your actual code'}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
              {isAr
                ? 'لا نستخدم قوالب الذكاء الاصطناعي العامة أو العبارات المبتذلة. يقرأ المحرك مستودعاتك ولغاتك الفعلية لصياغة 3 نبرات صوتية احترافية.'
                : 'No generic hallucinations or cliché buzzwords. Gemini reads your actual repositories, commit patterns, and language DNA to generate three tailored voices.'}
            </p>
          </div>

          {/* Tone Selector Tabs */}
          <div className="flex items-center justify-center gap-2">
            {[
              { id: 'formal', label: isAr ? 'رسمي معماري (Architectural)' : 'Architectural & Systems' },
              { id: 'friendly', label: isAr ? 'ودود للمصادر المفتوحة (Community)' : 'Open-Source Collaborator' },
              { id: 'direct', label: isAr ? 'مباشر للمبرمجين (Minimalist)' : 'Minimalist Engineer' },
            ].map(tone => (
              <button
                key={tone.id}
                type="button"
                onClick={() => setPreviewTone(tone.id as typeof previewTone)}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-mono transition-all border ${
                  previewTone === tone.id
                    ? 'border-[var(--accent)] bg-[var(--surface)] text-[var(--text)] font-bold shadow-xs'
                    : 'border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                {tone.label}
              </button>
            ))}
          </div>

          {/* Live Bio Card Display */}
          <div className="p-6 sm:p-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-lg space-y-4 max-w-3xl mx-auto">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-xs font-bold text-[var(--text)]">
                  @{demoProfile.login} · {previewTone.toUpperCase()} TONE
                </span>
              </div>
              <span className="text-[11px] font-mono text-[var(--text-muted)]">
                Model: gemini-3.8-flash
              </span>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-subtle)]">
                  {isAr ? 'النبذة التنفيذية (Summary):' : 'Executive Bio Summary:'}
                </span>
                <p className="text-sm sm:text-base font-serif text-[var(--text)] leading-relaxed italic">
                  "{activeBio.summary}"
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--accent)] font-semibold">
                    {isAr ? 'التركيز الأساسي (Primary Focus):' : 'Primary Focus:'}
                  </span>
                  <p className="text-xs text-[var(--text)]">
                    {activeBio.focus}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold">
                    {isAr ? 'قيد التطوير والتعلّم (Active Learning):' : 'Active Learning:'}
                  </span>
                  <p className="text-xs text-[var(--text)]">
                    {activeBio.learning || 'Modern web architectures and system design patterns'}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs">
              <span className="text-[11px] font-mono text-[var(--text-muted)]">
                {isAr ? 'مستخرج من المستودعات الفعلية دون أي تكهن' : 'Derived directly from live repository metadata'}
              </span>
              <button
                type="button"
                onClick={() => onLaunchStudio(demoProfile.login)}
                className="font-semibold text-[var(--accent)] hover:underline inline-flex items-center gap-1"
              >
                <span>{isAr ? 'تطبيق هذه النبذة في ملفك' : 'Apply to Profile'}</span>
                <ArrowIcon className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Creator Spotlight: Bavly Hamdy (100% Real Data & Repos) (Anchor: #creator-profile) */}
      <section id="creator-profile" className="py-16 px-4 sm:px-8 border-b border-[var(--border)] bg-[var(--surface)] transition-colors scroll-mt-20">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center sm:text-start flex flex-col md:flex-row items-center gap-8">
            <div className="relative shrink-0">
              <img
                src={creatorProfile.avatar_url || 'https://avatars.githubusercontent.com/u/108342478?v=4'}
                alt="Bavly Hamdy"
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-2 border-[var(--border)] shadow-xl"
              />
              <span className="absolute -bottom-2 -end-2 p-1.5 rounded-full bg-[var(--accent)] text-white shadow-md">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            </div>

            <div className="space-y-3 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h3 className="font-serif text-2xl font-bold text-[var(--text)]">
                  {creatorProfile.name || 'Bavly Hamdy'} (@{creatorProfile.login})
                </h3>
                <span className="text-xs font-mono text-[var(--accent)] font-semibold px-2.5 py-0.5 rounded-full bg-[var(--accent-soft)] border border-[var(--accent)]/20 w-fit mx-auto sm:mx-0">
                  Creator & Lead Architect
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                {creatorProfile.bio || 'Full-Stack Software Engineer & UI/UX Architect | Next.js, TypeScript, React & Node.js. Building modern, high-performance web experiences.'}
              </p>

              {/* Real Metrics Badges */}
              <div className="flex items-center justify-center sm:justify-start gap-3 text-xs font-mono flex-wrap pt-1">
                <span className="px-2.5 py-1 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] font-semibold">
                  📂 {creatorProfile.public_repos} {isAr ? 'مستودع عام على GitHub' : 'Public Repositories'}
                </span>
                <span className="px-2.5 py-1 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] font-semibold">
                  ⚡ 100% TypeScript & Modern Web
                </span>
                <span className="px-2.5 py-1 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] font-semibold">
                  📍 {creatorProfile.location || 'Cairo, Egypt'}
                </span>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-3 pt-2">
                <a
                  href={`https://github.com/${creatorProfile.login}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-[var(--text)] text-[var(--bg)] hover:opacity-90 transition-all shadow-xs"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>View GitHub Profile</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  type="button"
                  onClick={() => handleSelectDemoProfile(creatorProfile.login)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--border-strong)] transition-all"
                >
                  <Eye className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>Preview Bavly's README</span>
                </button>
              </div>
            </div>
          </div>

          {/* Real Featured Open-Source Projects by Bavly Hamdy */}
          <div className="pt-4 border-t border-[var(--border)] space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] text-center sm:text-start">
              {isAr ? 'أبرز مستودعات ومشاريع بافلي حمدي الحقيقية على GitHub:' : 'Actual Public Repositories by Bavly Hamdy:'}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {creatorRepos.slice(0, 4).map(repo => (
                <a
                  key={repo.id}
                  href={repo.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--accent)]/60 transition-all space-y-2 flex flex-col justify-between group shadow-2xs"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-mono text-xs font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors truncate">
                        {repo.name}
                      </span>
                      <ExternalLink className="w-3 h-3 text-[var(--text-subtle)] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] line-clamp-2 mt-1 leading-snug">
                      {repo.description || 'Open source repository by Bavly Hamdy.'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-subtle)] pt-1 border-t border-[var(--border)]">
                    <span className="text-[var(--accent)] font-medium">{repo.language || 'TypeScript'}</span>
                    <span>★ {repo.stargazers_count}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Technical Architecture & Data Pipeline (Bento Grid) (Anchor: #architecture) */}
      <section id="architecture" className="py-16 px-4 sm:px-8 max-w-6xl mx-auto w-full space-y-10 scroll-mt-20">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-4xl font-serif tracking-tight text-[var(--text)]">
            {isAr ? 'هندسة حقيقية تفصل بين العمل الجاد والمظاهر' : 'Architected for engineers who value precision'}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-xl mx-auto">
            {isAr
              ? 'ابتعدنا عن القوالب البلاستيكية المكررة. README Studio يقرأ كودك الحقيقي، ويصنع توثيقاً برمجياً أنيقاً يثري حضورك الهندسي.'
              : 'Built to eliminate badge bloat and generic cookie-cutter templates. Present your genuine systems with editorial clarity.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Card 1: Language DNA */}
          <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-3 shadow-2xs hover:border-[var(--accent)]/50 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--surface-2)] flex items-center justify-center text-[var(--accent)]">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-medium text-[var(--text)]">
                {isAr ? 'تحليل لغات دقيق بالبايت (Byte-accurate)' : 'Byte-Accurate Language DNA'}
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                {isAr
                  ? 'يقوم المحرك بفحص كافة المستودعات الأصلية عبر تقسيم الصفحات وقراءة حجم البايت الفعلي لكل لغة لتوليد شريط DNA حقيقي يعبر عن تخصصك.'
                  : 'We fetch raw language byte compositions directly via GitHub API across all your original repositories. Zero arbitrary guesswork.'}
              </p>
            </div>
            <div className="pt-3 border-t border-[var(--border)] font-mono text-[11px] text-[var(--accent)] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
              <span>Full Pagination • Non-Sampled</span>
            </div>
          </div>

          {/* Card 2: AI Bio by Gemini 3.8 Flash */}
          <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-3 shadow-2xs hover:border-[var(--accent)]/50 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--surface-2)] flex items-center justify-center text-amber-500">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-medium text-[var(--text)]">
                {isAr ? 'صياغة ذكية بالـ Gemini 3.8 Flash' : 'Gemini 3.8 Flash Synthesis'}
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                {isAr
                  ? 'يقرأ النموذج أحدث مشاريعك ولغاتك الفعلية لصياغة 3 نسخ مخصصة (رسمية معمارية، ودودة لمجتمع المصادر المفتوحة، أو مباشرة للمبرمجين).'
                  : 'Directly contextualized by your actual repositories and tech stack. Generates 3 tailored voices: Executive, Community, and Minimalist.'}
              </p>
            </div>
            <div className="pt-3 border-t border-[var(--border)] font-mono text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>@google/genai • Bilingual ar/en</span>
            </div>
          </div>

          {/* Card 3: 1-Click Atomic Publish */}
          <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-3 shadow-2xs hover:border-[var(--accent)]/50 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--surface-2)] flex items-center justify-center text-emerald-500">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-medium text-[var(--text)]">
                {isAr ? 'نشر ذري مباشر مع نسخ احتياطي' : '1-Click Atomic Safe Commits'}
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                {isAr
                  ? 'يتأكد التطبيق من وجود مستودع username/username وينشئه تلقائياً إذا لزم، مع حفظ نسخة احتياطية من الملف السابق وإمكانية التراجع بنقرة زر.'
                  : 'Creates the special repository if missing, takes an atomic snapshot of your existing README, and executes a clean PUT commit with undo capability.'}
              </p>
            </div>
            <div className="pt-3 border-t border-[var(--border)] font-mono text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Zero Force-Push • Rollback Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Open Source & Zero-Tracking Guarantee */}
      <section className="py-16 px-4 sm:px-8 max-w-4xl mx-auto w-full text-center space-y-6">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
          <ShieldCheck className="w-6 h-6" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-serif text-[var(--text)]">
          {isAr ? 'مفتوح المصدر وخاص 100% (Zero Middleman)' : '100% Client-Side & Privacy First'}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-start max-w-2xl mx-auto pt-2">
          <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-1">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-[var(--text)]">
              <ServerOff className="w-3.5 h-3.5 text-emerald-500" />
              <span>No Backend DB</span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">
              {isAr ? 'لا توجد قواعد بيانات وسيطة تسجل هويتك أو نشاطك.' : 'Zero analytics trackers, no middleman database storing your activity.'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-1">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-[var(--text)]">
              <Lock className="w-3.5 h-3.5 text-emerald-500" />
              <span>Browser Storage</span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">
              {isAr ? 'المفاتيح والـ Token تُحفظ محلياً في متصفحك فقط.' : 'Personal access tokens stay securely in your browser localStorage.'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-1">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-[var(--text)]">
              <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
              <span>MIT License</span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">
              {isAr ? 'كود مفتوح وشفاف بالكامل للتدقيق على GitHub.' : 'Inspect, fork, contribute, or audit the full source code on GitHub.'}
            </p>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => onLaunchStudio(activeHandle)}
            className="px-6 py-3 rounded-2xl bg-[var(--accent)] text-white text-sm font-semibold hover:bg-[var(--accent-hover)] active:scale-[0.98] transition-all shadow-md inline-flex items-center gap-2"
          >
            <span>{isAr ? 'ابدأ الاستوديو الآن مجاناً' : 'Start Designing Your README'}</span>
            <ArrowIcon className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 8. Technical Engineering FAQ Section (Anchor: #faq) */}
      <section id="faq" className="py-16 px-4 sm:px-8 border-t border-[var(--border)] bg-[var(--surface-2)]/20 scroll-mt-20">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent)]/20">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Developer FAQ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif text-[var(--text)]">
              {isAr ? 'الأسئلة التقنية الشائعة' : 'Frequently Asked Engineering Questions'}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              {isAr
                ? 'إجابات صريحة ومباشرة حول الأمان، حدود الـ API، وسير العمل الفعلي.'
                : 'Direct, candid answers regarding security, API quotas, and publishing mechanics.'}
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: isAr ? 'هل أحتاج إلى GitHub Token لاستخدام README Studio؟' : 'Do I need a GitHub Personal Access Token to use this?',
                a: isAr
                  ? 'لا، يمكنك معاينة وتخصيص وتوليد وتحميل أي ملف README بدون أي Token. يتم طلب Token فقط إذا رغبت في النشر المباشر الذري (1-Click Atomic Publish) إلى مستودع username/username الخاص بك، أو إذا أردت رفع حصة GitHub API من 60 إلى 5000 طلب في الساعة.'
                  : 'No. You can preview, customize, generate, and copy/download README files without any token. A token is only needed if you wish to use 1-Click Atomic Publishing to commit directly to your username/username repository, or to elevate the GitHub API rate limit from 60 to 5,000 requests/hr.',
              },
              {
                q: isAr ? 'أين تُحفظ الـ Tokens والمفاتيح الخاصة بي؟' : 'Where are my Personal Access Tokens and API keys stored?',
                a: isAr
                  ? 'تُحفظ حصرياً داخل متصفحك في الـ localStorage المحلي. لا يتم إرسالها إلى أي خادم، أو وسيط، أو قاعدة بيانات سحابية. الاتصال يتم مباشرة من متصفحك إلى api.github.com و generativelanguage.googleapis.com عبر تشفير TLS 1.3.'
                  : 'Strictly inside your browser localStorage. They are never transmitted to any third-party server, proxy, or remote database. All network calls travel directly between your browser and official GitHub / Google endpoints over TLS 1.3 encryption.',
              },
              {
                q: isAr ? 'ماذا يحدث إذا كان لدي بالفعل ملف README.md على ملفي الشخصي؟' : 'What happens if I already have an existing profile README?',
                a: isAr
                  ? 'يقوم README Studio بقراءة ملفك الحالي وعرضه في المحرر. قبل تنفيذ أي نشر جديد، يتم حفظ نسخة احتياطية ذرية تلقائياً في التخزين المحلي، مع توفير زر تراجع (Rollback) فوري لاستعادة ملفك السابق في أي لحظة.'
                  : 'README Studio detects and reads your active README. Prior to executing any new commit, an atomic snapshot is preserved in your local backup storage, with 1-click rollback available to restore your previous README whenever you want.',
              },
              {
                q: isAr ? 'كيف يتم حساب شريط الـ DNA للغات البرمجة بدقة؟' : 'How is the Language DNA percentage calculated?',
                a: isAr
                  ? 'نقوم بفحص جميع المستودعات الأصلية عبر تقسيم الصفحات بالكامل (Pagination) وجمع أحجام البايتات الحقيقية لكل لغة عبر واجهة GitHub API v3، ثم حساب النسبة المئوية الدقيقة دون أي تقريب عشوائي أو عينات جزئية.'
                  : 'We paginate through all original public repositories via GitHub REST v3 API, summing raw language byte totals across all repositories. The percentages reflect non-sampled, verifiable code distribution.',
              },
              {
                q: isAr ? 'هل المشروع مجاني ومفتوح المصدر بالكامل؟' : 'Is README Studio 100% free and open source?',
                a: isAr
                  ? 'نعم، المشروع مرخص بالكامل تحت رخصة MIT ومتاح كود المصدر الخاص به على GitHub للتدقيق والمساهمة والاستضافة الذاتية دون أي قيود أو اشتراكات مدفوعة.'
                  : 'Yes. README Studio is 100% free software licensed under the MIT License. The entire source code is available on GitHub for audit, contribution, and self-hosting.',
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full p-4 flex items-center justify-between text-start gap-4 hover:bg-[var(--surface-2)]/50 transition-colors"
                >
                  <span className="font-serif font-medium text-sm sm:text-base text-[var(--text)]">
                    {faq.q}
                  </span>
                  {openFaqIndex === idx ? (
                    <ChevronUp className="w-4 h-4 text-[var(--accent)] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
                  )}
                </button>

                {openFaqIndex === idx && (
                  <div className="px-4 pb-4 pt-1 text-xs text-[var(--text-muted)] leading-relaxed border-t border-[var(--border)] bg-[var(--surface-2)]/30">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. High-Contrast Footer */}
      <footer className="mt-auto py-8 border-t border-[var(--border)] bg-[var(--surface)] px-4 sm:px-8 text-center text-xs text-[var(--text-muted)] space-y-2">
        <p>
          README Studio · Released under the{' '}
          <a
            href="https://opensource.org/licenses/MIT"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-[var(--text)]"
          >
            MIT License
          </a>
        </p>
        <p className="font-serif italic text-[11px] text-[var(--text-subtle)]">
          Architected & Crafted with care by{' '}
          <a
            href="https://github.com/Bavly-Hamdy"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-[var(--text)] hover:underline"
          >
            Bavly Hamdy
          </a>
        </p>
      </footer>
    </div>
  );
};
