import { describe, it, expect, beforeEach, afterEach, afterAll } from 'vitest'
import { getAppData } from '../index.js'
import os from 'os'
import path from 'path'
import fs from 'fs'

// These tests exercise config loading, which resolves against process.cwd().
// They run in a throwaway directory: writing into the real repo would clobber
// the default config/navigation.yaml this package ships.
const REPO_ROOT = process.cwd()
let workDir

// Mock configuration content for testing
const mockSingleNavConfig = `
active_class: "current"
active_path_class: "current-path"
nav_class: "navigation"
elements:
  - href: /index.html
    name: Home
  - href: /about.html
    name: About
  - href: /contact.html
    name: Contact
`

const mockMultiNavConfig = `
active_class: "active"
active_path_class: "active-path"
nav_class: "nav"
elements:
  main:
    - href: /index.html
      name: Home
    - href: /services.html
      name: Services
  footer:
    - href: /imprint.html
      name: Impressum
    - href: /privacy.html
      name: Privacy
`

function writeConfig(content) {
    fs.mkdirSync(path.join(workDir, 'config'), { recursive: true })
    fs.writeFileSync(path.join(workDir, 'config/navigation.yaml'), content)
}

beforeEach(() => {
    workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nera-navigation-'))
    process.chdir(workDir)
})

afterEach(() => {
    process.chdir(REPO_ROOT)
    fs.rmSync(workDir, { recursive: true, force: true })
})

afterAll(() => {
    process.chdir(REPO_ROOT)
})

describe('Navigation Plugin Unit Tests', () => {
    describe('getAppData function', () => {
        it('should return undefined when app data is not an object', () => {
            writeConfig(mockSingleNavConfig)

            const result = getAppData({ app: null })
            expect(result).toBeNull()
        })

        it('should handle single navigation configuration', () => {
            writeConfig(mockSingleNavConfig)

            const mockData = { app: { title: 'Test Site' } }
            const result = getAppData(mockData)

            expect(result).toHaveProperty('nav')
            expect(result.nav.activeClass).toBe('current')
            expect(result.nav.activePathClass).toBe('current-path')
            expect(result.nav.navClass).toBe('navigation')
            expect(Array.isArray(result.nav.elements)).toBe(true)
            expect(result.nav.elements).toHaveLength(3)

            // Check if path property is added to elements
            expect(result.nav.elements[0]).toHaveProperty('path')
            expect(result.nav.elements[0].path).toBe('/')
            expect(result.nav.elements[0].href).toBe('/index.html')
            expect(result.nav.elements[0].name).toBe('Home')
        })

        it('should handle multi-navigation configuration', () => {
            writeConfig(mockMultiNavConfig)

            const mockData = { app: { title: 'Test Site' } }
            const result = getAppData(mockData)

            expect(result).toHaveProperty('nav')
            // This fixture sets the class keys explicitly, so the configured
            // values win over the derived defaults.
            expect(result.nav.activeClass).toBe('active')
            expect(result.nav.activePathClass).toBe('active-path')
            expect(result.nav.navClass).toBe('nav')

            // Check main navigation
            expect(result.nav).toHaveProperty('main')
            expect(result.nav.main.className).toBe('main-nav')
            expect(Array.isArray(result.nav.main.elements)).toBe(true)
            expect(result.nav.main.elements).toHaveLength(2)

            // Check footer navigation
            expect(result.nav).toHaveProperty('footer')
            expect(result.nav.footer.className).toBe('footer-nav')
            expect(Array.isArray(result.nav.footer.elements)).toBe(true)
            expect(result.nav.footer.elements).toHaveLength(2)

            // Verify path generation for nested navigation
            expect(result.nav.main.elements[0].path).toBe('/')
            expect(result.nav.footer.elements[0].path).toBe('/')
        })

        it('should preserve existing app data', () => {
            writeConfig(mockSingleNavConfig)

            const mockData = {
                app: {
                    title: 'Test Site',
                    meta: { description: 'A test site' },
                    customProperty: 'preserved',
                },
            }
            const result = getAppData(mockData)

            expect(result.title).toBe('Test Site')
            expect(result.meta.description).toBe('A test site')
            expect(result.customProperty).toBe('preserved')
            expect(result).toHaveProperty('nav')
        })

        it('should handle complex nested paths correctly', () => {
            writeConfig(`
active_class: "active"
nav_class: "nav"
elements:
  - href: /blog/post-1.html
    name: Post 1
  - href: /services/web-development/index.html
    name: Web Development
  - href: /about/team/john-doe.html
    name: John Doe
`)

            const result = getAppData({ app: {} })

            expect(result.nav.elements[0].path).toBe('/blog')
            expect(result.nav.elements[1].path).toBe(
                '/services/web-development'
            )
            expect(result.nav.elements[2].path).toBe('/about/team')
        })

        it('should use default CSS classes when not specified', () => {
            writeConfig(`
elements:
  - href: /index.html
    name: Home
`)

            const result = getAppData({ app: {} })

            expect(result.nav.activeClass).toBe('nav__link--active')
            expect(result.nav.activePathClass).toBe('nav__link--active-path')
            expect(result.nav.navClass).toBe('nav')
        })

        it('should skip an element missing href instead of throwing', () => {
            writeConfig(`
elements:
  - href: /index.html
    name: Home
  - name: Typo — no href
  - href: /contact.html
    name: Contact
`)

            const result = getAppData({ app: {} })

            expect(result.nav.elements).toHaveLength(2)
            expect(result.nav.elements.map((e) => e.href)).toEqual([
                '/index.html',
                '/contact.html',
            ])
        })

        it('should skip a malformed element inside a named navigation', () => {
            writeConfig(`
elements:
  main:
    - name: Broken
    - href: /index.html
      name: Home
`)

            const result = getAppData({ app: {} })

            expect(result.nav.main.elements).toHaveLength(1)
            expect(result.nav.main.elements[0].href).toBe('/index.html')
        })

        it('should tolerate a missing navigation.yaml', () => {
            const result = getAppData({ app: { title: 'Test Site' } })

            expect(result.nav.activeClass).toBe('nav__link--active')
            // Grouped or absent config yields an empty array, never the raw
            // config object -- zero-argument templates must not throw.
            expect(result.nav.elements).toEqual([])
        })
    })
})
