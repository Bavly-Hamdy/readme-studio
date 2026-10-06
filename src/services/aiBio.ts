import { GitHubUserProfile, GitHubRepository } from '../types';

export interface BioVariation {
  tone: 'formal' | 'friendly' | 'direct';
  summary: string;
  focus: string;
  learning?: string;
  currentWork?: string;
  askMeAbout?: string;
  funFact?: string;
}

export function generateBioVariations(
  profile: GitHubUserProfile,
  repos: GitHubRepository[],
  language: 'en' | 'ar'
): BioVariation[] {
  const topRepos = repos.slice(0, 4);
  const primaryLangs = Array.from(new Set(repos.map(r => r.language).filter(Boolean))).slice(0, 4);
  const name = profile.name || profile.login;
  const company = profile.company ? profile.company.replace(/^@/, '') : '';
  const location = profile.location || '';
  const userBio = profile.bio?.trim() || '';

  const mainProject = topRepos[0]?.name || 'Next.js & AI Web Platforms';
  const stackString = primaryLangs.join(', ') || 'TypeScript, Next.js, React, Node.js';
  const stackArabic = primaryLangs.join(' و') || 'TypeScript وNext.js وReact';

  if (language === 'ar') {
    return [
      {
        tone: 'formal',
        summary: userBio
          ? `${userBio}. أركز على هندسة النظم البرمجية المتكاملة وتصميم بنى تحتية موثوقة وقابلة للتوسع بأعلى معايير الجودة والأداء.`
          : `مهندس برمجيات${company ? ` لدى ${company}` : ''}${location ? ` يقيم في ${location}` : ''}. متخصص في تطوير المنصات السحابية وتصميم معماريات الواجهات والأنظمة الموزعة باستخدام ${stackArabic}.`,
        focus: `تصميم وبناء المعماريات البرمجية المتقدمة ونظم الويب السحابية.`,
        currentWork: `تطوير وصيانة ${mainProject} وأدوات المطورين مفتوحة المصدر.`,
        learning: 'تقنيات الويب السحابية ونماذج Gemini 3.8 Flash وهندسة الأنظمة الذكية.',
        askMeAbout: `${stackArabic}، وتصميم المعماريات البرمجية (System Architecture).`,
        funFact: 'أهتم بهندسة التفاصيل الدقيقة للأداء وسلاسة واجهات المستخدم، مع التركيز على كود نظيف وتجربة استثنائية.',
      },
      {
        tone: 'friendly',
        summary: `مرحباً! أنا ${name}. مطور برمجيات شغوف بحل المشكلات المعقدة وصناعة أدوات مبتكرة تفيد مجتمع المطورين والمستخدمين. ستجد معظم مشروعاتي مبنية بـ ${stackArabic}.`,
        focus: `تطوير تطبيقات الويب التفاعلية والمساهمة في البرمجيات مفتوحة المصدر.`,
        currentWork: `بناء أدوات وحلول برمجية حديثة تركز على ${mainProject}.`,
        learning: 'أحدث ممارسات الويب الحديثة وحلول الذكاء الاصطناعي التوليدي.',
        askMeAbout: `${stackArabic}، وهندسة واجهات المستخدم الحديثة.`,
        funFact: 'أعشق تحويل الأفكار المعقدة إلى برمجيات بسيطة وجميلة تعمل بسلاسة فائقة.',
      },
      {
        tone: 'direct',
        summary: `مهندس برمجيات Full-Stack. أركز على كتابة كود نظيف وأداء استثنائي وتصميم معماري خالٍ من الحشو. الحزمة التقنية الأساسية: ${primaryLangs.join(' · ') || 'Full-Stack Modern Web'}.`,
        focus: `تطوير أنظمة سريعة، مستقرة، وقابلة للتطوير المستمر.`,
        currentWork: `تطوير مشروعات تقنية عالية التأثير مع التركيز على ${mainProject}.`,
        learning: 'الأنظمة الموزعة ونماذج الذكاء الاصطناعي Agentic Workflows.',
        askMeAbout: `${stackArabic}، وحلول الأداء العالي.`,
        funFact: 'أؤمن بأن أفضل كود هو الكود البسيط والفعال والموثق باحترافية.',
      },
    ];
  }

  // English (default)
  return [
    {
      tone: 'formal',
      summary: userBio
        ? `${userBio} Committed to architectural excellence, high-throughput systems, and production-grade software delivery.`
        : `Software Engineer${company ? ` at ${company}` : ''}${location ? ` based in ${location}` : ''}. Focused on designing resilient, scalable software architectures and intuitive digital experiences with ${stackString}.`,
      focus: `End-to-end full-stack architectures and scalable developer tooling.`,
      currentWork: `Architecting and scaling ${mainProject} alongside open-source platforms.`,
      learning: 'Gemini 3.8 Flash agentic systems, distributed caches, and edge infrastructure.',
      askMeAbout: `${stackString}, Software Architecture, Performance Optimization.`,
      funFact: 'Passionate about sub-100ms interface latencies and deterministic system design.',
    },
    {
      tone: 'friendly',
      summary: `Hi there! I'm ${name}. I love turning complex architectural problems into elegant, delightfully intuitive software. Most of my open-source work centers around ${stackString}.`,
      focus: `Crafting intuitive developer experiences and impactful community software.`,
      currentWork: `Active development on ${mainProject} and modern web utilities.`,
      learning: 'Modern web architectures, agentic pipelines, and high-performance UX.',
      askMeAbout: `${stackString}, React ecosystems, and modern frontend styling.`,
      funFact: 'Obsessed with sleek micro-interactions and making software feel alive.',
    },
    {
      tone: 'direct',
      summary: `Software Engineer & UI/UX Architect. Building high-performance, maintainable web systems. Core Stack: ${primaryLangs.join(' · ') || 'Modern Full-Stack'}.`,
      focus: `Clean code, robust architectural boundaries, and zero-fluff software.`,
      currentWork: `Shipping ${mainProject} and mission-critical full-stack applications.`,
      learning: 'Distributed systems and next-generation AI workflows.',
      askMeAbout: `${stackString}, System Design, Cloud Deployments.`,
      funFact: 'Code quality over quantity; simplicity over accidental complexity.',
    },
  ];
}
