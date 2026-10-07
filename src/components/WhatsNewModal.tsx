import React from 'react';
import { motion } from 'motion/react';
import { Locale } from '../types';
import { X, ArrowRight, ArrowLeft, FileText, Check } from 'lucide-react';

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
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  if (!isOpen) return null;

  const changelogItems = [
    {
      versionTag: 'v2.1.0',
      title: isAr
        ? 'أتمتة CI/CD عبر GitHub Actions ومعايير الـ PWA'
        : 'GitHub Actions CI/CD Profile Sync & PWA Architecture',
      description: isAr
        ? 'أداة لتوليد ملفات GitHub Actions مخصصة لتحديث البروفايل أسبوعياً، مع نظام CI متكامل للمستودع ودعم كامل لمعايير الـ Progressive Web App.'
        : 'In-app GitHub Actions workflow generator for automated weekly profile updates, repository CI quality gates, PWA manifest, and print media rules.',
    },
    {
      versionTag: 'Security',
      title: isAr
        ? 'حماية أمنية مؤسسية بموجب معايير OWASP Top 10'
        : 'Enterprise Security & OWASP Top 10 Hardening',
      description: isAr
        ? 'تنقية كاملة للـ Markdown عبر DOMPurify بقائمة بيضاء صارمة، وحماية من الـ Reverse Tabnabbing، وحد أقصى 10MB لحماية الذاكرة من الـ DoS.'
        : 'Strict GFM tag whitelisting via DOMPurify, reverse tabnabbing defense, 10MB client DoS protection on CV uploads, and Rolldown modular chunking.',
    },
    {
      versionTag: 'Engine',
      title: isAr
        ? 'تكامل السيرة الذاتية (CV) مع مستودعات GitHub الحقيقية'
        : 'Multimodal Resume & CV Synergy',
      description: isAr
        ? 'تحليل مباشر لملفات السيرة الذاتية (PDF أو نصوص) واستخراج المسميات الوظيفية والشركات والشهادات ومطابقتها مع كود مستودعاتك الحقيقية دون أي تكهن.'
        : 'Direct ingestion of PDF and text resumes via Gemini 3.8 Flash. Automatically cross-references career history against authentic GitHub repository metadata with zero hallucinations.',
    },
    {
      versionTag: 'Markdown',
      title: isAr
        ? 'سجلات زمنية للخبرات العملية والتعليم والشهادات'
        : 'Native Career, Education & Certification Timelines',
      description: isAr
        ? 'توليد أقسام مهنية متكاملة في ملف الـ README تتضمن فترات العمل، المؤهلات الجامعية، والمعدلات، والشهادات المعتمدة عبر 4 طوابع تصميمية (Showcase, Minimal, Mono, Paper).'
        : 'Structured markdown timelines for employment history, university degrees, GPA, and verified certifications styled natively across 4 handcrafted theme designs.',
    },
    {
      versionTag: 'Heuristic',
      title: isAr
        ? 'تصفية حزمة التقنيات واستبعاد الشفرات الافتراضية'
        : 'Heuristic Anti-Boilerplate Qualification',
      description: isAr
        ? 'فحص شامل لكافة المستودعات (40+ repo) وحساب النسب المئوية لحجم الأكواد بالبايت، مع استبعاد الشفرات الجانبية الافتراضية مثل ملفات Xcode أو إعدادات Kotlin الثانوية.'
        : 'Strict multi-repo qualification based on authentic byte weights. Boilerplate framework noise (e.g., Xcode Swift templates for web developers) is cleanly eliminated.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 10 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="w-full max-w-2xl bg-[var(--surface)] border border-[var(--border-strong)] rounded-2xl shadow-xl overflow-hidden flex flex-col my-auto"
      >
        {/* Header: Editorial & Restrained */}
        <div className="px-6 sm:px-8 pt-7 pb-5 border-b border-[var(--border)] flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-semibold tracking-wider uppercase text-[var(--accent)]">
                Changelog · v2.1.0 (Current)
              </span>
              <span className="text-[10px] font-mono text-[var(--text-subtle)]">
                October 2026
              </span>
            </div>
            <h2 className="font-serif text-2xl font-normal tracking-tight text-[var(--text)]">
              {isAr ? 'الإصدار v2.1.0 (الحالي): أتمتة CI/CD والأمان المؤسسي' : 'Version 2.1.0 Release Notes (Current)'}
            </h2>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed max-w-lg">
              {isAr
                ? 'ترقية هندسية شاملة تضم أتمتة GitHub Actions، وتحصين أمني بموجب OWASP Top 10، وتكامل السيرة الذاتية مع كود المستودعات الفعلي.'
                : 'Enterprise-grade update introducing GitHub Actions CI/CD automation, OWASP Top 10 security hardening, and multimodal CV synergy.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Changelog List */}
        <div className="px-6 sm:px-8 py-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {changelogItems.map((item, idx) => (
            <div key={idx} className="space-y-1.5 border-b border-[var(--border)]/50 pb-5 last:border-b-0 last:pb-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-medium px-2 py-0.5 rounded border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-muted)]">
                  {item.versionTag}
                </span>
                <h3 className="font-serif text-sm font-semibold text-[var(--text)]">
                  {item.title}
                </h3>
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed ps-0.5">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Footer: Clean Actions */}
        <div className="px-6 sm:px-8 py-4 border-t border-[var(--border)] bg-[var(--surface-2)]/40 flex items-center justify-between gap-3">
          <div className="text-[11px] font-mono text-[var(--text-subtle)]">
            README Studio · 100% Client-Side
          </div>

          <div className="flex items-center gap-2.5">
            {onOpenResume && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenResume();
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--accent)] text-xs font-medium transition-all"
              >
                <FileText className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>{isAr ? 'استيراد CV' : 'Import CV'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1 px-4 py-1.5 rounded-xl bg-[var(--text)] text-[var(--bg)] text-xs font-semibold hover:opacity-90 active:scale-95 transition-all shadow-2xs"
            >
              <span>{isAr ? 'إغلاق' : 'Close'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
