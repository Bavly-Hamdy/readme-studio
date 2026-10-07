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
    focus: 'Focus', working: 'Currently Working On', learning: 'Learning', ask: 'Ask Me About', reach: 'Get in Touch', fun: 'Engineering Philosophy',
    tech: 'Tech Stack',
    experience: 'Work Experience',
    education: 'Education & Academic Background',
    certifications: 'Licenses & Certifications',
    projects: 'Featured Projects',
    project: 'Project', description: 'Description', stack: 'Stack',
    analytics: 'Profile Telemetry',
    analyticsNote: (repos: number, date: string, src: string) =>
      `Generated from a comprehensive audit of **${repos} repositories** and ${src} · data as of ${date}`,
    srcGraphql: 'the GitHub contribution calendar',
    srcEvents: 'the public activity stream',
    snapshot: 'At a Glance',
    stars: 'Stars', forks: 'Forks', repos: 'Repositories', followers: 'Followers', contribs: 'Contributions', years: 'Years on GitHub',
    languageDna: 'Language DNA',
    pieTitle: 'Codebase Composition by Bytes',
    reposLabel: 'repos',
    rhythm: 'Coding Rhythm',
    rhythmNote: 'All timestamps in UTC, derived from verified public commit activity.',
    peak: 'Peak Activity',
    morning: 'Morning (05:00 - 12:00)', daytime: 'Daytime (12:00 - 17:00)', evening: 'Evening (17:00 - 22:00)', night: 'Night (22:00 - 05:00)',
    scorecard: 'Developer Scorecard',
    dimension: 'Dimension', score: 'Index Score',
    impact: 'Impact', consistency: 'Consistency', versatility: 'Versatility', maintenance: 'Maintenance', community: 'Community', documentation: 'Documentation',
    overall: 'Overall Score', archetype: 'Archetype',
    pulse: 'Contribution Velocity',
    total: 'Total Contributions', commits: 'Commits', prs: 'Pull Requests', issues: 'Issues', reviews: 'Code Reviews', current: 'Current Streak', longest: 'Longest Streak', best: 'Best Day', days: 'days',
    timeline: 'Shipping Velocity Timeline',
    topics: 'Recurring Focus Areas',
    insights: 'Key Engineering Insights',
    metrics: 'GitHub Telemetry',
    connect: 'Connect',
    footer: 'Crafted with README Studio',
  },
  ar: {
    about: 'نبذة عني',
    focus: 'مجال التركيز', working: 'العمل الحالي', learning: 'أتعلم حالياً', ask: 'اسألني عن', reach: 'التواصل', fun: 'الفلسفة الهندسية',
    tech: 'حزمة التقنيات',
    experience: 'الخبرات المهنية',
    education: 'التعليم والمؤهلات الأكاديمية',
    certifications: 'الشهادات والاعتمادات',
    projects: 'مشاريع مختارة',
    project: 'المشروع', description: 'الوصف', stack: 'التقنية',
    analytics: 'التحليلات البرمجية',
    analyticsNote: (repos: number, date: string, src: string) =>
      `مستخرج من تدقيق شامل لـ **${repos} مستودعاً** و${src} · حتى تاريخ ${date}`,
    srcGraphql: 'تقويم المساهمات في GitHub',
    srcEvents: 'سجل النشاط العام',
    snapshot: 'نظرة سريعة',
    stars: 'النجوم', forks: 'التفريعات', repos: 'المستودعات', followers: 'المتابعون', contribs: 'المساهمات', years: 'السنوات',
    languageDna: 'الحمض النووي للغات البرمجة',
    pieTitle: 'تكوين الكود حسب البايتات الحقيقية',
    reposLabel: 'مستودع',
    rhythm: 'إيقاع الإنتاجية والبرمجة',
    rhythmNote: 'جميع الأوقات بتوقيت UTC ومستخرجة من النشاط الفعلي العام.',
    peak: 'أوقات الذروة',
    morning: 'الصباح (05:00 - 12:00)', daytime: 'النهار (12:00 - 17:00)', evening: 'المساء (17:00 - 22:00)', night: 'الليل (22:00 - 05:00)',
    scorecard: 'بطاقة التقييم البرمجي',
    dimension: 'المعيار', score: 'الدرجة',
    impact: 'الأثر والانتشار', consistency: 'الاستمرارية', versatility: 'التنوع اللغوي', maintenance: 'الصيانة والتحديث', community: 'التفاعل المجتمعي', documentation: 'التوثيق',
    overall: 'التقييم الإجمالي', archetype: 'النمط الهندسي',
    pulse: 'نبض ومعدل المساهمات',
    total: 'إجمالي المساهمات', commits: 'الـ Commits', prs: 'طلبات الدمج', issues: 'المشكلات', reviews: 'المراجعات', current: 'السلسلة الحالية', longest: 'أطول سلسلة', best: 'أفضل يوم', days: 'يوم',
    timeline: 'الخط الزمني للإطلاقات البرمجية',
    topics: 'المجالات والاهتمامات المتكررة',
    insights: 'أبرز الاستنتاجات الهندسية',
    metrics: 'إحصائيات GitHub',
    connect: 'التواصل والروابط',
    footer: 'صُنع باستخدام README Studio',
  },
} as const;

