import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Locale,
  GitHubUserProfile,
  GitHubRepository,
  ProfileAnalytics,
  ProfileSectionsConfig,
  ParsedResume,
} from '../types';
import { translations } from '../i18n/translations';
import { parseResumeWithAI, fuseResumeWithProfile, FusionOptions } from '../services/resumeParser';
import {
  X,
  Upload,
  FileText,
  FileCheck,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  GraduationCap,
  Award,
  Layers,
  ArrowRight,
  RotateCcw,
  Bot,
  Link,
  ShieldCheck,
  Check,
  Loader2,
} from 'lucide-react';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
  profile: GitHubUserProfile | null;
  repos: GitHubRepository[];
  analytics?: ProfileAnalytics | null;
  currentConfig: ProfileSectionsConfig;
  onApplyConfig: (updatedConfig: ProfileSectionsConfig) => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({
  isOpen,
  onClose,
  locale,
  profile,
  repos,
  analytics,
  currentConfig,
  onApplyConfig,
}) => {
  const t = translations[locale];
  const isAr = locale === 'ar';
  const rm = t.resumeModal;

  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  // Flow stages: 'input' -> 'analyzing' -> 'review'
  const [stage, setStage] = useState<'input' | 'analyzing' | 'review'>('input');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ParsedResume | null>(null);

  // Granular fusion options
  const [fusionOptions, setFusionOptions] = useState<FusionOptions>({
    importExperience: true,
    importEducation: true,
    importCertifications: true,
    importSkills: true,
    importBio: true,
    importContact: true,
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileSelect = (file: File) => {
    if (!file) return;
    setError(null);
    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const startAnalysis = async () => {
    if (!profile) return;
    if (activeTab === 'upload' && !selectedFile) {
      setError(isAr ? 'يرجى اختيار ملف السيرة الذاتية أولاً.' : 'Please select a resume file first.');
      return;
    }
    if (activeTab === 'paste' && !pastedText.trim()) {
      setError(isAr ? 'يرجى لصق نص السيرة الذاتية للمتابعة.' : 'Please paste resume text to proceed.');
      return;
    }

    setError(null);
    setStage('analyzing');
    setActiveStepIndex(0);

    // Simulate progressive UX milestones
    const stepTimer1 = setTimeout(() => setActiveStepIndex(1), 600);
    const stepTimer2 = setTimeout(() => setActiveStepIndex(2), 1600);
    const stepTimer3 = setTimeout(() => setActiveStepIndex(3), 2800);

    try {
      const result = await parseResumeWithAI({
        file: activeTab === 'upload' ? selectedFile : null,
        textInput: activeTab === 'paste' ? pastedText : undefined,
        profile,
        repos,
        analytics,
        locale,
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);

      setParsedData(result.resume);
      setStage('review');
    } catch (err: unknown) {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);
      setStage('input');
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    }
  };

  const handleApply = () => {
    if (!parsedData || !profile) return;
    const merged = fuseResumeWithProfile(
      parsedData,
      currentConfig,
      profile,
      repos,
      locale,
      fusionOptions
    );
    onApplyConfig(merged);
    onClose();
  };

  const handleReset = () => {
    setStage('input');
    setParsedData(null);
    setSelectedFile(null);
    setPastedText('');
    setError(null);
  };

  const stepsList = [rm.step1, rm.step2, rm.step3, rm.step4];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-md animate-fade-in overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-3xl bg-[var(--surface)] border border-[var(--border-strong)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto"
      >
        {/* Modal Header */}
        <div className="px-5 sm:px-7 py-4.5 border-b border-[var(--border)] flex items-center justify-between bg-[var(--surface-2)]/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[var(--accent)] to-purple-600 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-base sm:text-lg font-semibold text-[var(--text)]">
                  {rm.title}
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/20">
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-1">
                {rm.subtitle}
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

        {/* Modal Body */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400 text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">{error}</div>
            </div>
          )}

          {/* STAGE 1: INPUT */}
          {stage === 'input' && (
            <div className="space-y-5">
              {/* Context Banner */}
              {profile && (
                <div className="p-3.5 rounded-xl border border-[var(--accent)]/20 bg-[var(--accent-soft)] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={profile.avatar_url}
                      alt={profile.login}
                      className="w-7 h-7 rounded-full border border-[var(--border)]"
                    />
                    <div>
                      <span className="font-semibold text-[var(--text)]">@{profile.login}</span>
                      <span className="text-[var(--text-muted)] ms-1.5">
                        ({repos.length} {isAr ? 'مستودع مُحلل' : 'repos ready for cross-referencing'})
                      </span>
                    </div>
                  </div>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-[var(--accent)] font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {isAr ? 'بيانات حقيقية 100%' : 'Zero Hallucinations'}
                  </span>
                </div>
              )}

              {/* Tabs */}
              <div className="flex items-center gap-2 p-1 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] w-fit">
                <button
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    activeTab === 'upload'
                      ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs font-semibold'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{rm.tabUpload}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('paste')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    activeTab === 'paste'
                      ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs font-semibold'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{rm.tabPaste}</span>
                </button>
              </div>

              {/* Tab 1: Upload Dropzone */}
              {activeTab === 'upload' && (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.txt,.md"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileSelect(e.target.files[0]);
                      }
                    }}
                  />
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                      isDragging
                        ? 'border-[var(--accent)] bg-[var(--accent-soft)]/50 scale-[0.99]'
                        : selectedFile
                        ? 'border-[var(--accent)]/60 bg-[var(--surface-2)]'
                        : 'border-[var(--border)] hover:border-[var(--border-strong)] bg-[var(--surface-2)]/30 hover:bg-[var(--surface-2)]/60'
                    }`}
                  >
                    {selectedFile ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center">
                          <FileCheck className="w-6 h-6" />
                        </div>
                        <span className="font-semibold text-sm text-[var(--text)]">
                          {selectedFile.name}
                        </span>
                        <span className="text-xs text-[var(--text-muted)] font-mono">
                          {(selectedFile.size / 1024).toFixed(1)} KB · {selectedFile.type || 'Document'}
                        </span>
                        <span className="text-xs text-[var(--accent)] mt-1 underline">
                          {isAr ? 'انقر لتغيير الملف' : 'Click to choose another file'}
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-2xl bg-[var(--surface-2)] text-[var(--text-muted)] flex items-center justify-center border border-[var(--border)]">
                          <Upload className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[var(--text)]">
                            {rm.dropzoneTitle}
                          </p>
                          <p className="text-xs text-[var(--text-muted)] mt-1">
                            {rm.dropzoneDesc}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: Paste Area */}
              {activeTab === 'paste' && (
                <div>
                  <textarea
                    rows={9}
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    placeholder={rm.pastePlaceholder}
                    className="w-full p-4 rounded-xl bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] text-xs sm:text-sm font-sans outline-none focus:border-[var(--accent)] transition-all resize-y"
                  />
                  <div className="flex justify-between items-center text-[11px] text-[var(--text-muted)] mt-1.5 px-1 font-mono">
                    <span>{pastedText.length} characters</span>
                    <span>{isAr ? 'نص مباشر (Markdown / Plain Text)' : 'Direct plain text / Markdown'}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STAGE 2: ANALYZING ANIMATION */}
          {stage === 'analyzing' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-[var(--accent)]/20 border-t-[var(--accent)] animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-[var(--accent)]">
                  <Bot className="w-8 h-8 animate-pulse" />
                </div>
              </div>

              <div>
                <h3 className="font-serif text-lg font-semibold text-[var(--text)]">
                  {rm.analyzing}
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-1 max-w-md mx-auto">
                  {isAr
                    ? 'يقوم Gemini 3.8 Flash الآن بتحليل الـ CV ومطابقة المهارات والمشاريع مع مستودعات GitHub الحقيقية.'
                    : 'Gemini 3.8 Flash is cross-referencing your CV with your verified GitHub repositories.'}
                </p>
              </div>

              {/* Milestone Step Indicators */}
              <div className="w-full max-w-md space-y-2.5 text-start pt-2">
                {stepsList.map((stepText, idx) => {
                  const isDone = idx < activeStepIndex;
                  const isCurrent = idx === activeStepIndex;

                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 p-2.5 rounded-xl border text-xs transition-all ${
                        isDone
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                          : isCurrent
                          ? 'border-[var(--accent)]/40 bg-[var(--accent-soft)] text-[var(--text)] font-medium shadow-2xs'
                          : 'border-[var(--border)] bg-[var(--surface-2)]/40 text-[var(--text-muted)] opacity-60'
                      }`}
                    >
                      {isDone ? (
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : isCurrent ? (
                        <Loader2 className="w-4 h-4 text-[var(--accent)] animate-spin shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-current opacity-40 shrink-0" />
                      )}
                      <span className="truncate">{stepText}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STAGE 3: REVIEW & FUSION SELECTION */}
          {stage === 'review' && parsedData && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-semibold text-[var(--text)]">
                    {rm.previewTitle}
                  </h3>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{isAr ? 'إعادة الرفع' : 'Upload Another'}</span>
                  </button>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  {rm.previewSubtitle}
                </p>
              </div>

              {/* Bento Grid Preview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* 1. Identity & Headline */}
                <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-subtle)] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
                      {rm.detectedName}
                    </span>
                    <label className="flex items-center gap-1.5 text-xs cursor-pointer text-[var(--accent)]">
                      <input
                        type="checkbox"
                        checked={fusionOptions.importBio}
                        onChange={(e) =>
                          setFusionOptions({ ...fusionOptions, importBio: e.target.checked })
                        }
                        className="rounded"
                      />
                      <span>{isAr ? 'تضمين' : 'Include'}</span>
                    </label>
                  </div>
                  <div className="font-semibold text-sm text-[var(--text)]">
                    {parsedData.fullName || profile?.name || profile?.login}
                  </div>
                  <div className="text-xs text-[var(--accent)] font-medium">
                    {parsedData.headline || profile?.bio || 'Software Engineer'}
                  </div>
                  {parsedData.summary && (
                    <p className="text-xs text-[var(--text-muted)] line-clamp-2">
                      {parsedData.summary}
                    </p>
                  )}
                </div>

                {/* 2. Contact & Socials */}
                <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-subtle)] flex items-center gap-1.5">
                      <Link className="w-3.5 h-3.5 text-[var(--accent)]" />
                      {rm.detectedContact}
                    </span>
                    <label className="flex items-center gap-1.5 text-xs cursor-pointer text-[var(--accent)]">
                      <input
                        type="checkbox"
                        checked={fusionOptions.importContact}
                        onChange={(e) =>
                          setFusionOptions({ ...fusionOptions, importContact: e.target.checked })
                        }
                        className="rounded"
                      />
                      <span>{isAr ? 'تضمين' : 'Include'}</span>
                    </label>
                  </div>
                  <div className="space-y-1 text-xs">
                    {parsedData.email && (
                      <div className="text-[var(--text)]">📧 {parsedData.email}</div>
                    )}
                    {parsedData.linkedin && (
                      <div className="text-[var(--text)]">💼 linkedin.com/in/{parsedData.linkedin}</div>
                    )}
                    {parsedData.location && (
                      <div className="text-[var(--text-muted)]">📍 {parsedData.location}</div>
                    )}
                    {!parsedData.email && !parsedData.linkedin && (
                      <div className="text-[var(--text-subtle)]">{rm.noItems}</div>
                    )}
                  </div>
                </div>

                {/* 3. Work Experience */}
                <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/60 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-subtle)] flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-[var(--accent)]" />
                      {rm.detectedExp} ({parsedData.experiences?.length || 0})
                    </span>
                    <label className="flex items-center gap-1.5 text-xs cursor-pointer text-[var(--accent)]">
                      <input
                        type="checkbox"
                        checked={fusionOptions.importExperience}
                        onChange={(e) =>
                          setFusionOptions({
                            ...fusionOptions,
                            importExperience: e.target.checked,
                          })
                        }
                        className="rounded"
                      />
                      <span>{isAr ? 'تضمين' : 'Include'}</span>
                    </label>
                  </div>
                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                    {parsedData.experiences && parsedData.experiences.length > 0 ? (
                      parsedData.experiences.map((exp, idx) => (
                        <div key={idx} className="p-2 rounded-lg bg-[var(--surface)] text-xs border border-[var(--border)]">
                          <div className="font-semibold text-[var(--text)]">{exp.role}</div>
                          <div className="text-[var(--text-muted)] text-[11px]">
                            {exp.company} · {exp.period}
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-[var(--text-subtle)]">{rm.noItems}</span>
                    )}
                  </div>
                </div>

                {/* 4. Education & Degrees */}
                <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/60 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-subtle)] flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-[var(--accent)]" />
                      {rm.detectedEdu} ({parsedData.education?.length || 0})
                    </span>
                    <label className="flex items-center gap-1.5 text-xs cursor-pointer text-[var(--accent)]">
                      <input
                        type="checkbox"
                        checked={fusionOptions.importEducation}
                        onChange={(e) =>
                          setFusionOptions({
                            ...fusionOptions,
                            importEducation: e.target.checked,
                          })
                        }
                        className="rounded"
                      />
                      <span>{isAr ? 'تضمين' : 'Include'}</span>
                    </label>
                  </div>
                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                    {parsedData.education && parsedData.education.length > 0 ? (
                      parsedData.education.map((edu, idx) => (
                        <div key={idx} className="p-2 rounded-lg bg-[var(--surface)] text-xs border border-[var(--border)]">
                          <div className="font-semibold text-[var(--text)]">{edu.degree}</div>
                          <div className="text-[var(--text-muted)] text-[11px]">
                            {edu.institution} · {edu.period}
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-[var(--text-subtle)]">{rm.noItems}</span>
                    )}
                  </div>
                </div>

                {/* 5. Certifications */}
                <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/60 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-subtle)] flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-[var(--accent)]" />
                      {rm.detectedCert} ({parsedData.certifications?.length || 0})
                    </span>
                    <label className="flex items-center gap-1.5 text-xs cursor-pointer text-[var(--accent)]">
                      <input
                        type="checkbox"
                        checked={fusionOptions.importCertifications}
                        onChange={(e) =>
                          setFusionOptions({
                            ...fusionOptions,
                            importCertifications: e.target.checked,
                          })
                        }
                        className="rounded"
                      />
                      <span>{isAr ? 'تضمين' : 'Include'}</span>
                    </label>
                  </div>
                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                    {parsedData.certifications && parsedData.certifications.length > 0 ? (
                      parsedData.certifications.map((cert, idx) => (
                        <div key={idx} className="p-2 rounded-lg bg-[var(--surface)] text-xs border border-[var(--border)]">
                          <div className="font-semibold text-[var(--text)]">{cert.name}</div>
                          <div className="text-[var(--text-muted)] text-[11px]">
                            {cert.issuer} {cert.year ? `· ${cert.year}` : ''}
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-[var(--text-subtle)]">{rm.noItems}</span>
                    )}
                  </div>
                </div>

                {/* 6. Skills & Tech Stack */}
                <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/60 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-subtle)] flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[var(--accent)]" />
                      {rm.detectedSkills} ({parsedData.skills?.length || 0})
                    </span>
                    <label className="flex items-center gap-1.5 text-xs cursor-pointer text-[var(--accent)]">
                      <input
                        type="checkbox"
                        checked={fusionOptions.importSkills}
                        onChange={(e) =>
                          setFusionOptions({
                            ...fusionOptions,
                            importSkills: e.target.checked,
                          })
                        }
                        className="rounded"
                      />
                      <span>{isAr ? 'تضمين' : 'Include'}</span>
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                    {parsedData.skills && parsedData.skills.length > 0 ? (
                      parsedData.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-[var(--text-subtle)]">{rm.noItems}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-7 py-3.5 border-t border-[var(--border)] bg-[var(--surface-2)]/50 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
          >
            {t.common.cancel}
          </button>

          {stage === 'input' && (
            <button
              type="button"
              onClick={startAnalysis}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--accent)] text-white text-xs sm:text-sm font-medium hover:bg-[var(--accent-hover)] active:scale-[0.98] transition-all shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>{rm.analyzeButton}</span>
            </button>
          )}

          {stage === 'review' && (
            <button
              type="button"
              onClick={handleApply}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[var(--accent)] to-purple-600 text-white text-xs sm:text-sm font-medium hover:opacity-90 active:scale-[0.98] transition-all shadow-md"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{rm.fuseButton}</span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
