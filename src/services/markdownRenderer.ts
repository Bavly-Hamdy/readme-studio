import {
  GitHubUserProfile,
  Locale,
  ProfileAnalytics,
  ProfileSectionsConfig,
  ReadmeTheme,
  StatsSectionData,
} from '../types';
import { ARCHETYPES, RHYTHM_LABELS } from './archetypes';
import { WEEKDAYS_AR, WEEKDAYS_EN } from './githubAnalyzer';

/* ------------------------------------------------------------------ */
/*  Copy deck (README output language)                                 */
/* ------------------------------------------------------------------ */

const COPY = {
  en: {
    about: 'About Me',
    focus: 'Focus', working: 'Working on', learning: 'Learning', ask: 'Ask me about', reach: 'Reach me', fun: 'Fun fact',
    tech: 'Tech Stack',
    projects: 'Featured Projects',
    project: 'Project', description: 'Description', stack: 'Stack',
    analytics: 'Profile Analytics',
    analyticsNote: (repos: number, date: string, src: string) =>
      `Generated from a full analysis of **${repos} repositories** and ${src} · data as of ${date}`,
    srcGraphql: 'the GitHub contribution calendar',
    srcEvents: 'the public activity stream',
    snapshot: 'At a Glance',
    stars: 'Stars', forks: 'Forks', repos: 'Repos', followers: 'Followers', contribs: 'Contributions', years: 'Years',
    languageDna: 'Language DNA',
    pieTitle: 'Code composition by bytes',
    reposLabel: 'repos',
    rhythm: 'Coding Rhythm',
    rhythmNote: 'All times in UTC, derived from public activity.',
    peak: 'Peak',
    morning: 'Morning', daytime: 'Daytime', evening: 'Evening', night: 'Night',
    scorecard: 'Developer Scorecard',
    dimension: 'Dimension', score: 'Score',
    impact: 'Impact', consistency: 'Consistency', versatility: 'Versatility', maintenance: 'Maintenance', community: 'Community', documentation: 'Documentation',
    overall: 'Overall', archetype: 'Archetype',
    pulse: 'Contribution Pulse',
    total: 'Total', commits: 'Commits', prs: 'Pull Requests', issues: 'Issues', reviews: 'Reviews', current: 'Current Streak', longest: 'Longest Streak', best: 'Best Day', days: 'days',
    timeline: 'Shipping Timeline',
    topics: 'Recurring Themes',
    insights: 'Key Insights',
    metrics: 'GitHub Metrics',
    connect: 'Connect',
    footer: 'Crafted with README Studio',
  },
  ar: {
    about: 'نبذة عني',
    focus: 'التركيز', working: 'أعمل على', learning: 'أتعلّم', ask: 'اسألني عن', reach: 'تواصل معي', fun: 'معلومة طريفة',
    tech: 'التقنيات',
    projects: 'مشاريع مميزة',
    project: 'المشروع', description: 'الوصف', stack: 'التقنية',
    analytics: 'تحليلات الملف الشخصي',
    analyticsNote: (repos: number, date: string, src: string) =>
      `مولّد من تحليل كامل لـ **${repos} مستودعاً** و${src} · البيانات حتى ${date}`,
    srcGraphql: 'تقويم المساهمات في GitHub',
    srcEvents: 'سجل النشاط العام',
    snapshot: 'نظرة سريعة',
    stars: 'النجوم', forks: 'التفريعات', repos: 'المستودعات', followers: 'المتابعون', contribs: 'المساهمات', years: 'السنوات',
    languageDna: 'الحمض النووي للغات',
    pieTitle: 'تكوين الكود حسب الحجم',
    reposLabel: 'مستودع',
    rhythm: 'إيقاع البرمجة',
    rhythmNote: 'جميع الأوقات بتوقيت UTC ومستخرجة من النشاط العام.',
    peak: 'الذروة',
    morning: 'الصباح', daytime: 'النهار', evening: 'المساء', night: 'الليل',
    scorecard: 'بطاقة تقييم المطوّر',
    dimension: 'البُعد', score: 'الدرجة',
    impact: 'التأثير', consistency: 'الاستمرارية', versatility: 'التنوع', maintenance: 'الصيانة', community: 'المجتمع', documentation: 'التوثيق',
    overall: 'الإجمالي', archetype: 'النمط',
    pulse: 'نبض المساهمات',
    total: 'الإجمالي', commits: 'الـ Commits', prs: 'طلبات الدمج', issues: 'المشكلات', reviews: 'المراجعات', current: 'السلسلة الحالية', longest: 'أطول سلسلة', best: 'أفضل يوم', days: 'يوم',
    timeline: 'الخط الزمني للإطلاق',
    topics: 'المحاور المتكررة',
    insights: 'أبرز الاستنتاجات',
    metrics: 'إحصائيات GitHub',
    connect: 'تواصل',
    footer: 'صُنع باستخدام README Studio',
  },
} as const;

