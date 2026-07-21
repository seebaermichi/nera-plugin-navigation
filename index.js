import path from 'path'
import { getConfig } from '@nera-static/plugin-utils'

// Resolved per call rather than at module scope: the host project's cwd is
// what matters, and resolving lazily is what makes this testable.
function getHostConfigPath() {
    return path.resolve(process.cwd(), 'config/navigation.yaml')
}

function getNavElements(elements, groupName) {
    if (!Array.isArray(elements)) {
        console.warn(
            `⚠️ navigation.yaml: expected a list of elements${groupName ? ` under "${groupName}"` : ''}, got ${typeof elements}. Skipping.`
        )
        return []
    }

    return elements
        .filter((element, index) => {
            // A missing href is an ordinary YAML typo. Without this guard
            // path.posix.dirname throws a TypeError from inside node_modules,
            // which tells the user nothing about which entry is at fault.
            if (!element || typeof element.href !== 'string') {
                const where = groupName ? `${groupName}[${index}]` : `elements[${index}]`
                console.warn(
                    `⚠️ navigation.yaml: skipping ${where} — it has no "href".`
                )
                return false
            }

            return true
        })
        .map((element) => ({
            ...element,
            path: path.posix.dirname(element.href),
        }))
}

function getMainNav() {
    const navConfig = getConfig(getHostConfigPath())

    // `nav_class` is the BEM block name; the element and modifier classes are
    // derived from it, so setting it renames the whole family coherently. The
    // two active classes may still be overridden individually.
    navConfig.navClass = navConfig.nav_class || 'nav'
    navConfig.activeClass =
        navConfig.active_class || `${navConfig.navClass}__link--active`
    navConfig.activePathClass =
        navConfig.active_path_class || `${navConfig.navClass}__link--active-path`

    if (Array.isArray(navConfig.elements)) {
        navConfig.elements = getNavElements(navConfig.elements)
    } else {
        for (const key in navConfig.elements) {
            navConfig[key] = {
                className: `${key}-${navConfig.navClass}`,
                elements: getNavElements(navConfig.elements[key], key),
            }
        }

        // Grouped config (or no config at all) has no single default
        // navigation. Leave `elements` an empty array rather than the raw
        // config object, so a template calling a mixin with no arguments
        // renders an empty navigation instead of throwing on `item.href`.
        navConfig.elements = []
    }

    return navConfig
}

export function getAppData(data) {
    if (data.app && typeof data.app === 'object') {
        return {
            ...data.app,
            nav: getMainNav(),
        }
    }

    return data.app
}
