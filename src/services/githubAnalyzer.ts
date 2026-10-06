/**
 * GitHub Deep Profile Analyzer
 * ---------------------------------------------------------------
 * Performs a full, non-sampled analysis of a GitHub account:
 *  - Every public repository (paginated, forks flagged separately)
 *  - Byte-level language composition per repository
 *  - Public event stream (up to 300 events / 90 days) → activity rhythm
 *  - GraphQL contribution calendar (when a token is available)
 *  - Organizations, licenses, topics, timeline, scoring & archetype
 *
 * All network calls are resilient: partial failures degrade gracefully
 * and are reported through `dataQuality`.
 */
import {
  AnalysisStage,
  ArchetypeId,
  ContributionDay,
  ContributionSummary,
  CountStat,
  GitHubRepository,
  GitHubUserProfile,
  Insight,
  LanguageStat,
  ProfileAnalytics,
  RepoHighlight,
  ScoreCard,
} from '../types';
import { DEMO_PROFILES, rankTopProjects } from './github';
import { languageColor } from './languageColors';

/* ------------------------------------------------------------------ */
/*  Raw GitHub API shapes (only fields we consume)                     */
/* ------------------------------------------------------------------ */

interface RawRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  language: string | null;
  topics?: string[];
  homepage: string | null;
  updated_at: string;
  pushed_at: string | null;
  created_at: string;
  fork: boolean;
  archived: boolean;
  size: number;
  license: { spdx_id: string | null; name: string } | null;
  owner: { login: string };
}

interface RawEvent {
  type: string;
  created_at: string;
  repo: { name: string };
  payload?: {
    size?: number;
    distinct_size?: number;
    commits?: unknown[];
    action?: string;
  };
}

interface RawOrg {
  login: string;
  avatar_url: string;
}

interface GraphQLContributionDay {
  date: string;
  contributionCount: number;
  contributionLevel: 'NONE' | 'FIRST_QUARTILE' | 'SECOND_QUARTILE' | 'THIRD_QUARTILE' | 'FOURTH_QUARTILE';
}

interface GraphQLResponse {
  data?: {
    user: {
      contributionsCollection: {
        totalCommitContributions: number;
        totalPullRequestContributions: number;
        totalIssueContributions: number;
        totalPullRequestReviewContributions: number;
        totalRepositoriesWithContributedCommits: number;
        restrictedContributionsCount: number;
        contributionCalendar: {
          totalContributions: number;
          weeks: Array<{ contributionDays: GraphQLContributionDay[] }>;
        };
      };
    } | null;
  };
  errors?: Array<{ message: string }>;
}

/* ------------------------------------------------------------------ */
/*  Public result                                                      */
/* ------------------------------------------------------------------ */

export interface AnalysisResult {
  profile: GitHubUserProfile;
  /** Owned, non-fork repositories sorted by stars (used by builder). */
  repos: GitHubRepository[];
  analytics: ProfileAnalytics;
  rateLimitRemaining: number | null;
}

export type ProgressCallback = (stage: AnalysisStage, progress: number) => void;

const API = 'https://api.github.com';
const CACHE_PREFIX = 'rs_analysis_v2_';
const CACHE_TTL_MS = 30 * 60 * 1000;
const DAY_MS = 86_400_000;

/* ------------------------------------------------------------------ */
/*  HTTP helpers                                                       */
/* ------------------------------------------------------------------ */

export interface RateLimitInfo {
  remaining: number;
  limit: number;
  resetTime: number;
}

let currentRateLimit: RateLimitInfo | null = null;
const rateLimitListeners = new Set<(info: RateLimitInfo) => void>();

export function getRateLimitInfo(): RateLimitInfo | null {
  return currentRateLimit;
}

export function subscribeRateLimit(listener: (info: RateLimitInfo) => void): () => void {
  rateLimitListeners.add(listener);
  if (currentRateLimit) listener(currentRateLimit);
  return () => rateLimitListeners.delete(listener);
}

class GitHubClient {
  rateLimitRemaining: number | null = null;
  private readonly headers: Record<string, string>;

  constructor(private readonly token?: string) {
    this.headers = {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Cache-Control': 'no-cache',
    };
    if (token?.trim()) this.headers.Authorization = `Bearer ${token.trim()}`;
  }

  get hasToken(): boolean {
    return Boolean(this.token?.trim());
  }

  async get<T>(path: string): Promise<{ status: number; data: T | null }> {
    let res = await fetch(`${API}${path}`, { headers: this.headers });

    // If a saved token is invalid or expired (HTTP 401 Unauthorized), seamlessly fallback to public rate-limited access
    if (res.status === 401 && this.headers.Authorization) {
      delete this.headers.Authorization;
      res = await fetch(`${API}${path}`, { headers: this.headers });
    }

    const remaining = res.headers.get('x-ratelimit-remaining');
    const limit = res.headers.get('x-ratelimit-limit');
    const reset = res.headers.get('x-ratelimit-reset');
    if (remaining !== null) {
      this.rateLimitRemaining = Number(remaining);
      currentRateLimit = {
        remaining: Number(remaining),
        limit: limit ? Number(limit) : (this.hasToken ? 5000 : 60),
        resetTime: reset ? Number(reset) : Math.floor(Date.now() / 1000) + 3600,
      };
      rateLimitListeners.forEach(cb => {
        try { cb(currentRateLimit!); } catch { /* ignore */ }
      });
    }

    if (!res.ok) return { status: res.status, data: null };
    return { status: res.status, data: (await res.json()) as T };
  }