type Copy = (typeof COPY)[Locale];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const BANNER_THEMES: Record<string, { gradient: string; accent: string }> = {
  inkwash: { gradient: '0:1e1f21,50:4a4a4a,100:6d8196', accent: '6d8196' },
  cyberpunk: { gradient: '0:0f0c29,50:6d28d9,100:db2777', accent: 'a78bfa' },
  oceanic: { gradient: '0:0a192f,50:0284c7,100:06b6d4', accent: '38bdf8' },
  sunset: { gradient: '0:31102f,50:d97706,100:ef4444', accent: 'fbbf24' },
  emerald: { gradient: '0:062c21,50:059669,100:10b981', accent: '34d399' },
  monochrome: { gradient: '0:18181b,50:27272a,100:3f3f46', accent: 'e4e4e7' },
  midnight: { gradient: '0:020617,50:1e1b4b,100:3b82f6', accent: '60a5fa' },
};

const SHOWCASE_GRADIENT = BANNER_THEMES.cyberpunk.gradient;
const SHOWCASE_ACCENT = BANNER_THEMES.cyberpunk.accent;

function compact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 10_000) return `${Math.round(n / 1000)}k`;
  if (n >= 1_000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return String(n);
}

function bar(percent: number, width = 25): string {
  const filled = Math.round((Math.max(0, Math.min(100, percent)) / 100) * width);
  return '█'.repeat(filled) + '░'.repeat(width - filled);
}

function cell(text: string): string {
  return text.replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
}

function shield(label: string, message: string, color: string, logo?: string, style = 'for-the-badge'): string {
  const enc = (s: string) => encodeURIComponent(s.replace(/-/g, '--').replace(/_/g, '__'));
  const logoPart = logo ? `&logo=${encodeURIComponent(logo)}&logoColor=white` : '';
  return `https://img.shields.io/badge/${enc(label)}-${enc(message)}-${color}?style=${style}${logoPart}`;
}

function sanitizeTypingLine(text: string): string {
  let clean = text
    .replace(/[|]/g, '·')
    .replace(/&/g, 'and')
    .replace(/[;]/g, ',')
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (clean.length > 42) {
    const parts = clean.split(/[·,\-.]/);
    if (parts[0] && parts[0].trim().length >= 8 && parts[0].trim().length <= 42) {
      clean = parts[0].trim();
    } else {
      clean = clean.slice(0, 39).trim() + '...';
    }
  }
  return clean;
}

function typingLine(s: string): string {
  const sanitized = sanitizeTypingLine(s);
  return encodeURIComponent(sanitized).replace(/%20/g, '+');
}

function padEnd(s: string, n: number): string {
  return s.length >= n ? s.slice(0, n) : s + ' '.repeat(n - s.length);
}

function statsThemeParam(s: StatsSectionData): string {
  return s.statsTheme === 'github_dark' ? 'github_dark' : s.statsTheme;
}

/* ------------------------------------------------------------------ */
/*  Section renderers                                                  */
/* ------------------------------------------------------------------ */

