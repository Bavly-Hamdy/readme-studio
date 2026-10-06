import React, { useState, useMemo } from 'react';
import {
  Locale,
  ProfileSectionsConfig,
  GitHubUserProfile,
  GitHubRepository,
  TechItem,
  TechCategory,
  HeaderStyle,
  BannerPattern,
  BannerTheme,
  ExperienceItem,
  ExperienceSectionData,
  EducationItem,
  EducationSectionData,
  CertificationItem,
  CertificationsSectionData,
} from '../types';
import { SectionKey } from './SidebarSections';
import { translations } from '../i18n/translations';
import { generateBioVariations, BioVariation } from '../services/aiBio';
import { ALL_TECH_CATALOG, TechCatalogItem } from '../services/techDetection';
import { languageColor } from '../services/languageColors';
import {
  Sparkles,
  Plus,
  Trash2,
  ExternalLink,
  Star,
  GitFork,
  Check,
  Search,
  X,
  Palette,
  Terminal,
  Layout,
  Sliders,
  Eye,
  Layers,
  Code2,
  ArrowUp,
  ArrowDown,
  FolderGit2,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Briefcase,
  GraduationCap,
  Award,
  FileText,
} from 'lucide-react';
import { generateDeveloperBioWithGemini, getActiveGeminiKey } from '../services/geminiService';
import { ProfileAnalytics } from '../types';

interface SectionEditorProps {
  locale: Locale;
  activeSection: SectionKey;
  config: ProfileSectionsConfig;
  onChangeConfig: (newConfig: ProfileSectionsConfig) => void;
  profile: GitHubUserProfile | null;
  repos: GitHubRepository[];
  analytics?: ProfileAnalytics | null;
  onResetToDefaults?: () => void;
  onOpenResumeModal?: () => void;
}

