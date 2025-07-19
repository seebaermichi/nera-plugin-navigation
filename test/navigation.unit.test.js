import { describe, it, expect } from 'vitest'
import { getAppData } from '../index.js'
import path from 'path'
import fs from 'fs/promises'

const CONFIG_DIR = path.resolve(process.cwd(), 'config')
const CONFIG_FILE = path.join(CONFIG_DIR, 'navigation.yaml')

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

async function createTempConfig(content) {
    await fs.mkdir(CONFIG_DIR, { recursive: true })
    await fs.writeFile(CONFIG_FILE, content)
}

async function cleanupTempConfig() {
    try {
        await fs.unlink(CONFIG_FILE)
        await fs.rmdir(CONFIG_DIR)
    } catch {
        // Ignore cleanup errors
    }
}

describe('Navigation Plugin Unit Tests', () => {
    describe('getAppData function', () => {
        it('should return undefined when app data is not an object', async () => {
            await createTempConfig(mockSingleNavConfig)

            const result = getAppData({ app: null })
            expect(result).toBeNull()

            await cleanupTempConfig()
        })

        it('should handle single navigation configuration', async () => {
            await createTempConfig(mockSingleNavConfig)

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

            await cleanupTempConfig()
        })

        it('should handle multi-navigation configuration', async () => {
            await createTempConfig(mockMultiNavConfig)

            const mockData = { app: { title: 'Test Site' } }
            const result = getAppData(mockData)

            expect(result).toHaveProperty('nav')
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

            await cleanupTempConfig()
        })

        it('should preserve existing app data', async () => {
            await createTempConfig(mockSingleNavConfig)

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

            await cleanupTempConfig()
        })

        it('should handle complex nested paths correctly', async () => {
            const complexConfig = `
active_class: "active"
nav_class: "nav"
elements:
  - href: /blog/post-1.html
    name: Post 1
  - href: /services/web-development/index.html
    name: Web Development
  - href: /about/team/john-doe.html
    name: John Doe
`
            await createTempConfig(complexConfig)

            const result = getAppData({ app: {} })

            expect(result.nav.elements[0].path).toBe('/blog')
            expect(result.nav.elements[1].path).toBe(
                '/services/web-development'
            )
            expect(result.nav.elements[2].path).toBe('/about/team')

            await cleanupTempConfig()
        })

        it('should use default CSS classes when not specified', async () => {
            const minimalConfig = `
elements:
  - href: /index.html
    name: Home
`
            await createTempConfig(minimalConfig)

            const result = getAppData({ app: {} })

            expect(result.nav.activeClass).toBe('active')
            expect(result.nav.activePathClass).toBe('active-path')
            expect(result.nav.navClass).toBe('nav')

            await cleanupTempConfig()
        })
    })
})
