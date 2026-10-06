import React, { useState, useEffect } from 'react';
import { Locale, AppTheme, AppView, ArchetypeId } from '../types';
import { ARCHETYPES } from '../services/archetypes';
import { translations } from '../i18n/translations';
import {
  Sun,
  Moon,
  Globe,
  Settings,
  UploadCloud,
  Download,
  BarChart2,
  FileText,
  Activity,
  Home,
  Sparkles,
} from 'lucide-react';
import { LogoIcon } from './LogoIcon';
import { getRateLimitInfo, subscribeRateLimit, RateLimitInfo } from '../services/githubAnalyzer';

interface HeaderProps {
  locale: Locale;
  setLocale: (l: Locale) => void;
  appTheme: AppTheme;
  setAppTheme: (t: AppTheme) => void;
  onOpenSettings: () => void;
  onOpenPublish: () => void;
  onOpenTokenGuide: () => void;
  activeUsername: string;
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  archetype?: ArchetypeId;
  grade?: string;
  onDownloadReadme?: () => void;
  onOpenResumeModal?: () => void;
  onOpenWhatsNew?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  locale,
  setLocale,
  appTheme,
  setAppTheme,
  onOpenSettings,
  onOpenPublish,
  activeUsername,
  activeView,
  setActiveView,
  archetype,
  grade,
  onDownloadReadme,
  onOpenResumeModal,
  onOpenWhatsNew,
}) => {
  const t = translations[locale];
  const isAr = locale === 'ar';
  const arch = archetype ? ARCHETYPES[archetype] : null;

  const [rateLimit, setRateLimit] = useState<RateLimitInfo | null>(getRateLimitInfo());

  useEffect(() => {
    return subscribeRateLimit(info => setRateLimit(info));
  }, []);

  const toggleLanguage = () => {
    const nextLocale = locale === 'en' ? 'ar' : 'en';
    setLocale(nextLocale);
    localStorage.setItem('readme_studio_locale', nextLocale);
  };

  const toggleTheme = () => {
    const nextTheme = appTheme === 'light' ? 'dark' : 'light';
    setAppTheme(nextTheme);
    localStorage.setItem('readme_studio_theme', nextTheme);
  };

  return (
    <header className="h-14 sm:h-15 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between gap-3 transition-colors sticky top-0 z-30">
      {/* Zone 1: Wordmark & Active Profile Badge */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={() => setActiveView('landing')}
          className="flex items-center gap-2.5 text-start hover:opacity-85 transition-opacity"
        >
          <LogoIcon size={32} className="shadow-xs" />
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif text-lg sm:text-xl font-normal tracking-tight text-[var(--text)]">
              <span className="italic font-medium text-[var(--accent)]">README</span> Studio
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenWhatsNew?.();
              }}
              title={isAr ? 'سجل التحديثات v2.0' : 'Release notes v2.0'}
              className="text-[11px] font-mono px-1.5 py-0.5 rounded-md border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--border-strong)] transition-all cursor-pointer font-medium"
            >
              v2.0
            </button>
          </div>
        </button>

        {activeUsername && activeView !== 'landing' && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--surface-2)] text-xs text-[var(--text)] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>@{activeUsername}</span>
            {grade && (
              <span className="px-1.5 py-0.2 rounded font-semibold text-[10px] bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)]">
                Grade {grade}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Zone 2: Primary App Mode Switcher (Landing vs Deep Analytics vs README Builder) */}
      <div className="flex items-center p-1 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveView('landing')}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg transition-all ${
            activeView === 'landing'
              ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs font-semibold'
              : 'text-[var(--text-muted)] hover:text-[var(--text)]'
          }`}
          title={isAr ? 'الصفحة الرئيسية' : 'Home'}
        >
          <Home className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span className="hidden sm:inline">{isAr ? 'الرئيسية' : 'Home'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveView('analytics')}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg transition-all ${
            activeView === 'analytics'
              ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs font-semibold'
              : 'text-[var(--text-muted)] hover:text-[var(--text)]'
          }`}
          title={isAr ? 'التحليلات الاحترافية' : 'Deep Profile Analytics'}
        >
          <BarChart2 className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span className="hidden sm:inline">{isAr ? 'التحليلات' : 'Analytics'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveView('builder')}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg transition-all ${
            activeView === 'builder'
              ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs font-semibold'
              : 'text-[var(--text-muted)] hover:text-[var(--text)]'
          }`}
          title={isAr ? 'محرر الـ README' : 'README Studio Builder'}
        >
          <FileText className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span className="hidden sm:inline">{isAr ? 'المحرر' : 'Studio'}</span>
        </button>
      </div>

      {/* Zone 3: Actions & Rate Limit Pill */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Live GitHub Rate Limit Pill */}
        {rateLimit && (
          <div
            title={isAr ? `المتبقي من حصة GitHub API: ${rateLimit.remaining} من ${rateLimit.limit}` : `GitHub API Quota: ${rateLimit.remaining}/${rateLimit.limit}`}
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] text-[11px] font-mono text-[var(--text-muted)] select-none"
          >
            <Activity className={`w-3 h-3 ${rateLimit.remaining < 10 ? 'text-red-500 animate-pulse' : 'text-emerald-500'}`} />
            <span>{rateLimit.remaining}/{rateLimit.limit}</span>
          </div>
        )}

        {/* Resume Ingestion Action Button */}
        {onOpenResumeModal && (
          <button
            type="button"
            onClick={onOpenResumeModal}
            title={t.resumeModal.button}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] font-medium text-xs transition-all min-h-[34px]"
          >
            <FileText className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span className="hidden sm:inline">{t.resumeModal.button}</span>
            <span className="sm:hidden">{isAr ? 'الـ CV' : 'Resume'}</span>
          </button>
        )}

        {/* Quick Download README.md action */}
        {onDownloadReadme && (
          <button
            type="button"
            onClick={onDownloadReadme}
            title={isAr ? 'تحميل ملف README.md' : 'Download README.md'}
            className="hidden md:flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] hover:border-[var(--border-strong)] transition-all min-h-[34px]"
          >
            <Download className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span className="hidden lg:inline">{isAr ? 'تحميل' : 'Export'}</span>
          </button>
        )}

        {/* Language switch button */}
        <button
          onClick={toggleLanguage}
          title={locale === 'en' ? 'التبديل إلى العربية' : 'Switch to English'}
          className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] hover:border-[var(--border-strong)] transition-all min-h-[34px]"
        >
          <Globe className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span className="font-mono uppercase text-[11px] font-semibold">{locale === 'en' ? 'AR' : 'EN'}</span>
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={appTheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          className="p-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--border-strong)] transition-all min-w-[34px] min-h-[34px] flex items-center justify-center"
        >
          {appTheme === 'light' ? (
            <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          ) : (
            <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          )}
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          title={t.nav.settings}
          className="p-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--border-strong)] transition-all min-w-[34px] min-h-[34px] flex items-center justify-center"
        >
          <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        {/* Publish primary action */}
        <button
          onClick={onOpenPublish}
          className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-xl bg-[var(--accent)] text-white text-xs sm:text-sm font-medium hover:bg-[var(--accent-hover)] active:scale-[0.98] transition-all whitespace-nowrap shadow-xs min-h-[34px]"
        >
          <UploadCloud className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">{t.publish.button}</span>
          <span className="sm:hidden">{isAr ? 'نشر' : 'Publish'}</span>
        </button>
      </div>
    </header>
  );
};
