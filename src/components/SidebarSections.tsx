import React from 'react';
import { Locale, ReadmeTheme, ProfileSectionsConfig } from '../types';
import { translations } from '../i18n/translations';
import {
  User,
  FileText,
  Code,
  FolderGit2,
  BarChart3,
  Share2,
  Check,
  Eye,
  EyeOff,
  Sparkles,
  Briefcase,
  GraduationCap,
  Award,
} from 'lucide-react';

export type SectionKey = keyof ProfileSectionsConfig;

interface SidebarSectionsProps {
  locale: Locale;
  activeSection: SectionKey;
  setActiveSection: (sec: SectionKey) => void;
  config: ProfileSectionsConfig;
  onToggleSection: (sec: SectionKey) => void;
  theme: ReadmeTheme;
  setTheme: (t: ReadmeTheme) => void;
}

export const SidebarSections: React.FC<SidebarSectionsProps> = ({
  locale,
  activeSection,
  setActiveSection,
  config,
  onToggleSection,
  theme,
  setTheme,
}) => {
  const t = translations[locale];

  const sectionsList: Array<{
    key: SectionKey;
    label: string;
    icon: React.ReactNode;
  }> = [
    { key: 'header', label: t.sections.header, icon: <User className="w-4 h-4" /> },
    { key: 'about', label: t.sections.about, icon: <FileText className="w-4 h-4" /> },
    { key: 'techStack', label: t.sections.techStack, icon: <Code className="w-4 h-4" /> },
    { key: 'experience', label: (t.sections as any).experience || 'Work Experience', icon: <Briefcase className="w-4 h-4 text-sky-500" /> },
    { key: 'education', label: (t.sections as any).education || 'Education', icon: <GraduationCap className="w-4 h-4 text-indigo-500" /> },
    { key: 'certifications', label: (t.sections as any).certifications || 'Certifications', icon: <Award className="w-4 h-4 text-emerald-500" /> },
    { key: 'projects', label: t.sections.projects, icon: <FolderGit2 className="w-4 h-4" /> },
    { key: 'analytics', label: (t.sections as any).analytics || 'Deep Analytics', icon: <Sparkles className="w-4 h-4 text-amber-500" /> },
    { key: 'stats', label: t.sections.stats, icon: <BarChart3 className="w-4 h-4" /> },
    { key: 'connect', label: t.sections.connect, icon: <Share2 className="w-4 h-4" /> },
  ];

  const themesList: Array<{
    id: ReadmeTheme;
    name: string;
    desc: string;
  }> = [
    { id: 'showcase', name: (t.themes as any).showcase || 'Showcase', desc: (t.themes as any).showcaseDesc || 'Rich visual badges, metrics & cards' },
    { id: 'minimal', name: t.themes.minimal, desc: t.themes.minimalDesc },
    { id: 'mono', name: t.themes.mono, desc: t.themes.monoDesc },
    { id: 'paper', name: t.themes.paper, desc: t.themes.paperDesc },
  ];

  return (
    <aside className="w-full lg:w-72 h-full border-b lg:border-b-0 lg:border-e border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between p-3.5 sm:p-4 shrink-0 overflow-y-auto transition-colors">
      <div>
        <div className="flex items-center justify-between mb-2.5 px-1">
          <h2 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-subtle)]">
            {t.sections.title}
          </h2>
          <span className="text-[11px] text-[var(--text-subtle)] font-mono">
            {Object.values(config).filter(s => s && s.enabled).length}/{sectionsList.length}
          </span>
        </div>

        <div className="space-y-0.5">
          {sectionsList.map(({ key, label, icon }) => {
            const isEnabled = config[key]?.enabled ?? false;
            const isActive = activeSection === key;

            return (
              <div
                key={key}
                className={`group flex items-center justify-between rounded-xl border transition-all ${
                  isActive
                    ? 'border-[var(--accent)]/40 bg-[var(--accent-soft)] text-[var(--text)] font-semibold shadow-2xs'
                    : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]/60'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActiveSection(key)}
                  className="flex items-center gap-2.5 px-3 py-2 flex-1 text-start text-xs sm:text-sm"
                >
                  <span className={isActive ? 'text-[var(--accent)]' : 'text-[var(--text-subtle)] group-hover:text-[var(--text-muted)] transition-colors'}>
                    {icon}
                  </span>
                  <span className="truncate">{label}</span>
                </button>

                {/* Toggle button */}
                <button
                  type="button"
                  onClick={() => onToggleSection(key)}
                  title={isEnabled ? t.sections.enabled : t.sections.disabled}
                  className={`p-1.5 me-1.5 rounded-md transition-all ${
                    isEnabled
                      ? 'text-[var(--accent)] hover:bg-[var(--surface)] opacity-70 group-hover:opacity-100'
                      : 'text-[var(--text-subtle)] opacity-40 hover:opacity-100 hover:text-[var(--text-muted)]'
                  }`}
                >
                  {isEnabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Theme selection card */}
      <div className="mt-5 pt-3.5 border-t border-[var(--border)]">
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--text-subtle)] mb-2 px-1">
          {t.themes.label}
        </label>
        <div className="space-y-1">
          {themesList.map((th) => {
            const isSelected = theme === th.id;
            return (
              <button
                key={th.id}
                type="button"
                onClick={() => setTheme(th.id)}
                className={`w-full text-start p-2 rounded-lg border transition-all ${
                  isSelected
                    ? 'border-[var(--accent)] bg-[var(--surface-2)] shadow-2xs'
                    : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[var(--text)]">
                    {th.name}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[var(--accent)]" />}
                </div>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5 line-clamp-1">
                  {th.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