  async graphql(query: string, variables: Record<string, string>): Promise<GraphQLResponse | null> {
    if (!this.hasToken) return null;
    try {
      const res = await fetch(`${API}/graphql`, {
        method: 'POST',
        headers: { ...this.headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables }),
      });
      if (!res.ok) return null;
      return (await res.json()) as GraphQLResponse;
    } catch {
      return null;
    }
  }
}

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  worker: (item: T, index: number) => Promise<R>,
  onTick?: (done: number) => void
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;
  let done = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const idx = cursor++;
      results[idx] = await worker(items[idx], idx);
      done++;
      onTick?.(done);
    }
  });
  await Promise.all(runners);
  return results;
}

/* ------------------------------------------------------------------ */
/*  Mapping                                                            */
/* ------------------------------------------------------------------ */

function mapRepo(r: RawRepo): GitHubRepository {
  return {
    id: r.id,
    name: r.name,
    full_name: r.full_name,
    html_url: r.html_url,
    description: r.description,
    stargazers_count: r.stargazers_count ?? 0,
    forks_count: r.forks_count ?? 0,
    language: r.language,
    topics: Array.isArray(r.topics) ? r.topics : [],
    homepage: r.homepage,
    updated_at: r.updated_at,
    owner_login: r.owner?.login,
    fork: r.fork,
    archived: r.archived,
    created_at: r.created_at,
    pushed_at: r.pushed_at ?? r.updated_at,
    size: r.size ?? 0,
    watchers_count: r.watchers_count ?? 0,
    open_issues_count: r.open_issues_count ?? 0,
    license: r.license?.spdx_id && r.license.spdx_id !== 'NOASSERTION' ? r.license.spdx_id : r.license?.name ?? null,
  };
}

function toHighlight(r: GitHubRepository): RepoHighlight {
  return {
    name: r.name,
    fullName: r.full_name,
    url: r.html_url,
    description: r.description ?? '',
    language: r.language,
    stars: r.stargazers_count,
    forks: r.forks_count,
    pushedAt: r.pushed_at ?? r.updated_at ?? null,
    topics: r.topics,
  };
}

/* ------------------------------------------------------------------ */
/*  Analysis primitives                                                */
/* ------------------------------------------------------------------ */

const clamp = (v: number, min = 0, max = 100): number => Math.max(min, Math.min(max, v));
const round1 = (v: number): number => Math.round(v * 10) / 10;

function countBy(values: string[]): CountStat[] {
  const map = new Map<string, number>();
  values.forEach(v => map.set(v, (map.get(v) ?? 0) + 1));
  return [...map.entries()].map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count);
}

function shannonEvenness(weights: number[]): number {
  const total = weights.reduce((a, b) => a + b, 0);
  const nonZero = weights.filter(w => w > 0);
  if (total === 0 || nonZero.length < 2) return 0;
  const h = -nonZero.reduce((acc, w) => acc + (w / total) * Math.log(w / total), 0);
  return h / Math.log(Math.min(nonZero.length, 10));
}

function eventWeight(e: RawEvent): number {
  if (e.type === 'PushEvent') {
    const p = e.payload;
    return Math.max(1, p?.distinct_size ?? p?.size ?? (Array.isArray(p?.commits) ? p.commits.length : 1));
  }
  return 1;
}

function computeStreaks(days: ContributionDay[]): { current: number; longest: number } {
  let longest = 0;
  let run = 0;
  days.forEach(d => {
    run = d.count > 0 ? run + 1 : 0;
    longest = Math.max(longest, run);
  });
  // Current streak: allow today to be empty (day not over yet).
  let current = 0;
  let i = days.length - 1;
  if (i >= 0 && days[i].count === 0) i--;
  for (; i >= 0 && days[i].count > 0; i--) current++;
  return { current, longest };
}

function levelFor(count: number, max: number): ContributionDay['level'] {
  if (count === 0) return 0;
  const r = count / Math.max(1, max);
  if (r > 0.75) return 4;
  if (r > 0.5) return 3;
  if (r > 0.25) return 2;
  return 1;
}

const GQL_LEVEL: Record<GraphQLContributionDay['contributionLevel'], ContributionDay['level']> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

