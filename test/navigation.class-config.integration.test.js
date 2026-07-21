import { describe, it, expect, afterEach } from 'vitest'
import os from 'os'
import path from 'path'
import fs from 'fs'
import pug from 'pug'
import { fileURLToPath } from 'url'
import { getAppData } from '../index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const VIEWS_DIR = path.join(__dirname, '../views')
const REPO_ROOT = process.cwd()

const meta = {
    dirname: '/about',
    fullPath: '/about/me.html',
    filename: 'me.html',
}

// Config is read from cwd, so each case runs in its own throwaway project.
// `yaml === null` means "no config file at all".
function render(yaml, template = 'link-list-navigation.pug') {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'nera-nav-classes-'))
    fs.mkdirSync(path.join(dir, 'config'), { recursive: true })

    if (yaml !== null) {
        fs.writeFileSync(path.join(dir, 'config/navigation.yaml'), yaml)
    }

    process.chdir(dir)

    try {
        const app = getAppData({ app: {} })
        return pug.renderFile(path.join(VIEWS_DIR, template), { app, meta })
    } finally {
        process.chdir(REPO_ROOT)
        fs.rmSync(dir, { recursive: true, force: true })
    }
}

const FLAT = `
elements:
  - href: /index.html
    name: Home
  - href: /about/index.html
    name: About
`

const GROUPED = `
elements:
  main:
    - href: /index.html
      name: Home
  footer:
    - href: /imprint.html
      name: Imprint
`

afterEach(() => {
    process.chdir(REPO_ROOT)
})

describe('configurable class names', () => {
    it('renders the documented BEM defaults when nothing is configured', () => {
        const html = render(FLAT)

        expect(html).toContain('class="nav nav--list"')
        expect(html).toContain('class="nav__item"')
        expect(html).toContain('class="nav__link"')
        expect(html).toContain('nav__link--active-path')
    })

    it('renames the whole BEM family from nav_class', () => {
        const html = render(`
nav_class: mainmenu
${FLAT}`)

        expect(html).toContain('class="mainmenu mainmenu--list"')
        expect(html).toContain('class="mainmenu__item"')
        expect(html).toContain('class="mainmenu__link"')
        expect(html).toContain('mainmenu__link--active-path')
        expect(html).not.toContain('nav__')
    })

    it('applies active_class to the link matching the current page', () => {
        const html = render(`
active_class: is-current
elements:
  - href: /about/me.html
    name: Me
`)

        expect(html).toContain('is-current')
        expect(html).not.toContain('nav__link--active"')
    })

    it('applies active_path_class to an ancestor link', () => {
        const html = render(`
active_path_class: is-open
${FLAT}`)

        expect(html).toContain('is-open')
        expect(html).not.toContain('nav__link--active-path')
    })
})

describe('templates never throw on a non-flat config', () => {
    // Regression: grouped config left `elements` as the raw config object, so
    // the zero-argument entry templates hit `item.href.replace` on an array.
    it('renders an empty navigation for a grouped config', () => {
        const html = render(GROUPED)

        expect(html).toBe('<ul class="nav nav--list"></ul>')
    })

    it('renders an empty navigation when navigation.yaml is absent', () => {
        const html = render(null)

        expect(html).toBe('<ul class="nav nav--list"></ul>')
    })

    it('renders an empty navigation for every entry template', () => {
        expect(render(GROUPED, 'simple-navigation.pug')).toBe('<nav></nav>')
        expect(render(GROUPED, 'pipe-separated-navigation.pug')).toBe(
            '<nav></nav>'
        )
    })

    it('still exposes each named group for explicit mixin calls', () => {
        const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'nera-nav-groups-'))
        fs.mkdirSync(path.join(dir, 'config'), { recursive: true })
        fs.writeFileSync(path.join(dir, 'config/navigation.yaml'), GROUPED)
        process.chdir(dir)

        try {
            const app = getAppData({ app: {} })

            expect(app.nav.main.elements).toHaveLength(1)
            expect(app.nav.footer.elements).toHaveLength(1)
            expect(app.nav.main.className).toBe('main-nav')
            expect(app.nav.elements).toEqual([])
        } finally {
            process.chdir(REPO_ROOT)
            fs.rmSync(dir, { recursive: true, force: true })
        }
    })
})