function renderHeader(
  config: ProfileSectionsConfig,
  theme: ReadmeTheme,
  username: string,
  analytics: ProfileAnalytics | null,
  profile: GitHubUserProfile | null,
  locale: Locale
): string {
  const h = config.header.data;
  const name = h.name || profile?.name || username;
  const headerStyle = h.headerStyle || (theme === 'showcase' ? 'badge-hero' : 'minimal');
  const bTheme = BANNER_THEMES[h.bannerTheme || 'cyberpunk'] || BANNER_THEMES.cyberpunk;
  const pattern = h.bannerPattern || 'waving';
  const badgeStyle = h.badgeStyle || (theme === 'showcase' ? 'for-the-badge' : 'flat-square');

  // Common lines for Typing Animation (carefully sanitized to prevent clipping)
  const defaultHeadline = h.headline ? sanitizeTypingLine(h.headline) : 'Full-Stack Software Engineer';
  const defaultArchetype = analytics ? `${ARCHETYPES[analytics.archetype].emoji} ${ARCHETYPES[analytics.archetype].label[locale]}` : '';
  const defaultStatus = h.status ? sanitizeTypingLine(h.status) : 'Building impactful open-source software';
  const defaultStars = analytics && analytics.totals.stars > 0 ? `${compact(analytics.totals.stars)} ⭐ across public repositories` : '';

  const typingLines = (h.typingLines && h.typingLines.length)
    ? h.typingLines.map(sanitizeTypingLine).filter(Boolean)
    : [defaultHeadline, defaultArchetype, defaultStatus, defaultStars].filter(Boolean);

  const typingSvg = (h.showTyping !== false && typingLines.length > 0)
    ? `<a href="https://github.com/${username}"><img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=600&size=20&pause=1200&color=${bTheme.accent}&center=true&vCenter=true&width=680&lines=${typingLines
        .map(typingLine)
        .join(';')}" alt="Typing SVG" /></a>`
    : '';

  // Avatar markup
  let avatarHtml = '';
  if (h.showAvatar && (profile?.avatar_url || username)) {
    const avatarSrc = profile?.avatar_url || `https://github.com/${username}.png`;
    const radius = h.avatarShape === 'circle' ? '50%' : h.avatarShape === 'rounded' ? '22px' : '6px';
    avatarHtml = `<a href="https://github.com/${username}"><img src="${avatarSrc}" width="115" height="115" style="border-radius:${radius};border:3px solid #6366f1;padding:2px;" alt="${name}" /></a>`;
  }

  // Verified Badges strip
  const badges: string[] = [];
  if (profile) {
    badges.push(`<a href="https://github.com/${username}?tab=followers"><img src="${shield('Followers', compact(profile.followers), '6d28d9', 'github', badgeStyle)}" alt="followers" /></a>`);
  }
  if (analytics) {
    badges.push(`<img src="${shield('Stars', compact(analytics.totals.stars), 'db2777', 'starship', badgeStyle)}" alt="stars" />`);
    badges.push(`<img src="${shield('Grade', analytics.scores.grade, '0f766e', undefined, badgeStyle)}" alt="grade" />`);
  }
  if (h.location) {
    badges.push(`<img src="${shield('Location', h.location, '1f2937', 'googlemaps', badgeStyle)}" alt="location" />`);
  }
  if (h.showViewsCounter || (config.stats.enabled && config.stats.data.showProfileViews)) {
    const vcColor = h.viewsCounterColor || '7c3aed';
    badges.push(`<img src="https://komarev.com/ghpvc/?username=${encodeURIComponent(username)}&style=${badgeStyle}&color=${vcColor}&label=Profile+Views" alt="views" />`);
  }

  const badgesLine = badges.length ? `<p align="center">\n${badges.join('\n')}\n</p>` : '';

  if (headerStyle === 'capsule') {
    const cleanDesc = h.headline ? sanitizeTypingLine(h.headline) : '';
    const capsule =
      `https://capsule-render.vercel.app/api?type=${pattern}&color=${bTheme.gradient}&height=200&section=header` +
      `&text=${encodeURIComponent(name)}&fontSize=48&fontColor=ffffff&fontAlignY=40&animation=fadeIn` +
      (cleanDesc ? `&desc=${encodeURIComponent(cleanDesc)}&descAlignY=62&descSize=16` : '');

    return [
      `<div align="center">`,
      ``,
      `<img src="${capsule}" width="100%" alt="header" />`,
      ``,
      avatarHtml,
      ``,
      typingSvg,
      ``,
      badgesLine,
      ``,
      `</div>`,
    ]
      .filter((l, i, arr) => !(l === '' && arr[i - 1] === ''))
      .join('\n');
  }

  if (headerStyle === 'terminal' || theme === 'mono') {
    const lines = [
      '```text',
      '┌──(developer@github)-[~]',
      `└─$ whoami --verbose`,
      `NAME:      ${name}`,
      h.headline ? `ROLE:      ${h.headline}` : '',
      h.location ? `LOCATION:  ${h.location}` : '',
      h.status ? `STATUS:    ${h.status}` : '',
      analytics ? `ARCHETYPE: ${ARCHETYPES[analytics.archetype].label.en.toUpperCase()}` : '',
      analytics ? `GRADE:     ${analytics.scores.grade} (${analytics.scores.overall}/100)` : '',
      '└─$ uptime',
      analytics ? `UPTIME:    ${analytics.accountAgeYears} years on GitHub` : '',
      '```',
    ];
    return [lines.filter(Boolean).join('\n'), '', badges.join(' ')].filter(Boolean).join('\n\n');
  }

  // Modern Hero (Default for showcase and badge-hero)
  if (headerStyle === 'badge-hero' || theme === 'showcase') {
    const greetingText = h.greeting || (locale === 'ar' ? 'مرحباً، أنا' : "Hi there, I'm");
    const metaParts = [
      h.location ? `📍 ${h.location}` : '',
      h.status ? `🌱 ${h.status}` : '',
      analytics ? `⚡ ${ARCHETYPES[analytics.archetype].label[locale]}` : '',
    ].filter(Boolean);

    return [
      `<div align="center">`,
      ``,
      avatarHtml,
      ``,
      `# <h1 align="center">${greetingText} ${name} 👋</h1>`,
      ``,
      h.headline ? `<p align="center"><strong>${h.headline}</strong></p>` : '',
      ``,
      typingSvg ? `<p align="center">\n${typingSvg}\n</p>` : '',
      ``,
      metaParts.length ? `<p align="center">${metaParts.join('  ·  ')}</p>` : '',
      ``,
      badgesLine,
      ``,
      `</div>`,
    ]
      .filter(Boolean)
      .join('\n');
  }

  // minimal
  let md = `# ${h.greeting || "Hi, I'm"} ${name}\n\n`;
  if (h.headline) md += `> ${h.headline}\n\n`;
  const meta: string[] = [];
  if (h.location) meta.push(`📍 ${h.location}`);
  if (h.status) meta.push(`🌱 ${h.status}`);
  if (meta.length) md += `${meta.join('  ·  ')}\n\n`;
  if (badges.length) md += badges.join(' ');
  return md.trim();
}