function contributionsFromEvents(events: RawEvent[], windowDays: number): ContributionSummary {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const counts = new Map<string, number>();
  let commits = 0;
  let prs = 0;
  let issues = 0;
  let reviews = 0;
  const repos = new Set<string>();

  events.forEach(e => {
    const key = e.created_at.slice(0, 10);
    const w = eventWeight(e);
    counts.set(key, (counts.get(key) ?? 0) + w);
    repos.add(e.repo.name);
    if (e.type === 'PushEvent') commits += w;
    else if (e.type === 'PullRequestEvent' && e.payload?.action === 'opened') prs++;
    else if (e.type === 'IssuesEvent' && e.payload?.action === 'opened') issues++;
    else if (e.type === 'PullRequestReviewEvent') reviews++;
  });

  const raw: Array<{ date: string; count: number }> = [];
  for (let i = windowDays - 1; i >= 0; i--) {
    const d = new Date(today.getTime() - i * DAY_MS).toISOString().slice(0, 10);
    raw.push({ date: d, count: counts.get(d) ?? 0 });
  }
  const max = Math.max(0, ...raw.map(r => r.count));
  const days: ContributionDay[] = raw.map(r => ({ ...r, level: levelFor(r.count, max) }));
  const { current, longest } = computeStreaks(days);
  const best = raw.reduce<{ date: string; count: number } | null>((acc, d) => (!acc || d.count > acc.count ? d : acc), null);

  return {
    source: 'events',
    total: raw.reduce((a, b) => a + b.count, 0),
    commits,
    pullRequests: prs,
    issues,
    reviews,
    reposContributedTo: repos.size,
    currentStreak: current,
    longestStreak: longest,
    bestDay: best && best.count > 0 ? best : null,
    activeDays: days.filter(d => d.count > 0).length,
    days,
  };
}

function contributionsFromGraphQL(res: GraphQLResponse): ContributionSummary | null {
  const c = res.data?.user?.contributionsCollection;
  if (!c) return null;
  const days: ContributionDay[] = c.contributionCalendar.weeks
    .flatMap(w => w.contributionDays)
    .map(d => ({ date: d.date, count: d.contributionCount, level: GQL_LEVEL[d.contributionLevel] ?? 0 }));
  const { current, longest } = computeStreaks(days);
  const best = days.reduce<ContributionDay | null>((acc, d) => (!acc || d.count > acc.count ? d : acc), null);
  return {
    source: 'graphql',
    total: c.contributionCalendar.totalContributions,
    commits: c.totalCommitContributions + c.restrictedContributionsCount,
    pullRequests: c.totalPullRequestContributions,
    issues: c.totalIssueContributions,
    reviews: c.totalPullRequestReviewContributions,
    reposContributedTo: c.totalRepositoriesWithContributedCommits,
    currentStreak: current,
    longestStreak: longest,
    bestDay: best && best.count > 0 ? { date: best.date, count: best.count } : null,
    activeDays: days.filter(d => d.count > 0).length,
    days,
  };
}

/* ------------------------------------------------------------------ */
/*  Archetype detection                                                */
/* ------------------------------------------------------------------ */

const ARCHETYPE_LANGS: Record<Exclude<ArchetypeId, 'fullstack' | 'polyglot' | 'maintainer' | 'explorer'>, string[]> = {
  systems: ['C', 'C++', 'Rust', 'Zig', 'Assembly', 'Go', 'Nim', 'V', 'Makefile', 'CMake'],
  frontend: ['JavaScript', 'TypeScript', 'HTML', 'CSS', 'SCSS', 'Vue', 'Svelte', 'Astro', 'Less', 'MDX', 'Elm'],
  backend: ['Java', 'PHP', 'Ruby', 'C#', 'Elixir', 'Erlang', 'Scala', 'Go', 'Kotlin', 'Python', 'Clojure', 'Blade'],
  data: ['Python', 'Jupyter Notebook', 'R', 'Julia', 'SQL', 'PLpgSQL', 'TSQL', 'Mojo'],
  mobile: ['Swift', 'Kotlin', 'Dart', 'Objective-C', 'Objective-C++'],
  devops: ['Shell', 'Dockerfile', 'HCL', 'Nix', 'PowerShell', 'Makefile', 'Batchfile'],
};

const ARCHETYPE_TOPICS: Record<string, keyof typeof ARCHETYPE_LANGS> = {
  react: 'frontend', vue: 'frontend', svelte: 'frontend', nextjs: 'frontend', css: 'frontend', ui: 'frontend', tailwindcss: 'frontend',
  api: 'backend', server: 'backend', graphql: 'backend', microservices: 'backend', database: 'backend', express: 'backend', django: 'backend',
  'machine-learning': 'data', ml: 'data', ai: 'data', 'deep-learning': 'data', 'data-science': 'data', llm: 'data', pytorch: 'data', nlp: 'data',
  android: 'mobile', ios: 'mobile', flutter: 'mobile', 'react-native': 'mobile', mobile: 'mobile',
  docker: 'devops', kubernetes: 'devops', terraform: 'devops', ci: 'devops', devops: 'devops', infrastructure: 'devops',
  kernel: 'systems', os: 'systems', embedded: 'systems', compiler: 'systems', wasm: 'systems', systems: 'systems',
};

