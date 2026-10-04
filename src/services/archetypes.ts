import { ArchetypeId, Locale } from '../types';

export interface ArchetypeMeta {
  emoji: string;
  gradient: [string, string];
  label: Record<Locale, string>;
  description: Record<Locale, string>;
}

export const ARCHETYPES: Readonly<Record<ArchetypeId, ArchetypeMeta>> = {
  systems: {
    emoji: '⚙️',
    gradient: ['#f97316', '#dc2626'],
    label: { en: 'Systems Architect', ar: 'مهندس أنظمة' },
    description: {
      en: 'Works close to the metal — performance, memory and low-level correctness.',
      ar: 'يعمل قريباً من العتاد — الأداء والذاكرة والدقة منخفضة المستوى.',
    },
  },
  frontend: {
    emoji: '🎨',
    gradient: ['#06b6d4', '#6366f1'],
    label: { en: 'Interface Craftsman', ar: 'حِرفي الواجهات' },
    description: {
      en: 'Obsessed with user-facing experience, components and interaction quality.',
      ar: 'شغوف بتجربة المستخدم والمكوّنات وجودة التفاعل.',
    },
  },
  backend: {
    emoji: '🗄️',
    gradient: ['#10b981', '#0ea5e9'],
    label: { en: 'Backend Engineer', ar: 'مهندس خلفيات' },
    description: {
      en: 'Builds the services, APIs and data flows that everything else depends on.',
      ar: 'يبني الخدمات والواجهات البرمجية وتدفقات البيانات التي يعتمد عليها كل شيء.',
    },
  },
  fullstack: {
    emoji: '🧩',
    gradient: ['#8b5cf6', '#ec4899'],
    label: { en: 'Full-Stack Builder', ar: 'مطوّر متكامل' },
    description: {
      en: 'Ships end-to-end — comfortable from the database to the pixel.',
      ar: 'يُطلق منتجات متكاملة — من قاعدة البيانات حتى آخر بكسل.',
    },
  },
  data: {
    emoji: '🧠',
    gradient: ['#f59e0b', '#ef4444'],
    label: { en: 'Data & AI Engineer', ar: 'مهندس بيانات وذكاء اصطناعي' },
    description: {
      en: 'Turns data into models, pipelines and decisions.',
      ar: 'يحوّل البيانات إلى نماذج وخطوط معالجة وقرارات.',
    },
  },
  mobile: {
    emoji: '📱',
    gradient: ['#22c55e', '#14b8a6'],
    label: { en: 'Mobile Developer', ar: 'مطوّر تطبيقات جوّال' },
    description: {
      en: 'Crafts native-feeling experiences for phones and tablets.',
      ar: 'يصنع تجارب أصلية الإحساس للهواتف والأجهزة اللوحية.',
    },
  },
  devops: {
    emoji: '🚀',
    gradient: ['#3b82f6', '#06b6d4'],
    label: { en: 'Platform & DevOps', ar: 'مهندس منصات وDevOps' },
    description: {
      en: 'Automates infrastructure, delivery pipelines and reliability.',
      ar: 'يؤتمت البنية التحتية وخطوط التسليم والاعتمادية.',
    },
  },
  polyglot: {
    emoji: '🌐',
    gradient: ['#a855f7', '#06b6d4'],
    label: { en: 'Polyglot Engineer', ar: 'مهندس متعدد اللغات' },
    description: {
      en: 'Fluent across many ecosystems — picks the right tool for each problem.',
      ar: 'متمكّن من أنظمة بيئية عديدة — يختار الأداة المناسبة لكل مشكلة.',
    },
  },
  maintainer: {
    emoji: '👑',
    gradient: ['#eab308', '#f97316'],
    label: { en: 'Open-Source Maintainer', ar: 'مشرف مفتوح المصدر' },
    description: {
      en: 'Stewards widely adopted projects trusted by a large community.',
      ar: 'يرعى مشاريع واسعة الانتشار يثق بها مجتمع كبير.',
    },
  },
  explorer: {
    emoji: '🧭',
    gradient: ['#64748b', '#8b5cf6'],
    label: { en: 'Rising Explorer', ar: 'مستكشف صاعد' },
    description: {
      en: 'Early in the journey — experimenting, learning and shipping first projects.',
      ar: 'في بداية الرحلة — يجرّب ويتعلّم ويُطلق مشاريعه الأولى.',
    },
  },
};

export const RHYTHM_LABELS: Record<string, Record<Locale, string>> = {
  'early-bird': { en: '🌅 Early bird', ar: '🌅 محب الصباح' },
  daytime: { en: '☀️ Daytime builder', ar: '☀️ مطوّر نهاري' },
  evening: { en: '🌆 Evening hacker', ar: '🌆 مبرمج مسائي' },
  'night-owl': { en: '🌙 Night owl', ar: '🌙 كائن ليلي' },
  unknown: { en: '— Not enough activity', ar: '— نشاط غير كافٍ' },
};