function renderAbout(config: ProfileSectionsConfig, theme: ReadmeTheme, c: Copy): string {
  const a = config.about.data;
  const heading = theme === 'showcase' ? `## 🧑‍💻 ${c.about}` : `## ${c.about}`;
  let md = `${heading}\n\n`;
  if (a.summary) md += `${a.summary}\n\n`;
  const rows: Array<[string, string, string]> = [
    ['💼', c.focus, a.currentRole],
    ['🔭', c.working, a.currentWork],
    ['🌱', c.learning, a.currentLearning],
    ['💬', c.ask, a.askMeAbout],
    ['📫', c.reach, a.howToReach],
    ['⚡', c.fun, a.funFact],
  ];
  const filled = rows.filter(r => r[2]);
  if (filled.length) md += filled.map(([i, l, v]) => `- ${i} **${l}**: ${v}`).join('\n');
  return md.trim();
}

function renderTech(config: ProfileSectionsConfig, theme: ReadmeTheme, c: Copy): string | null {
  const ts = config.techStack.data;
  const active = ts.items.filter(i => i.enabled);
  if (!active.length) return null;
  const heading = theme === 'showcase' ? `## 🛠️ ${c.tech}` : `## ${c.tech}`;
  const badgeStyle = ts.badgeStyle || (theme === 'showcase' ? 'for-the-badge' : 'flat-square');

  const catLabels: Record<string, { en: string; icon: string }> = {
    languages: { en: 'Languages & Runtimes', icon: '🌐' },
    frontend: { en: 'Frontend & UI Frameworks', icon: '🎨' },
    backend: { en: 'Backend & APIs', icon: '⚙️' },
    mobile: { en: 'Mobile & Cross-Platform', icon: '📱' },
    database: { en: 'Databases & ORM', icon: '🗄️' },
    devops: { en: 'Cloud, DevOps & Infrastructure', icon: '☁️' },
    ml_ai: { en: 'AI, Machine Learning & Data', icon: '🧠' },
    testing: { en: 'Testing & Quality Assurance', icon: '🧪' },
    design: { en: 'Design & Prototyping', icon: '✨' },
    tools: { en: 'Tools, Utilities & Platforms', icon: '🛠️' },
  };

  const grouped = new Map<string, typeof active>();
  active.forEach(i => grouped.set(i.category, [...(grouped.get(i.category) ?? []), i]));

  const badge = (i: (typeof active)[number]) =>
    `<img src="https://img.shields.io/badge/${encodeURIComponent(i.name.replace(/-/g, '--'))}-${i.color || '24292e'}?style=${badgeStyle}&logo=${encodeURIComponent(i.badgeSlug || i.id)}&logoColor=white" alt="${i.name}" />`;

  if (ts.style === 'badges' || ts.style === 'grouped-cards') {
    let md = `${heading}\n\n`;
    grouped.forEach((items, cat) => {
      const info = catLabels[cat] || { en: cat, icon: '⚡' };
      md += `### ${info.icon} ${info.en}\n\n<p align="left">\n${items.map(badge).join('\n')}\n</p>\n\n`;
    });
    return md.trim();
  }

  if (ts.style === 'minimal-table') {
    let md = `${heading}\n\n| Category | Technologies |\n| :--- | :--- |\n`;
    grouped.forEach((items, cat) => {
      const info = catLabels[cat] || { en: cat, icon: '⚡' };
      md += `| **${info.icon} ${info.en}** | ${items.map(i => i.name).join(', ')} |\n`;
    });
    return md.trim();
  }

  let md = `${heading}\n\n`;
  grouped.forEach((items, cat) => {
    const info = catLabels[cat] || { en: cat, icon: '⚡' };
    md += `- **${info.icon} ${info.en}**: ${items.map(i => i.name).join(' · ')}\n`;
  });
  return md.trim();
}

