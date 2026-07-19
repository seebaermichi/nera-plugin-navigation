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
})
