# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.1] - 2024-12-27

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