function renderProjects(config: ProfileSectionsConfig, theme: ReadmeTheme, username: string, c: Copy): string | null {
  const p = config.projects.data;
  if (!p.projects.length) return null;
  const heading = theme === 'showcase' ? `## 🚀 ${c.projects}` : `## ${c.projects}`;

  if (theme === 'mono') {
    let md = `${heading}\n\n\`\`\`text\n`;
    p.projects.forEach((proj, idx) => {
      md += `[${String(idx + 1).padStart(2, '0')}] ${proj.name}\n`;
      if (proj.description) md += `     ${proj.description}\n`;
      const meta = [proj.language, p.showStars ? `★ ${proj.stars}` : '', p.showForks ? `⑂ ${proj.forks}` : ''].filter(Boolean);
      if (meta.length) md += `     (${meta.join(' · ')})\n`;
      md += `     URL: ${proj.url}\n\n`;
    });
    return `${md.trimEnd()}\n\`\`\``;
  }

  if (p.layout === 'cards') {
    const theme_ = statsThemeParam(config.stats.data);
    const cards = p.projects.map(proj => {
      const [owner, repo] = (proj.fullName ?? `${username}/${proj.name}`).split('/');
      return `<a href="${proj.url}"><img src="https://github-readme-stats-eight-theta.vercel.app/api/pin/?username=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}&theme=${theme_}&hide_border=true" width="49%" alt="${proj.name}" /></a>`;
    });
    return `${heading}\n\n<div align="center">\n${cards.join('\n')}\n</div>`;
  }

  if (p.layout === 'table') {
    const cols: string[] = [c.project, c.description, c.stack];
    if (p.showStars) cols.push('⭐');
    if (p.showForks) cols.push('🍴');
    let md = `${heading}\n\n| ${cols.join(' | ')} |\n| ${cols.map((_, i) => (i >= 3 ? ':-:' : ':--')).join(' | ')} |\n`;
    p.projects.forEach(proj => {
      const row = [`[**${cell(proj.name)}**](${proj.url})`, cell(proj.description || '—'), proj.language ? `\`${proj.language}\`` : '—'];
      if (p.showStars) row.push(compact(proj.stars));
      if (p.showForks) row.push(compact(proj.forks));
      md += `| ${row.join(' | ')} |\n`;
    });
    return md.trim();
  }

  let md = `${heading}\n\n`;
  p.projects.forEach(proj => {
    md += `### [${proj.name}](${proj.url})\n`;
    if (proj.description) md += `${proj.description}\n\n`;
    const meta = [proj.language ? `\`${proj.language}\`` : '', p.showStars ? `★ ${proj.stars.toLocaleString()}` : '', p.showForks ? `⑂ ${proj.forks.toLocaleString()}` : ''].filter(Boolean);
    if (meta.length) md += `${meta.join('  ·  ')}\n\n`;
  });
  return md.trim();
}

