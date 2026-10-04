/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Locale,
  AppTheme,
  ReadmeTheme,
  AppView,
  AnalysisStage,
  ProfileAnalytics,
  GitHubUserProfile,
  GitHubRepository,
  ProfileSectionsConfig,
} from './types';
import { Header } from './components/Header';
import { UsernameBar } from './components/UsernameBar';
import { SidebarSections, SectionKey } from './components/SidebarSections';
import { SectionEditor } from './components/SectionEditor';
import { LivePreview } from './components/LivePreview';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { PublishModal } from './components/PublishModal';
import { TokenGuideModal } from './components/TokenGuideModal';
import { SettingsModal } from './components/SettingsModal';
import { LandingPage } from './components/LandingPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { DEMO_PROFILES } from './services/github';
import { analyzeGitHubProfile, getDemoAnalysis, readCachedAnalysis } from './services/githubAnalyzer';
import { detectTechStack } from './services/techDetection';
import { generateReadmeMarkdown } from './services/markdownRenderer';
import { translations } from './i18n/translations';
import { SlidersHorizontal, Edit3, Eye, CheckCircle2, RotateCcw } from 'lucide-react';

export default function App() {
  // Locale with localStorage persistence, default 'en'
  const [locale, setLocale] = useState<Locale>(() => {
    const saved = localStorage.getItem('readme_studio_locale');
    return saved === 'ar' ? 'ar' : 'en';
  });

  // App Theme with localStorage persistence
  const [appTheme, setAppTheme] = useState<AppTheme>(() => {
    const saved = localStorage.getItem('readme_studio_theme');
    return saved === 'dark' ? 'dark' : 'light';
  });

  // GitHub token
  const [token, setToken] = useState<string>(() => {
    return localStorage.getItem('readme_studio_pat') || '';
  });

  // Active View (Landing Page vs Deep Analytics Dashboard vs README Studio)
  const [activeView, setActiveView] = useState<AppView>(() => {
    const saved = localStorage.getItem('readme_studio_view') as AppView;
    return saved === 'builder' || saved === 'analytics' || saved === 'landing' ? saved : 'landing';
  });

  const handleSetActiveView = (view: AppView) => {
    setActiveView(view);
    localStorage.setItem('readme_studio_view', view);
  };

  // Active GitHub User State (with persistence for real production workflows)
  const [username, setUsername] = useState<string>(() => {
    return localStorage.getItem('readme_studio_active_user') || 'bavly-hamdy';
  });

  const [profile, setProfile] = useState<GitHubUserProfile | null>(() => {
    const active = localStorage.getItem('readme_studio_active_user') || 'torvalds';
    const cached = readCachedAnalysis(active, false);
    if (cached) return cached.profile;
    return DEMO_PROFILES[active]?.profile || DEMO_PROFILES['torvalds'].profile;
  });

  const [repos, setRepos] = useState<GitHubRepository[]>(() => {
    const active = localStorage.getItem('readme_studio_active_user') || 'torvalds';
    const cached = readCachedAnalysis(active, false);
    if (cached) return cached.repos;
    return DEMO_PROFILES[active]?.repos || DEMO_PROFILES['torvalds'].repos;
  });

  const [analytics, setAnalytics] = useState<ProfileAnalytics | null>(() => {
    const active = localStorage.getItem('readme_studio_active_user') || 'torvalds';
    const cached = readCachedAnalysis(active, false);
    if (cached) return cached.analytics;
    return getDemoAnalysis(active)?.analytics ?? getDemoAnalysis('torvalds')?.analytics ?? null;
  });

  const [analysisStage, setAnalysisStage] = useState<AnalysisStage | null>(null);
  const [stageProgress, setStageProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Readme Theme
  const [readmeTheme, setReadmeTheme] = useState<ReadmeTheme>('showcase');

  // Active Section for editing
  const [activeSection, setActiveSection] = useState<SectionKey>('header');

  // Mobile layout tab
  const [mobileTab, setMobileTab] = useState<'sections' | 'editor' | 'preview'>('editor');

  // Draft auto-save indicator
  const [hasSavedDraft, setHasSavedDraft] = useState<boolean>(false);

  // Modals
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [isTokenGuideOpen, setIsTokenGuideOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Synchronize document dir and class on theme/locale change
  useEffect(() => {
    const root = document.documentElement;
    root.dir = locale === 'ar' ? 'rtl' : 'ltr';
    root.lang = locale;

    if (appTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [locale, appTheme]);

  // Initial sections configuration builder
  const createInitialConfig = useCallback((
    userProfile: GitHubUserProfile,
    userRepos: GitHubRepository[]
  ): ProfileSectionsConfig => {
    const detected = detectTechStack(userRepos);
    const topProjects = userRepos.slice(0, 4).map(r => ({
      name: r.name,
      description: r.description || 'Open source software project.',
      url: r.html_url,
      language: r.language || 'Code',
      stars: r.stargazers_count,
      forks: r.forks_count,
      fullName: r.full_name,
    }));

    return {
      header: {
        enabled: true,
        data: {
          greeting: locale === 'ar' ? 'مرحباً، أنا' : "Hi there, I'm",
          name: userProfile.name || userProfile.login,
          headline: userProfile.bio || 'Software Engineer building reliable systems',
          status: 'Building open-source tools',
          location: userProfile.location || '',
          showAvatar: true,
          avatarShape: 'circle',
          headerStyle: 'capsule',
          bannerPattern: 'waving',
          bannerTheme: 'inkwash',
          showTyping: true,
          typingLines: [
            userProfile.bio || 'Software Engineer',
            'Full-Stack Developer & Open Source Contributor',
            'Passionate about high-performance software',
          ],
          showViewsCounter: true,
          viewsCounterColor: '6d8196',
          badgeStyle: 'for-the-badge',
        },
      },
      about: {
        enabled: true,
        data: {
          summary: userProfile.bio
            ? `${userProfile.bio}. Passionate about clean architecture and impactful open-source engineering.`
            : 'Software engineer dedicated to writing maintainable, high-performance code and building helpful developer tools.',
          currentRole: 'Distributed software architectures',
          currentWork: userRepos[0] ? userRepos[0].name : 'modern web systems',
          currentLearning: 'Advanced systems performance & scalability',
          askMeAbout: 'Software architecture, TypeScript, system design',
          howToReach: userProfile.email || `@${userProfile.login} on GitHub`,
          funFact: 'I enjoy brewing espresso with measured pressure profiling.',
        },
      },
      techStack: {
        enabled: true,
        data: {
          style: 'grouped-cards',
          badgeStyle: 'for-the-badge',
          items: detected,
        },
      },
      projects: {
        enabled: topProjects.length > 0,
        data: {
          showStars: true,
          showForks: true,
          showTopics: true,
          layout: 'table',
          projects: topProjects,
        },
      },
      analytics: {
        enabled: true,
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
          languageLimit: 8,
        },
      },
      stats: {
        enabled: true,
        data: {
          showStatsCard: true,
          showStreakCard: true,
          showTopLanguagesCard: true,
          showActivityGraph: false,
          showTrophies: false,
          showProfileViews: false,
          statsTheme: 'minimal',
          hideBorder: true,
        },
      },
      connect: {
        enabled: true,
        data: {
          customCta: 'Always open to discussing exciting technical projects and open-source contributions.',
          links: [
            { platform: 'github', usernameOrUrl: userProfile.login, enabled: true },
            {
              platform: 'website',
              usernameOrUrl: userProfile.blog ? userProfile.blog.replace(/^https?:\/\//, '') : '',
              enabled: !!userProfile.blog,
            },
            { platform: 'linkedin', usernameOrUrl: '', enabled: false },
            { platform: 'twitter', usernameOrUrl: '', enabled: false },
            { platform: 'email', usernameOrUrl: userProfile.email || '', enabled: !!userProfile.email },
          ],
        },
      },
    };
  }, [locale]);

  // Initialize Config from saved draft or freshly generated
  const [config, setConfig] = useState<ProfileSectionsConfig>(() => {
    const active = localStorage.getItem('readme_studio_active_user') || 'torvalds';
    const savedDraft = localStorage.getItem(`readme_studio_draft_${active}`);
    if (savedDraft) {
      try {
        return JSON.parse(savedDraft);
      } catch {
        // malformed draft fallback
      }
    }

    const defaultProfile = DEMO_PROFILES[active]?.profile || DEMO_PROFILES['torvalds'].profile;
    const defaultRepos = DEMO_PROFILES[active]?.repos || DEMO_PROFILES['torvalds'].repos;
    return createInitialConfig(defaultProfile, defaultRepos);
  });

  // Auto-save user edits to persistent draft (debounced)
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (!username || !profile) return;
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(`readme_studio_draft_${username}`, JSON.stringify(config));
        setHasSavedDraft(true);
      } catch {
        /* storage full */
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [config, username, profile]);

  // Fetch GitHub User function with full deep profiling
  const handleFetchUser = useCallback(async (targetUsername: string, forceRefresh = false) => {
    setIsLoading(true);
    setErrorMessage(null);
    setAnalysisStage('profile');
    setStageProgress(0.05);

    try {
      const result = await analyzeGitHubProfile(
        targetUsername,
        token,
        (stage, progress) => {
          setAnalysisStage(stage);
          setStageProgress(progress);
        },
        { bypassCache: forceRefresh }
      );

      const cleanLogin = result.profile.login;
      setUsername(cleanLogin);
      setProfile(result.profile);
      setRepos(result.repos);
      setAnalytics(result.analytics);
      localStorage.setItem('readme_studio_active_user', cleanLogin);

      // Check if draft exists for this user
      const existingDraft = localStorage.getItem(`readme_studio_draft_${cleanLogin}`);
      if (existingDraft && !forceRefresh) {
        try {
          setConfig(JSON.parse(existingDraft));
          setHasSavedDraft(true);
        } catch {
          setConfig(createInitialConfig(result.profile, result.repos));
          setHasSavedDraft(false);
        }
      } else {
        setConfig(createInitialConfig(result.profile, result.repos));
        setHasSavedDraft(false);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '';
      if (message === 'USER_NOT_FOUND') {
        setErrorMessage(translations[locale].hero.errorNotFound);
      } else if (message === 'RATE_LIMITED') {
        setErrorMessage(translations[locale].hero.errorRateLimited);
      } else {
        setErrorMessage(translations[locale].hero.errorGeneral);
      }
    } finally {
      setIsLoading(false);
      setAnalysisStage(null);
    }
  }, [token, locale, createInitialConfig]);

  // On initial mount, if user was previously analyzed, trigger background refresh if needed
  useEffect(() => {
    const savedUser = localStorage.getItem('readme_studio_active_user');
    if (savedUser && (!profile || profile.login.toLowerCase() !== savedUser.toLowerCase())) {
      handleFetchUser(savedUser);
    }
  }, [handleFetchUser, profile]);

  // Reset to fresh GitHub data (wipes draft for current user)
  const handleResetToFreshData = () => {
    if (!profile) return;
    localStorage.removeItem(`readme_studio_draft_${username}`);
    setConfig(createInitialConfig(profile, repos));
    setHasSavedDraft(false);
  };

  // Toggle Section visibility
  const handleToggleSection = (key: SectionKey) => {
    setConfig(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        enabled: !prev[key].enabled,
      },
    }));
  };

  // Generate markdown live with full analytics integration
  const markdown = useMemo(() => {
    return generateReadmeMarkdown(config, readmeTheme, username, analytics, profile, locale);
  }, [config, readmeTheme, username, analytics, profile, locale]);

  // One-click Native Browser File Download
  const handleDownloadReadme = useCallback(() => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${username}-README.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [markdown, username]);

  const handleLaunchStudio = (initialUser?: string) => {
    if (initialUser && initialUser.trim()) {
      handleFetchUser(initialUser.trim());
    }
    handleSetActiveView('builder');
  };

  if (activeView === 'landing') {
    return (
      <ErrorBoundary fallbackTitle="An error occurred in README Studio landing">
        <LandingPage
          locale={locale}
          setLocale={setLocale}
          appTheme={appTheme}
          setAppTheme={setAppTheme}
          onLaunchStudio={handleLaunchStudio}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
        {/* Settings Modal */}
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          locale={locale}
          setLocale={setLocale}
          appTheme={appTheme}
          setAppTheme={setAppTheme}
          token={token}
          setToken={setToken}
        />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary fallbackTitle="An error occurred in README Studio workspace">
      <div className="h-screen h-[100dvh] flex flex-col overflow-hidden bg-[var(--bg)] text-[var(--text)] transition-colors">
        {/* Top Bar with View Switcher & Live API Health */}
        <Header
          locale={locale}
          setLocale={setLocale}
          appTheme={appTheme}
          setAppTheme={setAppTheme}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenPublish={() => setIsPublishOpen(true)}
          onOpenTokenGuide={() => setIsTokenGuideOpen(true)}
          activeUsername={username}
          activeView={activeView}
          setActiveView={handleSetActiveView}
          archetype={analytics?.archetype}
          grade={analytics?.scores.grade}
          onDownloadReadme={handleDownloadReadme}
        />

        {/* Username Ingestion & Progress Bar */}
        <UsernameBar
          locale={locale}
          onFetchUser={handleFetchUser}
          isLoading={isLoading}
          activeUsername={username}
          errorMessage={errorMessage}
          stage={analysisStage}
          stageProgress={stageProgress}
        />

        {/* Mode View: Deep Analytics vs README Builder */}
        {activeView === 'analytics' ? (
          <AnalyticsDashboard
            locale={locale}
            analytics={analytics}
            profile={profile}
            repos={repos}
            onSwitchToBuilder={() => setActiveView('builder')}
            onRefresh={() => handleFetchUser(username, true)}
            isLoading={isLoading}
          />
        ) : (
          <>
            {/* Mobile Sleek Segmented Tab Switcher */}
            <div className="lg:hidden border-b border-[var(--border)] bg-[var(--surface)] px-3 py-2 flex items-center justify-center sticky top-14 z-20 shadow-xs">
              <div className="flex items-center p-1 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] w-full max-w-md justify-between">
                <button
                  type="button"
                  onClick={() => setMobileTab('sections')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    mobileTab === 'sections'
                      ? 'bg-[var(--surface)] text-[var(--accent)] shadow-xs font-bold'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>{translations[locale].sections.title}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMobileTab('editor')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    mobileTab === 'editor'
                      ? 'bg-[var(--surface)] text-[var(--accent)] shadow-xs font-bold'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{translations[locale].nav.builder}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMobileTab('preview')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    mobileTab === 'preview'
                      ? 'bg-[var(--surface)] text-[var(--accent)] shadow-xs font-bold'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{translations[locale].nav.preview}</span>
                </button>
              </div>
            </div>

            {/* Main Builder Viewport: 3-column layout */}
            <main className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden relative">
              {/* Left Column: Sections & Themes (Fixed & stationary) */}
              <div className={`lg:flex lg:flex-col lg:w-72 lg:h-full shrink-0 ${mobileTab === 'sections' ? 'flex-1 overflow-y-auto block' : 'hidden'}`}>
                <SidebarSections
                  locale={locale}
                  activeSection={activeSection}
                  setActiveSection={(sec) => {
                    setActiveSection(sec);
                    setMobileTab('editor');
                  }}
                  config={config}
                  onToggleSection={handleToggleSection}
                  theme={readmeTheme}
                  setTheme={setReadmeTheme}
                />
              </div>

              {/* Middle Column: Active Section Editor (Independent Scroll) */}
              <div className={`lg:flex-1 lg:flex flex-col min-h-0 h-full overflow-hidden ${mobileTab === 'editor' ? 'flex flex-1 overflow-y-auto' : 'hidden'}`}>
                {/* Draft auto-save status header */}
                <div className="h-8 px-4 border-b border-[var(--border)] bg-[var(--surface-2)]/40 flex items-center justify-between text-[11px] text-[var(--text-muted)] shrink-0">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span>{hasSavedDraft ? (locale === 'ar' ? 'تم الحفظ تلقائياً في المتصفح' : 'Changes auto-saved to local draft') : (locale === 'ar' ? 'مسودة جديدة' : 'Active draft')}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetToFreshData}
                    title={locale === 'ar' ? 'إعادة ضبط المسودة لبيانات GitHub الأصلية' : 'Reset to fresh GitHub data'}
                    className="flex items-center gap-1 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    <span>{locale === 'ar' ? 'إعادة ضبط' : 'Reset to data'}</span>
                  </button>
                </div>

                <SectionEditor
                  locale={locale}
                  activeSection={activeSection}
                  config={config}
                  onChangeConfig={setConfig}
                  profile={profile}
                  repos={repos}
                  analytics={analytics}
                  onResetToDefaults={handleResetToFreshData}
                />
              </div>

              {/* Right Column: Live GitHub-accurate Preview (Independent Scroll) */}
              <div className={`lg:flex-1 lg:flex flex-col min-h-0 h-full overflow-hidden ${mobileTab === 'preview' ? 'flex flex-1 overflow-y-auto' : 'hidden'}`}>
                <LivePreview locale={locale} markdown={markdown} appTheme={appTheme} />
              </div>

              {/* Mobile Floating Action Pill for instantaneous Editor <-> Preview jump */}
              {mobileTab === 'editor' && (
                <button
                  type="button"
                  onClick={() => setMobileTab('preview')}
                  className="lg:hidden fixed bottom-5 end-4 z-40 px-4 py-2.5 rounded-full bg-[var(--accent)] text-white shadow-xl flex items-center gap-2 text-xs font-bold hover:scale-105 active:scale-95 transition-all"
                >
                  <Eye className="w-4 h-4" />
                  <span>{locale === 'ar' ? 'معاينة الـ README' : 'Live Preview'}</span>
                </button>
              )}

              {mobileTab === 'preview' && (
                <button
                  type="button"
                  onClick={() => setMobileTab('editor')}
                  className="lg:hidden fixed bottom-5 end-4 z-40 px-4 py-2.5 rounded-full bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] shadow-xl flex items-center gap-2 text-xs font-bold hover:scale-105 active:scale-95 transition-all"
                >
                  <Edit3 className="w-4 h-4 text-[var(--accent)]" />
                  <span>{locale === 'ar' ? 'العودة للمحرر' : 'Edit Section'}</span>
                </button>
              )}
            </main>
          </>
        )}

        {/* Publish Modal (Atomic GitHub Commits + Backups) */}
        <PublishModal
          isOpen={isPublishOpen}
          onClose={() => setIsPublishOpen(false)}
          locale={locale}
          username={username}
          markdownContent={markdown}
          token={token}
          setToken={setToken}
          onOpenTokenGuide={() => {
            setIsPublishOpen(false);
            setIsTokenGuideOpen(true);
          }}
        />

        {/* Token Guide Modal */}
        <TokenGuideModal
          isOpen={isTokenGuideOpen}
          onClose={() => setIsTokenGuideOpen(false)}
          locale={locale}
        />

        {/* Settings Modal (Gemini 3.8 Flash + Rate Limit Monitor + PAT) */}
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          locale={locale}
          setLocale={setLocale}
          appTheme={appTheme}
          setAppTheme={setAppTheme}
          token={token}
          setToken={setToken}
        />
      </div>
    </ErrorBoundary>
  );
}
