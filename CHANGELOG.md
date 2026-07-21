# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