function renderAnalytics(
  config: ProfileSectionsConfig,
  theme: ReadmeTheme,
  a: ProfileAnalytics,
  profile: GitHubUserProfile | null,
  c: Copy,
  locale: Locale
): string {
  const d = config.analytics.data;
  const fancy = theme === 'showcase';
  const parts: string[] = [];
  const date = new Date(a.generatedAt).toISOString().slice(0, 10);
  const src = a.contributions.source === 'graphql' ? c.srcGraphql : c.srcEvents;

  parts.push(`## ${fancy ? '📊 ' : ''}${c.analytics}\n\n> ${c.analyticsNote(a.totals.ownedRepos, date, src)}`);

  // --- Snapshot
  if (d.showSnapshot) {
    const cells: Array<[string, string]> = [
      [`⭐ ${c.stars}`, compact(a.totals.stars)],
      [`🍴 ${c.forks}`, compact(a.totals.forks)],
      [`📦 ${c.repos}`, String(a.totals.ownedRepos)],
      [`👥 ${c.followers}`, compact(profile?.followers ?? 0)],
      [`🔥 ${c.contribs}`, compact(a.contributions.total)],
      [`📅 ${c.years}`, String(a.accountAgeYears)],
    ];
    parts.push(
      `### ${fancy ? '⚡ ' : ''}${c.snapshot}\n\n` +
        `| ${cells.map(x => x[0]).join(' | ')} |\n| ${cells.map(() => ':-:').join(' | ')} |\n| ${cells.map(x => `**${x[1]}**`).join(' | ')} |`
    );
  }

  // --- Languages
  if (d.showLanguages && a.languages.length) {
    const langs = a.languages.slice(0, d.languageLimit);
    const width = Math.max(...langs.map(l => l.name.length), 8) + 2;
    let block = `### ${fancy ? '🧬 ' : ''}${c.languageDna}\n\n\`\`\`text\n`;
    langs.forEach(l => {
      block += `${padEnd(l.name, width)}${bar(l.percent)}  ${l.percent.toFixed(1).padStart(5)}%   ${l.repos} ${c.reposLabel}\n`;
    });
    block += '```';
    parts.push(block);

    if (d.showLanguagePie && theme !== 'mono') {
      const pie = langs.slice(0, 8);
      const vars = pie.map((l, i) => `'pie${i + 1}':'${l.color}'`).join(',');
      parts.push(
        '```mermaid\n' +
          `%%{init: {'theme':'base','themeVariables':{${vars},'pieStrokeColor':'#ffffff','pieOuterStrokeWidth':'0px','pieSectionTextColor':'#ffffff','pieTitleTextSize':'16px'}}}%%\n` +
          `pie showData title ${c.pieTitle}\n` +
          pie.map(l => `    "${l.name.replace(/"/g, "'")}" : ${l.percent}`).join('\n') +
          '\n```'
      );
    }
  }

  // --- Rhythm
  if (d.showRhythm && (a.weekdayActivity.some(v => v > 0) || a.hourActivity.some(v => v > 0))) {
    const days = locale === 'ar' ? WEEKDAYS_AR : WEEKDAYS_EN;
    const wTotal = a.weekdayActivity.reduce((x, y) => x + y, 0) || 1;
    const hTotal = a.hourActivity.reduce((x, y) => x + y, 0) || 1;
    const sum = (f: number, t: number) => a.hourActivity.slice(f, t).reduce((x, y) => x + y, 0);
    const buckets: Array<[string, number]> = [
      [`🌅 ${c.morning}`, sum(5, 12)],
      [`☀️ ${c.daytime}`, sum(12, 17)],
      [`🌆 ${c.evening}`, sum(17, 22)],
      [`🌙 ${c.night}`, sum(22, 24) + sum(0, 5)],
    ];
    let block = `### ${fancy ? '🕰️ ' : ''}${c.rhythm}\n\n\`\`\`text\n`;
    a.weekdayActivity.forEach((v, i) => {
      const pct = (v / wTotal) * 100;
      block += `${padEnd(days[i], 11)}${bar(pct, 22)}  ${pct.toFixed(1).padStart(5)}%\n`;
    });
    if (a.hourActivity.some(v => v > 0)) {
      block += '\n';
      buckets.forEach(([label, v]) => {
        const pct = (v / hTotal) * 100;
        block += `${padEnd(label, 12)}${bar(pct, 22)}  ${pct.toFixed(1).padStart(5)}%\n`;
      });
    }
    block += '```\n\n';
    const peak =
      a.peakWeekday !== null && a.peakHour !== null
        ? ` · ${c.peak}: **${days[a.peakWeekday]} ${String(a.peakHour).padStart(2, '0')}:00 UTC**`
        : '';
    block += `**${RHYTHM_LABELS[a.rhythm][locale]}**${peak}  \n<sub>${c.rhythmNote}</sub>`;
    parts.push(block);
  }

  // --- Scorecard
  if (d.showScores) {
    const s = a.scores;
    const rows: Array<[string, string, number]> = [
      ['🎯', c.impact, s.impact],
      ['📈', c.consistency, s.consistency],
      ['🧪', c.versatility, s.versatility],
      ['🛠️', c.maintenance, s.maintenance],
      ['🤝', c.community, s.community],
      ['📝', c.documentation, s.documentation],
    ];
    const arch = ARCHETYPES[a.archetype];
    const second = a.secondaryArchetype ? ` · ${ARCHETYPES[a.secondaryArchetype].emoji} ${ARCHETYPES[a.secondaryArchetype].label[locale]}` : '';
    let block = `### ${fancy ? '🏆 ' : ''}${c.scorecard}\n\n`;
    if (fancy) {
      block +=
        `<div align="center">\n\n` +
        `<img src="${shield(c.overall, `${s.overall}/100 · ${s.grade}`, '6d28d9')}" alt="overall" />\n` +
        `<img src="${shield(c.archetype, arch.label.en, 'db2777')}" alt="archetype" />\n\n</div>\n\n`;
    } else {
      block += `**${c.overall}: ${s.overall}/100 (${s.grade})** · ${arch.emoji} ${arch.label[locale]}${second}\n\n`;
    }
    block += `| ${c.dimension} | ${c.score} | |\n| :-- | :-- | --: |\n`;
    rows.forEach(([icon, label, v]) => (block += `| ${icon} ${label} | \`${bar(v, 20)}\` | **${v}** |\n`));
    if (fancy) block += `\n> ${arch.emoji} **${arch.label[locale]}**${second} — ${arch.description[locale]}`;
    parts.push(block.trim());
  }

  // --- Contributions
  if (d.showContributions && a.contributions.total > 0) {
    const k = a.contributions;
    const cols: Array<[string, string]> = [
      [c.total, compact(k.total)],
      [c.commits, compact(k.commits)],
      [c.prs, compact(k.pullRequests)],
      [c.issues, compact(k.issues)],
      [c.reviews, compact(k.reviews)],
      [c.current, `${k.currentStreak} ${c.days}`],
      [c.longest, `${k.longestStreak} ${c.days}`],
    ];
    let block =
      `### ${fancy ? '🔥 ' : ''}${c.pulse}\n\n| ${cols.map(x => x[0]).join(' | ')} |\n| ${cols.map(() => ':-:').join(' | ')} |\n| ${cols
        .map(x => `**${x[1]}**`)
        .join(' | ')} |`;
    if (k.bestDay) block += `\n\n<sub>🏅 ${c.best}: **${k.bestDay.count}** — ${k.bestDay.date}</sub>`;
    parts.push(block);
  }

  // --- Timeline
  if (d.showTimeline && a.reposByYear.length > 1) {
    const max = Math.max(...a.reposByYear.map(y => y.count));
    let block = `### ${fancy ? '🗓️ ' : ''}${c.timeline}\n\n\`\`\`text\n`;
    a.reposByYear.forEach(y => (block += `${y.label}  ${bar((y.count / max) * 100, 30)}  ${y.count}\n`));
    parts.push(`${block}\`\`\``);
  }

  // --- Topics
  if (d.showTopics && a.topics.length) {
    const topics = a.topics.slice(0, 16);
    const body =
      theme === 'mono'
        ? '`' + topics.map(t => `#${t.label}`).join('` `') + '`'
        : `<p align="left">\n` +
          topics
            .map(t => `  <img src="${shield(t.label, String(t.count), '0969da', undefined, 'flat')}" alt="${t.label}" />`)
            .join(' \n') +
          `\n</p>`;
    parts.push(`### ${fancy ? '🏷️ ' : ''}${c.topics}\n\n${body}`);
  }

  // --- Insights
  if (d.showInsights && a.insights.length) {
    parts.push(`### ${fancy ? '💡 ' : ''}${c.insights}\n\n${a.insights.map(i => `- ${i.icon} ${i[locale]}`).join('\n')}`);
  }

  return parts.join('\n\n');
}