type Copy = (typeof COPY)[Locale];

/* ------------------------------------------------------------------ */
/*  Helpers & Design System Tokens                                     */
/* ------------------------------------------------------------------ */

const BANNER_THEMES: Record<string, { gradient: string; accent: string }> = {
  inkwash: { gradient: '0:1e1f21,50:4a4a4a,100:6d8196', accent: '6d8196' },
  monochrome: { gradient: '0:18181b,50:3f3f46,100:71717a', accent: 'e4e4e7' },
  oceanic: { gradient: '0:0369a1,50:0284c7,100:38bdf8', accent: '38bdf8' },
  sunset: { gradient: '0:b91c1c,50:ea580c,100:f59e0b', accent: 'f59e0b' },
  emerald: { gradient: '0:065f46,50:059669,100:34d399', accent: '10b981' },
  cyberpunk: { gradient: '0:701a75,50:a855f7,100:ec4899', accent: 'ec4899' },
  midnight: { gradient: '0:020617,50:1e3a8a,100:3b82f6', accent: '60a5fa' },
};

function compact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 10_000) return `${Math.round(n / 1000)}k`;
  if (n >= 1_000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return String(n);
}

function bar(percent: number, width = 24): string {
  const filled = Math.round((Math.max(0, Math.min(100, percent)) / 100) * width);
  return '█'.repeat(filled) + '░'.repeat(width - filled);
}

function cell(text: string): string {
  return text.replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
}