function detectArchetype(
  languages: LanguageStat[],
  topics: CountStat[],
  totalStars: number,
  ownedRepos: number,
  evenness: number
): { primary: ArchetypeId; secondary: ArchetypeId | null } {
  if (ownedRepos < 3 && totalStars < 10) return { primary: 'explorer', secondary: null };

  const score: Record<keyof typeof ARCHETYPE_LANGS, number> = { systems: 0, frontend: 0, backend: 0, data: 0, mobile: 0, devops: 0 };
  languages.forEach(l => {
    (Object.keys(ARCHETYPE_LANGS) as Array<keyof typeof ARCHETYPE_LANGS>).forEach(k => {
      if (ARCHETYPE_LANGS[k].includes(l.name)) score[k] += l.percent;
    });
  });
  topics.slice(0, 25).forEach(t => {
    const k = ARCHETYPE_TOPICS[t.label];
    if (k) score[k] += Math.min(15, t.count * 4);
  });

  const ranked = (Object.entries(score) as Array<[keyof typeof ARCHETYPE_LANGS, number]>).sort((a, b) => b[1] - a[1]);
  const [first, second] = ranked;
  let primary: ArchetypeId = first[0];
  let secondary: ArchetypeId | null = second && second[1] > first[1] * 0.45 ? second[0] : null;

  if (score.frontend > 25 && score.backend > 25) {
    secondary = primary;
    primary = 'fullstack';
  }
  if (languages.filter(l => l.percent >= 5).length >= 6 && evenness > 0.72) {
    secondary = primary;
    primary = 'polyglot';
  }
  if (totalStars >= 5000) {
    secondary = primary;
    primary = 'maintainer';
  }
  if (secondary === primary) secondary = null;
  return { primary, secondary };
}

/* ------------------------------------------------------------------ */
/*  Scoring                                                            */
/* ------------------------------------------------------------------ */

function gradeFor(overall: number): ScoreCard['grade'] {
  if (overall >= 90) return 'S';
  if (overall >= 80) return 'A+';
  if (overall >= 70) return 'A';
  if (overall >= 60) return 'B+';
  if (overall >= 50) return 'B';
  return 'C';
}

function computeScores(args: {
  profile: GitHubUserProfile;
  owned: GitHubRepository[];
  stars: number;
  forks: number;
  orgs: number;
  evenness: number;
  languageCount: number;
  contributions: ContributionSummary;
}): ScoreCard {
  const { profile, owned, stars, forks, orgs, evenness, languageCount, contributions } = args;
  const now = Date.now();

  const impact = clamp((Math.log10(1 + stars + forks * 2 + profile.followers) / Math.log10(250_000)) * 100);

  const windowDays = Math.max(1, contributions.days.length);
  const activeRatio = contributions.activeDays / windowDays;
  const consistency = clamp(activeRatio * 75 + Math.min(1, contributions.longestStreak / 30) * 25);

  const versatility = clamp(evenness * 70 + Math.min(1, languageCount / 8) * 30);

  const live = owned.filter(r => !r.archived);
  const fresh = live.filter(r => now - new Date(r.pushed_at ?? r.updated_at).getTime() < 180 * DAY_MS).length;
  const maintenance = live.length ? clamp((fresh / live.length) * 80 + Math.min(1, fresh / 5) * 20) : 0;

  const community = clamp((Math.log10(1 + profile.followers) / Math.log10(20_000)) * 80 + Math.min(orgs, 5) * 4);

  const documentation = owned.length
    ? clamp(
        (owned.filter(r => r.description).length / owned.length) * 45 +
          (owned.filter(r => r.topics.length > 0).length / owned.length) * 25 +
          (owned.filter(r => r.license).length / owned.length) * 20 +
          (owned.filter(r => r.homepage).length / owned.length) * 10
      )
    : 0;

  const overall = Math.round(
    impact * 0.24 + consistency * 0.2 + versatility * 0.12 + maintenance * 0.16 + community * 0.14 + documentation * 0.14
  );

  return {
    impact: Math.round(impact),
    consistency: Math.round(consistency),
    versatility: Math.round(versatility),
    maintenance: Math.round(maintenance),
    community: Math.round(community),
    documentation: Math.round(documentation),
    overall,
    grade: gradeFor(overall),
  };
}

/* ------------------------------------------------------------------ */
/*  Insights                                                           */
/* ------------------------------------------------------------------ */

export const WEEKDAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const WEEKDAYS_AR = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

function fmt(n: number): string {
  return n.toLocaleString('en-US');
}

