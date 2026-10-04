import React from 'react';
import { Locale } from '../types';
import { translations } from '../i18n/translations';
import { X, ExternalLink, Key, ShieldCheck, Check } from 'lucide-react';

interface TokenGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
}

export const TokenGuideModal: React.FC<TokenGuideModalProps> = ({
  isOpen,
  onClose,
  locale,
}) => {
  const t = translations[locale];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--surface)]">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-[var(--accent)]" />
            <h3 className="font-semibold text-base sm:text-lg tracking-tight">
              {t.tokenGuide.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs leading-relaxed">
          <p className="text-[var(--text-muted)]">
            {t.tokenGuide.subtitle}
          </p>

          <div className="p-3 rounded border border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <strong>Security Guarantee:</strong> Your token is kept only in your local browser memory for this session and used solely to communicate directly with GitHub's official API to create or update your profile repository.
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {/* Step 1 */}
            <div className="p-3 rounded border border-[var(--border)] bg-[var(--surface-2)]/50 space-y-1.5">
              <span className="font-semibold text-[var(--text)]">
                {t.tokenGuide.step1Title}
              </span>
              <p className="text-[var(--text-muted)]">
                {t.tokenGuide.step1Desc}
              </p>
              <a
                href="https://github.com/settings/tokens/new?scopes=public_repo&description=README+Studio"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[var(--accent)] hover:underline font-medium pt-1"
              >
                <span>{t.tokenGuide.openGithubTokens}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Step 2 */}
            <div className="p-3 rounded border border-[var(--border)] bg-[var(--surface-2)]/50 space-y-1">
              <span className="font-semibold text-[var(--text)]">
                {t.tokenGuide.step2Title}
              </span>
              <p className="text-[var(--text-muted)]">
                {t.tokenGuide.step2Desc}
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-3 rounded border border-[var(--border)] bg-[var(--surface-2)]/50 space-y-1">
              <span className="font-semibold text-[var(--text)]">
                {t.tokenGuide.step3Title}
              </span>
              <p className="text-[var(--text-muted)]">
                {t.tokenGuide.step3Desc}
              </p>
              <div className="inline-block mt-1 px-2 py-0.5 rounded font-mono text-[11px] bg-[var(--surface)] border border-[var(--border)] text-[var(--accent)] font-semibold">
                ✓ public_repo
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-3 rounded border border-[var(--border)] bg-[var(--surface-2)]/50 space-y-1">
              <span className="font-semibold text-[var(--text)]">
                {t.tokenGuide.step4Title}
              </span>
              <p className="text-[var(--text-muted)]">
                {t.tokenGuide.step4Desc}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[var(--border)] bg-[var(--surface-2)] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium rounded bg-[var(--text)] text-[var(--bg)] hover:opacity-90 transition-opacity flex items-center gap-1"
          >
            <Check className="w-3.5 h-3.5" />
            <span>{t.tokenGuide.close}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