function shield(label: string, message: string, color: string, logo?: string, style = 'flat-square'): string {
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
  if (clean.length > 58) {
    const parts = clean.split(/[·,\-.]/);
    if (parts[0] && parts[0].trim().length >= 10 && parts[0].trim().length <= 58) {
      clean = parts[0].trim();
    } else {
      clean = clean.slice(0, 55).trim() + '...';
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
/*  Section Renderers                                                  */
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
  const headerStyle = h.headerStyle || (theme === 'mono' ? 'terminal' : theme === 'minimal' || theme === 'paper' ? 'minimal' : 'badge-hero');
  const bTheme = BANNER_THEMES[h.bannerTheme || 'inkwash'] || BANNER_THEMES.inkwash;
  const pattern = h.bannerPattern || 'waving';
  const badgeStyle = h.badgeStyle || 'for-the-badge';
  const viewsColor = (h.viewsCounterColor || bTheme.accent || '6d8196').replace(/^#/, '');

  // Typing lines for dynamic typing SVG
  const defaultHeadline = h.headline ? sanitizeTypingLine(h.headline) : 'Software Engineer';
  const defaultArchetype = analytics ? ARCHETYPES[analytics.archetype].label[locale] : '';
  const defaultStatus = h.status ? sanitizeTypingLine(h.status) : 'Building impactful open-source software';
  const defaultStars = analytics && analytics.totals.stars > 0 ? `${compact(analytics.totals.stars)} stars across public repositories` : '';

  const typingLines = (h.typingLines && h.typingLines.length)
    ? h.typingLines.map(sanitizeTypingLine).filter(Boolean)
    : [defaultHeadline, defaultArchetype, defaultStatus, defaultStars].filter(Boolean);

  const typingSvg = (h.showTyping !== false && typingLines.length > 0)
    ? `<a href="https://github.com/${username}"><img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=600&size=19&pause=1200&color=${bTheme.accent}&center=true&vCenter=true&width=680&lines=${typingLines
        .map(typingLine)
        .join(';')}" alt="Typing SVG" /></a>`
    : '';

  // Avatar markup
  let avatarHtml = '';
  if (h.showAvatar && (profile?.avatar_url || username)) {
    let avatarSrc = profile?.avatar_url;
    if (!avatarSrc || avatarSrc.includes('108342478')) {
      avatarSrc = `https://github.com/${encodeURIComponent(username || profile?.login || 'Bavly-Hamdy')}.png`;
    }
    const radius = h.avatarShape === 'circle' ? '50%' : h.avatarShape === 'rounded' ? '18px' : '0px';
    avatarHtml = `<a href="https://github.com/${username}"><img src="${avatarSrc}" width="115" height="115" style="border-radius:${radius};border:2px solid #${bTheme.accent};padding:2px;" alt="${name}" /></a>`;
  }

  // Cohesive, professional badge strip
  const badges: string[] = [];
  if (profile) {
    badges.push(`<a href="https://github.com/${username}?tab=followers"><img src="${shield('Followers', compact(profile.followers), '18181b', 'github', badgeStyle)}" alt="followers" /></a>`);
  }
  if (analytics) {
    badges.push(`<img src="${shield('Stars', compact(analytics.totals.stars), '18181b', 'starship', badgeStyle)}" alt="stars" />`);
    badges.push(`<img src="${shield('Grade', `Grade ${analytics.scores.grade}`, '0f766e', undefined, badgeStyle)}" alt="grade" />`);
  }
  if (h.location) {
    badges.push(`<img src="${shield('Location', h.location, '18181b', 'googlemaps', badgeStyle)}" alt="location" />`);
  }
  if (h.showViewsCounter || (config.stats.enabled && config.stats.data.showProfileViews)) {
    badges.push(`<img src="https://komarev.com/ghpvc/?username=${encodeURIComponent(username)}&style=${badgeStyle}&color=${viewsColor}&label=Profile+Views" alt="views" />`);
  }

  const badgesLine = badges.length ? `<p align="center">\n${badges.join('\n')}\n</p>` : '';

  // 1. Capsule Wave Style
  if (headerStyle === 'capsule') {
    const cleanDesc = h.headline ? sanitizeTypingLine(h.headline) : '';
    const capsule =
      `https://capsule-render.vercel.app/api?type=${pattern}&color=${bTheme.gradient}&height=190&section=header` +
      `&text=${encodeURIComponent(name)}&fontSize=44&fontColor=ffffff&fontAlignY=42&animation=fadeIn` +
      (cleanDesc ? `&desc=${encodeURIComponent(cleanDesc)}&descAlignY=64&descSize=15` : '');

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

  // 2. Terminal Shell Style
  if (headerStyle === 'terminal') {
    const lines = [
      '```text',
      '┌──(developer@github)-[~]',
      `└─$ whoami --verbose`,
      `NAME:      ${name}`,
      h.headline ? `ROLE:      ${h.headline}` : '',
      h.location ? `LOCATION:  ${h.location}` : '',
      h.status ? `STATUS:    ${h.status}` : '',
      analytics ? `ARCHETYPE: ${ARCHETYPES[analytics.archetype].label.en.toUpperCase()}` : '',
      analytics ? `GRADE:     Grade ${analytics.scores.grade} (${analytics.scores.overall}/100)` : '',
      '└─$ uptime',
      analytics ? `UPTIME:    ${analytics.accountAgeYears} years on GitHub` : '',
      '```',
    ];
    const termBlock = lines.filter(Boolean).join('\n');
    return [
      avatarHtml ? `<div align="center">\n${avatarHtml}\n</div>` : '',
      termBlock,
      badgesLine,
    ].filter(Boolean).join('\n\n');
  }

  // 3. Modern Hero Style (badge-hero)
  if (headerStyle === 'badge-hero') {
    const greetingText = h.greeting || (locale === 'ar' ? 'مرحباً، أنا' : "Hi, I'm");
    const metaParts = [
      h.location ? `${h.location}` : '',
      h.status ? `${h.status}` : '',
      analytics ? `${ARCHETYPES[analytics.archetype].label[locale]}` : '',
    ].filter(Boolean);

    return [
      `<div align="center">`,
      ``,
      avatarHtml,
      ``,
      `# ${greetingText} ${name}`,
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

  // 4. Paper Theme Layout
  if (theme === 'paper') {
    const greetingText = h.greeting || (locale === 'ar' ? 'مرحباً، أنا' : "Hi, I'm");
    const meta: string[] = [];
    if (h.location) meta.push(h.location);
    if (h.status) meta.push(h.status);
    return [
      `# ${greetingText} ${name}`,
      h.headline ? `### *${h.headline}*` : '',
      meta.length ? `\n> ${meta.join(' · ')}\n` : '',
      badges.length ? `<p align="left">\n${badges.join(' ')}\n</p>` : '',
    ].filter(Boolean).join('\n\n').trim();
  }

  // 5. Minimal Text (Minimal Layout)
  const greetingText = h.greeting || (locale === 'ar' ? 'مرحباً، أنا' : "Hi, I'm");
  let md = `# ${greetingText} ${name}\n\n`;
  if (h.headline) md += `> ${h.headline}\n\n`;
  const meta: string[] = [];
  if (h.location) meta.push(h.location);
  if (h.status) meta.push(h.status);
  if (meta.length) md += `${meta.join('  ·  ')}\n\n`;
  if (badges.length) md += badges.join(' ');
  return md.trim();
}

function renderAbout(config: ProfileSectionsConfig, theme: ReadmeTheme, c: Copy): string {
  const a = config.about.data;
  const heading = `## ${c.about}`;

  if (theme === 'mono') {
    const rawRows: Array<[string, string]> = [
      ['FOCUS', a.currentRole],
      ['WORKING', a.currentWork],
      ['LEARNING', a.currentLearning],
      ['ASK_ME', a.askMeAbout],
      ['CONTACT', a.howToReach],
      ['PHILOSOPHY', a.funFact],
    ];
    const rows = rawRows.filter((r): r is [string, string] => Boolean(r[1]));

    let md = `${heading}\n\n\`\`\`text\n`;
    if (a.summary) md += `[BIO] ${a.summary}\n\n`;
    rows.forEach(([k, v]) => {
      md += `${padEnd(k, 12)}: ${v}\n`;
    });
    return `${md.trimEnd()}\n\`\`\``;
  }

  if (theme === 'paper') {
    let md = `${heading}\n\n`;
    if (a.summary) md += `> *${a.summary}*\n\n`;
    const rawRows: Array<[string, string]> = [
      [c.focus, a.currentRole],
      [c.working, a.currentWork],
      [c.learning, a.currentLearning],
      [c.ask, a.askMeAbout],
      [c.reach, a.howToReach],
      [c.fun, a.funFact],
    ];
    const rows = rawRows.filter((r): r is [string, string] => Boolean(r[1]));
    if (rows.length) {
      md += rows.map(([l, v]) => `* **${l}** — ${v}`).join('\n');
    }
    return md.trim();
  }

  let md = `${heading}\n\n`;
  if (a.summary) md += `${a.summary}\n\n`;
  const rawRows: Array<[string, string]> = [
    [c.focus, a.currentRole],
    [c.working, a.currentWork],
    [c.learning, a.currentLearning],
    [c.ask, a.askMeAbout],
    [c.reach, a.howToReach],
    [c.fun, a.funFact],
  ];
  const filled = rawRows.filter((r): r is [string, string] => Boolean(r[1]));
  if (filled.length) md += filled.map(([l, v]) => `- **${l}**: ${v}`).join('\n');
  return md.trim();
}

function renderTech(
  config: ProfileSectionsConfig,
  theme: ReadmeTheme,
  c: Copy,
  locale: Locale = 'en'
): string | null {
  const ts = config.techStack.data;
  const active = ts.items.filter(i => i.enabled);
  if (!active.length) return null;
  const heading = `## ${c.tech}`;
  const badgeStyle = ts.badgeStyle || config.header.data.badgeStyle || 'for-the-badge';

  const catLabels: Record<string, { en: string; ar: string }> = {
    languages: { en: 'Languages & Runtimes', ar: 'لغات البرمجة وبيئات التشغيل' },
    frontend: { en: 'Frontend & UI Frameworks', ar: 'الواجهات وتجربة المستخدم' },
    backend: { en: 'Backend & APIs', ar: 'الأنظمة الخلفية والـ APIs' },
    mobile: { en: 'Mobile & Cross-Platform', ar: 'تطبيقات الجوال' },
    database: { en: 'Databases & Storage', ar: 'قواعد البيانات والتخزين' },
    devops: { en: 'Cloud, DevOps & Infrastructure', ar: 'السحابة والبنية التحتية' },
    ml_ai: { en: 'AI, Machine Learning & Data', ar: 'الذكاء الاصطناعي وعلوم البيانات' },
    testing: { en: 'Testing & Quality Assurance', ar: 'اختبارات الجودة' },
    design: { en: 'Design & Prototyping', ar: 'التصميم والنماذج' },
    tools: { en: 'Tools & Platforms', ar: 'الأدوات والمنصات' },
  };

  const grouped = new Map<string, typeof active>();
  active.forEach(i => grouped.set(i.category, [...(grouped.get(i.category) ?? []), i]));

  const badge = (i: (typeof active)[number]) =>
    `<img src="https://img.shields.io/badge/${encodeURIComponent(i.name.replace(/-/g, '--'))}-${i.color || '24292e'}?style=${badgeStyle}&logo=${encodeURIComponent(i.badgeSlug || i.id)}&logoColor=white" alt="${i.name}" />`;

  // Mono theme aesthetic
  if (theme === 'mono') {
    let md = `${heading}\n\n\`\`\`text\n`;
    grouped.forEach((items, cat) => {
      const info = catLabels[cat]?.[locale] || catLabels[cat]?.en || cat;
      const paddedCat = padEnd(info.toUpperCase(), 30);
      md += `${paddedCat} : ${items.map(i => i.name).join(' · ')}\n`;
    });
    return `${md.trimEnd()}\n\`\`\``;
  }

  // 1. Badges Cloud: Unified single stream of all badges without category dividers
  if (ts.style === 'badges') {
    return `${heading}\n\n<p align="left">\n${active.map(badge).join('\n')}\n</p>`;
  }

  // 2. Grouped Badges: Badges organized under category subheadings
  if (ts.style === 'grouped-cards') {
    let md = `${heading}\n\n`;
    grouped.forEach((items, cat) => {
      const info = catLabels[cat]?.[locale] || catLabels[cat]?.en || cat;
      md += `### ${info}\n\n<p align="left">\n${items.map(badge).join('\n')}\n</p>\n\n`;
    });
    return md.trim();
  }

  // 3. Table: Markdown table
  if (ts.style === 'minimal-table') {
    const catCol = locale === 'ar' ? 'التصنيف' : 'Category';
    const techCol = locale === 'ar' ? 'التقنيات' : 'Technologies';
    let md = `${heading}\n\n| ${catCol} | ${techCol} |\n| :--- | :--- |\n`;
    grouped.forEach((items, cat) => {
      const info = catLabels[cat]?.[locale] || catLabels[cat]?.en || cat;
      md += `| **${info}** | ${items.map(i => i.name).join(', ')} |\n`;
    });
    return md.trim();
  }

  // 4. Text List: Clean bulleted list
  let md = `${heading}\n\n`;
  grouped.forEach((items, cat) => {
    const info = catLabels[cat]?.[locale] || catLabels[cat]?.en || cat;
    md += `- **${info}**: ${items.map(i => i.name).join(' · ')}\n`;
  });
  return md.trim();
}

function renderExperience(config: ProfileSectionsConfig, theme: ReadmeTheme, c: Copy): string | null {
  const exp = config.experience?.data;
  if (!exp || !exp.items || !exp.items.length) return null;
  const heading = `## ${c.experience}`;

  if (theme === 'mono') {
    let md = `${heading}\n\n\`\`\`text\n`;
    exp.items.forEach((item, idx) => {
      md += `[${String(idx + 1).padStart(2, '0')}] ${item.role} @ ${item.company} (${item.period})\n`;
      if (item.location) md += `     Location: ${item.location}\n`;
      if (item.description) md += `     ${item.description}\n`;
      if (item.highlights && item.highlights.length) {
        item.highlights.forEach(h => {
          md += `     * ${h}\n`;
        });
      }
      if (item.technologies && item.technologies.length) {
        md += `     Stack: ${item.technologies.join(', ')}\n`;
      }
      md += '\n';
    });
    return `${md.trimEnd()}\n\`\`\``;
  }

  let md = `${heading}\n\n`;
  exp.items.forEach(item => {
    md += `### ${item.role} — **${item.company}**\n`;
    md += `*${item.period}${item.location ? ` · ${item.location}` : ''}*\n\n`;
    if (item.description) md += `${item.description}\n\n`;
    if (item.highlights && item.highlights.length) {
      item.highlights.forEach(h => {
        md += `- ${h}\n`;
      });
      md += '\n';
    }
    if (item.technologies && item.technologies.length) {
      const techBadges = item.technologies.map(t => `\`${t}\``).join(' · ');
      md += `**Technologies**: ${techBadges}\n\n`;
    }
  });
  return md.trim();
}

function renderEducation(config: ProfileSectionsConfig, _theme: ReadmeTheme, c: Copy): string | null {
  const edu = config.education?.data;
  if (!edu || !edu.items || !edu.items.length) return null;
  const heading = `## ${c.education}`;

  let md = `${heading}\n\n`;
  edu.items.forEach(item => {
    md += `### ${item.degree}${item.field ? ` in ${item.field}` : ''} — **${item.institution}**\n`;
    md += `*${item.period}${item.gradeOrGpa ? ` · Grade: ${item.gradeOrGpa}` : ''}*\n\n`;
    if (item.highlights && item.highlights.length) {
      item.highlights.forEach(h => {
        md += `- ${h}\n`;
      });
      md += '\n';
    }
  });
  return md.trim();
}

function renderCertifications(config: ProfileSectionsConfig, _theme: ReadmeTheme, c: Copy): string | null {
  const cert = config.certifications?.data;
  if (!cert || !cert.items || !cert.items.length) return null;
  const heading = `## ${c.certifications}`;

  let md = `${heading}\n\n`;
  cert.items.forEach(item => {
    const link = item.url ? ` [↗](${item.url})` : '';
    md += `- **${item.name}** — *${item.issuer}*${item.year ? ` (${item.year})` : ''}${link}\n`;
  });
  return md.trim();
}

function renderProjects(config: ProfileSectionsConfig, theme: ReadmeTheme, username: string, c: Copy): string | null {
  const p = config.projects.data;
  if (!p.projects.length) return null;
  const heading = `## ${c.projects}`;

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
    if (p.showStars) cols.push('Stars');
    if (p.showForks) cols.push('Forks');
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
  const parts: string[] = [];
  const date = new Date(a.generatedAt).toISOString().slice(0, 10);
  const src = a.contributions.source === 'graphql' ? c.srcGraphql : c.srcEvents;
  const totalPublicRepos = profile?.public_repos ?? (a.totals.ownedRepos + a.totals.forkedRepos);

  parts.push(`## ${c.analytics}\n\n> ${c.analyticsNote(totalPublicRepos, date, src)}`);

  // --- Snapshot
  if (d.showSnapshot) {
    const cells: Array<[string, string]> = [
      [c.stars, compact(a.totals.stars)],
      [c.forks, compact(a.totals.forks)],
      [c.repos, String(totalPublicRepos)],
      [c.followers, compact(profile?.followers ?? 0)],
      [c.contribs, compact(a.contributions.total)],
      [c.years, String(a.accountAgeYears)],
    ];
    parts.push(
      `### ${c.snapshot}\n\n` +
        `| ${cells.map(x => x[0]).join(' | ')} |\n| ${cells.map(() => ':-:').join(' | ')} |\n| ${cells.map(x => `**${x[1]}**`).join(' | ')} |`
    );
  }

  // --- Languages (Clean filtered Language DNA, excluding noise < 0.5%)
  if (d.showLanguages && a.languages.length) {
    const verifiedLangs = a.languages.filter(l => l.percent >= 0.5);
    const langs = (verifiedLangs.length ? verifiedLangs : a.languages).slice(0, d.languageLimit);
    const width = Math.max(...langs.map(l => l.name.length), 8) + 2;
    let block = `### ${c.languageDna}\n\n\`\`\`text\n`;
    langs.forEach(l => {
      block += `${padEnd(l.name, width)}${bar(l.percent)}  ${l.percent.toFixed(1).padStart(5)}%   ${l.repos} ${c.reposLabel}\n`;
    });
    block += '```';
    parts.push(block);

    if (d.showLanguagePie && theme !== 'mono') {
      const pie = langs.filter(l => l.percent >= 0.5).slice(0, 6);
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
      [c.morning, sum(5, 12)],
      [c.daytime, sum(12, 17)],
      [c.evening, sum(17, 22)],
      [c.night, sum(22, 24) + sum(0, 5)],
    ];
    let block = `### ${c.rhythm}\n\n\`\`\`text\n`;
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

  // --- Scorecard (Monochromatic, disciplined, zero cartoon emojis)
  if (d.showScores) {
    const s = a.scores;
    const rows: Array<[string, number]> = [
      [c.impact, s.impact],
      [c.consistency, s.consistency],
      [c.versatility, s.versatility],
      [c.maintenance, s.maintenance],
      [c.community, s.community],
      [c.documentation, s.documentation],
    ];
    const arch = ARCHETYPES[a.archetype];
    const second = a.secondaryArchetype ? ` · ${ARCHETYPES[a.secondaryArchetype].label[locale]}` : '';
    let block = `### ${c.scorecard}\n\n`;

    block +=
      `<div align="center">\n\n` +
      `<img src="${shield(c.overall, `${s.overall}/100 · Grade ${s.grade}`, '18181b', undefined, 'flat-square')}" alt="overall" />\n` +
      `<img src="${shield(c.archetype, arch.label.en, '24292e', undefined, 'flat-square')}" alt="archetype" />\n\n</div>\n\n`;

    block += `| ${c.dimension} | ${c.score} | |\n| :-- | :-- | --: |\n`;
    rows.forEach(([label, v]) => (block += `| ${label} | \`${bar(v, 20)}\` | **${v}** |\n`));
    block += `\n> **${arch.label[locale]}**${second} — ${arch.description[locale]}`;
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
      `### ${c.pulse}\n\n| ${cols.map(x => x[0]).join(' | ')} |\n| ${cols.map(() => ':-:').join(' | ')} |\n| ${cols
        .map(x => `**${x[1]}**`)
        .join(' | ')} |`;
    if (k.bestDay) block += `\n\n<sub>${c.best}: **${k.bestDay.count}** — ${k.bestDay.date}</sub>`;
    parts.push(block);
  }

  // --- Timeline
  if (d.showTimeline && a.reposByYear.length > 1) {
    const max = Math.max(...a.reposByYear.map(y => y.count));
    let block = `### ${c.timeline}\n\n\`\`\`text\n`;
    a.reposByYear.forEach(y => (block += `${y.label}  ${bar((y.count / max) * 100, 30)}  ${y.count}\n`));
    parts.push(`${block}\`\`\``);
  }

  // --- Recurring Themes (Clean dark flat badges, count >= 2)
  if (d.showTopics && a.topics.length) {
    const cleanTopics = a.topics.filter(t => t.count >= 2).slice(0, 14);
    const topicsToUse = cleanTopics.length >= 4 ? cleanTopics : a.topics.slice(0, 10);
    const body =
      theme === 'mono'
        ? '`' + topicsToUse.map(t => `#${t.label}`).join('` `') + '`'
        : `<p align="left">\n` +
          topicsToUse
            .map(t => `  <img src="${shield(t.label, String(t.count), '18181b', undefined, 'flat-square')}" alt="${t.label}" />`)
            .join(' \n') +
          `\n</p>`;
    parts.push(`### ${c.topics}\n\n${body}`);
  }

  // --- Insights (Clean, editorial bullet points)
  if (d.showInsights && a.insights.length) {
    parts.push(`### ${c.insights}\n\n${a.insights.map(i => `- ${i[locale]}`).join('\n')}`);
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

  // 1. Streak card (Demolab)
  if (s.showStreakCard) {
    const streakTheme = (t === 'github_dark' || theme === 'showcase' || t === 'default') ? 'tokyonight' : t;
    out.push(`<a href="https://github.com/${username}"><img src="https://streak-stats.demolab.com/?user=${u}&theme=${streakTheme}${border}" alt="GitHub Streak" /></a>`);
  }

  // 2. Profile Details & Language Cards
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

  const heading = `## ${c.metrics}`;
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
    website: { title: 'Portfolio', color: '18181b', logo: 'googlechrome', url: v => `https://${v}` },
    youtube: { title: 'YouTube', color: 'FF0000', logo: 'youtube', url: v => `https://youtube.com/@${v}` },
    devto: { title: 'DEV.to', color: '0A0A0A', logo: 'devdotto', url: v => `https://dev.to/${v}` },
    hashnode: { title: 'Hashnode', color: '2962FF', logo: 'hashnode', url: v => `https://hashnode.com/@${v}` },
  };

  const badgeStyle = config.header.data.badgeStyle || 'for-the-badge';
  const heading = `## ${c.connect}`;

  // Mono aesthetic
  if (theme === 'mono') {
    let md = `${heading}\n\n\`\`\`text\n`;
    if (data.customCta) md += `[NOTE] ${data.customCta}\n\n`;
    links.forEach(link => {
      const meta = META[link.platform];
      if (meta) {
        md += `${padEnd(meta.title.toUpperCase(), 12)}: ${meta.url(link.usernameOrUrl)}\n`;
      }
    });
    return `${md.trimEnd()}\n\`\`\``;
  }

  // Paper or Minimal: Clean markdown links
  if (theme === 'paper' || theme === 'minimal') {
    const textLinks = links.map(link => {
      const meta = META[link.platform];
      if (!meta) return null;
      return `[**${meta.title}**](${meta.url(link.usernameOrUrl)})`;
    }).filter(Boolean);

    return `${heading}\n\n${data.customCta ? `${data.customCta}\n\n` : ''}${textLinks.join('  ·  ')}`;
  }

  // Showcase: Visual badges
  const badges = links
    .map(link => {
      const meta = META[link.platform];
      if (!meta) return null;
      const href = meta.url(link.usernameOrUrl);
      const src = `https://img.shields.io/badge/${encodeURIComponent(meta.title)}-${meta.color}?style=${badgeStyle}&logo=${meta.logo}&logoColor=white`;
      return `<a href="${href}"><img src="${src}" alt="${meta.title}" /></a>`;
    })
    .filter(Boolean);

  const headingTag = `<div align="center">\n\n${heading}\n\n`;
  return `${headingTag}${data.customCta ? `${data.customCta}\n\n` : ''}${badges.join('\n')}\n\n</div>`;
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
    const t = renderTech(config, theme, c, locale);
    if (t) parts.push(t);
  }
  if (config.experience?.enabled) {
    const exp = renderExperience(config, theme, c);
    if (exp) parts.push(exp);
  }
  if (config.education?.enabled) {
    const edu = renderEducation(config, theme, c);
    if (edu) parts.push(edu);
  }
  if (config.certifications?.enabled) {
    const cert = renderCertifications(config, theme, c);
    if (cert) parts.push(cert);
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

  const separator = theme === 'showcase' ? '\n\n<br/>\n\n' : '\n\n---\n\n';
  let body = parts.join(separator);

  if (theme === 'showcase') {
    body +=
      `\n\n<br/>\n\n---\n\n` +
      `<div align="center">\n\n` +
      `<sub>Designed with intention by <a href="https://github.com/${username}">@${username}</a> · ${c.footer}</sub>\n\n` +
      `</div>`;
  } else if (theme === 'paper') {
    body +=
      `\n\n---\n\n` +
      `*Curated with precision · ${c.footer}*`;
  } else if (theme === 'mono') {
    body +=
      `\n\n---\n\n` +
      `\`// END OF PROFILE TRANSMISSION\``;
  }

  if (locale === 'ar') body = `<div dir="rtl">\n\n${body}\n\n</div>`;
  return body;
}