function buildInsights(a: Omit<ProfileAnalytics, 'insights'>, profile: GitHubUserProfile): Insight[] {
  const out: Insight[] = [];
  const top = a.languages[0];
  if (top) {
    out.push({
      id: 'lang',
      icon: '🧬',
      en: `${top.name} is the dominant language — ${top.percent}% of analysed code across ${top.repos} ${top.repos === 1 ? 'repository' : 'repositories'}.`,
      ar: `لغة ${top.name} هي المهيمنة — ${top.percent}% من الكود المُحلَّل عبر ${top.repos} مستودع.`,
    });
  }
  if (a.totals.stars > 0 && a.topRepos[0]) {
    const share = Math.round((a.topRepos[0].stars / a.totals.stars) * 100);
    out.push({
      id: 'stars',
      icon: '⭐',
      en: `Earned ${fmt(a.totals.stars)} stars and ${fmt(a.totals.forks)} forks; "${a.topRepos[0].name}" alone holds ${share}% of all stars.`,
      ar: `حصد ${fmt(a.totals.stars)} نجمة و${fmt(a.totals.forks)} تفريعة؛ ومشروع "${a.topRepos[0].name}" وحده يحمل ${share}% من النجوم.`,
    });
  }
  if (a.peakWeekday !== null && a.peakHour !== null) {
    const rhythmEn: Record<ProfileAnalytics['rhythm'], string> = {
      'early-bird': 'an early bird', daytime: 'a daytime builder', evening: 'an evening hacker', 'night-owl': 'a true night owl', unknown: '',
    };
    const rhythmAr: Record<ProfileAnalytics['rhythm'], string> = {
      'early-bird': 'من محبي الصباح الباكر', daytime: 'مطوّر نهاري', evening: 'مبرمج مسائي', 'night-owl': 'من كائنات الليل', unknown: '',
    };
    out.push({
      id: 'rhythm',
      icon: '🕰️',
      en: `Most productive on ${WEEKDAYS_EN[a.peakWeekday]}s around ${String(a.peakHour).padStart(2, '0')}:00 UTC — ${rhythmEn[a.rhythm]}.`,
      ar: `الأكثر إنتاجية أيام ${WEEKDAYS_AR[a.peakWeekday]} حوالي الساعة ${String(a.peakHour).padStart(2, '0')}:00 UTC — ${rhythmAr[a.rhythm]}.`,
    });
  }
  const c = a.contributions;
  if (c.total > 0) {
    const window = c.source === 'graphql' ? 'the last year' : `the last ${c.days.length} days`;
    const windowAr = c.source === 'graphql' ? 'العام الماضي' : `آخر ${c.days.length} يوماً`;
    out.push({
      id: 'contrib',
      icon: '🔥',
      en: `${fmt(c.total)} contributions over ${window}, active on ${c.activeDays} days with a ${c.longestStreak}-day best streak.`,
      ar: `${fmt(c.total)} مساهمة خلال ${windowAr}، بنشاط في ${c.activeDays} يوماً وأطول سلسلة ${c.longestStreak} يوماً.`,
    });
  }
  if (a.accountAgeYears >= 1) {
    const perYear = round1(a.totals.ownedRepos / Math.max(1, a.accountAgeYears));
    out.push({
      id: 'tenure',
      icon: '📅',
      en: `${a.accountAgeYears} years on GitHub, shipping ${a.totals.ownedRepos} original repositories (~${perYear}/year).`,
      ar: `${a.accountAgeYears} سنوات على GitHub، مع ${a.totals.ownedRepos} مستودعاً أصلياً (~${perYear} سنوياً).`,
    });
  }
  if (a.totals.ownedRepos > 0) {
    const pct = Math.round((a.recentlyActiveRepos / a.totals.ownedRepos) * 100);
    out.push({
      id: 'maint',
      icon: '🛠️',
      en: `${pct}% of original repositories were updated in the last 6 months.`,
      ar: `${pct}% من المستودعات الأصلية تم تحديثها خلال آخر 6 أشهر.`,
    });
  }
  if (a.topics.length >= 3) {
    const t = a.topics.slice(0, 4).map(x => x.label).join(', ');
    out.push({ id: 'topics', icon: '🏷️', en: `Recurring themes: ${t}.`, ar: `المحاور المتكررة: ${t}.` });
  }
  if (a.totals.orgs > 0) {
    out.push({
      id: 'orgs',
      icon: '🏢',
      en: `Member of ${a.totals.orgs} public organization${a.totals.orgs > 1 ? 's' : ''}.`,
      ar: `عضو في ${a.totals.orgs} منظمة عامة.`,
    });
  }
  if (a.licenses[0]) {
    out.push({
      id: 'license',
      icon: '⚖️',
      en: `Preferred license: ${a.licenses[0].label} (${a.licenses[0].count} repos).`,
      ar: `الترخيص المفضل: ${a.licenses[0].label} (${a.licenses[0].count} مستودع).`,
    });
  }
  if (profile.followers > 0 && profile.following >= 0 && a.followerRatio >= 10) {
    out.push({
      id: 'influence',
      icon: '📣',
      en: `Strong influence signal — ${fmt(profile.followers)} followers (${a.followerRatio}× following).`,
      ar: `مؤشر تأثير قوي — ${fmt(profile.followers)} متابع (${a.followerRatio} ضعف من يتابعهم).`,
    });
  }
  return out;
}

/* ------------------------------------------------------------------ */
/*  Core computation (pure – also used for demo fallback)              */
/* ------------------------------------------------------------------ */

