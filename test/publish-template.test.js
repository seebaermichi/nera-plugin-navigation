import fs from 'fs'
import os from 'os'
import path from 'path'
import { execFileSync } from 'child_process'
import pug from 'pug'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'

const SCRIPT_PATH = path.resolve('bin/publish-template.js')

// The publish target is a throwaway directory. Earlier versions of this file
// wrote stub .pug files into the real views/ source tree when any were
// missing, which is how a broken template could be "verified" as present.
let projectRoot
let templatesDest

function publish(args = []) {
    return execFileSync('node', [SCRIPT_PATH, ...args], {
        cwd: projectRoot,
        stdio: 'pipe',
    }).toString()
}

beforeEach(() => {
    projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'nera-nav-publish-'))
    templatesDest = path.join(projectRoot, 'views/vendor/plugin-navigation')

    // Minimum shape validateNeraProject() looks for.
    fs.writeFileSync(
        path.join(projectRoot, 'package.json'),
        JSON.stringify({ name: 'my-site' }, null, 2)
    )
    fs.mkdirSync(path.join(projectRoot, 'config'), { recursive: true })
    fs.writeFileSync(path.join(projectRoot, 'config/app.yaml'), 'lang: en\n')
    fs.mkdirSync(path.join(projectRoot, 'pages'), { recursive: true })
})

afterEach(() => {
    fs.rmSync(projectRoot, { recursive: true, force: true })
})

describe('publish-template command', () => {
    it('copies all pug templates to the correct location', () => {
        publish()

        expect(fs.existsSync(templatesDest)).toBe(true)

        for (const template of [
            'simple-navigation.pug',
            'pipe-separated-navigation.pug',
            'link-list-navigation.pug',
        ]) {
            expect(fs.existsSync(path.join(templatesDest, template))).toBe(true)
        }
    })

    it('copies the partials and helpers the templates include', () => {
        publish()

        // The top-level templates are useless without these: each one opens
        // with `include partials/...`, and every partial includes ../helper/.
        for (const nested of [
            'partials/simple-navigation.pug',
            'partials/pipe-separated-navigation.pug',
            'partials/link-list-navigation.pug',
            'helper/mixins.pug',
            'helper/setup.pug',
        ]) {
            expect(fs.existsSync(path.join(templatesDest, nested))).toBe(true)
        }
    })

    it('publishes templates that actually compile', () => {
        publish()

        // The point of the partials fix: a published template has to render
        // from its new home, not merely exist there.
        for (const template of [
            'simple-navigation.pug',
            'pipe-separated-navigation.pug',
            'link-list-navigation.pug',
        ]) {
            expect(() =>
                pug.compileFile(path.join(templatesDest, template))
            ).not.toThrow()
        }
    })

    it('skips if templates directory already exists', () => {
        fs.mkdirSync(templatesDest, { recursive: true })
        fs.writeFileSync(path.join(templatesDest, 'existing.pug'), '// existing')

        const output = publish()

        expect(output).toMatch(/Skipping/i)
        expect(output).toMatch(/--force/)
        expect(
            fs.readFileSync(path.join(templatesDest, 'existing.pug'), 'utf-8')
        ).toBe('// existing')
    })

    it('overwrites an existing directory when --force is passed', () => {
        fs.mkdirSync(templatesDest, { recursive: true })
        fs.writeFileSync(
            path.join(templatesDest, 'simple-navigation.pug'),
            '// stale'
        )

        publish(['--force'])

        const content = fs.readFileSync(
            path.join(templatesDest, 'simple-navigation.pug'),
            'utf-8'
        )
        expect(content).not.toBe('// stale')
        expect(content).toContain('include partials/simple-navigation')
        expect(
            fs.existsSync(path.join(templatesDest, 'partials/simple-navigation.pug'))
        ).toBe(true)
    })
})
