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

export interface InferredPersona {
  role: string;
  domain: 'ai_ml' | 'robotics' | 'systems' | 'mobile' | 'backend' | 'frontend' | 'fullstack' | 'general';
  focus: string;
  summary: string;
  currentWork: string;
  learning: string;
  askMeAbout: string;
  funFact: string;
  dominantLanguages: string[];
}

/**
 * Intelligently infer developer persona and domain from real profile bio,
 * weighted repository languages, and repository names/topics.
 */
export function inferDeveloperPersona(
  profile: GitHubUserProfile,
  repos: GitHubRepository[],
  language: 'en' | 'ar' = 'en'
): InferredPersona {
  const isAr = language === 'ar';
  const rawBio = profile.bio?.trim() || '';
  const bioLower = rawBio.toLowerCase();

  // 1. Calculate weighted frequency of languages across all repositories
  const langCounts = new Map<string, number>();
  for (const r of repos) {
    if (r.language) {
      langCounts.set(r.language, (langCounts.get(r.language) ?? 0) + 1);
    }
    if (r.languages) {
      for (const [l, b] of Object.entries(r.languages)) {
        if (b > 2000 && l !== r.language) {
          langCounts.set(l, (langCounts.get(l) ?? 0) + 0.5);
        }
      }
    }
  }

  // Sort languages strictly by repository count descending, prioritizing core programming languages over markup
  const markupLangs = new Set(['HTML', 'CSS', 'SCSS', 'Sass', 'Less']);
  const sortedLangsWithCount = [...langCounts.entries()].sort((a, b) => {
    const aIsMarkup = markupLangs.has(a[0]) ? 1 : 0;
    const bIsMarkup = markupLangs.has(b[0]) ? 1 : 0;
    if (aIsMarkup !== bIsMarkup) return aIsMarkup - bIsMarkup;
    return b[1] - a[1];
  });

  // Filter out one-off incidental template languages (e.g. 1 incidental Swift or Kotlin file in mobile wrapper)
  const substantiveLangs = sortedLangsWithCount.filter(([lang, count]) => {
    if (markupLangs.has(lang)) return false;
    if (repos.length >= 6 && count < 2) return false;
    return true;
  });

  const dominantLanguages = (substantiveLangs.length >= 2 ? substantiveLangs : sortedLangsWithCount)
    .slice(0, 4)
    .map(([lang]) => lang);

  // 2. Collect and analyze text corpus from repo names, descriptions, and topics
  const repoCorpus = repos
    .map(r => `${r.name} ${(r.topics || []).join(' ')} ${r.description || ''}`)
    .join(' ')
    .toLowerCase();

  // 3. Domain Scoring
  const scores = {
    ai_ml: 0,
    robotics: 0,
    systems: 0,
    mobile: 0,
    backend: 0,
    frontend: 0,
    fullstack: 0,
  };

  // Keyword weights in Bio (high priority)
  if (/\b(ai|ml|machine learning|deep learning|data science|nlp|llm|computer vision|vision|neural)\b/i.test(bioLower)) scores.ai_ml += 15;
  if (/\b(robotics|robotic|autonomous|ros|ros2)\b/i.test(bioLower)) scores.robotics += 15;
  if (/\b(embedded|firmware|systems|c\+\+|rust|kernel|low[- ]level)\b/i.test(bioLower)) scores.systems += 12;
  if (/\b(mobile|flutter|react native|ios|android|swift|kotlin)\b/i.test(bioLower)) scores.mobile += 15;
  if (/\b(backend|microservices|api|database|distributed)\b/i.test(bioLower)) scores.backend += 10;
  if (/\b(frontend|ui\/ux|ui|ux|web design|css)\b/i.test(bioLower)) scores.frontend += 10;
  if (/\b(full[- ]?stack)\b/i.test(bioLower)) scores.fullstack += 12;

  // Keyword weights in Repositories (substantive projects)
  const aiMatches = (repoCorpus.match(/\b(ai|ml|deep[- ]learning|machine[- ]learning|llm|rag|nlp|lstm|vector|prediction|forecast|vision|huggingface|transformers|summarization|chatbot)\b/g) || []).length;
  scores.ai_ml += Math.min(25, aiMatches * 3);

  const roboticsMatches = (repoCorpus.match(/\b(robotics|robot|ros|ros2|arduino|slam|autonomous)\b/g) || []).length;
  scores.robotics += Math.min(20, roboticsMatches * 3);

  const systemsMatches = (repoCorpus.match(/\b(systems|c\+\+|rust|embedded|kernel|assembly|driver)\b/g) || []).length;
  scores.systems += Math.min(20, systemsMatches * 2);

  const mobileMatches = (repoCorpus.match(/\b(flutter|react-native|android|ios|swift|apk)\b/g) || []).length;
  scores.mobile += Math.min(20, mobileMatches * 3);

  const webFrontendMatches = (repoCorpus.match(/\b(react|vue|angular|tailwind|nextjs|svelte|frontend|ui)\b/g) || []).length;
  scores.frontend += Math.min(15, webFrontendMatches * 2);

  const webBackendMatches = (repoCorpus.match(/\b(django|flask|fastapi|nest|express|laravel|spring|backend|api)\b/g) || []).length;
  scores.backend += Math.min(15, webBackendMatches * 2);

  // Language weights
  if (dominantLanguages.includes('Python') || dominantLanguages.includes('Jupyter Notebook')) {
    scores.ai_ml += 6;
  }
  if (dominantLanguages.includes('C++') || dominantLanguages.includes('Rust') || dominantLanguages.includes('C')) {
    scores.systems += 6;
  }

  // Determine top domain
  let domain: InferredPersona['domain'] = 'general';
  const rankedDomains = (Object.entries(scores) as Array<[keyof typeof scores, number]>).sort((a, b) => b[1] - a[1]);
  if (rankedDomains[0][1] >= 8) {
    domain = rankedDomains[0][0];
  }

  // 4. Role extraction (extract real title from bio tokens if possible)
  let extractedRole = '';
  if (rawBio) {
    // Split on pipes, bullets, commas, or newlines, preserving slashes for AI/ML, UI/UX, etc.
    const segments = rawBio.split(/(\|\||\||•|;|,\s+|\n+)/).map(s => s.trim()).filter(Boolean);
    const roleSegment = segments.find(s =>
      !/^[|•;,\n]+$/.test(s) && /\b(engineer|developer|architect|scientist|specialist|trainee|enthusiast)\b/i.test(s)
    );
    if (roleSegment && roleSegment.length <= 50) {
      extractedRole = roleSegment;
    }
  }

  // Fallback role based on domain if not extracted
  let role = extractedRole;
  if (!role) {
    switch (domain) {
      case 'ai_ml':
        role = isAr ? 'مهندس ذكاء اصطناعي وتعلم آلة' : 'AI & Machine Learning Engineer';
        break;
      case 'robotics':
        role = isAr ? 'مهندس روبوتات وأنظمة ذكية' : 'Robotics & Autonomous Systems Engineer';
        break;
      case 'systems':
        role = isAr ? 'مهندس أنظمة وبرمجيات منخفضة المستوى' : 'Systems & Low-Level Software Engineer';
        break;
      case 'mobile':
        role = isAr ? 'مطوّر تطبيقات جوال' : 'Mobile Application Engineer';
        break;
      case 'backend':
        role = isAr ? 'مهندس برمجيات Backend' : 'Backend Software Engineer';
        break;
      case 'frontend':
        role = isAr ? 'مهندس واجهات أمامية ومصمم تجارب' : 'Frontend Engineer & UI Craftsman';
        break;
      case 'fullstack':
        role = isAr ? 'مهندس برمجيات Full-Stack' : 'Full-Stack Software Engineer';
        break;
      default:
        role = isAr ? 'مهندس برمجيات' : 'Software Engineer';
        break;
    }
  }

  // Flagship project (strictly filter out personal event/invitation repos)
  const personalEventRegex = /^(engagement|wedding|invitation|birthday|party|guestbook|save[-_]?the[-_]?date|event)/i;
  const topProject =
    repos.find(r => !r.fork && r.name !== profile.login && !personalEventRegex.test(r.name))?.name ||
    repos.find(r => !r.fork && r.name !== profile.login)?.name ||
    repos[0]?.name ||
    (isAr ? 'مشروعات تقنية مبتكرة' : 'open-source software');

  // Stack strings
  const stackEn = dominantLanguages.join(', ') || 'Software Engineering';
  const stackAr = dominantLanguages.join(' و') || 'هندسة البرمجيات';

  // 5. Construct domain-specific attributes
  let focus = '';
  let learning = '';
  let askMeAbout = '';
  let funFact = '';

  const hasCompetitiveMath = /\b(problem solver|competitive|ecpc|icpc|codeforces|leetcode)\b/i.test(bioLower);

  switch (domain) {
    case 'ai_ml':
      focus = isAr
        ? 'الذكاء الاصطناعي، تعلم الآلة، التعلم العميق، ونماذج اللغة الضخمة (LLMs)'
        : 'Artificial Intelligence, Machine Learning, Deep Learning, and LLMs';
      learning = isAr
        ? 'نماذج الأساس (Foundation Models)، معمارية Agentic RAG وتطبيقات الذكاء الاصطناعي التوليدي'
        : 'Foundation Models, Agentic RAG Workflows, and Applied Generative AI';
      askMeAbout = isAr
        ? `${stackAr}، وتعلم الآلة والتعلم العميق، ومعالجة اللغات الطبيعية (NLP)`
        : `${stackEn}, Machine Learning, Deep Learning, LLMs & Retrieval Systems`;
      funFact = hasCompetitiveMath
        ? (isAr
            ? 'شغوف بحل المسائل الخوارزمية المعقدة، والبرمجة التنافسية، وبناء نماذج ذكاء اصطناعي تفكر بذكاء.'
            : 'Thrives on competitive programming puzzles, algorithmic complexity, and fine-tuning neural architectures.')
        : (isAr
            ? 'أستمتع بتدريب النماذج العصبية، وتحليل أداء الخوارزميات، وتوظيف الذكاء الاصطناعي لحل مشكلات العالم الحقيقي.'
            : 'Fascinated by loss convergence curves, model alignment, and turning theoretical AI research into running software.');
      break;

    case 'robotics':
      focus = isAr
        ? 'الروبوتات، الأنظمة المدمجة، الرؤية الحاسوبية، والأنظمة ذاتية القيادة'
        : 'Robotics, Embedded Systems, Computer Vision, and Autonomous Control';
      learning = isAr
        ? 'أنظمة ROS2، المعالجة اللحظية للبيانات، والتحكم الحركي في الروبوتات'
        : 'ROS2 ecosystem, real-time kinematics, and sensor fusion algorithms';
      askMeAbout = isAr
        ? `${stackAr}، والروبوتات، والمتحكمات الدقيقة، والرؤية الحاسوبية`
        : `${stackEn}, Robotics, ROS, Computer Vision, Embedded Controllers`;
      funFact = isAr
        ? 'أؤمن بأن أروع لحظات البرمجة هي عندما يتحول الكود الرياضي إلى حركة ميكانيكية حقيقية في العالم الواقعي.'
        : 'Believes true engineering magic happens when software interacts directly with physical hardware and actuators.';
      break;

    case 'systems':
      focus = isAr
        ? 'برمجة النظم منخفضة المستوى، كفاءة الذاكرة، وهندسة الأداء العالي'
        : 'Low-level Systems Programming, Memory Safety, and Performance Engineering';
      learning = isAr
        ? 'أنظمة التشغيل، المعالجة المتزامنة المتقدمة، وتحسين استهلاك الموارد'
        : 'Kernel internals, concurrent systems, and assembly-level optimizations';
      askMeAbout = isAr
        ? `${stackAr}، وتصميم النظم، وإدارة الذاكرة، والأداء الفائق`
        : `${stackEn}, Systems Programming, Memory Management, High-Throughput Engineering`;
      funFact = isAr
        ? 'أستمتع بتحليل كل بايت واستهلاك المعالج للوصول إلى أقصى أداء ممكن.'
        : 'Obsessed with eliminating unnecessary clock cycles and writing zero-allocation routines.';
      break;

    case 'mobile':
      focus = isAr
        ? 'تطبيقات الجوال عالية الأداء وتجارب المستخدم عبر المنصات'
        : 'Cross-platform mobile applications, reactive architectures & offline-first UX';
      learning = isAr
        ? 'معماريات الجوال الحديثة، تقنيات الرسوميات، والمزامنة السحابية اللحظية'
        : 'Modern declarative mobile frameworks, background sync & animation performance';
      askMeAbout = isAr
        ? `${stackAr}، وتطوير تطبيقات الجوال، وتصميم الواجهات التفاعلية`
        : `${stackEn}, Mobile Architecture, State Management, Responsive Design`;
      funFact = isAr
        ? 'أهتم بسلاسة الـ 60 إطاراً في الثانية في كل شاشة وتفاعل للمستخدم.'
        : 'Obsessed with consistent 60fps frame rates and fluid mobile gesture physics.';
      break;

    case 'backend':
      focus = isAr
        ? 'الأنظمة الخلفية الموزعة، واجهات برمجة التطبيقات (APIs)، وتدفق البيانات'
        : 'Distributed backend systems, scalable APIs, and database engineering';
      learning = isAr
        ? 'المعماريات المبنية على الأحداث، التخزين المؤقت الموزع، وقواعد البيانات الحديثة'
        : 'Event-driven architectures, distributed caching & resilient microservices';
      askMeAbout = isAr
        ? `${stackAr}، وتصميم الـ APIs، والأنظمة الموزعة، وهندسة قواعد البيانات`
        : `${stackEn}, API Architecture, Distributed Databases, Cloud Infrastructure`;
      funFact = isAr
        ? 'أهتم بكتابة خدمات تتحمل ملايين الطلبات بأقل استهلاك للموارد.'
        : 'Finds joy in designing resilient APIs and robust database schemas that scale gracefully.';
      break;

    case 'frontend':
      focus = isAr
        ? 'واجهات المستخدم التفاعلية الحديثة، أنظمة التصميم، وتجارب الويب الاستثنائية'
        : 'Modern user interfaces, design systems, and delightful web interactions';
      learning = isAr
        ? 'أحدث ممارسات الويب، حركات واجهات المستخدم، وتقنيات تحسين سرعة العرض'
        : 'Next-gen web frameworks, interaction physics, and accessibility standards';
      askMeAbout = isAr
        ? `${stackAr}، وهندسة الواجهات، وأنظمة التصميم، وحلول تجربة المستخدم`
        : `${stackEn}, Design Systems, Modern CSS, Web Animation Physics`;
      funFact = isAr
        ? 'أهتم بأدق تفاصيل البكسل والتفاعلات الدقيقة التي تجعل التجربة حية وممتعة.'
        : 'Passionate about sub-second perceptual latency and micro-interactions that make software feel alive.';
      break;

    case 'fullstack':
      focus = isAr
        ? 'تطوير المنظومات البرمجية المتكاملة والأنظمة السحابية القابلة للتوسع'
        : 'End-to-end full-stack architectures and scalable web platforms';
      learning = isAr
        ? 'المعماريات السحابية الحديثة، تكاملات الذكاء الاصطناعي، وهندسة النظم الموزعة'
        : 'Cloud native patterns, AI agent integration, and resilient distributed workflows';
      askMeAbout = isAr
        ? `${stackAr}، والمعماريات المتكاملة، وتصميم الأنظمة`
        : `${stackEn}, Full-Stack Systems, Architecture Design, Cloud Deployments`;
      funFact = isAr
        ? 'أستمتع بربط تفاصيل قواعد البيانات بتجربة المستخدم النهائية بسلاسة واحتراف.'
        : 'Loves bridging deep backend logic with polished, intuitive user interfaces.';
      break;

    default:
      focus = isAr
        ? 'هندسة البرمجيات النظيفة، حل المشكلات المعقدة، والبرمجيات مفتوحة المصدر'
        : 'Clean software engineering, problem solving, and open-source contributions';
      learning = isAr
        ? 'أحدث التقنيات البرمجية، المعماريات النظيفة، وممارسات التطوير الحديثة'
        : 'Modern software paradigms, clean architecture, and practical engineering solutions';
      askMeAbout = isAr
        ? `${stackAr}، وتصميم البرمجيات، وحل المشكلات`
        : `${stackEn}, Software Architecture, Problem Solving`;
      funFact = isAr
        ? 'أؤمن بأن أفضل كود هو الكود البسيط والفعال والموثق باحترافية.'
        : 'Believes code clarity and simplicity are the hallmarks of great craftsmanship.';
      break;
  }

  // Current work statement
  const currentWork = isAr
    ? `تطوير وصيانة ${topProject} ومشروعات برمجية مبتكرة`
    : `Architecting and scaling ${topProject}`;

  // Clean formatted summary based on authentic user bio
  let summary = '';
  if (rawBio) {
    // If the bio already has rich info, format it cleanly without adding discordant buzzwords
    const cleanBio = rawBio.replace(/\|\|/g, ' • ').replace(/\|/g, ' • ').trim().replace(/\.+$/, '');
    if (domain === 'ai_ml') {
      summary = isAr
        ? `${cleanBio}. أركز على تحويل الأفكار إلى حلول ذكاء اصطناعي ونظم برمجية عملية، من نماذج التعلم الآلي إلى وكلاء الذكاء الاصطناعي التوليدي.`
        : `${cleanBio}. Dedicated to transforming ideas into practical software and AI solutions, from machine learning pipelines to generative AI workflows.`;
    } else if (domain === 'robotics') {
      summary = isAr
        ? `${cleanBio}. شغوف بهندسة الروبوتات والأنظمة الذكية وربط البرمجيات بالعالم الفيزيائي.`
        : `${cleanBio}. Dedicated to robotics, autonomous intelligence, and bridging software with physical hardware.`;
    } else {
      summary = isAr
        ? `${cleanBio}. أركز على كتابة كود نظيف وتطوير حلول برمجية موثوقة ومبنية على أسس هندسية متينة.`
        : `${cleanBio}. Focused on writing maintainable, high-impact software grounded in solid architectural principles.`;
    }
  } else {
    summary = isAr
      ? `${role} متخصص في ${focus} باستخدام ${stackAr}.`
      : `${role} focused on ${focus} using ${stackEn}.`;
  }

  return {
    role,
    domain,
    focus,
    summary,
    currentWork,
    learning,
    askMeAbout,
    funFact,
    dominantLanguages,
  };
}