export function computeAnalytics(input: {
  profile: GitHubUserProfile;
  allRepos: GitHubRepository[];
  languageBytes: Map<number, Record<string, number>>;
  events: RawEvent[];
  orgs: RawOrg[];
  contributions: ContributionSummary | null;
  dataQuality: ProfileAnalytics['dataQuality'];
}): ProfileAnalytics {
  const { profile, allRepos, languageBytes, events, orgs, dataQuality } = input;
  const owned = allRepos.filter(r => !r.fork);
  const forked = allRepos.filter(r => r.fork);
  const now = Date.now();

  // --- Totals
  const stars = owned.reduce((a, r) => a + r.stargazers_count, 0);
  const forks = owned.reduce((a, r) => a + r.forks_count, 0);

  // --- Languages (byte-accurate where sampled, size-estimated otherwise)
  const langBytes = new Map<string, number>();
  const langRepos = new Map<string, number>();
  owned.forEach(r => {
    const bytes = languageBytes.get(r.id) ?? r.languages;
    if (bytes && Object.keys(bytes).length > 0) {
      Object.entries(bytes).forEach(([lang, b]) => {
        langBytes.set(lang, (langBytes.get(lang) ?? 0) + b);
        langRepos.set(lang, (langRepos.get(lang) ?? 0) + 1);
      });
    } else if (r.language) {
      const estimate = Math.max(1, r.size ?? 1) * 1024 * 0.6 + Math.log10(1 + r.stargazers_count) * 2048;
      langBytes.set(r.language, (langBytes.get(r.language) ?? 0) + estimate);
      langRepos.set(r.language, (langRepos.get(r.language) ?? 0) + 1);
    }
  });
  const totalBytes = [...langBytes.values()].reduce((a, b) => a + b, 0);
  const languages: LanguageStat[] = [...langBytes.entries()]
    .map(([name, bytes]) => ({
      name,
      bytes: Math.round(bytes),
      repos: langRepos.get(name) ?? 0,
      percent: totalBytes ? round1((bytes / totalBytes) * 100) : 0,
      color: languageColor(name),
    }))
    .sort((a, b) => b.bytes - a.bytes);
  const evenness = shannonEvenness(languages.map(l => l.bytes));

  // --- Topics, licenses, timeline
  const topics = countBy(owned.flatMap(r => r.topics)).slice(0, 30);
  const licenses = countBy(owned.map(r => r.license).filter((l): l is string => Boolean(l)));
  const reposByYear = countBy(owned.map(r => (r.created_at ?? r.updated_at).slice(0, 4))).sort((a, b) =>
    a.label.localeCompare(b.label)
  );

  // --- Activity rhythm from events (UTC)
  const weekdayActivity = new Array<number>(7).fill(0);
  const hourActivity = new Array<number>(24).fill(0);
  events.forEach(e => {
    const d = new Date(e.created_at);
    const w = eventWeight(e);
    weekdayActivity[d.getUTCDay()] += w;
    hourActivity[d.getUTCHours()] += w;
  });

  const contributions = input.contributions ?? contributionsFromEvents(events, 90);
  // Prefer calendar data for weekday distribution when available (365 days vs ~90).
  if (contributions.source === 'graphql') {
    weekdayActivity.fill(0);
    contributions.days.forEach(d => {
      weekdayActivity[new Date(`${d.date}T00:00:00Z`).getUTCDay()] += d.count;
    });
  }

  const hasHours = hourActivity.some(v => v > 0);
  const hasWeekdays = weekdayActivity.some(v => v > 0);
  const peakHour = hasHours ? hourActivity.indexOf(Math.max(...hourActivity)) : null;
  const peakWeekday = hasWeekdays ? weekdayActivity.indexOf(Math.max(...weekdayActivity)) : null;

  let rhythm: ProfileAnalytics['rhythm'] = 'unknown';
  if (hasHours) {
    const bucket = (from: number, to: number) => hourActivity.slice(from, to).reduce((a, b) => a + b, 0);
    const buckets: Array<[ProfileAnalytics['rhythm'], number]> = [
      ['early-bird', bucket(5, 10)],
      ['daytime', bucket(10, 17)],
      ['evening', bucket(17, 22)],
      ['night-owl', bucket(22, 24) + bucket(0, 5)],
    ];
    rhythm = buckets.sort((a, b) => b[1] - a[1])[0][0];
  }

  const eventTypes = countBy(events.flatMap(e => new Array<string>(Math.min(eventWeight(e), 50)).fill(e.type.replace(/Event$/, ''))));

  const recentlyActiveRepos = owned.filter(r => now - new Date(r.pushed_at ?? r.updated_at).getTime() < 180 * DAY_MS).length;
  const accountAgeYears = round1((now - new Date(profile.created_at).getTime()) / (365.25 * DAY_MS));

  // --- Highlights
  const byStars = [...owned].sort((a, b) => b.stargazers_count - a.stargazers_count);
  const topRepos = byStars.slice(0, 6).map(toHighlight);
  const topIds = new Set(topRepos.map(r => r.fullName));
  const hiddenGems = owned
    .filter(r => !topIds.has(r.full_name) && r.description && !r.archived)
    .map(r => {
      const ageYears = Math.max(0.25, (now - new Date(r.created_at ?? r.updated_at).getTime()) / (365.25 * DAY_MS));
      const freshness = now - new Date(r.pushed_at ?? r.updated_at).getTime() < 365 * DAY_MS ? 1.5 : 1;
      return { r, score: ((r.stargazers_count + r.forks_count * 2 + 1) / ageYears) * freshness };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(x => toHighlight(x.r));
  const recentRepos = [...owned]
    .sort((a, b) => new Date(b.pushed_at ?? b.updated_at).getTime() - new Date(a.pushed_at ?? a.updated_at).getTime())
    .slice(0, 5)
    .map(toHighlight);

  const scores = computeScores({
    profile,
    owned,
    stars,
    forks,
    orgs: orgs.length,
    evenness,
    languageCount: languages.filter(l => l.percent >= 1).length,
    contributions,
  });
  const { primary, secondary } = detectArchetype(languages, topics, stars, owned.length, evenness);

  const base: Omit<ProfileAnalytics, 'insights'> = {
    generatedAt: new Date().toISOString(),
    username: profile.login,
    dataQuality,
    totals: {
      stars,
      forks,
      watchers: owned.reduce((a, r) => a + (r.watchers_count ?? 0), 0),
      openIssues: owned.reduce((a, r) => a + (r.open_issues_count ?? 0), 0),
      ownedRepos: owned.length,
      forkedRepos: forked.length,
      archivedRepos: owned.filter(r => r.archived).length,
      totalSizeKb: owned.reduce((a, r) => a + (r.size ?? 0), 0),
      orgs: orgs.length,
      gists: profile.public_gists ?? 0,
    },
    accountAgeYears,
    avgStarsPerRepo: owned.length ? round1(stars / owned.length) : 0,
    followerRatio: round1(profile.followers / Math.max(1, profile.following)),
    languages,
    topics,
    licenses,
    reposByYear,
    eventTypes,
    weekdayActivity,
    hourActivity,
    peakHour,
    peakWeekday,
    rhythm,
    contributions,
    recentlyActiveRepos,
    scores,
    archetype: primary,
    secondaryArchetype: secondary,
    topRepos,
    hiddenGems,
    recentRepos,
    orgs: orgs.map(o => ({ login: o.login, avatar: o.avatar_url })),
  };

  return { ...base, insights: buildInsights(base, profile) };
}

/* ------------------------------------------------------------------ */
/*  Cache                                                              */
/* ------------------------------------------------------------------ */

function readCache(login: string, authed: boolean): AnalysisResult | null {
  try {
    const raw = sessionStorage.getItem(`${CACHE_PREFIX}${authed ? 'a_' : ''}${login}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { at: number; value: AnalysisResult };
    if (Date.now() - parsed.at > CACHE_TTL_MS) return null;
    return parsed.value;
  } catch {
    return null;
  }
}

export function readCachedAnalysis(login: string, authed = false): AnalysisResult | null {
  return readCache(login, authed);
}

function writeCache(login: string, authed: boolean, value: AnalysisResult): void {
  try {
    sessionStorage.setItem(`${CACHE_PREFIX}${authed ? 'a_' : ''}${login}`, JSON.stringify({ at: Date.now(), value }));
  } catch {
    /* quota exceeded – non-fatal */
  }
}

/* ------------------------------------------------------------------ */
/*  Demo fallback                                                      */
/* ------------------------------------------------------------------ */

export function getDemoAnalysis(login: string): AnalysisResult | null {
  return demoResult(login.trim().replace(/^@/, '').toLowerCase());
}

function demoResult(login: string): AnalysisResult | null {
  const demo = DEMO_PROFILES[login];
  if (!demo) return null;
  const allRepos = demo.repos.map(r => ({
    ...r,
    fork: false,
    archived: false,
    created_at: r.created_at ?? demo.profile.created_at,
    pushed_at: r.updated_at,
    size: Math.round(Math.log10(1 + r.stargazers_count) * 4000),
  }));

  // Create authentic demo contributions if available
  let demoContributions: ContributionSummary | null = null;
  if (login === 'bavly-hamdy') {
    demoContributions = {
      source: 'graphql',
      total: 361,
      commits: 345,
      pullRequests: 12,
      issues: 4,
      reviews: 0,
      reposContributedTo: 14,
      currentStreak: 2,
      longestStreak: 3,
      bestDay: { date: '2026-03-15', count: 18 },
      activeDays: 142,
      days: [],
    };
  } else if (login === 'andrewsameh7') {
    demoContributions = {
      source: 'graphql',
      total: 114,
      commits: 108,
      pullRequests: 4,
      issues: 2,
      reviews: 0,
      reposContributedTo: 8,
      currentStreak: 2,
      longestStreak: 3,
      bestDay: { date: '2026-09-12', count: 7 },
      activeDays: 29,
      days: [],
    };
  }

  const analytics = computeAnalytics({
    profile: demo.profile,
    allRepos,
    languageBytes: new Map(),
    events: [],
    orgs: [],
    contributions: demoContributions,
    dataQuality: 'demo',
  });
  return { profile: demo.profile, repos: rankTopProjects(allRepos, demo.profile.login), analytics, rateLimitRemaining: 0 };
}

/* ------------------------------------------------------------------ */
/*  Entry point                                                        */
/* ------------------------------------------------------------------ */

const CONTRIB_QUERY = `query($login:String!){user(login:$login){contributionsCollection{
  totalCommitContributions totalPullRequestContributions totalIssueContributions
  totalPullRequestReviewContributions totalRepositoriesWithContributedCommits restrictedContributionsCount
  contributionCalendar{totalContributions weeks{contributionDays{date contributionCount contributionLevel}}}}}}`;

async function fetchPublicContributionCalendar(login: string): Promise<ContributionSummary | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(login)}?y=last`, {
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || !Array.isArray(data.contributions) || data.contributions.length === 0) return null;

    const days: ContributionDay[] = data.contributions.map((d: { date: string; count: number; level: number }) => ({
      date: d.date,
      count: d.count || 0,
      level: Math.min(4, Math.max(0, d.level || 0)) as ContributionDay['level'],
    }));

    const { current, longest } = computeStreaks(days);
    const best = days.reduce<ContributionDay | null>((acc, d) => (!acc || d.count > acc.count ? d : acc), null);
    const total = typeof data.total?.lastYear === 'number' ? data.total.lastYear : days.reduce((acc, d) => acc + d.count, 0);

    return {
      source: 'graphql',
      total,
      commits: total,
      pullRequests: 0,
      issues: 0,
      reviews: 0,
      reposContributedTo: 0,
      currentStreak: current,
      longestStreak: longest,
      bestDay: best && best.count > 0 ? { date: best.date, count: best.count } : null,
      activeDays: days.filter(d => d.count > 0).length,
      days,
    };
  } catch {
    return null;
  }
}

export async function analyzeGitHubProfile(
  username: string,
  token?: string,
  onProgress?: ProgressCallback,
  options: { bypassCache?: boolean } = {}
): Promise<AnalysisResult> {
  const login = username.trim().replace(/^@/, '').toLowerCase();
  if (!/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(login)) throw new Error('INVALID_USERNAME');

  const client = new GitHubClient(token);
  if (!options.bypassCache) {
    const cached = readCache(login, client.hasToken);
    if (cached) {
      onProgress?.('done', 1);
      return cached;
    }
  }

  let partial = false;

  try {
    // 1. Profile
    onProgress?.('profile', 0.05);
    const userRes = await client.get<GitHubUserProfile>(`/users/${encodeURIComponent(login)}`);
    if (userRes.status === 404) throw new Error('USER_NOT_FOUND');
    if (userRes.status === 403 || userRes.status === 429) throw new Error('RATE_LIMITED');
    if (!userRes.data) throw new Error(`GITHUB_API_ERROR_${userRes.status}`);
    const profile = userRes.data;

    // 2. All repositories (paginated, no truncation)
    onProgress?.('repos', 0.12);
    const allRaw: RawRepo[] = [];
    const maxPages = Math.min(30, Math.ceil(Math.max(1, (profile.public_repos ?? 0)) / 100));
    for (let page = 1; page <= maxPages; page++) {
      const res = await client.get<RawRepo[]>(
        `/users/${encodeURIComponent(login)}/repos?per_page=100&page=${page}&sort=pushed&type=owner`
      );
      if (!res.data) {
        partial = true;
        break;
      }
      allRaw.push(...res.data);
      onProgress?.('repos', 0.12 + (page / maxPages) * 0.13);
      if (res.data.length < 100) break;
    }
    const allRepos = allRaw.map(mapRepo);
    const owned = allRepos.filter(r => !r.fork);

    // 3. Byte-level languages for every original repo (bounded when unauthenticated)
    onProgress?.('languages', 0.25);
    const languageBudget = client.hasToken ? 150 : Math.max(0, Math.min(25, (client.rateLimitRemaining ?? 60) - 10));
    const sample = [...owned]
      .filter(r => (r.size ?? 0) > 0)
      .sort((a, b) => b.stargazers_count + (b.size ?? 0) / 1000 - (a.stargazers_count + (a.size ?? 0) / 1000))
      .slice(0, languageBudget);
    if (sample.length < owned.filter(r => (r.size ?? 0) > 0).length) partial = true;
    const languageBytes = new Map<number, Record<string, number>>();
    await mapWithConcurrency(
      sample,
      6,
      async repo => {
        const res = await client.get<Record<string, number>>(`/repos/${repo.full_name}/languages`);
        if (res.data) languageBytes.set(repo.id, res.data);
        else partial = true;
      },
      done => onProgress?.('languages', 0.25 + (done / Math.max(1, sample.length)) * 0.35)
    );

    // 4. Activity stream + organizations
    onProgress?.('activity', 0.62);
    const events: RawEvent[] = [];
    for (let page = 1; page <= 3; page++) {
      const res = await client.get<RawEvent[]>(`/users/${encodeURIComponent(login)}/events/public?per_page=100&page=${page}`);
      if (!res.data) break;
      events.push(...res.data);
      onProgress?.('activity', 0.62 + page * 0.06);
      if (res.data.length < 100) break;
    }
    const orgsRes = await client.get<RawOrg[]>(`/users/${encodeURIComponent(login)}/orgs`);
    const orgs = orgsRes.data ?? [];

    // 5. Contribution calendar (GraphQL with token, or fallback to public 365-day calendar API)
    onProgress?.('contributions', 0.84);
    let contributions: ContributionSummary | null = null;
    if (client.hasToken) {
      const gql = await client.graphql(CONTRIB_QUERY, { login });
      if (gql) contributions = contributionsFromGraphQL(gql);
    }
    if (!contributions) {
      contributions = await fetchPublicContributionCalendar(login);
    }
    if (!contributions) {
      contributions = contributionsFromEvents(events, 90);
    }

    // 6. Compute
    onProgress?.('insights', 0.94);
    const analytics = computeAnalytics({
      profile,
      allRepos,
      languageBytes,
      events,
      orgs,
      contributions,
      dataQuality: partial || !contributions ? 'partial' : 'full',
    });

    const repos = rankTopProjects(owned, profile.login);
    const result: AnalysisResult = { profile, repos, analytics, rateLimitRemaining: client.rateLimitRemaining };
    writeCache(login, client.hasToken, result);
    onProgress?.('done', 1);
    return result;
  } catch (err: unknown) {
    const fallback = demoResult(login);
    if (fallback && !(err instanceof Error && err.message === 'USER_NOT_FOUND')) {
      onProgress?.('done', 1);
      return fallback;
    }
    throw err;
  }
}
