const path = require('path')

const { getConfig } = require('../plugin-helper')

module.exports = (() => {
    const getNavElements = (elements) => {
        return elements.map(element => Object.assign({}, element, {
            path: path.dirname(element.href)
        }))
    }

    const getMainNav = () => {
        const navConfig = getConfig(`${__dirname}/config/navigation.yaml`)

        navConfig.activeClass = navConfig.active_class || 'active'
        navConfig.activePathClass = navConfig.active_path_class || 'active-path'
        navConfig.navClass = navConfig.nav_class || 'nav'

        if (Array.isArray(navConfig.elements)) {
            navConfig.elements = getNavElements(navConfig.elements)
        } else {
            const navElements = Object.keys(navConfig.elements)

            navElements.forEach(element => {
                navConfig[element] = {
                    className: `${element}-${navConfig.navClass}`
                }
                navConfig[element].elements = getNavElements(navConfig.elements[element])
            })
        }

        return navConfig
    }

    const getAppData = data => {
        if (data.app !== null && typeof data.app === 'object') {
            return Object.assign({}, data.app, {
                nav: getMainNav()
            })
        }

        return data.app
    }

    return {
        getAppData
    }
})()
