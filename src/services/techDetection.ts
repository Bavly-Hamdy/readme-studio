import { GitHubRepository, TechCategory, TechItem } from '../types';

export interface TechCatalogItem {
  id: string;
  name: string;
  category: TechCategory;
  badgeSlug: string;
  color: string;
  keywords: string[];
}

export const ALL_TECH_CATALOG: TechCatalogItem[] = [
  // ===================== 1. LANGUAGES =====================
  { id: 'typescript', name: 'TypeScript', category: 'languages', badgeSlug: 'typescript', color: '3178C6', keywords: ['typescript', 'ts'] },
  { id: 'javascript', name: 'JavaScript', category: 'languages', badgeSlug: 'javascript', color: 'F7DF1E', keywords: ['javascript', 'js', 'es6'] },
  { id: 'python', name: 'Python', category: 'languages', badgeSlug: 'python', color: '3776AB', keywords: ['python', 'py'] },
  { id: 'go', name: 'Go', category: 'languages', badgeSlug: 'go', color: '00ADD8', keywords: ['go', 'golang'] },
  { id: 'rust', name: 'Rust', category: 'languages', badgeSlug: 'rust', color: '000000', keywords: ['rust', 'rs', 'cargo'] },
  { id: 'java', name: 'Java', category: 'languages', badgeSlug: 'openjdk', color: 'ED8B00', keywords: ['java'] },
  { id: 'cpp', name: 'C++', category: 'languages', badgeSlug: 'cplusplus', color: '00599C', keywords: ['c++', 'cpp'] },
  { id: 'c', name: 'C', category: 'languages', badgeSlug: 'c', color: 'A8B9CC', keywords: ['c-lang', 'clanguage'] },
  { id: 'csharp', name: 'C#', category: 'languages', badgeSlug: 'csharp', color: '239120', keywords: ['c#', 'csharp'] },
  { id: 'php', name: 'PHP', category: 'languages', badgeSlug: 'php', color: '777BB4', keywords: ['php'] },
  { id: 'ruby', name: 'Ruby', category: 'languages', badgeSlug: 'ruby', color: 'CC342D', keywords: ['ruby'] },
  { id: 'swift', name: 'Swift', category: 'languages', badgeSlug: 'swift', color: 'F05138', keywords: ['swift'] },
  { id: 'kotlin', name: 'Kotlin', category: 'languages', badgeSlug: 'kotlin', color: '7F52FF', keywords: ['kotlin'] },
  { id: 'dart', name: 'Dart', category: 'languages', badgeSlug: 'dart', color: '0175C2', keywords: ['dart'] },
  { id: 'scala', name: 'Scala', category: 'languages', badgeSlug: 'scala', color: 'DC322F', keywords: ['scala'] },
  { id: 'r', name: 'R', category: 'languages', badgeSlug: 'r', color: '276DC3', keywords: ['r-lang', 'rlang'] },
  { id: 'julia', name: 'Julia', category: 'languages', badgeSlug: 'julia', color: '9558B2', keywords: ['julia'] },
  { id: 'lua', name: 'Lua', category: 'languages', badgeSlug: 'lua', color: '2C2D72', keywords: ['lua'] },
  { id: 'elixir', name: 'Elixir', category: 'languages', badgeSlug: 'elixir', color: '4B275F', keywords: ['elixir'] },
  { id: 'clojure', name: 'Clojure', category: 'languages', badgeSlug: 'clojure', color: '5881D8', keywords: ['clojure'] },
  { id: 'haskell', name: 'Haskell', category: 'languages', badgeSlug: 'haskell', color: '5D4F85', keywords: ['haskell'] },
  { id: 'solidity', name: 'Solidity', category: 'languages', badgeSlug: 'solidity', color: '363636', keywords: ['solidity', 'web3', 'smart-contracts'] },
  { id: 'zig', name: 'Zig', category: 'languages', badgeSlug: 'zig', color: 'F7A41D', keywords: ['zig'] },
  { id: 'bash', name: 'Bash / Shell', category: 'languages', badgeSlug: 'gnubash', color: '4EAA25', keywords: ['bash', 'sh', 'shell'] },
  { id: 'powershell', name: 'PowerShell', category: 'languages', badgeSlug: 'powershell', color: '5391FE', keywords: ['powershell', 'ps1'] },
  { id: 'html5', name: 'HTML5', category: 'languages', badgeSlug: 'html5', color: 'E34F26', keywords: ['html', 'html5'] },
  { id: 'css3', name: 'CSS3', category: 'languages', badgeSlug: 'css3', color: '1572B6', keywords: ['css', 'css3'] },
  { id: 'graphql_lang', name: 'GraphQL', category: 'languages', badgeSlug: 'graphql', color: 'E10098', keywords: ['graphql'] },

  // ===================== 2. FRONTEND =====================
  { id: 'react', name: 'React', category: 'frontend', badgeSlug: 'react', color: '20232A', keywords: ['react', 'reactjs'] },
  { id: 'nextjs', name: 'Next.js', category: 'frontend', badgeSlug: 'nextdotjs', color: '000000', keywords: ['next', 'nextjs', 'next.js'] },
  { id: 'vue', name: 'Vue.js', category: 'frontend', badgeSlug: 'vuedotjs', color: '4FC08D', keywords: ['vue', 'vuejs'] },
  { id: 'nuxtjs', name: 'Nuxt.js', category: 'frontend', badgeSlug: 'nuxtdotjs', color: '00DC82', keywords: ['nuxt', 'nuxtjs'] },
  { id: 'angular', name: 'Angular', category: 'frontend', badgeSlug: 'angular', color: 'DD0031', keywords: ['angular'] },
  { id: 'svelte', name: 'Svelte', category: 'frontend', badgeSlug: 'svelte', color: 'FF3E00', keywords: ['svelte', 'sveltekit'] },
  { id: 'astro', name: 'Astro', category: 'frontend', badgeSlug: 'astro', color: 'BC52EE', keywords: ['astro'] },
  { id: 'solidjs', name: 'SolidJS', category: 'frontend', badgeSlug: 'solid', color: '2C4F7C', keywords: ['solidjs', 'solid'] },
  { id: 'remix', name: 'Remix', category: 'frontend', badgeSlug: 'remix', color: '000000', keywords: ['remix'] },
  { id: 'vite', name: 'Vite', category: 'frontend', badgeSlug: 'vite', color: '646CFF', keywords: ['vite', 'vitejs'] },
  { id: 'tailwind', name: 'Tailwind CSS', category: 'frontend', badgeSlug: 'tailwindcss', color: '06B6D4', keywords: ['tailwind', 'tailwindcss'] },
  { id: 'bootstrap', name: 'Bootstrap', category: 'frontend', badgeSlug: 'bootstrap', color: '7952B3', keywords: ['bootstrap'] },
  { id: 'sass', name: 'SASS / SCSS', category: 'frontend', badgeSlug: 'sass', color: 'CC6699', keywords: ['sass', 'scss'] },
  { id: 'shadcn', name: 'Shadcn UI', category: 'frontend', badgeSlug: 'shadcnui', color: '000000', keywords: ['shadcn'] },
  { id: 'radixui', name: 'Radix UI', category: 'frontend', badgeSlug: 'radixui', color: '161618', keywords: ['radix', 'radix-ui'] },
  { id: 'mui', name: 'Material UI (MUI)', category: 'frontend', badgeSlug: 'mui', color: '007FFF', keywords: ['mui', 'material-ui'] },
  { id: 'chakraui', name: 'Chakra UI', category: 'frontend', badgeSlug: 'chakraui', color: '319795', keywords: ['chakra', 'chakra-ui'] },
  { id: 'threejs', name: 'Three.js', category: 'frontend', badgeSlug: 'threedotjs', color: '000000', keywords: ['three.js', 'threejs', 'webgl'] },
  { id: 'redux', name: 'Redux', category: 'frontend', badgeSlug: 'redux', color: '764ABC', keywords: ['redux'] },
  { id: 'jquery', name: 'jQuery', category: 'frontend', badgeSlug: 'jquery', color: '0769AD', keywords: ['jquery'] },

  // ===================== 3. BACKEND =====================
  { id: 'nodejs', name: 'Node.js', category: 'backend', badgeSlug: 'nodedotjs', color: '339933', keywords: ['node', 'nodejs'] },
  { id: 'express', name: 'Express', category: 'backend', badgeSlug: 'express', color: '000000', keywords: ['express', 'expressjs'] },
  { id: 'nestjs', name: 'NestJS', category: 'backend', badgeSlug: 'nestjs', color: 'E0234E', keywords: ['nest', 'nestjs'] },
  { id: 'fastify', name: 'Fastify', category: 'backend', badgeSlug: 'fastify', color: '000000', keywords: ['fastify'] },
  { id: 'fastapi', name: 'FastAPI', category: 'backend', badgeSlug: 'fastapi', color: '009688', keywords: ['fastapi'] },
  { id: 'django', name: 'Django', category: 'backend', badgeSlug: 'django', color: '092E20', keywords: ['django'] },
  { id: 'flask', name: 'Flask', category: 'backend', badgeSlug: 'flask', color: '000000', keywords: ['flask'] },
  { id: 'spring', name: 'Spring Boot', category: 'backend', badgeSlug: 'springboot', color: '6DB33F', keywords: ['spring', 'springboot'] },
  { id: 'laravel', name: 'Laravel', category: 'backend', badgeSlug: 'laravel', color: 'FF2D20', keywords: ['laravel'] },
  { id: 'rails', name: 'Ruby on Rails', category: 'backend', badgeSlug: 'rubyonrails', color: 'CC0000', keywords: ['rails', 'rubyonrails'] },
  { id: 'dotnet', name: '.NET / ASP.NET', category: 'backend', badgeSlug: 'dotnet', color: '512BD4', keywords: ['dotnet', '.net', 'aspnet'] },
  { id: 'trpc', name: 'tRPC', category: 'backend', badgeSlug: 'trpc', color: '2596BE', keywords: ['trpc'] },
  { id: 'socketio', name: 'Socket.io', category: 'backend', badgeSlug: 'socketdotio', color: '010101', keywords: ['socket.io', 'websocket'] },
  { id: 'strapi', name: 'Strapi', category: 'backend', badgeSlug: 'strapi', color: '2F2E8B', keywords: ['strapi'] },

  // ===================== 4. MOBILE =====================
  { id: 'reactnative', name: 'React Native', category: 'mobile', badgeSlug: 'react', color: '61DAFB', keywords: ['react-native', 'reactnative'] },
  { id: 'flutter', name: 'Flutter', category: 'mobile', badgeSlug: 'flutter', color: '02569B', keywords: ['flutter'] },
  { id: 'expo', name: 'Expo', category: 'mobile', badgeSlug: 'expo', color: '000020', keywords: ['expo'] },
  { id: 'tauri', name: 'Tauri', category: 'mobile', badgeSlug: 'tauri', color: '24C8DB', keywords: ['tauri'] },
  { id: 'electron', name: 'Electron', category: 'mobile', badgeSlug: 'electron', color: '47848F', keywords: ['electron'] },
  { id: 'ionic', name: 'Ionic', category: 'mobile', badgeSlug: 'ionic', color: '3880FF', keywords: ['ionic'] },

  // ===================== 5. DATABASE & ORM =====================
  { id: 'postgresql', name: 'PostgreSQL', category: 'database', badgeSlug: 'postgresql', color: '4169E1', keywords: ['postgres', 'postgresql', 'psql'] },
  { id: 'mongodb', name: 'MongoDB', category: 'database', badgeSlug: 'mongodb', color: '47A248', keywords: ['mongo', 'mongodb'] },
  { id: 'mysql', name: 'MySQL', category: 'database', badgeSlug: 'mysql', color: '4479A1', keywords: ['mysql'] },
  { id: 'redis', name: 'Redis', category: 'database', badgeSlug: 'redis', color: 'DC382D', keywords: ['redis'] },
  { id: 'sqlite', name: 'SQLite', category: 'database', badgeSlug: 'sqlite', color: '003B57', keywords: ['sqlite'] },
  { id: 'supabase', name: 'Supabase', category: 'database', badgeSlug: 'supabase', color: '3ECF8E', keywords: ['supabase'] },
  { id: 'firebase', name: 'Firebase', category: 'database', badgeSlug: 'firebase', color: 'FFCA28', keywords: ['firebase', 'firestore'] },
  { id: 'prisma', name: 'Prisma', category: 'database', badgeSlug: 'prisma', color: '2D3748', keywords: ['prisma'] },
  { id: 'drizzle', name: 'Drizzle ORM', category: 'database', badgeSlug: 'drizzle', color: 'C5F74F', keywords: ['drizzle'] },
  { id: 'mariadb', name: 'MariaDB', category: 'database', badgeSlug: 'mariadb', color: '003545', keywords: ['mariadb'] },
  { id: 'sqlserver', name: 'Microsoft SQL Server', category: 'database', badgeSlug: 'microsoftsqlserver', color: 'CC292B', keywords: ['mssql', 'sqlserver'] },
  { id: 'dynamodb', name: 'Amazon DynamoDB', category: 'database', badgeSlug: 'amazondynamodb', color: '4053D6', keywords: ['dynamodb'] },
  { id: 'cassandra', name: 'Cassandra', category: 'database', badgeSlug: 'apachecassandra', color: '1287B1', keywords: ['cassandra'] },
  { id: 'neo4j', name: 'Neo4j', category: 'database', badgeSlug: 'neo4j', color: '008CC1', keywords: ['neo4j'] },
  { id: 'cockroachdb', name: 'CockroachDB', category: 'database', badgeSlug: 'cockroachlabs', color: '6933FF', keywords: ['cockroach'] },

  // ===================== 6. DEVOPS, CLOUD & SERVERS =====================
  { id: 'docker', name: 'Docker', category: 'devops', badgeSlug: 'docker', color: '2496ED', keywords: ['docker', 'container'] },
  { id: 'kubernetes', name: 'Kubernetes', category: 'devops', badgeSlug: 'kubernetes', color: '326CE5', keywords: ['kubernetes', 'k8s'] },
  { id: 'aws', name: 'AWS', category: 'devops', badgeSlug: 'amazonwebservices', color: '232F3E', keywords: ['aws', 'amazon', 'lambda', 's3', 'ec2'] },
  { id: 'gcp', name: 'Google Cloud', category: 'devops', badgeSlug: 'googlecloud', color: '4285F4', keywords: ['gcp', 'google-cloud'] },
  { id: 'azure', name: 'Azure', category: 'devops', badgeSlug: 'microsoftazure', color: '0078D4', keywords: ['azure'] },
  { id: 'cloudflare', name: 'Cloudflare', category: 'devops', badgeSlug: 'cloudflare', color: 'F38020', keywords: ['cloudflare'] },
  { id: 'vercel', name: 'Vercel', category: 'devops', badgeSlug: 'vercel', color: '000000', keywords: ['vercel'] },
  { id: 'netlify', name: 'Netlify', category: 'devops', badgeSlug: 'netlify', color: '00C7B7', keywords: ['netlify'] },
  { id: 'digitalocean', name: 'DigitalOcean', category: 'devops', badgeSlug: 'digitalocean', color: '0080FF', keywords: ['digitalocean'] },
  { id: 'githubactions', name: 'GitHub Actions', category: 'devops', badgeSlug: 'githubactions', color: '2088FF', keywords: ['actions', 'ci', 'cd', 'workflows'] },
  { id: 'gitlabci', name: 'GitLab CI', category: 'devops', badgeSlug: 'gitlab', color: 'FC6D26', keywords: ['gitlab-ci'] },
  { id: 'jenkins', name: 'Jenkins', category: 'devops', badgeSlug: 'jenkins', color: 'D24939', keywords: ['jenkins'] },
  { id: 'linux', name: 'Linux', category: 'devops', badgeSlug: 'linux', color: 'FCC624', keywords: ['linux', 'ubuntu', 'debian'] },
  { id: 'nginx', name: 'NGINX', category: 'devops', badgeSlug: 'nginx', color: '009639', keywords: ['nginx'] },
  { id: 'apache', name: 'Apache', category: 'devops', badgeSlug: 'apache', color: 'D22128', keywords: ['apache'] },
  { id: 'kafka', name: 'Apache Kafka', category: 'devops', badgeSlug: 'apachekafka', color: '231F20', keywords: ['kafka'] },
  { id: 'rabbitmq', name: 'RabbitMQ', category: 'devops', badgeSlug: 'rabbitmq', color: 'FF6600', keywords: ['rabbitmq'] },
  { id: 'terraform', name: 'Terraform', category: 'devops', badgeSlug: 'terraform', color: '7B42BC', keywords: ['terraform'] },
  { id: 'ansible', name: 'Ansible', category: 'devops', badgeSlug: 'ansible', color: 'EE0000', keywords: ['ansible'] },
  { id: 'grafana', name: 'Grafana', category: 'devops', badgeSlug: 'grafana', color: 'F46800', keywords: ['grafana'] },

  // ===================== 7. ML, DL & AI =====================
  { id: 'pytorch', name: 'PyTorch', category: 'ml_ai', badgeSlug: 'pytorch', color: 'EE4C2C', keywords: ['pytorch', 'torch'] },
  { id: 'tensorflow', name: 'TensorFlow', category: 'ml_ai', badgeSlug: 'tensorflow', color: 'FF6F00', keywords: ['tensorflow', 'tf'] },
  { id: 'keras', name: 'Keras', category: 'ml_ai', badgeSlug: 'keras', color: 'D00000', keywords: ['keras'] },
  { id: 'scikitlearn', name: 'Scikit-Learn', category: 'ml_ai', badgeSlug: 'scikitlearn', color: 'F7931E', keywords: ['scikit', 'sklearn'] },
  { id: 'pandas', name: 'Pandas', category: 'ml_ai', badgeSlug: 'pandas', color: '150458', keywords: ['pandas'] },
  { id: 'numpy', name: 'NumPy', category: 'ml_ai', badgeSlug: 'numpy', color: '013243', keywords: ['numpy'] },
  { id: 'opencv', name: 'OpenCV', category: 'ml_ai', badgeSlug: 'opencv', color: '5C3EE8', keywords: ['opencv'] },
  { id: 'huggingface', name: 'Hugging Face', category: 'ml_ai', badgeSlug: 'huggingface', color: 'FFD21E', keywords: ['huggingface', 'transformers'] },
  { id: 'langchain', name: 'LangChain', category: 'ml_ai', badgeSlug: 'langchain', color: '1C3C3C', keywords: ['langchain'] },
  { id: 'jupyter', name: 'Jupyter', category: 'ml_ai', badgeSlug: 'jupyter', color: 'F37626', keywords: ['jupyter', 'ipynb'] },

  // ===================== 8. TESTING =====================
  { id: 'jest', name: 'Jest', category: 'testing', badgeSlug: 'jest', color: 'C21325', keywords: ['jest'] },
  { id: 'vitest', name: 'Vitest', category: 'testing', badgeSlug: 'vitest', color: '6E9F18', keywords: ['vitest'] },
  { id: 'cypress', name: 'Cypress', category: 'testing', badgeSlug: 'cypress', color: '17202C', keywords: ['cypress'] },
  { id: 'playwright', name: 'Playwright', category: 'testing', badgeSlug: 'playwright', color: '2EAD33', keywords: ['playwright'] },
  { id: 'selenium', name: 'Selenium', category: 'testing', badgeSlug: 'selenium', color: '43B02A', keywords: ['selenium'] },
  { id: 'sentry', name: 'Sentry', category: 'testing', badgeSlug: 'sentry', color: '362D59', keywords: ['sentry'] },

  // ===================== 9. DESIGN & CREATIVE =====================
  { id: 'figma', name: 'Figma', category: 'design', badgeSlug: 'figma', color: 'F24E1E', keywords: ['figma', 'design'] },
  { id: 'photoshop', name: 'Adobe Photoshop', category: 'design', badgeSlug: 'adobephotoshop', color: '31A8FF', keywords: ['photoshop', 'ps'] },
  { id: 'illustrator', name: 'Adobe Illustrator', category: 'design', badgeSlug: 'adobeillustrator', color: 'FF9A00', keywords: ['illustrator', 'ai'] },
  { id: 'blender', name: 'Blender', category: 'design', badgeSlug: 'blender', color: 'F5792A', keywords: ['blender', '3d'] },
  { id: 'canva', name: 'Canva', category: 'design', badgeSlug: 'canva', color: '00C4CC', keywords: ['canva'] },
  { id: 'sketch', name: 'Sketch', category: 'design', badgeSlug: 'sketch', color: 'F7B500', keywords: ['sketch'] },

  // ===================== 10. TOOLS & GAME ENGINES =====================
  { id: 'git', name: 'Git', category: 'tools', badgeSlug: 'git', color: 'F05032', keywords: ['git'] },
  { id: 'github_tool', name: 'GitHub', category: 'tools', badgeSlug: 'github', color: '181717', keywords: ['github'] },
  { id: 'gitlab_tool', name: 'GitLab', category: 'tools', badgeSlug: 'gitlab', color: 'FC6D26', keywords: ['gitlab'] },
  { id: 'postman', name: 'Postman', category: 'tools', badgeSlug: 'postman', color: 'FF6C37', keywords: ['postman', 'api'] },
  { id: 'insomnia', name: 'Insomnia', category: 'tools', badgeSlug: 'insomnia', color: '4000BF', keywords: ['insomnia'] },
  { id: 'swagger', name: 'Swagger', category: 'tools', badgeSlug: 'swagger', color: '85EA2D', keywords: ['swagger', 'openapi'] },
  { id: 'notion', name: 'Notion', category: 'tools', badgeSlug: 'notion', color: '000000', keywords: ['notion'] },
  { id: 'jira', name: 'Jira', category: 'tools', badgeSlug: 'jira', color: '0052CC', keywords: ['jira'] },
  { id: 'eslint', name: 'ESLint', category: 'tools', badgeSlug: 'eslint', color: '4B32C3', keywords: ['eslint'] },
  { id: 'prettier', name: 'Prettier', category: 'tools', badgeSlug: 'prettier', color: 'F7B93E', keywords: ['prettier'] },
  { id: 'unity', name: 'Unity', category: 'tools', badgeSlug: 'unity', color: '000000', keywords: ['unity', 'gamedev'] },
  { id: 'unreal', name: 'Unreal Engine', category: 'tools', badgeSlug: 'unrealengine', color: '0E1128', keywords: ['unreal', 'ue5'] },
  { id: 'godot', name: 'Godot Engine', category: 'tools', badgeSlug: 'godotengine', color: '478CBF', keywords: ['godot'] },
  { id: 'raspberrypi', name: 'Raspberry Pi', category: 'tools', badgeSlug: 'raspberrypi', color: 'A22846', keywords: ['raspberry', 'rpi', 'iot'] },
  { id: 'arduino', name: 'Arduino', category: 'tools', badgeSlug: 'arduino', color: '00979D', keywords: ['arduino'] },
];

