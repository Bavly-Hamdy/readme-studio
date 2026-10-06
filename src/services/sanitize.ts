import DOMPurify from 'dompurify';

/**
 * Enterprise-Grade HTML Sanitization for Rendered Markdown & Dynamic HTML.
 * Hardened to satisfy OWASP Top 10 (A03: Injection & XSS) standards.
 * 
 * Features:
 * - Strict tag whitelist tailored for GitHub Flavored Markdown (GFM).
 * - Blocks script, iframe, object, embed, form, and executable elements.
 * - Enforces secure URL protocols (https, http, mailto) and strips javascript: URI schemes.
 * - Automatically injects rel="noopener noreferrer" and target="_blank" on external links.
 */
export function sanitizeMarkdownHtml(dirtyHtml: string): string {
  if (!dirtyHtml || typeof dirtyHtml !== 'string') {
    return '';
  }

  // Configure DOMPurify hooks once to enforce secure link attributes
  DOMPurify.removeHook('afterSanitizeAttributes');
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'A') {
      const href = node.getAttribute('href');
      if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
        node.setAttribute('target', '_blank');
        node.setAttribute('rel', 'noopener noreferrer nofollow');
      }
    }
  });

  return DOMPurify.sanitize(dirtyHtml, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'a', 'img', 'div', 'span',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'pre', 'code', 'ul', 'ol', 'li',
      'blockquote', 'hr', 'br',
      'sub', 'sup', 'strong', 'em', 'del', 'details', 'summary',
      'svg', 'path', 'g', 'circle', 'rect', 'line'
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'class', 'id',
      'width', 'height', 'align', 'style', 'dir',
      'data-theme', 'target', 'rel',
      'viewBox', 'xmlns', 'fill', 'stroke', 'stroke-width', 'd'
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    FORBID_TAGS: [
      'script', 'iframe', 'object', 'embed', 'base',
      'form', 'input', 'textarea', 'button', 'style', 'link', 'meta'
    ],
    FORBID_ATTR: [
      'onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur',
      'formaction', 'autofocus', 'contenteditable'
    ],
  });
}

/**
 * Strict GitHub username format validator
 * Validates against GitHub username specifications:
 * - Max 39 characters
 * - Alphanumeric with single hyphens (cannot begin or end with hyphen)
 */
export function sanitizeGitHubUsername(input: string): string {
  if (!input) return '';
  let clean = input.trim();
  // Strip full URL if provided (e.g., https://github.com/username)
  clean = clean.replace(/^(?:https?:\/\/)?(?:www\.)?github\.com\//i, '');
  // Strip leading @
  clean = clean.replace(/^@+/, '');
  // Strip any trailing path or query parameters
  clean = clean.split(/[/?#]/)[0].trim();
  return clean;
}

export function isValidGitHubUsername(username: string): boolean {
  if (!username || username.length > 39) return false;
  return /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/.test(username);
}
