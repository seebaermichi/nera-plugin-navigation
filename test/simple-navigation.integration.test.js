import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import os from 'os'
import path from 'path'
import fs from 'fs'
import pug from 'pug'
import { load } from 'cheerio'
import { fileURLToPath } from 'url'
import { getAppData } from '../index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const VIEWS_DIR = path.join(__dirname, '../views')

// Config is read relative to cwd, so this runs from a throwaway directory
// rather than writing into — and then deleting from — the real repo, which
// now ships its own config/navigation.yaml.
const REPO_ROOT = process.cwd()
let workDir

beforeAll(() => {
    workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nera-nav-integration-'))
    fs.mkdirSync(path.join(workDir, 'config'), { recursive: true })
    fs.writeFileSync(
        path.join(workDir, 'config/navigation.yaml'),
        `
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
`
    )
    process.chdir(workDir)
})

afterAll(() => {
    process.chdir(REPO_ROOT)
    fs.rmSync(workDir, { recursive: true, force: true })
})

describe('Navigation plugin integration', () => {
    it('loads config and renders navigation HTML', () => {
        const appWithNav = getAppData({ app: {} })

        // Since we don't want to adjust the template, we only use main nav elements for this test
        appWithNav.nav.elements = appWithNav.nav.main.elements

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
        )

        const $ = load(html)
        expect($('a').first().text()).toBe('About')
        expect($('a').first().attr('href')).toBe('/about/index.html')
        expect($('a').first().attr('class')).toContain('active-path')
        expect(
            $('a[href="/about/michael-becker.html"]').first().attr('class')
        ).toContain('active')
    })

    // Renders the link-list mixin directly so `rootPath` can be passed, which
    // the ready-made views/simple-navigation.pug does not expose.
    function renderNav({ elements, meta, rootPath }) {
        // Relative include, resolved against `filename` below — an absolute
        // one would additionally require pug's `basedir`.
        const src = [
            'include partials/link-list-navigation',
            '',
            rootPath === undefined
                ? '+linkListNav(elements, "nav--main")'
                : `+linkListNav(elements, "nav--main", "${rootPath}")`,
        ].join('\n')

        return pug.render(src, {
            filename: path.join(VIEWS_DIR, 'inline.pug'),
            app: { nav: { elements } },
            elements,
            meta,
        })
    }

    const LANG_NAV = [
        { href: '/es/index.html', name: 'Inicio' },
        { href: '/es/docs/index.html', name: 'Docs' },
        { href: '/es/plugins/index.html', name: 'Plugins' },
        { href: '/es/about.html', name: 'Acerca de' },
    ]

    it('does not mark every entry on a page sitting in a prefixed root', () => {
        // /es/about.html lives directly in /es. With rootPath left at '/', /es
        // looks like a nested section and every href starting with /es matches.
        const html = renderNav({
            elements: LANG_NAV,
            meta: { dirname: '/es', fullPath: '/es/about.html' },
            rootPath: '/es',
        })

        const $ = load(html)
        const marked = $('a')
            .filter((_, el) => /active/.test($(el).attr('class') || ''))
            .map((_, el) => $(el).attr('href'))
            .get()

        expect(marked).toEqual(['/es/about.html'])
    })

    it('still marks the section index from a nested page under a prefixed root', () => {
        const html = renderNav({
            elements: LANG_NAV,
            meta: { dirname: '/es/docs', fullPath: '/es/docs/cli.html' },
            rootPath: '/es',
        })

        const $ = load(html)
        expect($('a[href="/es/docs/index.html"]').attr('class')).toContain(
            'active-path'
        )
        expect($('a[href="/es/index.html"]').attr('class') || '').not.toContain(
            'active'
        )
    })

    it('does not treat a sibling directory sharing a name prefix as the section', () => {
        const html = renderNav({
            elements: [
                { href: '/docs/index.html', name: 'Docs' },
                { href: '/docs-archive/index.html', name: 'Archive' },
            ],
            meta: { dirname: '/docs', fullPath: '/docs/cli.html' },
        })

        const $ = load(html)
        expect($('a[href="/docs/index.html"]').attr('class')).toContain(
            'active-path'
        )
        expect(
            $('a[href="/docs-archive/index.html"]').attr('class') || ''
        ).not.toContain('active')
    })

    it('defaults rootPath to / so existing call sites are unaffected', () => {
        const html = renderNav({
            elements: [
                { href: '/index.html', name: 'Home' },
                { href: '/about.html', name: 'About' },
            ],
            meta: { dirname: '/', fullPath: '/about.html' },
        })

        const $ = load(html)
        expect($('a[href="/about.html"]').attr('class')).toContain('active')
        expect($('a[href="/index.html"]').attr('class') || '').not.toContain(
            'active'
        )
    })
})
