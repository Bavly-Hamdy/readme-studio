/**
 * Subset of GitHub Linguist language colors (https://github.com/github-linguist/linguist).
 * Used so every chart in the dashboard and README matches GitHub's own palette.
 */
export const LANGUAGE_COLORS: Readonly<Record<string, string>> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
  PHP: '#4F5D95',
  Ruby: '#701516',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Scala: '#c22d40',
  Elixir: '#6e4a7e',
  Erlang: '#B83998',
  Haskell: '#5e5086',
  Clojure: '#db5855',
  Lua: '#000080',
  Perl: '#0298c3',
  R: '#198CE7',
  Julia: '#a270ba',
  'Jupyter Notebook': '#DA5B0B',
  Shell: '#89e051',
  PowerShell: '#012456',
  Dockerfile: '#384d54',
  HCL: '#844FBA',
  Nix: '#7e7eff',
  Makefile: '#427819',
  CMake: '#DA3434',
  HTML: '#e34c26',
  CSS: '#563d7c',
  SCSS: '#c6538c',
  Less: '#1d365d',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  Astro: '#ff5a03',
  MDX: '#fcb32c',
  'Objective-C': '#438eff',
  'Objective-C++': '#6866fb',
  Assembly: '#6E4C13',
  Zig: '#ec915c',
  Nim: '#ffc200',
  OCaml: '#ef7a08',
  'F#': '#b845fc',
  Solidity: '#AA6746',
  Vim: '#199f4b',
  'Vim Script': '#199f4b',
  'Emacs Lisp': '#c065db',
  TeX: '#3D6117',
  Groovy: '#4298b8',
  'Visual Basic .NET': '#945db7',
  Crystal: '#000100',
  Elm: '#60B5CC',
  GDScript: '#355570',
  Mojo: '#ff4c1f',
  V: '#4f87c4',
  WebAssembly: '#04133b',
  Batchfile: '#C1F12E',
  Smarty: '#f0c040',
  Twig: '#c1d026',
  Handlebars: '#f7931e',
  Pug: '#a86454',
  Blade: '#f7523f',
  PLpgSQL: '#336790',
  TSQL: '#e38c00',
  SQL: '#e38c00',
  Markdown: '#083fa1',
};

const FALLBACK_PALETTE = ['#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b', '#6366f1', '#10b981', '#ef4444', '#0ea5e9'];

export function languageColor(name: string | null | undefined): string {
  if (!name) return '#8b949e';
  const known = LANGUAGE_COLORS[name];
  if (known) return known;
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return FALLBACK_PALETTE[hash % FALLBACK_PALETTE.length];
}
