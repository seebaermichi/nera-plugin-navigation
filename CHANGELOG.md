# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - 2026-07-22

### Added

-   `nav_class`, `active_class` and `active_path_class` now actually work. The
    templates read them instead of hardcoding class names, so `nav_class` is a
    real BEM block name: setting `nav_class: mainmenu` renames the whole family
    to `.mainmenu`, `.mainmenu--list`, `.mainmenu__item`, `.mainmenu__link`,
    `.mainmenu__link--active`
-   integration tests covering configurable class names, and covering every
    entry template against a grouped and an absent config

### Fixed

-   **BREAKING**: a grouped (multi-navigation) config no longer crashes the
    ready-made templates. `app.nav.elements` was left as the raw config object,
    so a zero-argument mixin call reached `item.href.replace` on an array and
    threw. It is now always an array — empty when the config is grouped or
    absent, so those templates render an empty navigation instead of failing
    the build
-   the README's only include snippet pointed at
    `views/vendor/plugin-navigation/…`, which resolves from no directory at
    all: it lacked the leading `/` **and** carried a spurious `views/` segment
-   the documented BEM class list named three classes no template emits
    (`.nav__list`, `.nav__item--inline`, `.nav__separator`) and omitted
    `.nav--list`, which every list navigation carries

### Changed

-   **BREAKING**: `app.nav.activeClass` and `app.nav.activePathClass` now
    default to `nav__link--active` / `nav__link--active-path` — the values the
    templates have always emitted — instead of `active` / `active-path`, values
    that appeared nowhere in the markup
-   **BREAKING**: `app.nav.elements` is `[]` rather than the raw config object
    when the config is grouped
-   the packaged `config/navigation.yaml` ships the three class keys commented
    out, so copying it no longer changes your markup
-   documented that `href` is required and that entries lacking it are skipped
    with a warning, that `path` is derived, and that extra keys pass through
-   documented every entry template and mixin by name, and the role of
    `helper/`
-   Node requirement corrected to `>= 20.0.0`; added the `@nera-static/plugin-utils`
    `^1.2.0` range and the reason behind the Nera v4.1.0 floor
-   added a Contributing section

### Migration from v2.x

**If you never set `active_class`, `active_path_class` or `nav_class`,
nothing changes.** The rendered markup is byte-identical to 2.4.1.

**If you copied the packaged `config/navigation.yaml`** — which shipped with
`active_class: active`, `active_path_class: active-path`, `nav_class: nav` —
those values were previously ignored and are now applied. Your active links
would change from `nav__link--active` to `active`. To keep your existing CSS
working, comment the three keys out:

```yaml
# active_class: active
# active_path_class: active-path
# nav_class: nav
```

Or keep them and update your CSS to match. The base class `nav` produces the
same output either way.

**If you use a grouped config** with the ready-made entry templates, they
previously threw; they now render an empty navigation. Include the `partials/`
file and call the mixin with explicit elements instead:

```pug
include /vendor/plugin-navigation/partials/link-list-navigation

+linkListNav(app.nav.main.elements, 'nav--main')
```

**If you read `app.nav.elements` directly under a grouped config**, it is now
`[]` rather than the raw config object. Read `app.nav.<group>.elements`.


## [2.4.1] - 2026-07-21

### Fixed

-   the active-path class is now applied to a section entry when the current
    page sits anywhere beneath it, not only one level down. The check asked
    whether the navigation entry lived inside the current page's directory,
    which is the relationship inverted: it happens to hold when a page is a
    direct child of its section, and fails below that. A page at
    `/tutorials/tags/links.html` — for instance a tag overview generated with
    `tag_overview_path: /tutorials/tags` — left `/tutorials/index.html`
    unmarked. Entries whose href sits in the root are still never treated as
    ancestors, so Home is not marked on every page


## [2.4.0] - 2026-07-21

### Added

-   `rootPath` argument on the `linkListNav`, `simpleNav` and
    `pipeSeparatedNav` mixins, defaulting to `/`. It names the directory that
    counts as the site root, for sites whose pages live under a shared prefix
    such as `/de` or a subdirectory deployment

### Fixed

-   the active-path class is no longer applied to every navigation entry on a
    page that sits directly in a prefixed root. The check recognised only `/`
    as a root, so for a page such as `/es/about.html` the prefix `/es` looked
    like an ordinary section, and since every navigation href in that language
    starts with `/es`, all of them matched. Pass the prefix as `rootPath` to
    resolve it
-   the ancestor test is anchored at a path separator, so a page in `/docs` no
    longer claims `/docs-archive/index.html` as part of its own section

### Notes

-   the templates are unchanged in markup and class names, and existing call
    sites keep working — `rootPath` defaults to `/`, which is exactly the
    previous behaviour. Sites that already published templates need
    `npx nera-navigation --force` to pick up the corrected `helper/setup.pug`


## [2.3.0] - 2026-07-21

### Changed

-   raised minimum Node from 18 to 20; Node 18 reached end-of-life on
    2025-04-30 and the dev toolchain requires Node 20+


## [2.2.0] - 2026-07-19

### Fixed

-   the `publish-template` command is now actually shipped. `bin/` was absent
    from the published package and no `bin` entry existed, so the command
    documented in the README could never resolve
-   published templates now include their `partials/` and `helper/` files, so
    they compile. Previously only the three top-level templates were copied and
    every one of them failed on its first `include` (requires
    `@nera-static/plugin-utils` ^1.2.0)
-   a `navigation.yaml` entry missing `href` no longer crashes the build with a
    `TypeError` from inside `node_modules`; the entry is skipped with a warning
    naming its position

### Added

-   a commented default `config/navigation.yaml` is now shipped
-   `npx nera-navigation --force` re-publishes over existing templates,
    discarding local edits

### Changed

-   `@nera-static/plugin-utils` range widened to `^1.2.0`
-   navigation config is resolved per call rather than at module load

## [2.1.0] - 2024-12-27

### Added

-   Professional CHANGELOG.md for release tracking
-   Enhanced README.md with comprehensive documentation
-   Support for Nera v4.1.0 static site generator
-   Template publishing system via `bin/publish-template.js`
-   BEM (Block Element Modifier) CSS methodology for all templates
-   Comprehensive test suite with 14 tests covering all functionality

### Changed

-   Updated development dependencies for security and performance
-   Improved package.json metadata and repository references
-   Enhanced code documentation and examples
-   Modernized CSS classes using BEM methodology:
    -   `.nav`, `.nav__list`, `.nav__item`, `.nav__link`
    -   `.nav__link--active`, `.nav__link--active-path`
    -   `.nav--list`, `.nav__list--pipe-separated`

### Technical Details

-   Maintains stable API with `getAppData()` function
-   Full compatibility with Nera's plugin system
-   Zero breaking changes from previous version
-   All tests passing (14/14)
-   Template publishing to `views/vendor/plugin-navigation/`

## [2.0.1] - Previous Release

### Note

-   This version was already published on npm before our enhancements

## [2.0.0] - 2024-07-19

### Added

-   Initial stable release for Nera static site generator
-   Navigation generation from YAML configuration
-   Support for multi-level navigations (main, footer, etc.)
-   Built-in Pug templates and mixins
-   Automatic active/path highlighting
-   Comprehensive test coverage

### Features

-   Single and multi-navigation support
-   Flexible CSS class configuration
-   Template inheritance and mixins
-   Integration with @nera-static/plugin-utils

### Dependencies

-   Node.js >=18 support
-   ES modules architecture
-   Modern development tooling
