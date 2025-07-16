import path from 'path'
import { getConfig } from '@nera-static/plugin-utils'

// Default location to look for navigation.yaml in host project
const HOST_CONFIG_PATH = path.resolve(process.cwd(), 'config/navigation.yaml')

function getNavElements(elements) {
    return elements.map((element) => ({
        ...element,
        path: path.posix.dirname(element.href),
    }))
}

function getMainNav() {
    const navConfig = getConfig(HOST_CONFIG_PATH)

    navConfig.activeClass = navConfig.active_class || 'active'
    navConfig.activePathClass = navConfig.active_path_class || 'active-path'
    navConfig.navClass = navConfig.nav_class || 'nav'

    if (Array.isArray(navConfig.elements)) {
        navConfig.elements = getNavElements(navConfig.elements)
    } else {
        for (const key in navConfig.elements) {
            navConfig[key] = {
                className: `${key}-${navConfig.navClass}`,
                elements: getNavElements(navConfig.elements[key]),
            }
        }
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
