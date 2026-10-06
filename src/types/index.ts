export type Locale = 'en' | 'ar';
export type AppTheme = 'light' | 'dark';
export type ReadmeTheme = 'showcase' | 'minimal' | 'mono' | 'paper';
export type AppView = 'landing' | 'analytics' | 'builder';

export interface GitHubUserProfile {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  twitter_username?: string | null;
  public_gists?: number;
  hireable?: boolean | null;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  homepage: string | null;
  updated_at: string;
  isSelected?: boolean;
  owner_login?: string;
  fork?: boolean;
  archived?: boolean;
  created_at?: string;
  pushed_at?: string;
  size?: number;
  watchers_count?: number;
  open_issues_count?: number;
  license?: string | null;
  languages?: Record<string, number>;
}

/* ------------------------------------------------------------------ */
/*  Analytics domain                                                   */
/* ------------------------------------------------------------------ */

export interface LanguageStat {
  name: string;
  bytes: number;
  repos: number;
  percent: number;
  color: string;
}

export interface CountStat {
  label: string;
  count: number;
}

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ContributionSummary {
  source: 'graphql' | 'events';
  total: number;
  commits: number;
  pullRequests: number;
  issues: number;
  reviews: number;
  reposContributedTo: number;
  currentStreak: number;
  longestStreak: number;
  bestDay: { date: string; count: number } | null;
  activeDays: number;
  days: ContributionDay[];
}

export interface ScoreCard {
  impact: number;
  consistency: number;
  versatility: number;
  maintenance: number;
  community: number;
  documentation: number;
  overall: number;
  grade: 'S' | 'A+' | 'A' | 'B+' | 'B' | 'C';
}

export type ArchetypeId =
  | 'systems'
  | 'frontend'
  | 'backend'
  | 'fullstack'
  | 'data'
  | 'mobile'
  | 'devops'
  | 'polyglot'
  | 'maintainer'
  | 'explorer';

export interface Insight {
  id: string;
  icon: string;
  en: string;
  ar: string;
}

export interface RepoHighlight {
  name: string;
  fullName: string;
  url: string;
  description: string;
  language: string | null;
  stars: number;
  forks: number;
  pushedAt: string | null;
  topics: string[];
}

export interface ProfileAnalytics {
  generatedAt: string;
  username: string;
  dataQuality: 'full' | 'partial' | 'demo';
  totals: {
    stars: number;
    forks: number;
    watchers: number;
    openIssues: number;
    ownedRepos: number;
    forkedRepos: number;
    archivedRepos: number;
    totalSizeKb: number;
    orgs: number;
    gists: number;
  };
  accountAgeYears: number;
  avgStarsPerRepo: number;
  followerRatio: number;
  languages: LanguageStat[];
  topics: CountStat[];
  licenses: CountStat[];
  reposByYear: CountStat[];
  eventTypes: CountStat[];
  weekdayActivity: number[];
  hourActivity: number[];
  peakHour: number | null;
  peakWeekday: number | null;
  rhythm: 'early-bird' | 'daytime' | 'evening' | 'night-owl' | 'unknown';
  contributions: ContributionSummary;
  recentlyActiveRepos: number;
  scores: ScoreCard;
  archetype: ArchetypeId;
  secondaryArchetype: ArchetypeId | null;
  topRepos: RepoHighlight[];
  hiddenGems: RepoHighlight[];
  recentRepos: RepoHighlight[];
  orgs: Array<{ login: string; avatar: string }>;
  insights: Insight[];
}

export type AnalysisStage = 'profile' | 'repos' | 'languages' | 'activity' | 'contributions' | 'insights' | 'done';

export type TechCategory =
  | 'languages'
  | 'frontend'
  | 'backend'
  | 'mobile'
  | 'database'
  | 'devops'
  | 'ml_ai'
  | 'testing'
  | 'design'
  | 'tools';

export interface TechItem {
  id: string;
  name: string;
  category: TechCategory;
  badgeSlug?: string;
  color?: string;
  enabled: boolean;
}

export interface SocialLink {
  platform: 'github' | 'linkedin' | 'twitter' | 'website' | 'email' | 'youtube' | 'devto' | 'hashnode';
  usernameOrUrl: string;
  enabled: boolean;
}

export type HeaderStyle = 'capsule' | 'terminal' | 'badge-hero' | 'minimal';
export type BannerPattern = 'waving' | 'soft' | 'rect' | 'slice' | 'cylinder';
export type BannerTheme = 'inkwash' | 'cyberpunk' | 'oceanic' | 'sunset' | 'emerald' | 'monochrome' | 'midnight';

export interface HeaderSectionData {
  greeting: string;
  name: string;
  headline: string;
  status: string;
  location: string;
  showAvatar: boolean;
  avatarShape: 'circle' | 'rounded' | 'square';
  headerStyle?: HeaderStyle;
  bannerPattern?: BannerPattern;
  bannerTheme?: BannerTheme;
  showTyping?: boolean;
  typingLines?: string[];
  showViewsCounter?: boolean;
  viewsCounterColor?: string;
  badgeStyle?: 'flat-square' | 'for-the-badge' | 'plastic';
}

export interface AboutSectionData {
  summary: string;
  currentRole: string;
  currentWork: string;
  currentLearning: string;
  askMeAbout: string;
  howToReach: string;
  funFact: string;
}

export interface TechStackSectionData {
  style: 'badges' | 'text-list' | 'minimal-table' | 'grouped-cards';
  badgeStyle?: 'for-the-badge' | 'flat-square' | 'plastic';
  items: TechItem[];
}

export interface FeaturedProjectsSectionData {
  showStars: boolean;
  showForks: boolean;
  showTopics: boolean;
  layout: 'table' | 'cards' | 'list';
  projects: Array<{
    name: string;
    description: string;
    url: string;
    language: string;
    stars: number;
    forks: number;
    fullName?: string;
  }>;
}

export interface StatsSectionData {
  showStatsCard: boolean;
  showStreakCard: boolean;
  showTopLanguagesCard: boolean;
  statsTheme: 'default' | 'tokyonight' | 'radical' | 'minimal' | 'github_dark';
  hideBorder: boolean;
  showActivityGraph: boolean;
  showTrophies: boolean;
  showProfileViews: boolean;
}

export interface AnalyticsSectionData {
  showSnapshot: boolean;
  showLanguages: boolean;
  showLanguagePie: boolean;
  showRhythm: boolean;
  showScores: boolean;
  showContributions: boolean;
  showTimeline: boolean;
  showTopics: boolean;
  showInsights: boolean;
  languageLimit: number;
}

export interface ConnectSectionData {
  links: SocialLink[];
  customCta: string;
}

export interface ProfileSectionsConfig {
  header: { enabled: boolean; data: HeaderSectionData };
  about: { enabled: boolean; data: AboutSectionData };
  techStack: { enabled: boolean; data: TechStackSectionData };
  projects: { enabled: boolean; data: FeaturedProjectsSectionData };
  analytics: { enabled: boolean; data: AnalyticsSectionData };
  stats: { enabled: boolean; data: StatsSectionData };
  connect: { enabled: boolean; data: ConnectSectionData };
}

export interface PublishedBackup {
  timestamp: string;
  username: string;
  sha: string;
  content: string;
  commitUrl: string;
}
