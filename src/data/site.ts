export type Language = 'zh' | 'en';
export type Page = 'home' | 'products' | 'about';

export const pages: Page[] = ['home', 'products', 'about'];
export const languages: Language[] = ['zh', 'en'];

// Identity fields still waiting on the owner. Keep unknown values in {{...}} form.
export const company = {
  name: '开特云',
  email: '{{联系邮箱}}',
  team: '{{团队介绍}}',
};

export const mailto = `mailto:${company.email}`;

const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');

export function href(lang: Language, page: Page, hash = ''): string {
  const langPart = lang === 'en' ? 'en/' : '';
  const pagePart = page === 'home' ? '' : `${page}/`;
  return `${base}${langPart}${pagePart}${hash}`;
}

export function asset(path: string): string {
  return `${base}${path.replace(/^\//, '')}`;
}
