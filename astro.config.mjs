import { defineConfig } from 'astro/config';

export default defineConfig({
  site: process.env.SITE_URL || 'https://shajiuquan.github.io',
  base: process.env.SITE_BASE || '/company-site',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
});
