import React, { useState } from 'react';
import { Locale, AnalysisStage } from '../types';
import { translations } from '../i18n/translations';
import { Search, Loader2, AlertCircle, Sparkles } from 'lucide-react';

interface UsernameBarProps {
  locale: Locale;
  onFetchUser: (username: string) => Promise<void>;
  isLoading: boolean;
  activeUsername: string;
  errorMessage: string | null;
  stage?: AnalysisStage | null;
  stageProgress?: number;
}

const STAGE_LABELS: Record<AnalysisStage, { en: string; ar: string }> = {
  profile: { en: 'Fetching profile metadata...', ar: 'جلب بيانات الحساب الأساسية...' },
  repos: { en: 'Analyzing all public repositories & stars...', ar: 'تحليل كافة المستودعات العامة والنجوم...' },
  languages: { en: 'Computing byte-level Language DNA...', ar: 'حساب لغات البرمجة بدقة البايت...' },
  activity: { en: 'Tracing public events & commit rhythm...', ar: 'تتبع سجل الأنشطة وإيقاع الالتزامات...' },
  contributions: { en: 'Mapping contribution calendar...', ar: 'بناء مصفوفة المساهمات...' },
  insights: { en: 'Synthesizing scores & hidden gems...', ar: 'حساب نقاط التقييم واستنتاج الرؤى...' },
  done: { en: 'Analysis complete!', ar: 'اكتمل التحليل بنجاح!' },
};

export const UsernameBar: React.FC<UsernameBarProps> = ({
  locale,
  onFetchUser,
  isLoading,
  activeUsername,
  errorMessage,
  stage,
  stageProgress = 0,
}) => {
  const t = translations[locale];
  const isAr = locale === 'ar';
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onFetchUser(inputValue.trim());
    }
  };

  const handleDemoClick = (demoUser: string) => {
    setInputValue(demoUser);
    onFetchUser(demoUser);
  };

  return (
    <div className="border-b border-[var(--border)] bg-[var(--surface-2)]/60 px-3 sm:px-6 py-2.5 transition-colors">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Username form */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 flex-1 w-full max-w-xl">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 start-0 flex items-center ps-3.5 text-[var(--text-muted)] font-mono text-xs sm:text-sm pointer-events-none select-none">
              <span className="hidden sm:inline">github.com/</span>
              <span className="sm:hidden font-bold text-[var(--accent)]">@</span>
            </span>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={activeUsername || t.hero.inputPlaceholder}
              disabled={isLoading}
              className="w-full h-9 sm:h-10 ps-8 sm:ps-26 pe-3 text-xs sm:text-sm bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/15 font-mono transition-all shadow-2xs"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || (!inputValue.trim() && !activeUsername)}
            className="h-9 sm:h-10 px-4 text-xs sm:text-sm font-medium rounded-xl bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] active:scale-[0.98] disabled:opacity-40 transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-xs"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span className="text-xs">{t.hero.fetching}</span>
              </>
            ) : (
              <>
                <Search className="w-3.5 h-3.5" />
                <span className="hidden xs:inline text-xs font-medium">{t.hero.fetchButton}</span>
              </>
            )}
          </button>
        </form>

        {/* Demo profiles selection */}
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] overflow-x-auto no-scrollbar py-0.5">
          <span className="hidden md:inline shrink-0 text-xs text-[var(--text-subtle)] font-serif italic">{t.hero.orTryDemo}</span>
          {['torvalds', 'gaearon', 'antfu', 'shadcn'].map((demo) => (
            <button
              key={demo}
              type="button"
              onClick={() => handleDemoClick(demo)}
              disabled={isLoading}
              className={`px-2.5 py-1 rounded-full text-xs font-mono border whitespace-nowrap transition-all ${
                activeUsername === demo
                  ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-soft)] font-bold shadow-2xs'
                  : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--border-strong)]'
              }`}
            >
              @{demo}
            </button>
          ))}
        </div>
      </div>

      {/* Live Analysis Progress Bar */}
      {isLoading && (
        <div className="max-w-6xl mx-auto mt-2 p-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-xs animate-in fade-in transition-all">
          <div className="flex items-center justify-between text-xs mb-1">
            <div className="flex items-center gap-2 text-[var(--accent)] font-medium">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span className="text-[11px]">{stage ? STAGE_LABELS[stage][locale] : t.hero.fetching}</span>
            </div>
            <span className="font-mono text-[11px] text-[var(--text-muted)]">
              {Math.round(stageProgress * 100)}%
            </span>
          </div>
          <div className="w-full h-1 rounded-full bg-[var(--surface-2)] overflow-hidden">
            <div
              className="h-full bg-[var(--accent)] rounded-full transition-all duration-300"
              style={{ width: `${Math.max(8, Math.round(stageProgress * 100))}%` }}
            />
          </div>
        </div>
      )}

      {/* Error state */}
      {errorMessage && (
        <div className="max-w-6xl mx-auto mt-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-xs text-red-500">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
