import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Locale } from '../types';
import { translations } from '../i18n/translations';
import {
  X,
  Sparkles,
  FileText,
  Briefcase,
  CheckCircle2,
  ShieldCheck,
  BarChart3,
  UploadCloud,
  Layers,
  ArrowRight,
  Flame,
  Zap,
} from 'lucide-react';

interface WhatsNewModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
  onOpenResume?: () => void;
}

export const WhatsNewModal: React.FC<WhatsNewModalProps> = ({
  isOpen,
  onClose,
  locale,
  onOpenResume,
}) => {
  const isAr = locale === 'ar';
  const t = translations[locale];
  const wn = (t as any).whatsNew || {};

  if (!isOpen) return null;

  const features = [
    {
      icon: <FileText className="w-5 h-5 text-purple-500" />,
      badge: isAr ? 'رئيسي' : 'Major',
      badgeColor: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/25',
      title: isAr ? 'استيراد وتحليل الـ Resume / CV عبر الذكاء الاصطناعي' : 'Multimodal AI Resume / CV Synergy',
      desc: isAr
        ? 'ارفع ملف سيرتك الذاتية (PDF/Text) ليقوم محرك Gemini 3.8 Flash بتحليله ومطابقته بدقة 100% مع مستودعات GitHub الحقيقية لاستخراج مسارك الوظيفي بلا أي تكهن.'
        : 'Upload your CV (PDF or plain text). Gemini 3.8 Flash cross-analyzes it directly with verified GitHub repositories to detect real job titles, education, and career achievements with zero hallucinations.',
    },
    {
      icon: <Briefcase className="w-5 h-5 text-sky-500" />,
      badge: isAr ? 'أقسام جديدة' : 'New Sections',
      badgeColor: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/25',
      title: isAr ? 'أقسام الخبرات والتعليم والشهادات في الـ README' : 'Work Experience, Education & Certifications',
      desc: isAr
        ? 'دعم أقسام مهنية متكاملة بـ 4 طوابع تصميمية (Showcase, Minimal, Mono, Paper) لعرض الشركات السابقة، المؤهلات الجامعية، والشهادات المعتمدة.'
        : 'Native README sections for your employment history, academic university degrees, and verified certifications across all 4 handcrafted style themes.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
      badge: isAr ? 'دقة متناهية' : 'Precision',
      badgeColor: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25',
      title: isAr ? 'تنقية ذكية لحزمة التقنيات (Anti-Boilerplate)' : 'Heuristic Anti-Boilerplate Tech Stack',
      desc: isAr
        ? 'تحليل حقيقي لكافة المستودعات (40+ repo) وحساب النسب المئوية لحجم الأكواد، مع إزالة الشفرات الافتراضية مثل ملفات Xcode أو إعدادات Kotlin الثانوية.'
        : 'Accurate multi-repo qualification based on authentic byte weights. Boilerplate noise (e.g. 0.12% Xcode Swift boilerplate) is cleanly eliminated.',
    },
    {
      icon: <BarChart3 className="w-5 h-5 text-amber-500" />,
      badge: isAr ? 'تحليلات عميقة' : 'Deep Analytics',
      badgeColor: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/25',
      title: isAr ? 'لوحة تحليلات الحساب والحمض النووي للغات' : 'Telemetry Analytics & Language DNA',
      desc: isAr
        ? 'إحصائيات استمرارية المساهمات (Streaks)، توزيع أوقات النشاط البرمجي (Circadian Rhythm)، ورادار تقييم أداء المطور من S إلى C.'
        : 'Contribution streaks calendar, 24-hour circadian coding rhythm, Language DNA byte breakdown, and automated engineering scorecard.',
    },
    {
      icon: <UploadCloud className="w-5 h-5 text-indigo-500" />,
      badge: isAr ? 'نشر فوري' : 'Zero-Trust',
      badgeColor: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/25',
      title: isAr ? 'نشر مباشر في مستودع البروفايل مع نسخ احتياطية' : 'Atomic GitHub Publishing & Rollbacks',
      desc: isAr
        ? 'التزام مباشر (Commit) بنقرة واحدة إلى مستودع username/username مع إنشاء مستودع تلقائي وحفظ نسخ احتياطية للتراجع في أي وقت.'
        : 'Commit directly to username/username repository with automated backup snapshots and one-click rollback capabilities.',
    },
    {
      icon: <Zap className="w-5 h-5 text-rose-500" />,
      badge: isAr ? 'أحدث النماذج' : 'Gemini 3.8',
      badgeColor: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/25',
      title: isAr ? 'محرك Gemini 3.8 Flash مع سلسلة نماذج مرنة' : 'Gemini 3.8 Flash Model Chain',
      desc: isAr
        ? 'ترقية محرك الذكاء الاصطناعي ليعتمد تلقائياً على سلسلة نماذج سريعة ودقيقة: gemini-3.8-flash ثم 2.5-flash ثم 1.5-flash.'
        : 'Upgraded AI architecture leveraging Google GenAI candidate chain: gemini-3.8-flash -> gemini-2.5-flash -> gemini-1.5-flash.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-3xl bg-[var(--surface)] border border-[var(--border-strong)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto"
      >
        {/* Header */}
        <div className="px-5 sm:px-7 py-4.5 border-b border-[var(--border)] flex items-center justify-between bg-[var(--surface-2)]/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[var(--accent)] to-purple-600 flex items-center justify-center text-white shadow-sm">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-base sm:text-lg font-semibold text-[var(--text)]">
                  {isAr ? 'ما الجديد في الإصدار 2.0' : "What's New in Version 2.0"}
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/20">
                  README Studio v2.0
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                {isAr
                  ? 'نقلة نوعية في دقة التحليل والتكامل المزدوج بين الـ Resume وحساب GitHub.'
                  : 'A major architectural milestone bringing Multimodal AI Resume Synergy and deep telemetry.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feature Bento Grid */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/40 hover:bg-[var(--surface-2)]/80 hover:border-[var(--accent)]/30 transition-all space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="w-8 h-8 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center">
                      {feat.icon}
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${feat.badgeColor}`}>
                      {feat.badge}
                    </span>
                  </div>
                  <h3 className="font-semibold text-xs sm:text-sm text-[var(--text)]">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Multimodal Spotlight Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[var(--accent)]/10 via-purple-500/10 to-[var(--accent)]/10 border border-[var(--accent)]/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-start">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--accent)] text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-xs sm:text-sm text-[var(--text)]">
                  {isAr ? 'جرّب رفع سيرتك الذاتية الآن' : 'Try AI Resume Ingestion Right Now'}
                </h4>
                <p className="text-xs text-[var(--text-muted)]">
                  {isAr
                    ? 'ارفع ملف PDF أو الصق النص لتحليل الخبرات والشهادات ودمجها مباشرة في الـ README.'
                    : 'Upload a PDF or paste text to cross-analyze career details with your repositories.'}
                </p>
              </div>
            </div>

            {onOpenResume && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenResume();
                }}
                className="px-4 py-2 rounded-xl bg-[var(--accent)] text-white text-xs font-semibold hover:bg-[var(--accent-hover)] transition-all shrink-0 shadow-sm"
              >
                {isAr ? 'استيراد السيرة الذاتية' : 'Open Resume Ingest'}
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-7 py-3.5 border-t border-[var(--border)] bg-[var(--surface-2)]/50 flex items-center justify-between shrink-0">
          <span className="text-[11px] font-mono text-[var(--text-muted)]">
            v2.0.0 · Gemini 3.8 Flash Engine
          </span>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[var(--text)] text-[var(--bg)] text-xs sm:text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all"
          >
            {isAr ? 'ابدأ الاستكشاف' : 'Explore Studio'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
