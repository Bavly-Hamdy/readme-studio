import React, { useState, useMemo } from 'react';
import { Locale, AppTheme } from '../types';
import { translations } from '../i18n/translations';
import { marked } from 'marked';
import {
  Copy,
  Download,
  Check,
  Sun,
  Moon,
  Eye,
  FileCode,
  Columns,
} from 'lucide-react';

interface LivePreviewProps {
  locale: Locale;
  markdown: string;
  appTheme?: AppTheme;
}

export const LivePreview: React.FC<LivePreviewProps> = ({ locale, markdown, appTheme }) => {
  const t = translations[locale];
  const [viewMode, setViewMode] = useState<'preview' | 'markdown' | 'split'>('preview');
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>(() => {
    return appTheme === 'dark' ? 'dark' : 'light';
  });
  const [copied, setCopied] = useState(false);

  // Sync preview theme if global app theme changes
  React.useEffect(() => {
    if (appTheme) {
      setPreviewTheme(appTheme);
    }
  }, [appTheme]);

  // Configure marked for GitHub flavored markdown
  const htmlContent = useMemo(() => {
    try {
      return marked.parse(markdown, {
        gfm: true,
        breaks: true,
      });
    } catch {
      return markdown;
    }
  }, [markdown]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'README.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--surface)] border-t lg:border-t-0 lg:border-s border-[var(--border)] overflow-hidden transition-colors">
      {/* Top Preview Controls bar */}
      <div className="h-11 px-2.5 sm:px-4 border-b border-[var(--border)] flex items-center justify-between gap-1.5 sm:gap-2 shrink-0 bg-[var(--surface-2)]/50">
        {/* View mode segmented buttons */}
        <div className="flex items-center p-0.5 rounded-lg border border-[var(--border)] bg-[var(--surface)]">
          <button
            type="button"
            onClick={() => setViewMode('preview')}
            title={t.preview.tabPreview}
            className={`px-2.5 py-1 text-xs font-medium rounded-md flex items-center gap-1.5 transition-all ${
              viewMode === 'preview'
                ? 'bg-[var(--surface-2)] text-[var(--text)] shadow-2xs font-semibold'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span className="hidden sm:inline">{t.preview.tabPreview}</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('split')}
            title={t.preview.tabSplit}
            className={`hidden md:flex px-2.5 py-1 text-xs font-medium rounded-md items-center gap-1.5 transition-all ${
              viewMode === 'split'
                ? 'bg-[var(--surface-2)] text-[var(--text)] shadow-2xs font-semibold'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            <Columns className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>{t.preview.tabSplit}</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('markdown')}
            title={t.preview.tabMarkdown}
            className={`px-2.5 py-1 text-xs font-medium rounded-md flex items-center gap-1.5 transition-all ${
              viewMode === 'markdown'
                ? 'bg-[var(--surface-2)] text-[var(--text)] shadow-2xs font-semibold'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span className="hidden sm:inline">{t.preview.tabMarkdown}</span>
          </button>
        </div>

        {/* GitHub simulated mode & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* GitHub Dark/Light simulator toggle */}
          {viewMode !== 'markdown' && (
            <button
              type="button"
              onClick={() => setPreviewTheme(previewTheme === 'light' ? 'dark' : 'light')}
              title={`Simulate GitHub ${previewTheme === 'light' ? 'Dark' : 'Light'} Mode`}
              className={`p-1 rounded-lg border transition-all flex items-center gap-1.5 px-2.5 text-xs min-h-[30px] font-mono shadow-xs ${
                previewTheme === 'dark'
                  ? 'border-[#30363d] bg-[#161b22] text-[#58a6ff]'
                  : 'border-[#d0d7de] bg-white text-[#0969da]'
              }`}
            >
              {previewTheme === 'light' ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-700" />
                  <span className="hidden sm:inline text-[11px] font-medium">GH Dark</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline text-[11px] font-medium">GH Light</span>
                </>
              )}
            </button>
          )}

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 text-xs font-medium rounded-lg border transition-all min-h-[30px] ${
              copied
                ? 'border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--border-strong)]'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">{t.common.copied}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.preview.copyButton}</span>
              </>
            )}
          </button>

          {/* Download Button */}
          <button
            type="button"
            onClick={handleDownload}
            title={t.preview.downloadButton}
            className="p-1.5 text-[var(--text)] rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)] transition-colors min-h-[30px] flex items-center justify-center"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Markdown Source view */}
        {(viewMode === 'markdown' || viewMode === 'split') && (
          <div
            className={`flex-1 p-3.5 sm:p-5 font-mono text-xs overflow-auto bg-[var(--surface-2)] text-[var(--text)] whitespace-pre-wrap leading-relaxed select-all ${
              viewMode === 'split' ? 'border-e border-[var(--border)]' : ''
            }`}
          >
            {markdown}
          </div>
        )}

        {/* GitHub-accurate Rendered view */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div
            className={`flex-1 overflow-auto p-3 sm:p-6 lg:p-8 pb-24 lg:pb-8 transition-colors ${
              previewTheme === 'dark'
                ? 'bg-[#0d1117] text-[#e6edf3]'
                : 'bg-[#f6f8fa] text-[#1f2328]'
            }`}
          >
            {/* The outer container emulates GitHub's exact README container styling */}
            <div
              className={`max-w-3xl mx-auto rounded-xl border p-3.5 sm:p-6 lg:p-8 shadow-xs transition-colors ${
                previewTheme === 'dark'
                  ? 'border-[#30363d] bg-[#0d1117]'
                  : 'border-[#d0d7de] bg-white'
              }`}
            >
              <div
                className={`markdown-body ${previewTheme === 'dark' ? 'gh-theme-dark' : 'gh-theme-light'}`}
                data-theme={previewTheme}
                dangerouslySetInnerHTML={{ __html: htmlContent as string }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