export function detectTechStack(repos: GitHubRepository[]): TechItem[] {
  const detectedIds = new Set<string>();
  const allTexts: string[] = [];

  for (const repo of repos) {
    if (repo.language) {
      allTexts.push(repo.language.toLowerCase());
    }
    if (repo.name) {
      allTexts.push(repo.name.toLowerCase().replace(/[-_]/g, ' '));
    }
    if (repo.description) {
      allTexts.push(repo.description.toLowerCase());
    }
    if (repo.topics && Array.isArray(repo.topics)) {
      repo.topics.forEach(t => allTexts.push(t.toLowerCase()));
    }
  }

  const combined = allTexts.join(' ');

  for (const tech of ALL_TECH_CATALOG) {
    for (const kw of tech.keywords) {
      const regex = new RegExp(`(^|\\b|[-_])${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\b|[-_]|$)`, 'i');
      if (regex.test(combined)) {
        detectedIds.add(tech.id);
        break;
      }
    }
  }

  // Fallback defaults if very few detected
  if (detectedIds.size === 0) {
    ['git', 'typescript', 'react', 'nodejs'].forEach(id => detectedIds.add(id));
  }

  return ALL_TECH_CATALOG.map(tech => ({
    id: tech.id,
    name: tech.name,
    category: tech.category,
    badgeSlug: tech.badgeSlug,
    color: tech.color,
    enabled: detectedIds.has(tech.id),
  }));
}
