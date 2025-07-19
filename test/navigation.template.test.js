import { describe, it, expect } from 'vitest'
import path from 'path'
import fs from 'fs/promises'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const VIEWS_DIR = path.join(__dirname, '../views')

describe('Navigation Template Files', () => {
    describe('template structure', () => {
        it('should have all required template files', async () => {
            const requiredTemplates = [
                'simple-navigation.pug',
                'pipe-separated-navigation.pug',
                'link-list-navigation.pug',
            ]

            for (const template of requiredTemplates) {
                const templatePath = path.join(VIEWS_DIR, template)
                await expect(fs.access(templatePath)).resolves.not.toThrow()
            }
        })

        it('should have helper files', async () => {
            const helperFiles = ['mixins.pug', 'setup.pug']

            for (const helper of helperFiles) {
                const helperPath = path.join(VIEWS_DIR, 'helper', helper)
                await expect(fs.access(helperPath)).resolves.not.toThrow()
            }
        })

        it('should have partial templates', async () => {
            const partials = [
                'simple-navigation.pug',
                'pipe-separated-navigation.pug',
                'link-list-navigation.pug',
            ]

            for (const partial of partials) {
                const partialPath = path.join(VIEWS_DIR, 'partials', partial)
                await expect(fs.access(partialPath)).resolves.not.toThrow()
            }
        })

        it('should have valid template content', async () => {
            const templatePath = path.join(VIEWS_DIR, 'helper/mixins.pug')
            const content = await fs.readFile(templatePath, 'utf-8')

            // Check that mixin is properly defined
            expect(content).toContain('mixin link')
            expect(content).toContain('href=item.href')
            expect(content).toContain('item.name')
        })

        it('should have setup helper with navigation logic', async () => {
            const setupPath = path.join(VIEWS_DIR, 'helper/setup.pug')
            const content = await fs.readFile(setupPath, 'utf-8')

            // Check for navigation-specific logic
            expect(content).toContain('meta.fullPath')
            expect(content).toContain('activeClass')
            expect(content).toContain('activePathClass')
        })
    })
})