function renderStats(config: ProfileSectionsConfig, theme: ReadmeTheme, username: string, c: Copy): string | null {
  const s = config.stats.data;
  if (!s.showStatsCard && !s.showStreakCard && !s.showTopLanguagesCard && !s.showActivityGraph && !s.showTrophies) return null;
  const u = encodeURIComponent(username);
  const t = statsThemeParam(s);
  const border = s.hideBorder ? '&hide_border=true' : '';
  const out: string[] = [];

  // 1. Streak card (Demolab - proven 100% reliable on GitHub Camo)
  if (s.showStreakCard) {
    const streakTheme = (t === 'github_dark' || theme === 'showcase' || t === 'default') ? 'github-dark-blue' : t === 'tokyonight' ? 'tokyonight' : t;
    out.push(`<a href="https://github.com/${username}"><img src="https://streak-stats.demolab.com/?user=${u}&theme=${streakTheme}${border}" alt="GitHub Streak" /></a>`);
  }

  // 2. Profile Details & Language Cards (using 100% reliable summary cards that never 502/fail on Camo)
  const cardTheme = (t === 'github_dark' || theme === 'showcase' || t === 'default') ? 'github_dark' : t === 'tokyonight' ? 'solarized_dark' : 'default';
  const pair: string[] = [];
  if (s.showStatsCard) {
    pair.push(`<a href="https://github.com/${username}"><img src="https://github-profile-summary-cards.vercel.app/api/cards/profile-details?username=${u}&theme=${cardTheme}" alt="GitHub Stats" /></a>`);
  }
  if (s.showTopLanguagesCard) {
    pair.push(`<a href="https://github.com/${username}"><img src="https://github-profile-summary-cards.vercel.app/api/cards/repos-per-language?username=${u}&theme=${cardTheme}" alt="Top Languages" /></a>`);
  }
  if (pair.length) {
    out.push(pair.join('\n'));
  }

  // 3. Trophies (optional)
  if (s.showTrophies) {
    out.push(`<img src="https://github-profile-trophy.vercel.app/?username=${u}&theme=${cardTheme === 'github_dark' ? 'darkhub' : cardTheme}&no-frame=${s.hideBorder}&no-bg=true&margin-w=6&row=1&column=7" alt="trophies" />`);
  }

  // 4. Activity Graph (optional)
  if (s.showActivityGraph) {
    out.push(`<img src="https://github-readme-activity-graph.vercel.app/graph?username=${u}&theme=github-compact&area=true${border ? '&hide_border=true' : ''}" width="100%" alt="activity graph" />`);
  }

  const heading = theme === 'showcase' ? `## 📈 ${c.metrics}` : `## ${c.metrics}`;
  return `${heading}\n\n<div align="center">\n\n${out.join('\n\n')}\n\n</div>`;
}

