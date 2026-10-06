import React from 'react';
import {
  Locale,
  ProfileAnalytics,
  GitHubUserProfile,
  GitHubRepository,
} from '../types';
import { ARCHETYPES, RHYTHM_LABELS } from '../services/archetypes';
import {
  Sparkles,
  Star,
  GitFork,
  BookOpen,
  Users,
  Flame,
  Calendar,
  Clock,
  Compass,
  Code2,
  ExternalLink,
  Award,
  Layers,
  Activity,
  FileText,
  Zap,
} from 'lucide-react';

interface AnalyticsDashboardProps {
  locale: Locale;
  analytics: ProfileAnalytics | null;
  profile: GitHubUserProfile | null;
  repos: GitHubRepository[];
  onSwitchToBuilder: () => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  locale,
  analytics,
  profile,
  onSwitchToBuilder,
  onRefresh,
  isLoading,
}) => {
  const isAr = locale === 'ar';

  if (!analytics) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[var(--bg)] min-h-[60vh]">
        <div className="w-16 h-16 rounded-2xl bg-[var(--surface-2)] flex items-center justify-center text-[var(--text-muted)] mb-4">
          <Activity className="w-8 h-8 animate-pulse text-[var(--accent)]" />
        </div>
        <h3 className="text-xl font-medium text-[var(--text)] mb-2">
          {isAr ? 'لا توجد بيانات تحليلية بعد' : 'No Analysis Available Yet'}
        </h3>
        <p className="text-sm text-[var(--text-muted)] max-w-md mb-6">
          {isAr
            ? 'أدخل اسم مستخدم GitHub في الأعلى للبدء بالتحليل الحقيقي والكامل بدون اختصار.'
            : 'Enter a GitHub username above to run a complete, non-sampled developer profile analysis.'}
        </p>
      </div>
    );
  }

  const arch = ARCHETYPES[analytics.archetype] || ARCHETYPES['systems'];
  const secArch = analytics.secondaryArchetype ? ARCHETYPES[analytics.secondaryArchetype] : null;
  const scores = analytics.scores;
  const contribs = analytics.contributions;
  const rhythmLabel = RHYTHM_LABELS[analytics.rhythm]?.[locale] || analytics.rhythm;

  const weekdayNames = isAr
    ? ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const maxWeekday = Math.max(...analytics.weekdayActivity, 1);
  const maxHour = Math.max(...analytics.hourActivity, 1);

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--bg)] p-3.5 sm:p-6 lg:p-8 pb-16 lg:pb-8 space-y-6">
      {/* Top Hero Archetype Card */}
      <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 shadow-xs transition-all">
        <div
          className="absolute -top-24 -end-24 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ background: `linear-gradient(135deg, ${arch.gradient[0]}, ${arch.gradient[1]})` }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-6">
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shadow-md shrink-0 border border-white/10"
              style={{ background: `linear-gradient(135deg, ${arch.gradient[0]}, ${arch.gradient[1]})` }}
            >
              <span>{arch.emoji}</span>
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-xs font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-muted)]">
                  {isAr ? 'الهوية البرمجية الغالبة' : 'Primary Developer Archetype'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  {isAr ? `المستوى ${scores.grade}` : `Grade ${scores.grade}`}
                </span>
                {secArch && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[var(--surface-2)] text-[var(--text-muted)]">
                    + {secArch.emoji} {secArch.label[locale]}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text)] mt-2">
                {arch.label[locale]}
              </h1>

              <p className="text-sm text-[var(--text-muted)] mt-1.5 max-w-2xl leading-relaxed">
                {arch.description[locale]}
              </p>
            </div>
          </div>

          {/* Quick Action buttons */}
          <div className="flex items-center gap-3 self-start md:self-center shrink-0">
            <button
              type="button"
              onClick={onSwitchToBuilder}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--accent)] text-white text-xs sm:text-sm font-medium hover:bg-[var(--accent-hover)] active:scale-[0.98] transition-all shadow-xs"
            >
              <FileText className="w-4 h-4" />
              <span>{isAr ? 'فتح محرر الـ README' : 'Open README Studio'}</span>
            </button>
            <button
              type="button"
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface-2)]/60 text-[var(--text)] text-xs sm:text-sm hover:border-[var(--border-strong)] transition-all"
            >
              <Zap className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isAr ? 'تحديث' : 'Refresh'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bento Grid Layer 1: Vital Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] transition-all hover:border-[var(--border-strong)]">
          <div className="flex items-center gap-2 text-[var(--text-muted)] mb-1 text-xs">
            <Star className="w-3.5 h-3.5 text-amber-500" />
            <span>{isAr ? 'النجوم' : 'Total Stars'}</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-[var(--text)]">
            {analytics.totals.stars.toLocaleString()}
          </div>
          <div className="text-[11px] text-[var(--text-subtle)] mt-1">
            {analytics.avgStarsPerRepo.toFixed(1)} {isAr ? 'نجمة/مشروع' : 'avg/repo'}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] transition-all hover:border-[var(--border-strong)]">
          <div className="flex items-center gap-2 text-[var(--text-muted)] mb-1 text-xs">
            <GitFork className="w-3.5 h-3.5 text-blue-500" />
            <span>{isAr ? 'التفريعات' : 'Total Forks'}</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-[var(--text)]">
            {analytics.totals.forks.toLocaleString()}
          </div>
          <div className="text-[11px] text-[var(--text-subtle)] mt-1">
            {isAr ? 'من قبل مجتمع المطورين' : 'community forks'}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] transition-all hover:border-[var(--border-strong)]">
          <div className="flex items-center gap-2 text-[var(--text-muted)] mb-1 text-xs">
            <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
            <span>{isAr ? 'المستودعات العامة' : 'Public Repositories'}</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-[var(--text)]">
            {(profile?.public_repos ?? (analytics.totals.ownedRepos + analytics.totals.forkedRepos)).toLocaleString()}
          </div>
          <div className="text-[11px] text-[var(--text-subtle)] mt-1">
            {analytics.totals.ownedRepos} {isAr ? 'مشروع أصلي' : 'original'} · {analytics.totals.forkedRepos} {isAr ? 'منسوخ' : 'forked'}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] transition-all hover:border-[var(--border-strong)]">
          <div className="flex items-center gap-2 text-[var(--text-muted)] mb-1 text-xs">
            <Users className="w-3.5 h-3.5 text-purple-500" />
            <span>{isAr ? 'المتابعون' : 'Followers'}</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-[var(--text)]">
            {(profile?.followers ?? 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-[var(--text-subtle)] mt-1">
            {profile?.following ?? 0} {isAr ? 'يتابعهم' : 'following'}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] transition-all hover:border-[var(--border-strong)]">
          <div className="flex items-center gap-2 text-[var(--text-muted)] mb-1 text-xs">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span>{isAr ? 'المساهمات والتتابع' : 'Contributions & Streak'}</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-[var(--text)]">
            {contribs.total.toLocaleString()}
          </div>
          <div className="text-[11px] text-[var(--text-subtle)] mt-1">
            {contribs.longestStreak} {isAr ? 'أطول سلسلة' : 'longest streak'} · {contribs.currentStreak} {isAr ? 'تتابع حالي' : 'current'}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] transition-all hover:border-[var(--border-strong)]">
          <div className="flex items-center gap-2 text-[var(--text-muted)] mb-1 text-xs">
            <Calendar className="w-3.5 h-3.5 text-cyan-500" />
            <span>{isAr ? 'عمر الحساب' : 'Account Age'}</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-[var(--text)]">
            {analytics.accountAgeYears} <span className="text-sm font-normal">{isAr ? 'سنة' : 'yrs'}</span>
          </div>
          <div className="text-[11px] text-[var(--text-subtle)] mt-1">
            {isAr ? 'منذ الانضمام لـ GitHub' : 'on GitHub'}
          </div>
        </div>
      </div>

      {/* Bento Grid Layer 2: Scorecard & Language DNA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Dimensions Scorecard (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[var(--accent)]" />
                <h3 className="font-serif text-lg font-bold text-[var(--text)]">
                  {isAr ? 'مصفوفة التقييم الهندسي' : 'Engineering Scorecard'}
                </h3>
              </div>
              <div className="text-end">
                <span className="text-2xl font-bold font-mono text-[var(--accent)]">
                  {scores.overall}
                </span>
                <span className="text-xs text-[var(--text-muted)]">/100</span>
              </div>
            </div>

            <p className="text-xs text-[var(--text-muted)] mb-5">
              {isAr
                ? 'تحليل موضوعي دقيق يعتمد على التفاعل، التوثيق، الصيانة، وتنوع المهارات.'
                : 'Deterministic evaluation across impact, consistency, versatility, and open-source hygiene.'}
            </p>

            <div className="space-y-3.5">
              {[
                { label: isAr ? 'الأثر والتأثير' : 'Impact', val: scores.impact, color: 'bg-indigo-500' },
                { label: isAr ? 'الاستمرارية والنشاط' : 'Consistency', val: scores.consistency, color: 'bg-emerald-500' },
                { label: isAr ? 'التنوع التقني' : 'Versatility', val: scores.versatility, color: 'bg-amber-500' },
                { label: isAr ? 'جودة الصيانة' : 'Maintenance', val: scores.maintenance, color: 'bg-cyan-500' },
                { label: isAr ? 'حضور المجتمع' : 'Community', val: scores.community, color: 'bg-purple-500' },
                { label: isAr ? 'التوثيق والوضوح' : 'Documentation', val: scores.documentation, color: 'bg-rose-500' },
              ].map(dim => (
                <div key={dim.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--text)] font-medium">{dim.label}</span>
                    <span className="font-mono text-[var(--text-muted)]">{dim.val}/100</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[var(--surface-2)] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${dim.color} transition-all duration-700`}
                      style={{ width: `${dim.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>{isAr ? 'تقييم شامل متوازن' : 'Calibrated against verified devs'}</span>
            <span className="font-mono font-bold text-[var(--text)]">Grade: {scores.grade}</span>
          </div>
        </div>

        {/* Language DNA (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[var(--accent)]" />
              <h3 className="font-serif text-lg font-bold text-[var(--text)]">
                {isAr ? 'الحمض النووي البرمجي (Language DNA)' : 'Language DNA'}
              </h3>
            </div>
            <span className="text-xs font-mono text-[var(--text-muted)]">
              {analytics.languages.length} {isAr ? 'لغات مكتشفة' : 'languages'}
            </span>
          </div>

          <p className="text-xs text-[var(--text-muted)] mb-5">
            {isAr
              ? 'محسوبة بدقة البايت (Byte-level) من كافة المشاريع العامة المملوكة للحساب.'
              : 'Computed at exact byte-level resolution across all owned public codebases.'}
          </p>

          {/* Unified horizontal bar */}
          <div className="w-full h-3 rounded-full overflow-hidden flex bg-[var(--surface-2)] mb-5">
            {analytics.languages.slice(0, 10).map((l) => (
              <div
                key={l.name}
                style={{ width: `${l.percent}%`, backgroundColor: l.color }}
                title={`${l.name}: ${l.percent.toFixed(1)}%`}
                className="h-full hover:opacity-80 transition-opacity"
              />
            ))}
          </div>

          {/* Language grid breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pe-1">
            {analytics.languages.slice(0, 12).map((lang) => (
              <div
                key={lang.name}
                className="p-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)]/40 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: lang.color }}
                  />
                  <span className="font-medium text-[var(--text)]">{lang.name}</span>
                </div>
                <div className="flex items-center gap-3 font-mono text-[var(--text-muted)]">
                  <span>{lang.repos} {isAr ? 'مستودع' : 'repos'}</span>
                  <span className="font-semibold text-[var(--text)]">{lang.percent.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bento Grid Layer 3: Activity Rhythm & Developer Chronotype */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Developer Rhythm & Weekly Rhythm (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[var(--accent)]" />
              <h3 className="font-serif text-lg font-bold text-[var(--text)]">
                {isAr ? 'إيقاع النشاط وأوقات الإنتاجية' : 'Activity Rhythm & Peak Hours'}
              </h3>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-medium border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)]">
              {rhythmLabel}
            </span>
          </div>

          <p className="text-xs text-[var(--text-muted)] mb-5">
            {isAr
              ? 'تحليل أوقات الالتزام والمساهمة (UTC) لاستنتاج نمط وساعات الإنتاجية الطبيعية.'
              : 'Chronotype deduced from public commit timestamps and active contribution bursts.'}
          </p>

          {/* Weekday distribution bars */}
          <div className="space-y-2 mb-6">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              {isAr ? 'توزيع الأيام' : 'Weekly Distribution'}
            </h4>
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2 pt-2">
              {analytics.weekdayActivity.map((count, i) => {
                const heightPct = Math.round((count / maxWeekday) * 100);
                const isPeak = analytics.peakWeekday === i;
                return (
                  <div key={i} className="flex flex-col items-center gap-1.5">
                    <div className="w-full h-24 bg-[var(--surface-2)] rounded flex flex-col justify-end p-0.5">
                      <div
                        className={`w-full rounded-sm transition-all duration-500 ${
                          isPeak ? 'bg-[var(--accent)]' : 'bg-[var(--text-muted)]/40 hover:bg-[var(--text-muted)]/70'
                        }`}
                        style={{ height: `${Math.max(6, heightPct)}%` }}
                        title={`${weekdayNames[i]}: ${count} events`}
                      />
                    </div>
                    <span className={`text-[11px] ${isPeak ? 'font-bold text-[var(--accent)]' : 'text-[var(--text-muted)]'}`}>
                      {weekdayNames[i]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hour distribution summary */}
          {analytics.hourActivity.some(v => v > 0) && (
            <div className="pt-2 border-t border-[var(--border)]">
              <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                <span>{isAr ? 'أعلى ساعة نشاط مسجلة:' : 'Peak productive hour:'}</span>
                <span className="font-mono font-bold text-[var(--text)]">
                  {analytics.peakHour !== null ? `${String(analytics.peakHour).padStart(2, '0')}:00 UTC` : '—'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Deep Insights (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="font-serif text-lg font-bold text-[var(--text)]">
                {isAr ? 'ملاحظات ورؤى استنتاجية' : 'Algorithmic Insights'}
              </h3>
            </div>

            <p className="text-xs text-[var(--text-muted)] mb-4">
              {isAr
                ? 'استنتاجات ذكية ومحايدة مستخلصة من عمق الحساب وسجل المشاريع.'
                : 'Data-driven synthesis revealing workflow nuances and engineering strengths.'}
            </p>

            <div className="space-y-3">
              {analytics.insights.slice(0, 5).map((insight) => (
                <div
                  key={insight.id}
                  className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/30 flex items-start gap-3 text-xs"
                >
                  <span className="text-base shrink-0">{insight.icon}</span>
                  <p className="text-[var(--text)] leading-relaxed">
                    {insight[locale]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span className="flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" />
              <span>{isAr ? 'دقة البيانات:' : 'Data quality:'}</span>
            </span>
            <span className="font-mono uppercase font-bold text-[var(--accent)]">
              {analytics.dataQuality}
            </span>
          </div>
        </div>
      </div>

      {/* Curated Repository Spotlights */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[var(--accent)]" />
            <h3 className="font-serif text-lg font-bold text-[var(--text)]">
              {isAr ? 'أبرز المشاريع والجواهر الخفية' : 'Top Spotlights & Hidden Gems'}
            </h3>
          </div>
          <span className="text-xs text-[var(--text-muted)]">
            {isAr ? 'مرتبة بالأثر وجودة الكود' : 'Curated by impact & recency'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...analytics.topRepos.slice(0, 3), ...analytics.hiddenGems.slice(0, 3)].map((r) => (
            <a
              key={r.fullName}
              href={r.url}
              target="_blank"
              rel="noreferrer"
              className="group p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h4 className="font-mono text-sm font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors truncate">
                    {r.name}
                  </h4>
                  <ExternalLink className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--text)] transition-colors shrink-0" />
                </div>
                <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed mb-3">
                  {r.description || (isAr ? 'لا يوجد وصف متاح للمشروع.' : 'No description provided.')}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-[var(--border)]/60 font-mono text-[var(--text-muted)]">
                <span className="flex items-center gap-1.5">
                  {r.language && <span className="font-medium text-[var(--text)]">{r.language}</span>}
                </span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-500" />
                    <span>{r.stars}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork className="w-3 h-3" />
                    <span>{r.forks}</span>
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
