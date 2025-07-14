import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import path from 'path';
import fs from 'fs/promises';
import pug from 'pug';
import { load } from 'cheerio';
import { fileURLToPath } from 'url';
import { getAppData } from '../index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_DIR = path.resolve(process.cwd(), 'config');
const VIEWS_DIR = path.join(__dirname, '../views');
const CONFIG_FILE = path.join(CONFIG_DIR, 'navigation.yaml');

beforeAll(async () => {
    await fs.mkdir(CONFIG_DIR, { recursive: true });

    const configContent = `
active_class: "active"
active_path_class: "active-path"
nav_class: "nav"
elements:
  main:
    - href: /about/index.html
      name: About
    - href: /about/michael-becker.html
      name: About Me
    - href: /index.html
      name: Home
`;

    await fs.writeFile(CONFIG_FILE, configContent);
});

afterAll(async () => {
    await fs.rm(CONFIG_FILE, { force: true });
});

describe('Navigation plugin integration', () => {
    it('loads config and renders navigation HTML', () => {
        const appWithNav = getAppData({ app: {} });

        // Since we don't want to adjust the template, we only use main nav elements for this test
        appWithNav.nav.elements = appWithNav.nav.main.elements;

        const html = pug.renderFile(
            path.join(VIEWS_DIR, 'simple-navigation.pug'),
            {
                app: appWithNav,
                meta: {
                    dirname: '/about',
                    fullPath: '/about/michael-becker.html',
                    filename: 'michael-becker.html',
                },
            }
        );

        const $ = load(html);
        expect($('a').first().text()).toBe('About');
        expect($('a').first().attr('href')).toBe('/about/index.html');
        expect($('a').first().attr('class')).toContain('active-path');
        expect($('a[href="/about/michael-becker.html"]').first().attr('class')).toContain('active');
    });
});