/**
 * Generate 3 distinct bio variations strictly grounded in the developer's real persona and stack.
 */
export function generateBioVariations(
  profile: GitHubUserProfile,
  repos: GitHubRepository[],
  language: 'en' | 'ar'
): BioVariation[] {
  const isAr = language === 'ar';
  const persona = inferDeveloperPersona(profile, repos, language);
  const name = profile.name || profile.login;
  const company = profile.company ? profile.company.replace(/^@/, '') : '';
  const location = profile.location || '';
  const topProject = persona.currentWork;

  if (isAr) {
    return [
      {
        tone: 'formal',
        summary: profile.bio
          ? `${profile.bio.replace(/\|\|/g, ' • ')}. ملتزم بأعلى معايير الجودة الهندسية وبناء أنظمة برمجية موثوقة وقابلة للتوسع في مجالات ${persona.focus}.`
          : `${persona.role}${company ? ` لدى ${company}` : ''}${location ? ` في ${location}` : ''}. متخصص في ${persona.focus} باستخدام ${persona.dominantLanguages.join(' و')}.`,
        focus: persona.focus,
        currentWork: topProject,
        learning: persona.learning,
        askMeAbout: persona.askMeAbout,
        funFact: persona.funFact,
      },
      {
        tone: 'friendly',
        summary: `مرحباً! أنا ${name}. ${persona.role} وشغوف بحل التحديات التقنية وتحويل الأفكار إلى حلول برمجية ومشاريع عملية تفيد المجتمع. أعمالي الأساسية تركز على ${persona.focus}.`,
        focus: persona.focus,
        currentWork: topProject,
        learning: persona.learning,
        askMeAbout: persona.askMeAbout,
        funFact: persona.funFact,
      },
      {
        tone: 'direct',
        summary: `${persona.role}. تركيز هندسي مباشر على ${persona.focus}. الحزمة التقنية الأساسية: ${persona.dominantLanguages.join(' · ')}.`,
        focus: persona.focus,
        currentWork: topProject,
        learning: persona.learning,
        askMeAbout: persona.askMeAbout,
        funFact: persona.funFact,
      },
    ];
  }

  // English variations
  return [
    {
      tone: 'formal',
      summary: profile.bio
        ? `${profile.bio.replace(/\|\|/g, ' • ')}. Dedicated to engineering excellence, rigorous problem solving, and building robust solutions in ${persona.focus}.`
        : `${persona.role}${company ? ` at ${company}` : ''}${location ? ` based in ${location}` : ''}. Specializing in ${persona.focus} using ${persona.dominantLanguages.join(', ')}.`,
      focus: persona.focus,
      currentWork: topProject,
      learning: persona.learning,
      askMeAbout: persona.askMeAbout,
      funFact: persona.funFact,
    },
    {
      tone: 'friendly',
      summary: `Hi there! I'm ${name}. ${persona.role} passionate about solving challenging problems and turning innovative ideas into practical, reliable software solutions. Most of my work centers around ${persona.focus}.`,
      focus: persona.focus,
      currentWork: topProject,
      learning: persona.learning,
      askMeAbout: persona.askMeAbout,
      funFact: persona.funFact,
    },
    {
      tone: 'direct',
      summary: `${persona.role}. Sharp focus on ${persona.focus}. Core stack: ${persona.dominantLanguages.join(' · ')}.`,
      focus: persona.focus,
      currentWork: topProject,
      learning: persona.learning,
      askMeAbout: persona.askMeAbout,
      funFact: persona.funFact,
    },
  ];
}