function renderConnect(config: ProfileSectionsConfig, theme: ReadmeTheme, c: Copy): string | null {
  const data = config.connect.data;
  const links = data.links.filter(l => l.enabled && l.usernameOrUrl.trim());
  if (!links.length && !data.customCta) return null;

  const META: Record<string, { title: string; color: string; logo: string; url: (v: string) => string }> = {
    github: { title: 'GitHub', color: '181717', logo: 'github', url: v => `https://github.com/${v}` },
    linkedin: { title: 'LinkedIn', color: '0A66C2', logo: 'linkedin', url: v => `https://linkedin.com/in/${v}` },
    twitter: { title: 'X', color: '000000', logo: 'x', url: v => `https://x.com/${v.replace('@', '')}` },
    email: { title: 'Email', color: 'D14836', logo: 'gmail', url: v => `mailto:${v}` },
    website: { title: 'Portfolio', color: '6d28d9', logo: 'googlechrome', url: v => `https://${v}` },
    youtube: { title: 'YouTube', color: 'FF0000', logo: 'youtube', url: v => `https://youtube.com/@${v}` },
    devto: { title: 'DEV.to', color: '0A0A0A', logo: 'devdotto', url: v => `https://dev.to/${v}` },
    hashnode: { title: 'Hashnode', color: '2962FF', logo: 'hashnode', url: v => `https://hashnode.com/@${v}` },
  };
  const style = theme === 'showcase' ? 'for-the-badge' : 'flat';
  const badges = links.map(l => {
    const m = META[l.platform];
    const raw = l.usernameOrUrl.trim();
    const url = /^(https?:|mailto:)/.test(raw) ? raw : m.url(raw);
    return `<a href="${url}"><img src="https://img.shields.io/badge/${encodeURIComponent(m.title)}-${m.color}?style=${style}&logo=${m.logo}&logoColor=white" alt="${m.title}" /></a>`;
  });

  const heading = theme === 'showcase' ? `## 🤝 ${c.connect}` : `## ${c.connect}`;
  if (theme === 'showcase') {
    return `${heading}\n\n<div align="center">\n\n${data.customCta ? `${data.customCta}\n\n` : ''}${badges.join('\n')}\n\n</div>`;
  }
  return `${heading}\n\n${data.customCta ? `${data.customCta}\n\n` : ''}${badges.join(' ')}`;
}

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

export function generateReadmeMarkdown(
  config: ProfileSectionsConfig,
  theme: ReadmeTheme,
  username: string,
  analytics: ProfileAnalytics | null = null,
  profile: GitHubUserProfile | null = null,
  locale: Locale = 'en'
): string {
  const c = COPY[locale];
  const parts: string[] = [];

  if (config.header.enabled) parts.push(renderHeader(config, theme, username, analytics, profile, locale));
  if (config.about.enabled) parts.push(renderAbout(config, theme, c));
  if (config.techStack.enabled) {
    const t = renderTech(config, theme, c);
    if (t) parts.push(t);
  }
  if (config.projects.enabled) {
    const p = renderProjects(config, theme, username, c);
    if (p) parts.push(p);
  }
  if (config.analytics.enabled && analytics) parts.push(renderAnalytics(config, theme, analytics, profile, c, locale));
  if (config.stats.enabled) {
    const s = renderStats(config, theme, username, c);
    if (s) parts.push(s);
  }
  if (config.connect.enabled) {
    const k = renderConnect(config, theme, c);
    if (k) parts.push(k);
  }

  let body = parts.join(theme === 'showcase' ? '\n\n<br/>\n\n' : '\n\n---\n\n');

  if (theme === 'showcase') {
    body +=
      `\n\n<br/>\n\n---\n\n` +
      `<div align="center">\n\n` +
      `<sub>⭐️ Designed with care by <a href="https://github.com/${username}">@${username}</a> · ${c.footer}</sub>\n\n` +
      `</div>`;
  }
  if (locale === 'ar') body = `<div dir="rtl">\n\n${body}\n\n</div>`;
  return body;
}