export const SectionEditor: React.FC<SectionEditorProps> = ({
  locale,
  activeSection,
  config,
  onChangeConfig,
  profile,
  repos,
  analytics,
  onResetToDefaults,
  onOpenResumeModal,
}) => {
  const t = translations[locale];
  const isAr = locale === 'ar';

  const [bioVariations, setBioVariations] = useState<BioVariation[] | null>(null);
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [bioSource, setBioSource] = useState<'gemini' | 'rules' | null>(null);
  const [customTechName, setCustomTechName] = useState('');
  const [customTechCategory, setCustomTechCategory] = useState<TechCategory>('languages');

  // Tech Explorer search & category tab
  const [techSearchQuery, setTechSearchQuery] = useState('');
  const [selectedTechCategory, setSelectedTechCategory] = useState<string>('all');

  // Helper for updating nested data
  const updateSectionData = <K extends SectionKey>(key: K, data: Partial<ProfileSectionsConfig[K]['data']>) => {
    onChangeConfig({
      ...config,
      [key]: {
        ...config[key],
        data: {
          ...config[key].data,
          ...data,
        },
      },
    });
  };

  // Bio suggestions handler with Gemini AI support
  const handleGenerateBios = async () => {
    if (!profile) return;
    setIsGeneratingBio(true);
    try {
      const res = await generateDeveloperBioWithGemini({
        profile,
        repos,
        analytics,
        locale,
      });
      setBioVariations(res.variations);
      setBioSource(res.source);
    } catch {
      const fallback = generateBioVariations(profile, repos, locale);
      setBioVariations(fallback);
      setBioSource('rules');
    } finally {
      setIsGeneratingBio(false);
    }
  };

  const handleApplyBio = (bio: BioVariation) => {
    updateSectionData('about', {
      summary: bio.summary,
      currentRole: bio.focus,
      currentLearning: bio.learning || config.about.data.currentLearning,
      currentWork: bio.currentWork || config.about.data.currentWork,
      askMeAbout: bio.askMeAbout || config.about.data.askMeAbout,
      funFact: bio.funFact || config.about.data.funFact,
    });
  };

  // Add custom tech
  const handleAddCustomTech = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTechName.trim()) return;

    const newTech: TechItem = {
      id: customTechName.toLowerCase().replace(/\s+/g, '-'),
      name: customTechName.trim(),
      category: customTechCategory,
      enabled: true,
      color: '4A5568',
    };

    updateSectionData('techStack', {
      items: [newTech, ...config.techStack.data.items],
    });
    setCustomTechName('');
  };

  // Toggle specific catalog tech (from the 100+ GPRM catalog)
  const handleToggleCatalogTech = (catalogItem: TechCatalogItem) => {
    const existingIndex = config.techStack.data.items.findIndex(i => i.id === catalogItem.id);
    if (existingIndex >= 0) {
      const nextItems = config.techStack.data.items.map((it, idx) =>
        idx === existingIndex ? { ...it, enabled: !it.enabled } : it
      );
      updateSectionData('techStack', { items: nextItems });
    } else {
      const newItem: TechItem = {
        id: catalogItem.id,
        name: catalogItem.name,
        category: catalogItem.category,
        badgeSlug: catalogItem.badgeSlug,
        color: catalogItem.color,
        enabled: true,
      };
      updateSectionData('techStack', { items: [newItem, ...config.techStack.data.items] });
    }
  };

  const isTechEnabled = (techId: string) => {
    return config.techStack.data.items.some(i => i.id === techId && i.enabled);
  };

  // Filtered tech catalog
  const filteredCatalog = useMemo(() => {
    const query = techSearchQuery.trim().toLowerCase();
    return ALL_TECH_CATALOG.filter(tech => {
      const matchesCategory = selectedTechCategory === 'all' || tech.category === selectedTechCategory;
      if (!matchesCategory) return false;
      if (!query) return true;
      return (
        tech.name.toLowerCase().includes(query) ||
        tech.keywords.some(kw => kw.toLowerCase().includes(query)) ||
        tech.category.toLowerCase().includes(query)
      );
    });
  }, [techSearchQuery, selectedTechCategory]);

  const activeTechCount = useMemo(() => {
    return config.techStack.data.items.filter(i => i.enabled).length;
  }, [config.techStack.data.items]);

  // Project handlers
  const [repoSearchQuery, setRepoSearchQuery] = useState('');
  const [repoLanguageFilter, setRepoLanguageFilter] = useState('all');
  const [repoSortBy, setRepoSortBy] = useState<'stars' | 'updated' | 'name'>('stars');
  const [isRepoPickerExpanded, setIsRepoPickerExpanded] = useState(true);

  // Check if a repository is currently in featured projects
  const isRepoFeatured = (r: GitHubRepository) => {
    return config.projects.data.projects.some(
      p =>
        p.url === r.html_url ||
        (p.fullName && p.fullName.toLowerCase() === r.full_name.toLowerCase()) ||
        p.name.toLowerCase() === r.name.toLowerCase()
    );
  };

  // Toggle a repository into or out of featured projects
  const handleToggleRepo = (r: GitHubRepository) => {
    const isAlready = isRepoFeatured(r);
    if (isAlready) {
      const next = config.projects.data.projects.filter(
        p =>
          !(
            p.url === r.html_url ||
            (p.fullName && p.fullName.toLowerCase() === r.full_name.toLowerCase()) ||
            p.name.toLowerCase() === r.name.toLowerCase()
          )
      );
      updateSectionData('projects', { projects: next });
    } else {
      const newProj = {
        name: r.name,
        description: r.description || '',
        url: r.html_url,
        language: r.language || '',
        stars: r.stargazers_count ?? 0,
        forks: r.forks_count ?? 0,
        fullName: r.full_name,
      };
      updateSectionData('projects', {
        projects: [...config.projects.data.projects, newProj],
      });
    }
  };

  const handleSelectTopStarred = (count = 4) => {
    const sorted = [...repos].sort((a, b) => (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0));
    const picked = sorted.slice(0, count).map(r => ({
      name: r.name,
      description: r.description || '',
      url: r.html_url,
      language: r.language || '',
      stars: r.stargazers_count ?? 0,
      forks: r.forks_count ?? 0,
      fullName: r.full_name,
    }));
    updateSectionData('projects', { projects: picked });
  };

  const handleSelectTopRecent = (count = 6) => {
    const sorted = [...repos].sort((a, b) => {
      const timeA = new Date(a.pushed_at ?? a.updated_at).getTime();
      const timeB = new Date(b.pushed_at ?? b.updated_at).getTime();
      return timeB - timeA;
    });
    const picked = sorted.slice(0, count).map(r => ({
      name: r.name,
      description: r.description || '',
      url: r.html_url,
      language: r.language || '',
      stars: r.stargazers_count ?? 0,
      forks: r.forks_count ?? 0,
      fullName: r.full_name,
    }));
    updateSectionData('projects', { projects: picked });
  };

  const handleClearAllProjects = () => {
    updateSectionData('projects', { projects: [] });
  };

  const handleMoveProject = (index: number, dir: 'up' | 'down') => {
    const list = [...config.projects.data.projects];
    const targetIdx = dir === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    updateSectionData('projects', { projects: list });
  };

  const repoLanguagesList = useMemo(() => {
    const langCount = new Map<string, number>();
    repos.forEach(r => {
      if (r.language) {
        langCount.set(r.language, (langCount.get(r.language) ?? 0) + 1);
      }
    });
    const sorted = [...langCount.entries()].sort((a, b) => b[1] - a[1]);
    return [{ lang: 'all', count: repos.length }, ...sorted.map(([lang, count]) => ({ lang, count }))];
  }, [repos]);

  const filteredRepos = useMemo(() => {
    const q = repoSearchQuery.trim().toLowerCase();
    return repos
      .filter(r => {
        const matchLang = repoLanguageFilter === 'all' || r.language === repoLanguageFilter;
        if (!matchLang) return false;
        if (!q) return true;
        return (
          r.name.toLowerCase().includes(q) ||
          (r.description && r.description.toLowerCase().includes(q)) ||
          (r.language && r.language.toLowerCase().includes(q)) ||
          (r.topics && r.topics.some(tp => tp.toLowerCase().includes(q)))
        );
      })
      .sort((a, b) => {
        if (repoSortBy === 'stars') return (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0);
        if (repoSortBy === 'updated') {
          const timeA = new Date(a.pushed_at ?? a.updated_at).getTime();
          const timeB = new Date(b.pushed_at ?? b.updated_at).getTime();
          return timeB - timeA;
        }
        return a.name.localeCompare(b.name);
      });
  }, [repos, repoSearchQuery, repoLanguageFilter, repoSortBy]);

  const handleAddProject = () => {
    const newProj = {
      name: 'my-new-project',
      description: 'A thoughtful open-source software project.',
      url: profile ? `https://github.com/${profile.login}/my-new-project` : 'https://github.com',
      language: 'TypeScript',
      stars: 1,
      forks: 0,
    };
    updateSectionData('projects', {
      projects: [newProj, ...config.projects.data.projects],
    });
  };

  const handleRemoveProject = (index: number) => {
    const next = [...config.projects.data.projects];
    next.splice(index, 1);
    updateSectionData('projects', { projects: next });
  };

  const handleUpdateProject = (index: number, field: string, value: any) => {
    const next = [...config.projects.data.projects];
    next[index] = { ...next[index], [field]: value };
    updateSectionData('projects', { projects: next });
  };

  const techCategoriesList: Array<{ id: string; label: string; icon: string }> = [
    { id: 'all', label: isAr ? 'الكل' : 'All', icon: '🌐' },
    { id: 'languages', label: isAr ? 'اللغات' : 'Languages', icon: '💻' },
    { id: 'frontend', label: isAr ? 'الواجهات' : 'Frontend', icon: '🎨' },
    { id: 'backend', label: isAr ? 'الخلفيات' : 'Backend', icon: '⚙️' },
    { id: 'mobile', label: isAr ? 'تطبيقات الجوال' : 'Mobile', icon: '📱' },
    { id: 'database', label: isAr ? 'قواعد البيانات' : 'Databases', icon: '🗄️' },
    { id: 'devops', label: isAr ? 'DevOps & سحابي' : 'DevOps & Cloud', icon: '☁️' },
    { id: 'ml_ai', label: isAr ? 'ذكاء اصطناعي' : 'AI & ML', icon: '🧠' },
    { id: 'testing', label: isAr ? 'الاختبار' : 'Testing', icon: '🧪' },
    { id: 'design', label: isAr ? 'التصميم' : 'Design', icon: '✨' },
    { id: 'tools', label: isAr ? 'أدوات ومحركات' : 'Tools', icon: '🛠️' },
  ];

  return (
    <div className="flex-1 p-3.5 sm:p-6 pb-24 lg:pb-6 overflow-y-auto bg-[var(--surface-2)]/30 transition-colors">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* --- 1. SUPERCHARGED HEADER SECTION EDITOR --- */}
        {activeSection === 'header' && (
          <div className="space-y-5">
            <div>
              <h3 className="font-serif text-lg font-bold text-[var(--text)]">
                {t.sections.header}
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                {isAr
                  ? 'صمم ترويسة احترافية جذابة تخطف الأنظار مع رسومات متحركة وبطاقات شرفية.'
                  : 'Design an elite, memorable hero section with animated banners, typing effects, and verified badge strips.'}
              </p>
            </div>

            {/* Header Visual Style Choice */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] mb-2 uppercase tracking-wider">
                {isAr ? 'نمط الترويسة الرئيسي' : 'Header Layout Style'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'badge-hero', name: isAr ? 'بطل البروفايل (موصى به)' : 'Modern Hero (Recommended)', desc: 'Avatar, animated typing & badges' },
                  { id: 'capsule', name: isAr ? 'بانر انسيابي' : 'Capsule Wave', desc: 'Dynamic SVG banner' },
                  { id: 'terminal', name: isAr ? 'طرفية أوامر' : 'Terminal Shell', desc: 'UNIX prompt specs' },
                  { id: 'minimal', name: isAr ? 'هادئ وموجز' : 'Minimal Text', desc: 'Zen markdown quote' },
                ].map(styleOpt => {
                  const isCurrent = (config.header.data.headerStyle || 'badge-hero') === styleOpt.id;
                  return (
                    <button
                      key={styleOpt.id}
                      type="button"
                      onClick={() => updateSectionData('header', { headerStyle: styleOpt.id as HeaderStyle })}
                      className={`p-2.5 rounded-xl border text-start transition-all ${
                        isCurrent
                          ? 'border-[var(--accent)] bg-[var(--accent-soft)] shadow-xs'
                          : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)]'
                      }`}
                    >
                      <div className="text-xs font-bold text-[var(--text)]">{styleOpt.name}</div>
                      <div className="text-[10px] text-[var(--text-muted)] mt-0.5 line-clamp-1">{styleOpt.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Capsule Options (Theme & Pattern) */}
            {(config.header.data.headerStyle || 'capsule') === 'capsule' && (
              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-muted)] mb-2">
                    {isAr ? 'تدرج ألوان البانر (Color Palette)' : 'Banner Theme Palette'}
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
                    {[
                      { id: 'inkwash', name: 'Ink Wash', color: 'from-[#1e1f21] via-[#4a4a4a] to-[#6d8196]' },
                      { id: 'monochrome', name: 'Mono', color: 'from-zinc-900 to-zinc-600' },
                      { id: 'oceanic', name: 'Oceanic', color: 'from-blue-600 to-cyan-400' },
                      { id: 'sunset', name: 'Sunset', color: 'from-amber-500 to-rose-500' },
                      { id: 'emerald', name: 'Emerald', color: 'from-emerald-600 to-teal-400' },
                      { id: 'cyberpunk', name: 'Cyberpunk', color: 'from-purple-600 to-pink-500' },
                      { id: 'midnight', name: 'Midnight', color: 'from-slate-900 to-blue-600' },
                    ].map(pal => {
                      const isSel = (config.header.data.bannerTheme || 'inkwash') === pal.id;
                      return (
                        <button
                          key={pal.id}
                          type="button"
                          onClick={() => updateSectionData('header', { bannerTheme: pal.id as BannerTheme })}
                          className={`p-2 rounded-lg border text-center transition-all ${
                            isSel ? 'border-[var(--accent)] ring-2 ring-[var(--accent)]/30' : 'border-[var(--border)]'
                          }`}
                        >
                          <div className={`w-full h-3 rounded bg-gradient-to-r ${pal.color} mb-1.5`} />
                          <span className="text-[11px] font-medium text-[var(--text)] block truncate">{pal.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                      {isAr ? 'نمط حركة الموجة (Pattern)' : 'Banner Pattern Shape'}
                    </label>
                    <select
                      value={config.header.data.bannerPattern || 'waving'}
                      onChange={(e) => updateSectionData('header', { bannerPattern: e.target.value as BannerPattern })}
                      className="w-full h-8 px-2.5 text-xs bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] rounded outline-none"
                    >
                      <option value="waving">Waving Wave</option>
                      <option value="soft">Soft Curve</option>
                      <option value="slice">Diagonal Slice</option>
                      <option value="rect">Clean Rectangle</option>
                      <option value="cylinder">Cylinder Arc</option>
                    </select>
                  </div>

                  <div className="flex-1">
                    <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                      {isAr ? 'طابع الشارات' : 'Badges Style'}
                    </label>
                    <select
                      value={config.header.data.badgeStyle || 'for-the-badge'}
                      onChange={(e) => updateSectionData('header', { badgeStyle: e.target.value as any })}
                      className="w-full h-8 px-2.5 text-xs bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] rounded outline-none"
                    >
                      <option value="for-the-badge">for-the-badge (Bold SaaS)</option>
                      <option value="flat-square">flat-square (Modern Flat)</option>
                      <option value="plastic">plastic (Embossed)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Core Text Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                  {t.editor.greeting}
                </label>
                <input
                  type="text"
                  value={config.header.data.greeting}
                  onChange={(e) => updateSectionData('header', { greeting: e.target.value })}
                  placeholder={t.editor.greetingPlaceholder}
                  className="w-full h-9 px-3 text-sm bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded focus:ring-1 focus:ring-[var(--accent)] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                  {t.editor.fullName}
                </label>
                <input
                  type="text"
                  value={config.header.data.name}
                  onChange={(e) => updateSectionData('header', { name: e.target.value })}
                  placeholder={profile?.name || profile?.login || 'Linus Torvalds'}
                  className="w-full h-9 px-3 text-sm bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded focus:ring-1 focus:ring-[var(--accent)] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                {t.editor.headline}
              </label>
              <input
                type="text"
                value={config.header.data.headline}
                onChange={(e) => updateSectionData('header', { headline: e.target.value })}
                placeholder={t.editor.headlinePlaceholder}
                className="w-full h-9 px-3 text-sm bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded focus:ring-1 focus:ring-[var(--accent)] outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                  {t.editor.location}
                </label>
                <input
                  type="text"
                  value={config.header.data.location}
                  onChange={(e) => updateSectionData('header', { location: e.target.value })}
                  placeholder="e.g. San Francisco, CA or Remote"
                  className="w-full h-9 px-3 text-sm bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded focus:ring-1 focus:ring-[var(--accent)] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                  {t.editor.status}
                </label>
                <input
                  type="text"
                  value={config.header.data.status}
                  onChange={(e) => updateSectionData('header', { status: e.target.value })}
                  placeholder={t.editor.statusPlaceholder}
                  className="w-full h-9 px-3 text-sm bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded focus:ring-1 focus:ring-[var(--accent)] outline-none"
                />
              </div>
            </div>

            {/* Avatar & Typing SVG Toggles */}
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[var(--text)] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.header.data.showAvatar !== false}
                    onChange={(e) => updateSectionData('header', { showAvatar: e.target.checked })}
                    className="rounded text-[var(--accent)]"
                  />
                  <span>{isAr ? 'عرض صورة البروفايل (Avatar)' : 'Show Profile Avatar in Header'}</span>
                </label>

                {config.header.data.showAvatar !== false && (
                  <div className="flex items-center gap-1.5 text-xs">
                    {(['circle', 'rounded', 'square'] as const).map(shape => (
                      <button
                        key={shape}
                        type="button"
                        onClick={() => updateSectionData('header', { avatarShape: shape })}
                        className={`px-2 py-0.5 text-[11px] rounded border capitalize transition-colors ${
                          (config.header.data.avatarShape || 'circle') === shape
                            ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)] font-semibold'
                            : 'border-[var(--border)] text-[var(--text-muted)]'
                        }`}
                      >
                        {shape}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[var(--text)] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.header.data.showViewsCounter ?? true}
                    onChange={(e) => updateSectionData('header', { showViewsCounter: e.target.checked })}
                    className="rounded text-[var(--accent)]"
                  />
                  <span>{isAr ? 'عداد زيارات البروفايل (Profile Views)' : 'Display Profile Views Counter'}</span>
                </label>

                <input
                  type="text"
                  value={config.header.data.viewsCounterColor || '7c3aed'}
                  onChange={(e) => updateSectionData('header', { viewsCounterColor: e.target.value.replace(/#/g, '') })}
                  placeholder="HEX color"
                  className="w-20 h-7 text-xs font-mono text-center bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] rounded"
                  title="Counter HEX color"
                />
              </div>

              <div className="pt-2 border-t border-[var(--border)] space-y-1.5">
                <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[var(--text)] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.header.data.showTyping !== false}
                    onChange={(e) => updateSectionData('header', { showTyping: e.target.checked })}
                    className="rounded text-[var(--accent)]"
                  />
                  <span>{isAr ? 'كتابة ديناميكية متحركة (Typing Animation SVG)' : 'Animated Typing SVG Header'}</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* --- 2. ABOUT ME SECTION EDITOR --- */}
        {activeSection === 'about' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-medium text-[var(--text)]">
                {t.sections.about}
              </h3>

              <button
                type="button"
                disabled={isGeneratingBio}
                onClick={handleGenerateBios}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--accent)] disabled:opacity-50 transition-all shadow-2xs"
              >
                {isGeneratingBio ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--accent)]" />
                    <span>{isAr ? 'جاري التحليل والصياغة...' : 'Synthesizing with AI...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>{t.editor.suggestBio}</span>
                    {getActiveGeminiKey() && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/25">
                        Gemini
                      </span>
                    )}
                  </>
                )}
              </button>
            </div>

            {bioVariations && (
              <div className="p-3.5 rounded-xl border border-[var(--accent)]/40 bg-[var(--surface)] space-y-2.5 shadow-2xs animate-in fade-in">
                <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[var(--accent)]">{t.editor.suggestBio}</span>
                    <span className="text-[10px] font-mono text-[var(--text-muted)] px-1.5 py-0.5 rounded bg-[var(--surface-2)]">
                      {bioSource === 'gemini'
                        ? (isAr ? '✨ مدعوم بنموذج Gemini 3.8 Flash' : '✨ Powered by Gemini 3.8 Flash')
                        : (isAr ? 'قواعد ذكية مبنية على بياناتك الحقيقية' : 'Tailored synthesis from public repos')}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBioVariations(null)}
                    className="text-[var(--text-subtle)] hover:text-[var(--text)] text-sm px-1"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-2">
                  {bioVariations.map((v) => (
                    <div
                      key={v.tone}
                      className="p-2.5 rounded bg-[var(--surface-2)] text-xs space-y-1.5 border border-transparent hover:border-[var(--border)] transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] font-semibold uppercase text-[var(--accent)]">
                          {v.tone}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleApplyBio(v)}
                          className="px-2 py-0.5 rounded text-[11px] bg-[var(--text)] text-[var(--bg)] font-medium hover:opacity-90"
                        >
                          {t.editor.applyBio}
                        </button>
                      </div>
                      <p className="text-[var(--text)] leading-relaxed">{v.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                {t.editor.summary}
              </label>
              <textarea
                rows={3}
                value={config.about.data.summary}
                onChange={(e) => updateSectionData('about', { summary: e.target.value })}
                className="w-full p-3 text-sm bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded focus:ring-1 focus:ring-[var(--accent)] outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                  {t.editor.currentRole}
                </label>
                <input
                  type="text"
                  value={config.about.data.currentRole}
                  onChange={(e) => updateSectionData('about', { currentRole: e.target.value })}
                  placeholder="e.g. Distributed Systems Engineer"
                  className="w-full h-9 px-3 text-sm bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded focus:ring-1 focus:ring-[var(--accent)] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                  {t.editor.currentWork}
                </label>
                <input
                  type="text"
                  value={config.about.data.currentWork}
                  onChange={(e) => updateSectionData('about', { currentWork: e.target.value })}
                  placeholder="e.g. High-throughput indexing engines"
                  className="w-full h-9 px-3 text-sm bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded focus:ring-1 focus:ring-[var(--accent)] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                  {t.editor.currentLearning}
                </label>
                <input
                  type="text"
                  value={config.about.data.currentLearning}
                  onChange={(e) => updateSectionData('about', { currentLearning: e.target.value })}
                  placeholder="e.g. Rust, WebGPU, eBPF"
                  className="w-full h-9 px-3 text-sm bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded focus:ring-1 focus:ring-[var(--accent)] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                  {t.editor.askMeAbout}
                </label>
                <input
                  type="text"
                  value={config.about.data.askMeAbout}
                  onChange={(e) => updateSectionData('about', { askMeAbout: e.target.value })}
                  placeholder="e.g. TypeScript, System Architecture, Go"
                  className="w-full h-9 px-3 text-sm bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded focus:ring-1 focus:ring-[var(--accent)] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                  {t.editor.howToReach}
                </label>
                <input
                  type="text"
                  value={config.about.data.howToReach}
                  onChange={(e) => updateSectionData('about', { howToReach: e.target.value })}
                  placeholder="e.g. dev@domain.com or Twitter DM"
                  className="w-full h-9 px-3 text-sm bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded focus:ring-1 focus:ring-[var(--accent)] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                  {t.editor.funFact}
                </label>
                <input
                  type="text"
                  value={config.about.data.funFact}
                  onChange={(e) => updateSectionData('about', { funFact: e.target.value })}
                  placeholder="e.g. I brew espresso with precise flow-profiling"
                  className="w-full h-9 px-3 text-sm bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded focus:ring-1 focus:ring-[var(--accent)] outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* --- 3. POWERFUL GPRM-STYLE TECH STACK EXPLORER --- */}
        {activeSection === 'techStack' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-serif text-lg font-bold text-[var(--text)]">
                  {t.sections.techStack}
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  {isAr
                    ? 'اختر تقنياتك بضغطة واحدة من بين أكثر من 100+ تقنية وأداة في مختلف المجالات.'
                    : 'Choose your tech stack by clicking from 100+ technologies across all engineering disciplines.'}
                </p>
              </div>

              <div className="flex items-center gap-1.5 self-start sm:self-auto px-2.5 py-1 rounded-full border border-[var(--accent)]/30 bg-[var(--accent-soft)] text-xs font-bold text-[var(--accent)]">
                <Code2 className="w-3.5 h-3.5" />
                <span>{activeTechCount} {isAr ? 'تقنية مفعّلة' : 'Active Techs'}</span>
              </div>
            </div>

            {/* Rigorous Evidence Banner */}
            <div className="p-3 rounded-xl border border-emerald-500/25 bg-emerald-500/5 text-xs text-[var(--text-muted)] flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-semibold text-[var(--text)]">
                  {isAr ? 'تحليل رقمي دقيق مبني على 100% من مستودعاتك:' : '100% Percentage-Backed Repository Analysis:'}
                </span>{' '}
                {isAr
                  ? `تم تحليل ${repos.length} مستودعاً بالكامل بالبايت. اللغات التي تظهر هي فقط التي تمتلك مشاريع أساسية أو حصة كود مؤثرة. يتم استبعاد ملفات القوالب التلقائية (مثل Swift في مجلدات iOS بنسبة 0.1%) لضمان الدقة وتجنب أي بيانات غير حقيقية.`
                  : `Analyzed across all ${repos.length} public repositories down to exact byte counts. Auto-enabled technologies are strictly backed by primary code or explicit topic tags. Template scaffolding (e.g. Swift in iOS subfolders < 0.2%) is strictly filtered out.`}
              </div>
            </div>

            {/* Display Style & Badge Style Controls */}
            <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase text-[var(--text-muted)] mb-1">
                  {t.editor.techStyle}
                </label>
                <div className="inline-flex rounded border border-[var(--border)] bg-[var(--surface-2)] p-0.5 text-xs">
                  {[
                    { id: 'grouped-cards', name: isAr ? 'مقسم بالتصنيفات' : 'Grouped Badges' },
                    { id: 'badges', name: isAr ? 'سحابة شارات' : 'Badges Cloud' },
                    { id: 'minimal-table', name: isAr ? 'جدول أنيق' : 'Table' },
                    { id: 'text-list', name: isAr ? 'قائمة نصية' : 'Text List' },
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => updateSectionData('techStack', { style: st.id as any })}
                      className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                        config.techStack.data.style === st.id
                          ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs font-bold'
                          : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                      }`}
                    >
                      {st.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-[var(--text-muted)] mb-1">
                  {isAr ? 'تصميم الشارة (Badge Style)' : 'Badge Style'}
                </label>
                <select
                  value={config.techStack.data.badgeStyle || 'for-the-badge'}
                  onChange={(e) => updateSectionData('techStack', { badgeStyle: e.target.value as any })}
                  className="h-7 px-2 text-xs bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] rounded outline-none"
                >
                  <option value="for-the-badge">for-the-badge (Bold SaaS)</option>
                  <option value="flat-square">flat-square (Modern Flat)</option>
                  <option value="plastic">plastic (Embossed)</option>
                </select>
              </div>
            </div>

            {/* Instant Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-[var(--text-muted)] absolute start-3 top-3 pointer-events-none" />
              <input
                type="text"
                value={techSearchQuery}
                onChange={(e) => setTechSearchQuery(e.target.value)}
                placeholder={isAr ? 'ابحث في أكثر من 100+ تقنية (مثل: React, Docker, Python, PyTorch)...' : 'Search 100+ technologies (e.g. React, Docker, Python, PyTorch)...'}
                className="w-full h-10 ps-9 pe-9 text-xs sm:text-sm bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-[var(--accent)] outline-none transition-all"
              />
              {techSearchQuery && (
                <button
                  type="button"
                  onClick={() => setTechSearchQuery('')}
                  className="absolute end-3 top-3 text-[var(--text-muted)] hover:text-[var(--text)]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
              {techCategoriesList.map((cat) => {
                const isSelected = selectedTechCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedTechCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition-all border ${
                      isSelected
                        ? 'border-[var(--accent)] bg-[var(--accent)] text-white shadow-xs'
                        : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--border-strong)]'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Interactive Grid of Tech Badges (Click to toggle!) */}
            <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] max-h-96 overflow-y-auto space-y-3">
              {filteredCatalog.length === 0 ? (
                <div className="py-8 text-center text-xs text-[var(--text-muted)]">
                  {isAr ? 'لم يتم العثور على تقنية مطابقة. يمكنك إضافتها يدوياً بالأسفل.' : 'No matching technologies found. You can add it manually below.'}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {filteredCatalog.map((tech) => {
                    const active = isTechEnabled(tech.id);
                    const matchingConfigItem = config.techStack.data.items.find(i => i.id === tech.id);
                    const pct = matchingConfigItem?.percentage;
                    return (
                      <button
                        key={tech.id}
                        type="button"
                        onClick={() => handleToggleCatalogTech(tech)}
                        title={active ? 'Click to remove' : 'Click to add'}
                        className={`group px-3 py-1.5 rounded-xl border text-xs font-mono font-medium flex items-center gap-2 transition-all transform active:scale-95 ${
                          active
                            ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--text)] shadow-xs ring-1 ring-[var(--accent)]/40 font-bold'
                            : 'border-[var(--border)] bg-[var(--surface-2)]/50 text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--border-strong)]'
                        }`}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: `#${tech.color}` }}
                        />
                        <span>{tech.name}</span>
                        {pct !== undefined && pct > 0 && (
                          <span className="text-[10px] font-mono px-1 rounded bg-[var(--surface)] text-[var(--accent)] font-semibold border border-[var(--border)]">
                            {pct}%
                          </span>
                        )}
                        {active ? (
                          <Check className="w-3.5 h-3.5 text-[var(--accent)]" />
                        ) : (
                          <Plus className="w-3 h-3 text-[var(--text-subtle)] group-hover:text-[var(--text)]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Add Custom Tech Input Form */}
            <form onSubmit={handleAddCustomTech} className="flex gap-2 items-center pt-1">
              <input
                type="text"
                value={customTechName}
                onChange={(e) => setCustomTechName(e.target.value)}
                placeholder={isAr ? 'إضافة تقنية مخصصة يدوياً...' : 'Add any custom tech manually...'}
                className="flex-1 h-9 px-3 text-xs sm:text-sm bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded-xl focus:ring-1 focus:ring-[var(--accent)] outline-none"
              />
              <select
                value={customTechCategory}
                onChange={(e) => setCustomTechCategory(e.target.value as any)}
                aria-label={t.editor.techCategory}
                className="h-9 px-2 text-xs bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded-xl outline-none"
              >
                <option value="languages">Languages</option>
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="mobile">Mobile</option>
                <option value="database">Database</option>
                <option value="devops">DevOps</option>
                <option value="ml_ai">AI / ML</option>
                <option value="testing">Testing</option>
                <option value="design">Design</option>
                <option value="tools">Tools</option>
              </select>
              <button
                type="submit"
                className="h-9 px-3.5 text-xs rounded-xl bg-[var(--text)] text-[var(--bg)] font-medium flex items-center gap-1 hover:opacity-90"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.common.apply}</span>
              </button>
            </form>
          </div>
        )}

        {/* --- 4. FEATURED PROJECTS SECTION EDITOR (WITH FULL REPOSITORY EXPLORER) --- */}
        {activeSection === 'projects' && (
          <div className="space-y-5">
            {/* Header & Overview */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-serif text-lg font-bold text-[var(--text)]">
                  {t.sections.projects}
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  {t.editor.projectsNotice}
                </p>
              </div>

              <div className="flex items-center gap-1.5 self-start sm:self-auto px-2.5 py-1 rounded-full border border-[var(--accent)]/30 bg-[var(--accent-soft)] text-xs font-bold text-[var(--accent)]">
                <FolderGit2 className="w-3.5 h-3.5" />
                <span>
                  {config.projects.data.projects.length} {isAr ? 'مشاريع محددة' : 'Featured'}
                  {repos.length > 0 && ` / ${repos.length} ${isAr ? 'مستودع متاح' : 'Available'}`}
                </span>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] me-1">
                {isAr ? 'إجراءات سريعة:' : 'Quick Select:'}
              </span>

              <button
                type="button"
                onClick={() => handleSelectTopStarred(4)}
                className="px-2.5 py-1 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--accent)] text-xs font-medium text-[var(--text)] flex items-center gap-1 transition-colors"
                title={isAr ? 'تحديد أعلى 4 مستودعات تقييماً بالنجوم' : 'Select Top 4 by Star Count'}
              >
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span>{t.editor.topStarredAction}</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectTopRecent(6)}
                className="px-2.5 py-1 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--accent)] text-xs font-medium text-[var(--text)] flex items-center gap-1 transition-colors"
                title={isAr ? 'تحديد أحدث 6 مشاريع تم التعديل عليها' : 'Select Top 6 Recently Pushed'}
              >
                <Sparkles className="w-3 h-3 text-[var(--accent)]" />
                <span>{t.editor.recentActiveAction}</span>
              </button>

              <button
                type="button"
                onClick={handleAddProject}
                className="px-2.5 py-1 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--border-strong)] text-xs font-medium text-[var(--text)] flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>{t.editor.addCustomProject}</span>
              </button>

              {config.projects.data.projects.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAllProjects}
                  className="px-2 py-1 rounded-lg text-xs font-medium text-red-500 hover:bg-red-500/10 ms-auto transition-colors"
                >
                  {t.editor.clearSelectionAction}
                </button>
              )}
            </div>

            {/* --- REPOSITORY EXPLORER / BROWSER ACCORDION --- */}
            {repos.length > 0 && (
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-xs">
                {/* Accordion Toggle Header */}
                <button
                  type="button"
                  onClick={() => setIsRepoPickerExpanded(prev => !prev)}
                  className="w-full p-3.5 flex items-center justify-between bg-[var(--surface-2)]/60 hover:bg-[var(--surface-2)] transition-colors text-start"
                >
                  <div className="flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-[var(--accent)]" />
                    <div>
                      <div className="text-xs font-bold text-[var(--text)] flex items-center gap-2">
                        <span>{t.editor.selectFromRepos}</span>
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-[var(--accent)]/15 text-[var(--accent)] font-mono">
                          {filteredRepos.length}
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                        {isAr
                          ? 'اضغط على أي مستودع لإضافته أو إزالته فوراً من القائمة'
                          : 'Click any repository card to toggle it in or out of your README'}
                      </p>
                    </div>
                  </div>

                  <div className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text)]">
                    {isRepoPickerExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isRepoPickerExpanded && (
                  <div className="p-3.5 space-y-3 border-t border-[var(--border)]">
                    {/* Search & Sort Controls */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="relative flex-1">
                        <Search className="w-3.5 h-3.5 absolute top-2.5 start-2.5 text-[var(--text-muted)]" />
                        <input
                          type="text"
                          value={repoSearchQuery}
                          onChange={(e) => setRepoSearchQuery(e.target.value)}
                          placeholder={t.editor.searchReposPlaceholder}
                          className="w-full h-8 ps-8 pe-7 text-xs bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] rounded-lg focus:ring-1 focus:ring-[var(--accent)] outline-none"
                        />
                        {repoSearchQuery && (
                          <button
                            type="button"
                            onClick={() => setRepoSearchQuery('')}
                            className="absolute top-2 end-2 text-[var(--text-muted)] hover:text-[var(--text)]"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <select
                        value={repoSortBy}
                        onChange={(e) => setRepoSortBy(e.target.value as any)}
                        aria-label="Sort repositories"
                        className="h-8 px-2.5 text-xs bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] rounded-lg outline-none cursor-pointer"
                      >
                        <option value="stars">⭐ {isAr ? 'الأعلى نجوماً' : 'Most Stars'}</option>
                        <option value="updated">🕒 {isAr ? 'الأحدث نشاطاً' : 'Recently Updated'}</option>
                        <option value="name">🔤 {isAr ? 'أبجدياً (A-Z)' : 'Name (A-Z)'}</option>
                      </select>
                    </div>

                    {/* Language Filter Chips */}
                    {repoLanguagesList.length > 2 && (
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                        {repoLanguagesList.map(item => (
                          <button
                            key={item.lang}
                            type="button"
                            onClick={() => setRepoLanguageFilter(item.lang)}
                            className={`px-2 py-0.5 rounded-full text-[11px] whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                              repoLanguageFilter === item.lang
                                ? 'bg-[var(--accent)] text-white font-bold shadow-xs'
                                : 'bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)] border border-[var(--border)]'
                            }`}
                          >
                            {item.lang !== 'all' && (
                              <span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: languageColor(item.lang) }}
                              />
                            )}
                            <span>{item.lang === 'all' ? t.editor.allRepos : item.lang}</span>
                            <span className="opacity-70 text-[10px]">({item.count})</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Repository Grid / Cards */}
                    <div className="max-h-72 overflow-y-auto space-y-2 pe-1">
                      {filteredRepos.length === 0 ? (
                        <div className="py-6 text-center text-xs text-[var(--text-muted)]">
                          {t.editor.noReposFound}
                        </div>
                      ) : (
                        filteredRepos.map(repo => {
                          const featured = isRepoFeatured(repo);
                          const langCol = languageColor(repo.language);
                          return (
                            <div
                              key={repo.id}
                              onClick={() => handleToggleRepo(repo)}
                              className={`p-2.5 rounded-xl border text-start cursor-pointer transition-all flex items-center justify-between gap-3 ${
                                featured
                                  ? 'border-emerald-500/50 bg-emerald-500/10 shadow-xs'
                                  : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] hover:bg-[var(--surface-2)]/50'
                              }`}
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs font-bold text-[var(--text)] truncate">
                                    {repo.name}
                                  </span>
                                  {repo.fork && (
                                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-500 font-mono">
                                      fork
                                    </span>
                                  )}
                                  <a
                                    href={repo.html_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-[var(--text-muted)] hover:text-[var(--text)]"
                                    title="View on GitHub"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </div>

                                {repo.description && (
                                  <p className="text-[11px] text-[var(--text-muted)] line-clamp-1 mt-0.5">
                                    {repo.description}
                                  </p>
                                )}

                                <div className="flex items-center gap-3 mt-1.5 text-[10px] font-mono text-[var(--text-muted)]">
                                  {repo.language && (
                                    <span className="flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: langCol }} />
                                      <span>{repo.language}</span>
                                    </span>
                                  )}
                                  <span className="flex items-center gap-0.5 text-amber-500">
                                    <Star className="w-2.5 h-2.5 fill-amber-500" />
                                    <span>{repo.stargazers_count}</span>
                                  </span>
                                  <span className="flex items-center gap-0.5">
                                    <GitFork className="w-2.5 h-2.5" />
                                    <span>{repo.forks_count}</span>
                                  </span>
                                </div>
                              </div>

                              <div className="shrink-0">
                                {featured ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-500 text-white shadow-xs">
                                    <Check className="w-3 h-3" />
                                    <span>{t.editor.inFeatured}</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors">
                                    <Plus className="w-3 h-3" />
                                    <span>{t.editor.addToFeatured}</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* --- DISPLAY SETTINGS & SELECTED PROJECTS --- */}
            <div className="pt-2 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h4 className="text-xs font-bold text-[var(--text)] uppercase tracking-wider">
                  {t.editor.featuredCount} ({config.projects.data.projects.length})
                </h4>

                <div className="flex items-center gap-4 text-xs text-[var(--text-muted)] flex-wrap">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.projects.data.showStars}
                      onChange={(e) =>
                        updateSectionData('projects', { showStars: e.target.checked })
                      }
                      className="rounded text-[var(--accent)] focus:ring-[var(--accent)]"
                    />
                    <span>{t.editor.showStars}</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.projects.data.showForks}
                      onChange={(e) =>
                        updateSectionData('projects', { showForks: e.target.checked })
                      }
                      className="rounded text-[var(--accent)] focus:ring-[var(--accent)]"
                    />
                    <span>{t.editor.showForks}</span>
                  </label>

                  <div className="flex items-center gap-1 ms-auto">
                    <span className="text-[11px] text-[var(--text-muted)]">{locale === 'ar' ? 'العرض:' : 'Layout:'}</span>
                    {(['table', 'cards', 'list'] as const).map(lay => (
                      <button
                        key={lay}
                        type="button"
                        onClick={() => updateSectionData('projects', { layout: lay })}
                        className={`px-2 py-0.5 rounded border text-[10px] font-mono uppercase transition-colors ${
                          config.projects.data.layout === lay
                            ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)] font-bold'
                            : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)]'
                        }`}
                      >
                        {lay}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Selected Projects List with Reordering */}
              {config.projects.data.projects.length === 0 ? (
                <div className="p-6 rounded-xl border border-dashed border-[var(--border)] text-center text-xs text-[var(--text-muted)]">
                  {isAr
                    ? 'لم يتم تحديد أي مشاريع حتى الآن. استخدم متصفح المستودعات أعلاه لإضافة مشاريعك المميزة.'
                    : 'No projects selected yet. Use the repository explorer above to pick your featured repositories.'}
                </div>
              ) : (
                <div className="space-y-3">
                  {config.projects.data.projects.map((proj, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-2.5 transition-colors shadow-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1">
                          <span className="w-5 h-5 rounded-full bg-[var(--surface-2)] text-[10px] font-mono font-bold text-[var(--text-muted)] flex items-center justify-center shrink-0">
                            #{idx + 1}
                          </span>
                          <input
                            type="text"
                            value={proj.name}
                            onChange={(e) => handleUpdateProject(idx, 'name', e.target.value)}
                            placeholder={t.editor.projectName}
                            className="font-mono text-xs font-bold bg-transparent text-[var(--text)] border-b border-transparent hover:border-[var(--border)] focus:border-[var(--accent)] outline-none flex-1"
                          />
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveProject(idx, 'up')}
                            className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text)] disabled:opacity-20 transition-colors"
                            title={t.editor.reorderUp}
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === config.projects.data.projects.length - 1}
                            onClick={() => handleMoveProject(idx, 'down')}
                            className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text)] disabled:opacity-20 transition-colors"
                            title={t.editor.reorderDown}
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <a
                            href={proj.url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1 text-[var(--text-muted)] hover:text-[var(--text)]"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button
                            type="button"
                            onClick={() => handleRemoveProject(idx)}
                            className="p-1 text-[var(--text-subtle)] hover:text-red-500 transition-colors"
                            title={t.editor.removeProject}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <input
                        type="text"
                        value={proj.description}
                        onChange={(e) => handleUpdateProject(idx, 'description', e.target.value)}
                        placeholder={t.editor.projectDesc}
                        className="w-full text-xs text-[var(--text-muted)] bg-transparent border-b border-transparent hover:border-[var(--border)] focus:border-[var(--accent)] outline-none"
                      />

                      <div className="flex items-center gap-4 text-xs font-mono text-[var(--text-muted)]">
                        <input
                          type="text"
                          value={proj.language}
                          onChange={(e) => handleUpdateProject(idx, 'language', e.target.value)}
                          placeholder="Language"
                          className="w-24 bg-transparent border-b border-transparent hover:border-[var(--border)] outline-none"
                        />
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-500" />
                          <input
                            type="number"
                            value={proj.stars}
                            onChange={(e) =>
                              handleUpdateProject(idx, 'stars', parseInt(e.target.value) || 0)
                            }
                            className="w-16 bg-transparent border-b border-transparent hover:border-[var(--border)] outline-none"
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <GitFork className="w-3 h-3 text-[var(--text-muted)]" />
                          <input
                            type="number"
                            value={proj.forks}
                            onChange={(e) =>
                              handleUpdateProject(idx, 'forks', parseInt(e.target.value) || 0)
                            }
                            className="w-16 bg-transparent border-b border-transparent hover:border-[var(--border)] outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- 5. GITHUB STATS SECTION EDITOR --- */}
        {activeSection === 'stats' && (
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-medium text-[var(--text)]">
              {t.sections.stats}
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              {t.editor.statsNotice}
            </p>

            <div className="space-y-2.5 pt-2">
              <label className="flex items-center gap-2 text-sm text-[var(--text)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.stats.data.showStatsCard}
                  onChange={(e) =>
                    updateSectionData('stats', { showStatsCard: e.target.checked })
                  }
                  className="rounded text-[var(--accent)] focus:ring-[var(--accent)]"
                />
                <span>{t.editor.showStatsCard}</span>
              </label>

              <label className="flex items-center gap-2 text-sm text-[var(--text)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.stats.data.showStreakCard}
                  onChange={(e) =>
                    updateSectionData('stats', { showStreakCard: e.target.checked })
                  }
                  className="rounded text-[var(--accent)] focus:ring-[var(--accent)]"
                />
                <span>{t.editor.showStreakCard}</span>
              </label>

              <label className="flex items-center gap-2 text-sm text-[var(--text)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.stats.data.showTopLanguagesCard}
                  onChange={(e) =>
                    updateSectionData('stats', { showTopLanguagesCard: e.target.checked })
                  }
                  className="rounded text-[var(--accent)] focus:ring-[var(--accent)]"
                />
                <span>{t.editor.showTopLanguagesCard}</span>
              </label>

              <label className="flex items-center gap-2 text-sm text-[var(--text)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.stats.data.showActivityGraph}
                  onChange={(e) =>
                    updateSectionData('stats', { showActivityGraph: e.target.checked })
                  }
                  className="rounded text-[var(--accent)] focus:ring-[var(--accent)]"
                />
                <span>{locale === 'ar' ? 'رسم بياني لنشاط المساهمات (Activity Graph)' : 'Activity Graph'}</span>
              </label>

              <label className="flex items-center gap-2 text-sm text-[var(--text)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.stats.data.showTrophies}
                  onChange={(e) =>
                    updateSectionData('stats', { showTrophies: e.target.checked })
                  }
                  className="rounded text-[var(--accent)] focus:ring-[var(--accent)]"
                />
                <span>{locale === 'ar' ? 'كؤوس وشارات GitHub (Trophies)' : 'GitHub Trophies'}</span>
              </label>

              <label className="flex items-center gap-2 text-sm text-[var(--text)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.stats.data.showProfileViews}
                  onChange={(e) =>
                    updateSectionData('stats', { showProfileViews: e.target.checked })
                  }
                  className="rounded text-[var(--accent)] focus:ring-[var(--accent)]"
                />
                <span>{locale === 'ar' ? 'عداد زيارات الحساب (Profile Views Counter)' : 'Profile Views Counter'}</span>
              </label>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">
                {t.editor.statsTheme}
              </label>
              <select
                value={config.stats.data.statsTheme}
                onChange={(e) => updateSectionData('stats', { statsTheme: e.target.value as any })}
                className="h-9 px-3 text-sm bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded outline-none w-full sm:w-60"
              >
                <option value="default">{t.editor.statsThemeDefault}</option>
                <option value="github_dark">{t.editor.statsThemeDark}</option>
                <option value="minimal">{t.editor.statsThemeMinimal}</option>
                <option value="tokyonight">{t.editor.statsThemeTokyo}</option>
              </select>
            </div>
          </div>
        )}

        {/* --- 5.5. ANALYTICS SECTION EDITOR --- */}
        {activeSection === 'analytics' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-serif text-lg font-medium text-[var(--text)]">
                {locale === 'ar' ? 'التحليلات الاحترافية في الـ README' : 'Deep Analytics in README'}
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                {locale === 'ar'
                  ? 'اختر الجداول والرسومات البيانية والمصفوفات التي تريد تضمينها في ملف الـ README.'
                  : 'Select metrics, charts, and matrices to embed directly into your generated profile README.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <label className="flex items-center gap-2 text-xs sm:text-sm text-[var(--text)] p-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.analytics.data.showSnapshot}
                  onChange={(e) => updateSectionData('analytics', { showSnapshot: e.target.checked })}
                  className="rounded text-[var(--accent)]"
                />
                <span>{locale === 'ar' ? '⚡ جدول النظرة السريعة (Snapshot)' : '⚡ Quick Snapshot Table'}</span>
              </label>

              <label className="flex items-center gap-2 text-xs sm:text-sm text-[var(--text)] p-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.analytics.data.showLanguages}
                  onChange={(e) => updateSectionData('analytics', { showLanguages: e.target.checked })}
                  className="rounded text-[var(--accent)]"
                />
                <span>{locale === 'ar' ? '🧬 شريط الحمض النووي للغات' : '🧬 Language DNA Bars'}</span>
              </label>

              <label className="flex items-center gap-2 text-xs sm:text-sm text-[var(--text)] p-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.analytics.data.showLanguagePie}
                  onChange={(e) => updateSectionData('analytics', { showLanguagePie: e.target.checked })}
                  className="rounded text-[var(--accent)]"
                />
                <span>{locale === 'ar' ? '🥧 رسم دائري للغات (Mermaid Pie)' : '🥧 Mermaid Language Pie'}</span>
              </label>

              <label className="flex items-center gap-2 text-xs sm:text-sm text-[var(--text)] p-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.analytics.data.showRhythm}
                  onChange={(e) => updateSectionData('analytics', { showRhythm: e.target.checked })}
                  className="rounded text-[var(--accent)]"
                />
                <span>{locale === 'ar' ? '🕰️ إيقاع النشاط وأوقات البرمجة' : '🕰️ Coding Rhythm & Chronotype'}</span>
              </label>

              <label className="flex items-center gap-2 text-xs sm:text-sm text-[var(--text)] p-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.analytics.data.showScores}
                  onChange={(e) => updateSectionData('analytics', { showScores: e.target.checked })}
                  className="rounded text-[var(--accent)]"
                />
                <span>{locale === 'ar' ? '🏆 مصفوفة التقييم وشارة الهوية' : '🏆 Engineering Scorecard'}</span>
              </label>

              <label className="flex items-center gap-2 text-xs sm:text-sm text-[var(--text)] p-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.analytics.data.showContributions}
                  onChange={(e) => updateSectionData('analytics', { showContributions: e.target.checked })}
                  className="rounded text-[var(--accent)]"
                />
                <span>{locale === 'ar' ? '🔥 تفاصيل المساهمات والتتابع' : '🔥 Contributions & Streaks'}</span>
              </label>

              <label className="flex items-center gap-2 text-xs sm:text-sm text-[var(--text)] p-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.analytics.data.showTimeline}
                  onChange={(e) => updateSectionData('analytics', { showTimeline: e.target.checked })}
                  className="rounded text-[var(--accent)]"
                />
                <span>{locale === 'ar' ? '📅 خط المشاريع عبر السنين' : '📅 Repositories by Year'}</span>
              </label>

              <label className="flex items-center gap-2 text-xs sm:text-sm text-[var(--text)] p-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.analytics.data.showTopics}
                  onChange={(e) => updateSectionData('analytics', { showTopics: e.target.checked })}
                  className="rounded text-[var(--accent)]"
                />
                <span>{locale === 'ar' ? '🏷️ سحابة مواضيع الاهتمام (Topics)' : '🏷️ Topics & Focus Areas'}</span>
              </label>

              <label className="flex items-center gap-2 text-xs sm:text-sm text-[var(--text)] p-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.analytics.data.showInsights}
                  onChange={(e) => updateSectionData('analytics', { showInsights: e.target.checked })}
                  className="rounded text-[var(--accent)]"
                />
                <span>{locale === 'ar' ? '💡 الاستنتاجات الذكية' : '💡 Algorithmic Insights'}</span>
              </label>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                {locale === 'ar' ? 'عدد اللغات المعروضة:' : 'Language limit:'} {config.analytics.data.languageLimit}
              </label>
              <input
                type="range"
                min={3}
                max={15}
                value={config.analytics.data.languageLimit}
                onChange={(e) => updateSectionData('analytics', { languageLimit: parseInt(e.target.value) || 8 })}
                className="w-full sm:w-64 accent-[var(--accent)]"
              />
            </div>
          </div>
        )}

        {/* --- 5B. EXPERIENCE SECTION EDITOR --- */}
        {activeSection === 'experience' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[var(--border)]">
              <div>
                <h3 className="font-serif text-lg font-medium text-[var(--text)] flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-sky-500" />
                  <span>{(t.editor as any).experienceTitle || 'Work Experience'}</span>
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  {(t.editor as any).experienceNotice || 'Highlight relevant engineering roles, internships, and technical impact.'}
                </p>
              </div>

              {onOpenResumeModal && (
                <button
                  type="button"
                  onClick={onOpenResumeModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--accent)]/30 bg-[var(--accent-soft)] text-[var(--accent)] hover:bg-[var(--accent)]/15 text-xs font-semibold transition-all shrink-0 self-start sm:self-auto"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{(t.editor as any).importFromResume || 'Import from Resume / CV'}</span>
                </button>
              )}
            </div>

            {/* Experience Items List */}
            <div className="space-y-4">
              {(config.experience?.data?.items || []).map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/50 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold text-[var(--accent)]">
                      #{idx + 1} {item.role || 'Role'} {item.company ? `@ ${item.company}` : ''}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const nextItems = (config.experience?.data?.items || []).filter((_, i) => i !== idx);
                        onChangeConfig({
                          ...config,
                          experience: {
                            enabled: config.experience?.enabled ?? true,
                            data: {
                              style: config.experience?.data?.style || 'timeline',
                              items: nextItems,
                            },
                          },
                        });
                      }}
                      className="p-1 rounded text-[var(--text-subtle)] hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      title={t.common.delete}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-[var(--text-muted)] mb-1">
                        {(t.editor as any).expRole || 'Role / Job Title'}
                      </label>
                      <input
                        type="text"
                        value={item.role}
                        onChange={(e) => {
                          const nextItems = [...(config.experience?.data?.items || [])];
                          nextItems[idx] = { ...nextItems[idx], role: e.target.value };
                          onChangeConfig({
                            ...config,
                            experience: {
                              enabled: config.experience?.enabled ?? true,
                              data: { style: config.experience?.data?.style || 'timeline', items: nextItems },
                            },
                          });
                        }}
                        placeholder="e.g. Machine Learning Engineer"
                        className="w-full h-8 px-2.5 text-xs bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded outline-none focus:border-[var(--accent)]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-[var(--text-muted)] mb-1">
                        {(t.editor as any).expCompany || 'Company / Organization'}
                      </label>
                      <input
                        type="text"
                        value={item.company}
                        onChange={(e) => {
                          const nextItems = [...(config.experience?.data?.items || [])];
                          nextItems[idx] = { ...nextItems[idx], company: e.target.value };
                          onChangeConfig({
                            ...config,
                            experience: {
                              enabled: config.experience?.enabled ?? true,
                              data: { style: config.experience?.data?.style || 'timeline', items: nextItems },
                            },
                          });
                        }}
                        placeholder="e.g. ITI / Siemens / Independent"
                        className="w-full h-8 px-2.5 text-xs bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded outline-none focus:border-[var(--accent)]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-[var(--text-muted)] mb-1">
                        {(t.editor as any).expPeriod || 'Period'}
                      </label>
                      <input
                        type="text"
                        value={item.period}
                        onChange={(e) => {
                          const nextItems = [...(config.experience?.data?.items || [])];
                          nextItems[idx] = { ...nextItems[idx], period: e.target.value };
                          onChangeConfig({
                            ...config,
                            experience: {
                              enabled: config.experience?.enabled ?? true,
                              data: { style: config.experience?.data?.style || 'timeline', items: nextItems },
                            },
                          });
                        }}
                        placeholder="e.g. 2023 - Present"
                        className="w-full h-8 px-2.5 text-xs bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded outline-none focus:border-[var(--accent)]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-[var(--text-muted)] mb-1">
                        {(t.editor as any).expLocation || 'Location'}
                      </label>
                      <input
                        type="text"
                        value={item.location || ''}
                        onChange={(e) => {
                          const nextItems = [...(config.experience?.data?.items || [])];
                          nextItems[idx] = { ...nextItems[idx], location: e.target.value };
                          onChangeConfig({
                            ...config,
                            experience: {
                              enabled: config.experience?.enabled ?? true,
                              data: { style: config.experience?.data?.style || 'timeline', items: nextItems },
                            },
                          });
                        }}
                        placeholder="e.g. Cairo, Egypt (or Remote)"
                        className="w-full h-8 px-2.5 text-xs bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded outline-none focus:border-[var(--accent)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[var(--text-muted)] mb-1">
                      {(t.editor as any).expHighlights || 'Key Highlights / Achievements (one per line)'}
                    </label>
                    <textarea
                      rows={3}
                      value={(item.highlights || []).join('\n')}
                      onChange={(e) => {
                        const lines = e.target.value.split('\n').filter(l => l.trim().length > 0);
                        const nextItems = [...(config.experience?.data?.items || [])];
                        nextItems[idx] = { ...nextItems[idx], highlights: lines };
                        onChangeConfig({
                          ...config,
                          experience: {
                            enabled: config.experience?.enabled ?? true,
                            data: { style: config.experience?.data?.style || 'timeline', items: nextItems },
                          },
                        });
                      }}
                      placeholder="• Built end-to-end model pipeline..."
                      className="w-full p-2 text-xs bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded outline-none focus:border-[var(--accent)] font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[var(--text-muted)] mb-1">
                      {(t.editor as any).expTech || 'Technologies Used (comma separated)'}
                    </label>
                    <input
                      type="text"
                      value={(item.technologies || []).join(', ')}
                      onChange={(e) => {
                        const tags = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                        const nextItems = [...(config.experience?.data?.items || [])];
                        nextItems[idx] = { ...nextItems[idx], technologies: tags };
                        onChangeConfig({
                          ...config,
                          experience: {
                            enabled: config.experience?.enabled ?? true,
                            data: { style: config.experience?.data?.style || 'timeline', items: nextItems },
                          },
                        });
                      }}
                      placeholder="Python, PyTorch, Docker, ROS2"
                      className="w-full h-8 px-2.5 text-xs bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded outline-none focus:border-[var(--accent)] font-mono"
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  const currentItems = config.experience?.data?.items || [];
                  const newItem: ExperienceItem = {
                    id: `exp-${currentItems.length + 1}`,
                    role: isAr ? 'مهندس برمجيات' : 'Software Engineer',
                    company: isAr ? 'شركة تقنية' : 'Tech Company',
                    period: isAr ? '2023 - حتى الآن' : '2023 - Present',
                    location: '',
                    highlights: [],
                    technologies: [],
                  };
                  onChangeConfig({
                    ...config,
                    experience: {
                      enabled: true,
                      data: {
                        style: config.experience?.data?.style || 'timeline',
                        items: [...currentItems, newItem],
                      },
                    },
                  });
                }}
                className="w-full py-2.5 rounded-xl border border-dashed border-[var(--border)] hover:border-[var(--accent)] text-xs text-[var(--text-muted)] hover:text-[var(--text)] flex items-center justify-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{(t.editor as any).addExperience || 'Add Experience'}</span>
              </button>
            </div>
          </div>
        )}

        {/* --- 5C. EDUCATION SECTION EDITOR --- */}
        {activeSection === 'education' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[var(--border)]">
              <div>
                <h3 className="font-serif text-lg font-medium text-[var(--text)] flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-indigo-500" />
                  <span>{(t.editor as any).educationTitle || 'Education & Academic Background'}</span>
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  {(t.editor as any).educationNotice || 'Add academic degrees, universities, and graduation honors.'}
                </p>
              </div>

              {onOpenResumeModal && (
                <button
                  type="button"
                  onClick={onOpenResumeModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--accent)]/30 bg-[var(--accent-soft)] text-[var(--accent)] hover:bg-[var(--accent)]/15 text-xs font-semibold transition-all shrink-0 self-start sm:self-auto"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{(t.editor as any).importFromResume || 'Import from Resume / CV'}</span>
                </button>
              )}
            </div>

            {/* Education Items List */}
            <div className="space-y-4">
              {(config.education?.data?.items || []).map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/50 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold text-[var(--accent)]">
                      #{idx + 1} {item.degree || 'Degree'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const nextItems = (config.education?.data?.items || []).filter((_, i) => i !== idx);
                        onChangeConfig({
                          ...config,
                          education: {
                            enabled: config.education?.enabled ?? true,
                            data: { items: nextItems },
                          },
                        });
                      }}
                      className="p-1 rounded text-[var(--text-subtle)] hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      title={t.common.delete}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-[var(--text-muted)] mb-1">
                        {(t.editor as any).eduDegree || 'Degree Title'}
                      </label>
                      <input
                        type="text"
                        value={item.degree}
                        onChange={(e) => {
                          const nextItems = [...(config.education?.data?.items || [])];
                          nextItems[idx] = { ...nextItems[idx], degree: e.target.value };
                          onChangeConfig({
                            ...config,
                            education: {
                              enabled: config.education?.enabled ?? true,
                              data: { items: nextItems },
                            },
                          });
                        }}
                        placeholder="e.g. B.Sc. in Software Engineering"
                        className="w-full h-8 px-2.5 text-xs bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded outline-none focus:border-[var(--accent)]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-[var(--text-muted)] mb-1">
                        {(t.editor as any).eduInstitution || 'University / Institution'}
                      </label>
                      <input
                        type="text"
                        value={item.institution}
                        onChange={(e) => {
                          const nextItems = [...(config.education?.data?.items || [])];
                          nextItems[idx] = { ...nextItems[idx], institution: e.target.value };
                          onChangeConfig({
                            ...config,
                            education: {
                              enabled: config.education?.enabled ?? true,
                              data: { items: nextItems },
                            },
                          });
                        }}
                        placeholder="e.g. Helwan University"
                        className="w-full h-8 px-2.5 text-xs bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded outline-none focus:border-[var(--accent)]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-[var(--text-muted)] mb-1">
                        {(t.editor as any).eduPeriod || 'Years'}
                      </label>
                      <input
                        type="text"
                        value={item.period}
                        onChange={(e) => {
                          const nextItems = [...(config.education?.data?.items || [])];
                          nextItems[idx] = { ...nextItems[idx], period: e.target.value };
                          onChangeConfig({
                            ...config,
                            education: {
                              enabled: config.education?.enabled ?? true,
                              data: { items: nextItems },
                            },
                          });
                        }}
                        placeholder="e.g. 2020 - 2024"
                        className="w-full h-8 px-2.5 text-xs bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded outline-none focus:border-[var(--accent)]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-[var(--text-muted)] mb-1">
                        {(t.editor as any).eduGrade || 'Grade / Honors'}
                      </label>
                      <input
                        type="text"
                        value={item.gradeOrGpa || ''}
                        onChange={(e) => {
                          const nextItems = [...(config.education?.data?.items || [])];
                          nextItems[idx] = { ...nextItems[idx], gradeOrGpa: e.target.value };
                          onChangeConfig({
                            ...config,
                            education: {
                              enabled: config.education?.enabled ?? true,
                              data: { items: nextItems },
                            },
                          });
                        }}
                        placeholder="e.g. Very Good (GPA: 3.4)"
                        className="w-full h-8 px-2.5 text-xs bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded outline-none focus:border-[var(--accent)]"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  const currentItems = config.education?.data?.items || [];
                  const newItem: EducationItem = {
                    id: `edu-${currentItems.length + 1}`,
                    institution: isAr ? 'جامعة حلوان' : 'Faculty of Computers and AI',
                    degree: isAr ? 'بكالوريوس هندسة البرمجيات' : 'B.Sc. in Software Engineering',
                    period: '2020 - 2024',
                  };
                  onChangeConfig({
                    ...config,
                    education: {
                      enabled: true,
                      data: { items: [...currentItems, newItem] },
                    },
                  });
                }}
                className="w-full py-2.5 rounded-xl border border-dashed border-[var(--border)] hover:border-[var(--accent)] text-xs text-[var(--text-muted)] hover:text-[var(--text)] flex items-center justify-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{(t.editor as any).addEducation || 'Add Education'}</span>
              </button>
            </div>
          </div>
        )}

        {/* --- 5D. CERTIFICATIONS SECTION EDITOR --- */}
        {activeSection === 'certifications' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[var(--border)]">
              <div>
                <h3 className="font-serif text-lg font-medium text-[var(--text)] flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-500" />
                  <span>{(t.editor as any).certificationsTitle || 'Licenses & Certifications'}</span>
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  {(t.editor as any).certificationsNotice || 'Showcase verified certifications, specializations, and professional courses.'}
                </p>
              </div>

              {onOpenResumeModal && (
                <button
                  type="button"
                  onClick={onOpenResumeModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--accent)]/30 bg-[var(--accent-soft)] text-[var(--accent)] hover:bg-[var(--accent)]/15 text-xs font-semibold transition-all shrink-0 self-start sm:self-auto"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{(t.editor as any).importFromResume || 'Import from Resume / CV'}</span>
                </button>
              )}
            </div>

            {/* Certifications Items List */}
            <div className="space-y-4">
              {(config.certifications?.data?.items || []).map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/50 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold text-[var(--accent)]">
                      #{idx + 1} {item.name || 'Certification'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const nextItems = (config.certifications?.data?.items || []).filter((_, i) => i !== idx);
                        onChangeConfig({
                          ...config,
                          certifications: {
                            enabled: config.certifications?.enabled ?? true,
                            data: { items: nextItems },
                          },
                        });
                      }}
                      className="p-1 rounded text-[var(--text-subtle)] hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      title={t.common.delete}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-[var(--text-muted)] mb-1">
                        {(t.editor as any).certName || 'Certification Name'}
                      </label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => {
                          const nextItems = [...(config.certifications?.data?.items || [])];
                          nextItems[idx] = { ...nextItems[idx], name: e.target.value };
                          onChangeConfig({
                            ...config,
                            certifications: {
                              enabled: config.certifications?.enabled ?? true,
                              data: { items: nextItems },
                            },
                          });
                        }}
                        placeholder="e.g. Deep Learning Specialization"
                        className="w-full h-8 px-2.5 text-xs bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded outline-none focus:border-[var(--accent)]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-[var(--text-muted)] mb-1">
                        {(t.editor as any).certIssuer || 'Issuing Organization'}
                      </label>
                      <input
                        type="text"
                        value={item.issuer}
                        onChange={(e) => {
                          const nextItems = [...(config.certifications?.data?.items || [])];
                          nextItems[idx] = { ...nextItems[idx], issuer: e.target.value };
                          onChangeConfig({
                            ...config,
                            certifications: {
                              enabled: config.certifications?.enabled ?? true,
                              data: { items: nextItems },
                            },
                          });
                        }}
                        placeholder="e.g. DeepLearning.AI / Coursera / ITI"
                        className="w-full h-8 px-2.5 text-xs bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded outline-none focus:border-[var(--accent)]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-[var(--text-muted)] mb-1">
                        {(t.editor as any).certYear || 'Year'}
                      </label>
                      <input
                        type="text"
                        value={item.year || ''}
                        onChange={(e) => {
                          const nextItems = [...(config.certifications?.data?.items || [])];
                          nextItems[idx] = { ...nextItems[idx], year: e.target.value };
                          onChangeConfig({
                            ...config,
                            certifications: {
                              enabled: config.certifications?.enabled ?? true,
                              data: { items: nextItems },
                            },
                          });
                        }}
                        placeholder="e.g. 2024"
                        className="w-full h-8 px-2.5 text-xs bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded outline-none focus:border-[var(--accent)]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-[var(--text-muted)] mb-1">
                        {(t.editor as any).certUrl || 'Credential URL (Optional)'}
                      </label>
                      <input
                        type="text"
                        value={item.url || ''}
                        onChange={(e) => {
                          const nextItems = [...(config.certifications?.data?.items || [])];
                          nextItems[idx] = { ...nextItems[idx], url: e.target.value };
                          onChangeConfig({
                            ...config,
                            certifications: {
                              enabled: config.certifications?.enabled ?? true,
                              data: { items: nextItems },
                            },
                          });
                        }}
                        placeholder="https://coursera.org/verify/..."
                        className="w-full h-8 px-2.5 text-xs bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded outline-none focus:border-[var(--accent)] font-mono"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  const currentItems = config.certifications?.data?.items || [];
                  const newItem: CertificationItem = {
                    id: `cert-${currentItems.length + 1}`,
                    name: isAr ? 'شهادة مسار المصادر المفتوحة والذكاء الاصطناعي' : 'Open Source & AI Track Graduate',
                    issuer: isAr ? 'معهد تكنولوجيا المعلومات (ITI)' : 'Information Technology Institute (ITI)',
                    year: '2024',
                  };
                  onChangeConfig({
                    ...config,
                    certifications: {
                      enabled: true,
                      data: { items: [...currentItems, newItem] },
                    },
                  });
                }}
                className="w-full py-2.5 rounded-xl border border-dashed border-[var(--border)] hover:border-[var(--accent)] text-xs text-[var(--text-muted)] hover:text-[var(--text)] flex items-center justify-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{(t.editor as any).addCertification || 'Add Certification'}</span>
              </button>
            </div>
          </div>
        )}

        {/* --- 6. CONNECT SECTION EDITOR --- */}
        {activeSection === 'connect' && (
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-medium text-[var(--text)]">
              {t.sections.connect}
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              {t.editor.socialNotice}
            </p>

            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                {t.editor.ctaText}
              </label>
              <input
                type="text"
                value={config.connect.data.customCta}
                onChange={(e) => updateSectionData('connect', { customCta: e.target.value })}
                placeholder={t.editor.ctaPlaceholder}
                className="w-full h-9 px-3 text-sm bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded focus:ring-1 focus:ring-[var(--accent)] outline-none"
              />
            </div>

            <div className="space-y-2.5 pt-2">
              {config.connect.data.links.map((link, idx) => (
                <div key={link.platform} className="flex items-center gap-3">
                  <label className="w-24 text-xs font-mono capitalize text-[var(--text-muted)] flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={link.enabled}
                      onChange={(e) => {
                        const next = [...config.connect.data.links];
                        next[idx] = { ...next[idx], enabled: e.target.checked };
                        updateSectionData('connect', { links: next });
                      }}
                      className="rounded text-[var(--accent)]"
                    />
                    <span>{link.platform}</span>
                  </label>

                  <input
                    type="text"
                    value={link.usernameOrUrl}
                    onChange={(e) => {
                      const next = [...config.connect.data.links];
                      next[idx] = { ...next[idx], usernameOrUrl: e.target.value };
                      updateSectionData('connect', { links: next });
                    }}
                    placeholder={`Your ${link.platform} handle or URL`}
                    className="flex-1 h-8 px-2.5 text-xs bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
