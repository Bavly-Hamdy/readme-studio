import { GitHubUserProfile, GitHubRepository } from '../types';

export interface BioVariation {
  tone: 'formal' | 'friendly' | 'direct';
  summary: string;
  focus: string;
  learning?: string;
}

export function generateBioVariations(
  profile: GitHubUserProfile,
  repos: GitHubRepository[],
  language: 'en' | 'ar'
): BioVariation[] {
  const topRepos = repos.slice(0, 3);
  const primaryLangs = Array.from(new Set(repos.map(r => r.language).filter(Boolean))).slice(0, 3);
  const name = profile.name || profile.login;
  const company = profile.company ? profile.company.replace(/^@/, '') : '';
  const location = profile.location || '';

  if (language === 'ar') {
    return [
      {
        tone: 'formal',
        summary: `مهندس برمجيات${company ? ` لدى ${company}` : ''}${location ? `، يقيم في ${location}` : ''}. أركز على بناء وتطوير أنظمة موثوقة وقابلة للتوسع باستخدام ${primaryLangs.join(' و') || 'أحدث التقنيات'}.`,
        focus: `تطوير المشاريع البرمجية وتصميم المعماريات الموزعة.`,
        learning: primaryLangs[0] ? `أحدث ممارسات وهندسة أداء ${primaryLangs[0]}` : 'المعمارية السحابية المتقدمة',
      },
      {
        tone: 'friendly',
        summary: `مرحباً! أنا ${name}. مبرمج شغوف بتطوير البرمجيات مفتوحة المصدر وحل المشكلات الهندسية الواقعية. ستجد معظم أعمالي هنا مبنية بـ ${primaryLangs.join(' و') || 'لغات وتقنيات الويب'}.`,
        focus: topRepos[0] ? `المساهمة في ${topRepos[0].name} وأدوات المطورين مفتوحة المصدر.` : 'بناء أدوات مفيدة للمطورين والمستخدمين.',
        learning: 'تقنيات الويب الحديثة وأنظمة الأداء العالي',
      },
      {
        tone: 'direct',
        summary: `مطور برمجيات. أبني أنظمة وأدوات بالتركيز على البساطة والأداء. التقنيات الأساسية: ${primaryLangs.join(' · ') || 'Full-Stack'}.`,
        focus: `كتابة كود نظيف وتطوير مشاريع عملية.`,
        learning: 'تقنيات النظم الموزعة',
      },
    ];
  }

  // English (default)
  return [
    {
      tone: 'formal',
      summary: `Software engineer${company ? ` at ${company}` : ''}${location ? ` based in ${location}` : ''}. Focused on architecting resilient, production-ready software systems with a strong emphasis on ${primaryLangs.join(', ') || 'modern engineering practices'}.`,
      focus: `High-throughput backend architectures and maintainable web applications.`,
      learning: primaryLangs[0] ? `Advanced patterns and performance profiling in ${primaryLangs[0]}` : 'Cloud-native infrastructure',
    },
    {
      tone: 'friendly',
      summary: `Hi there! I'm ${name}. I love crafting intuitive tools, contributing to open-source communities, and turning complex ideas into clean code. Most of my public work centers around ${primaryLangs.join(' and ') || 'open software'}.`,
      focus: topRepos[0] ? `Building and maintaining ${topRepos[0].name} alongside other developer utilities.` : 'Open source tooling and developer productivity.',
      learning: 'Modern web architectures and system design patterns',
    },
    {
      tone: 'direct',
      summary: `Software engineer. Crafting focused, high-performance software. Core competencies: ${primaryLangs.join(' · ') || 'Modern Full-Stack'}.`,
      focus: `Building practical tools with clean architecture and zero fluff.`,
      learning: 'Distributed systems & tooling',
    },
  ];
}
