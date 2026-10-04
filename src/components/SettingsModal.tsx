import React, { useState, useEffect } from 'react';
import { Locale, AppTheme } from '../types';
import { translations } from '../i18n/translations';
import { X, Globe, Moon, Sun, Key, Trash2, Sparkles, Activity, ExternalLink } from 'lucide-react';
import { getRateLimitInfo, subscribeRateLimit, RateLimitInfo } from '../services/githubAnalyzer';
import { getActiveGeminiKey } from '../services/geminiService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
  setLocale: (l: Locale) => void;
  appTheme: AppTheme;
  setAppTheme: (t: AppTheme) => void;
  token: string;
  setToken: (t: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  locale,
  setLocale,
  appTheme,
  setAppTheme,
  token,
  setToken,
}) => {
  const t = translations[locale];
  const isAr = locale === 'ar';

  const [tokenInput, setTokenInput] = useState(token);
  const [tokenSavedSuccess, setTokenSavedSuccess] = useState(false);

  // Gemini API Key state
  const [geminiKeyInput, setGeminiKeyInput] = useState(() => getActiveGeminiKey() || '');
  const [geminiSavedSuccess, setGeminiSavedSuccess] = useState(false);

  // Live GitHub Rate Limit
  const [rateLimit, setRateLimit] = useState<RateLimitInfo | null>(getRateLimitInfo());

  useEffect(() => {
    return subscribeRateLimit((info) => setRateLimit(info));
  }, []);

  useEffect(() => {
    setTokenInput(token);
  }, [token]);

  if (!isOpen) return null;

  const handleLanguageChange = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('readme_studio_locale', newLocale);
  };

  const handleThemeChange = (newTheme: AppTheme) => {
    setAppTheme(newTheme);
    localStorage.setItem('readme_studio_theme', newTheme);
  };

  const handleSaveToken = () => {
    setToken(tokenInput.trim());
    if (tokenInput.trim()) {
      localStorage.setItem('readme_studio_pat', tokenInput.trim());
    } else {
      localStorage.removeItem('readme_studio_pat');
    }
    setTokenSavedSuccess(true);
    setTimeout(() => setTokenSavedSuccess(false), 2000);
  };

  const handleClearToken = () => {
    setToken('');
    setTokenInput('');
    localStorage.removeItem('readme_studio_pat');
  };

  const handleSaveGeminiKey = () => {
    const val = geminiKeyInput.trim();
    if (val) {
      localStorage.setItem('readme_studio_gemini_key', val);
    } else {
      localStorage.removeItem('readme_studio_gemini_key');
    }
    setGeminiSavedSuccess(true);
    setTimeout(() => setGeminiSavedSuccess(false), 2000);
  };

  const handleClearGeminiKey = () => {
    setGeminiKeyInput('');
    localStorage.removeItem('readme_studio_gemini_key');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--surface)]">
          <h3 className="font-semibold text-base sm:text-lg tracking-tight">
            {t.settings.title}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-6 text-sm">
          {/* GitHub API Health & Rate Limit */}
          <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/70 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text)]">
                <Activity className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>{isAr ? 'حالة استهلاك GitHub API' : 'GitHub API Health & Quota'}</span>
              </div>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full font-medium ${
                token ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
              }`}>
                {token ? (isAr ? 'موثّق بـ Token' : 'Authenticated') : (isAr ? 'عام (محدود)' : 'Public')}
              </span>
            </div>
            <div className="flex items-baseline justify-between text-xs pt-1">
              <span className="text-[var(--text-muted)] font-serif italic">
                {isAr ? 'الطلبات المتبقية:' : 'Remaining API quota:'}
              </span>
              <span className="font-mono font-bold text-[var(--text)]">
                {rateLimit ? `${rateLimit.remaining} / ${rateLimit.limit}` : (token ? '5000 / 5000' : '60 / 60')}
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
              {token
                ? (isAr ? 'حسابك يتمتع بسقف 5000 طلب/ساعة للتحليل المعمّق ومزامنة الـ README مباشرة.' : 'Enjoying 5,000 requests/hr quota with direct atomic commits.')
                : (isAr ? 'الوصول العام يتيح 60 طلباً/ساعة. أضف Personal Access Token للحصول على 5000 طلب/ساعة.' : 'Public requests are capped at 60 req/hr. Add a PAT below to unlock 5,000 req/hr.')}
            </p>
          </div>

          {/* Language preference */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              <Globe className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>{t.settings.languageLabel}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleLanguageChange('en')}
                className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all ${
                  locale === 'en'
                    ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--text)] font-semibold shadow-2xs'
                    : 'border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                English (Default)
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange('ar')}
                className={`p-2.5 rounded-xl border text-xs font-medium text-center font-arabic transition-all ${
                  locale === 'ar'
                    ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--text)] font-semibold shadow-2xs'
                    : 'border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                العربية (RTL)
              </button>
            </div>
          </div>

          {/* Theme preference */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              {appTheme === 'light' ? (
                <Sun className="w-3.5 h-3.5 text-[var(--accent)]" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-[var(--accent)]" />
              )}
              <span>{t.settings.themeLabel}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleThemeChange('light')}
                className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all ${
                  appTheme === 'light'
                    ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--text)] font-semibold shadow-2xs'
                    : 'border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                {isAr ? 'أبيض ناصع (Crisp White)' : 'Crisp White'}
              </button>
              <button
                type="button"
                onClick={() => handleThemeChange('dark')}
                className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all ${
                  appTheme === 'dark'
                    ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--text)] font-semibold shadow-2xs'
                    : 'border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                {isAr ? 'حبر فحمي (Ink Charcoal)' : 'Ink Charcoal Dark'}
              </button>
            </div>
          </div>

          {/* Real AI (Gemini 2.5 Flash) API Configuration */}
          <div className="space-y-2 pt-2 border-t border-[var(--border)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>{isAr ? 'محرّك الذكاء الاصطناعي (Gemini 2.5 Flash)' : 'Gemini 2.5 Flash AI Engine'}</span>
              </div>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-[var(--accent)] hover:underline inline-flex items-center gap-1 font-serif italic"
              >
                <span>{isAr ? 'الحصول على مفتاح مجاني' : 'Get free key'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
              {isAr
                ? 'يُستخدم لتوليد سير ذاتية احترافية، نصوص افتتاحية، ورؤى معمارية مخصصة استناداً لمشاريعك ومستودعاتك الحقيقية.'
                : 'Powers bespoke developer bios, punchy headlines, and engineering summaries tailored to your real repositories.'}
            </p>

            <div className="flex gap-2">
              <input
                type="password"
                value={geminiKeyInput}
                onChange={(e) => setGeminiKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="flex-1 h-9 px-3 text-xs font-mono bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--accent)]/15 focus:border-[var(--accent)]"
              />
              <button
                type="button"
                onClick={handleSaveGeminiKey}
                className="px-3.5 h-9 text-xs rounded-xl bg-[var(--text)] text-[var(--bg)] font-medium hover:opacity-90 active:scale-[0.98] transition-all shadow-xs"
              >
                {t.settings.saveToken}
              </button>
              {geminiKeyInput && (
                <button
                  type="button"
                  onClick={handleClearGeminiKey}
                  title="Clear key"
                  className="px-2.5 h-9 text-xs rounded-xl border border-red-300 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {geminiSavedSuccess && (
              <p className="text-xs text-emerald-600 font-medium">
                ✓ {isAr ? 'تم حفظ مفتاح Gemini بنجاح.' : 'Gemini API key saved in browser storage.'}
              </p>
            )}
          </div>

          {/* GitHub Personal Access Token management */}
          <div className="space-y-2 pt-2 border-t border-[var(--border)]">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              <Key className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>{t.settings.storedTokenLabel}</span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
              {isAr
                ? 'مطلوب فقط لنشر الـ README مباشرة بضغطة زر إلى مستودعك الخاص username/username على GitHub.'
                : 'Required only for 1-click publishing directly to your GitHub profile repository (username/username).'}
            </p>

            <div className="flex gap-2">
              <input
                type="password"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="ghp_... or github_pat_..."
                className="flex-1 h-9 px-3 text-xs font-mono bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--accent)]/15 focus:border-[var(--accent)]"
              />
              <button
                type="button"
                onClick={handleSaveToken}
                className="px-3.5 h-9 text-xs rounded-xl bg-[var(--text)] text-[var(--bg)] font-medium hover:opacity-90 active:scale-[0.98] transition-all shadow-xs"
              >
                {t.settings.saveToken}
              </button>
              {token && (
                <button
                  type="button"
                  onClick={handleClearToken}
                  title={t.settings.clearToken}
                  className="px-2.5 h-9 text-xs rounded-xl border border-red-300 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {tokenSavedSuccess && (
              <p className="text-xs text-emerald-600 font-medium">
                ✓ {isAr ? 'تم حفظ GitHub Token بنجاح.' : 'GitHub Token saved in browser storage.'}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[var(--border)] bg-[var(--surface-2)] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--border-strong)] transition-colors"
          >
            {t.settings.close}
          </button>
        </div>
      </div>
    </div>
  );
};
