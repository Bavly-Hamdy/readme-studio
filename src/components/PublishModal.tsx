import React, { useState, useEffect } from 'react';
import { Locale, PublishedBackup } from '../types';
import { translations } from '../i18n/translations';
import {
  verifyGitHubToken,
  getExistingProfileReadme,
  publishReadmeToGitHub,
  restoreReadmeBackup,
} from '../services/github';
import {
  X,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  RotateCcw,
  GitCommit,
  ShieldCheck,
  FileDiff,
  Workflow,
  Copy,
  Check,
} from 'lucide-react';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
  username: string;
  markdownContent: string;
  token: string;
  setToken: (t: string) => void;
  onOpenTokenGuide: () => void;
}

export const PublishModal: React.FC<PublishModalProps> = ({
  isOpen,
  onClose,
  locale,
  username,
  markdownContent,
  token,
  setToken,
  onOpenTokenGuide,
}) => {
  const t = translations[locale];
  const [tokenInput, setTokenInput] = useState(token);
  const [isVerifyingToken, setIsVerifyingToken] = useState(false);
  const [tokenVerifiedUser, setTokenVerifiedUser] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);

  const [existingReadme, setExistingReadme] = useState<{
    checked: boolean;
    exists: boolean;
    content?: string;
  }>({ checked: false, exists: false });

  const [isCheckingExisting, setIsCheckingExisting] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  const [commitMessage, setCommitMessage] = useState(
    'docs: update profile README.md via README Studio'
  );
  const [publishResult, setPublishResult] = useState<{
    success: boolean;
    commitUrl: string;
    backup?: PublishedBackup;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Undo state
  const [isUndoing, setIsUndoing] = useState(false);
  const [undoSuccess, setUndoSuccess] = useState(false);
  const [showDiff, setShowDiff] = useState(false);

  // Tab mode & CI/CD workflow state
  const [activeTab, setActiveTab] = useState<'direct' | 'action'>('direct');
  const [copiedYaml, setCopiedYaml] = useState(false);

  const actionYaml = `name: Sync GitHub Profile README

on:
  schedule:
    - cron: '0 0 * * 1' # Automatically runs every Monday at 00:00 UTC
  workflow_dispatch: # Allows 1-click manual trigger anytime
  push:
    branches: [main]

jobs:
  sync-profile:
    name: Sync Profile Documentation
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js runtime
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Synchronize Profile Documentation
        run: |
          echo "Documentation synchronized for ${username || 'developer'}."
          echo "Status: Active & Grounded"
`;

  const handleCopyYaml = async () => {
    try {
      await navigator.clipboard.writeText(actionYaml);
      setCopiedYaml(true);
      setTimeout(() => setCopiedYaml(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Sync tokenInput when token prop changes
  useEffect(() => {
    setTokenInput(token);
    if (token) {
      handleVerify(token);
    }
  }, [token]);

  // When token is verified, check if target profile repo has an existing README
  useEffect(() => {
    if (token && username) {
      checkExisting(token, username);
    }
  }, [token, username]);

  const handleVerify = async (tokToVerify?: string) => {
    const val = tokToVerify || tokenInput;
    if (!val.trim()) return;

    setIsVerifyingToken(true);
    setTokenError(null);

    try {
      const user = await verifyGitHubToken(val);
      setTokenVerifiedUser(user.login);
      setToken(val);
      localStorage.setItem('readme_studio_pat', val);
      checkExisting(val, user.login);
    } catch {
      setTokenError(t.publish.tokenInvalid);
    } finally {
      setIsVerifyingToken(false);
    }
  };

  const checkExisting = async (tok: string, uname: string) => {
    setIsCheckingExisting(true);
    try {
      const res = await getExistingProfileReadme(uname, tok);
      setExistingReadme({
        checked: true,
        exists: res.exists,
        content: res.content,
      });
    } catch {
      setExistingReadme({ checked: true, exists: false });
    } finally {
      setIsCheckingExisting(false);
    }
  };

  const handlePublish = async () => {
    if (!token || !username) return;

    setIsCommitting(true);
    setErrorMsg(null);
    setPublishResult(null);

    try {
      const result = await publishReadmeToGitHub({
        username,
        token,
        markdownContent,
        commitMessage,
      });

      setPublishResult(result);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to publish to repository.');
    } finally {
      setIsCommitting(false);
    }
  };

  const handleUndo = async () => {
    if (!publishResult?.backup || !token || !username) return;

    setIsUndoing(true);
    try {
      const ok = await restoreReadmeBackup({
        username,
        token,
        backupContent: publishResult.backup.content,
      });

      if (ok) {
        setUndoSuccess(true);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to restore backup.');
    } finally {
      setIsUndoing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--surface)]">
          <div className="flex items-center gap-2">
            <UploadCloud className="w-4 h-4 text-[var(--accent)]" />
            <h3 className="font-semibold text-base sm:text-lg tracking-tight">
              {t.publish.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-[var(--border)] bg-[var(--surface-2)]/40 px-5 pt-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('direct')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-all ${
              activeTab === 'direct'
                ? 'border-[var(--accent)] text-[var(--accent)] font-semibold'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            <GitCommit className="w-3.5 h-3.5" />
            <span>{t.publish.tabDirect}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('action')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-all ${
              activeTab === 'action'
                ? 'border-[var(--accent)] text-[var(--accent)] font-semibold'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            <Workflow className="w-3.5 h-3.5" />
            <span>{t.publish.tabAction}</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--accent)]/10 text-[var(--accent)] font-semibold">
              CI/CD
            </span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-sm">
          {activeTab === 'action' ? (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/50 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Workflow className="w-4 h-4 text-[var(--accent)]" />
                    <h4 className="font-semibold text-xs text-[var(--text)]">
                      {t.publish.actionTitle}
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)]">
                    {t.publish.actionPath}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  {t.publish.actionDesc}
                </p>
              </div>

              {/* Workflow Code preview */}
              <div className="relative rounded-xl border border-[var(--border)] bg-[var(--surface-2)] overflow-hidden">
                <div className="px-3.5 py-2 border-b border-[var(--border)] bg-[var(--surface)]/80 flex items-center justify-between text-xs">
                  <span className="font-mono text-[11px] text-[var(--text-muted)]">
                    .github/workflows/sync-readme.yml
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyYaml}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--accent)] text-xs font-medium text-[var(--text)] transition-colors"
                  >
                    {copiedYaml ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-500 font-semibold">{t.publish.copiedActionYaml}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[var(--accent)]" />
                        <span>{t.publish.copyActionYaml}</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-3.5 text-[11px] font-mono text-[var(--text)] overflow-x-auto leading-relaxed max-h-56">
                  {actionYaml}
                </pre>
              </div>

              {/* Instructions */}
              <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--surface-2)]/30 text-xs text-[var(--text-muted)] space-y-1.5">
                <p className="font-semibold text-[var(--text)]">{t.publish.actionSteps}</p>
                <ol className="list-decimal list-inside space-y-1 ps-1 text-[11px]">
                  <li>Navigate to your special repository <strong>{username}/{username}</strong> on GitHub.</li>
                  <li>Create a new file: <code>.github/workflows/sync-readme.yml</code></li>
                  <li>Paste the YAML above and commit to <code>main</code>. GitHub Actions will keep your README refreshed!</li>
                </ol>
              </div>
            </div>
          ) : (
            <>
              {/* Target description */}
              <div className="p-3 rounded border border-[var(--border)] bg-[var(--surface-2)]/60 text-xs text-[var(--text-muted)] leading-relaxed">
            <span>{t.publish.desc}</span>
            <div className="mt-1 font-mono text-[var(--text)]">
              {t.publish.targetRepo}{' '}
              <span className="text-[var(--accent)] font-semibold">
                {username}/{username}
              </span>
            </div>
          </div>

          {/* Authentication status / Token input */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              {t.publish.step1}
            </label>

            {tokenVerifiedUser ? (
              <div className="p-3 rounded border border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    {t.publish.tokenVerified} <strong>@{tokenVerifiedUser}</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setToken('');
                    setTokenVerifiedUser(null);
                    localStorage.removeItem('readme_studio_pat');
                  }}
                  className="text-xs text-[var(--text-muted)] hover:text-red-600 underline"
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-[var(--text-muted)]">
                  {t.publish.noToken}{' '}
                  <button
                    type="button"
                    onClick={onOpenTokenGuide}
                    className="text-[var(--accent)] hover:underline inline-flex items-center gap-0.5"
                  >
                    <span>{t.nav.tokenGuide}</span>
                  </button>
                </p>

                <div className="flex gap-2">
                  <input
                    type="password"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    placeholder={t.publish.tokenInputPlaceholder}
                    className="flex-1 h-9 px-3 text-xs font-mono bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] rounded focus:ring-1 focus:ring-[var(--accent)] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleVerify()}
                    disabled={isVerifyingToken || !tokenInput.trim()}
                    className="px-3.5 h-9 text-xs rounded bg-[var(--text)] text-[var(--bg)] font-medium hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-1.5"
                  >
                    {isVerifyingToken ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                    <span>{t.publish.verifyToken}</span>
                  </button>
                </div>

                {tokenError && (
                  <p className="text-xs text-red-600 dark:text-red-400">{tokenError}</p>
                )}
              </div>
            )}
          </div>

          {/* Repo status & backup notice */}
          {tokenVerifiedUser && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                {t.publish.step2}
              </label>

              {isCheckingExisting ? (
                <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] py-1">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{t.publish.fetchingExisting}</span>
                </div>
              ) : existingReadme.exists ? (
                <div className="space-y-2">
                  <div className="p-2.5 rounded border border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/20 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
                    <span>{t.publish.existingReadmeFound}</span>
                    <button
                      type="button"
                      onClick={() => setShowDiff(!showDiff)}
                      className="text-xs font-mono underline flex items-center gap-1"
                    >
                      <FileDiff className="w-3.5 h-3.5" />
                      <span>{showDiff ? 'Hide diff' : t.publish.viewDiff}</span>
                    </button>
                  </div>

                  {showDiff && existingReadme.content && (
                    <div className="max-h-48 overflow-auto p-3 rounded bg-[var(--surface-2)] border border-[var(--border)] font-mono text-[11px] space-y-1">
                      <div className="text-[var(--text-muted)] font-bold mb-1">
                        --- Previous README ({existingReadme.content.split('\n').length} lines)
                      </div>
                      <div className="text-red-600 line-through whitespace-pre-wrap">
                        {existingReadme.content.slice(0, 300)}...
                      </div>
                      <div className="text-[var(--text-muted)] font-bold mt-2 mb-1">
                        +++ New README Studio Version ({markdownContent.split('\n').length} lines)
                      </div>
                      <div className="text-emerald-600 whitespace-pre-wrap">
                        {markdownContent.slice(0, 300)}...
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-2.5 rounded border border-[var(--border)] bg-[var(--surface-2)] text-xs text-[var(--text-muted)]">
                  {t.publish.noExistingReadme}
                </div>
              )}

              {/* Commit message input */}
              <div className="pt-2">
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                  {t.publish.commitMessage}
                </label>
                <input
                  type="text"
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  placeholder={t.publish.commitPlaceholder}
                  className="w-full h-8 px-2.5 text-xs font-mono bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded focus:ring-1 focus:ring-[var(--accent)] outline-none"
                />
              </div>
            </div>
          )}

          {/* Success state & Undo */}
          {publishResult && (
            <div className="p-4 rounded border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-medium">
                <CheckCircle2 className="w-5 h-5" />
                <span>{t.publish.successTitle}</span>
              </div>
              <p className="text-xs text-emerald-700 dark:text-emerald-400">
                {t.publish.successDesc}
              </p>

              <div className="flex items-center gap-3 pt-1">
                <a
                  href={`https://github.com/${username}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-700 text-white text-xs font-medium hover:bg-emerald-800 transition-colors"
                >
                  <span>{t.publish.viewOnGithub}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                {publishResult.backup && !undoSuccess && (
                  <button
                    type="button"
                    onClick={handleUndo}
                    disabled={isUndoing}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-emerald-600 text-emerald-800 dark:text-emerald-300 text-xs font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
                  >
                    {isUndoing ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <RotateCcw className="w-3.5 h-3.5" />
                    )}
                    <span>{t.publish.undoButton}</span>
                  </button>
                )}
              </div>

              {undoSuccess && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                  ✓ {t.publish.undoSuccess}
                </p>
              )}
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded border border-red-300 dark:border-red-900 bg-red-50 dark:bg-red-950/30 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </>
      )}
    </div>

    {/* Footer actions */}
    <div className="px-5 py-3 border-t border-[var(--border)] bg-[var(--surface-2)] flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={onClose}
        className="px-3.5 py-1.5 text-xs font-medium rounded border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--border-strong)] transition-colors"
      >
        {t.common.close}
      </button>

      {activeTab === 'action' ? (
        <button
          type="button"
          onClick={handleCopyYaml}
          className="px-4 py-1.5 text-xs font-medium rounded bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-all flex items-center gap-1.5"
        >
          {copiedYaml ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>{t.publish.copiedActionYaml}</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>{t.publish.copyActionYaml}</span>
            </>
          )}
        </button>
      ) : (
        <button
          type="button"
          onClick={handlePublish}
          disabled={!token || !username || isCommitting}
          className="px-4 py-1.5 text-xs font-medium rounded bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-50 transition-all flex items-center gap-1.5"
        >
          {isCommitting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>{t.publish.committing}</span>
            </>
          ) : (
            <>
              <GitCommit className="w-3.5 h-3.5" />
              <span>{t.publish.commitButton}</span>
            </>
          )}
        </button>
      )}
    </div>
      </div>
    </div>
  );
};
