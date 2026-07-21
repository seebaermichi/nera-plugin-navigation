# @nera-static/plugin-navigation

[![Test](https://github.com/seebaermichi/nera-plugin-navigation/actions/workflows/test.yml/badge.svg)](https://github.com/seebaermichi/nera-plugin-navigation/actions/workflows/test.yml)
[![npm version](https://img.shields.io/npm/v/@nera-static/plugin-navigation)](https://www.npmjs.com/package/@nera-static/plugin-navigation)

A plugin for the [Nera](https://github.com/seebaermichi/nera) static site generator to create navigations from config files. Supports mixins and templates for easy rendering and styling.

## ✨ Features

- Define one or more navigations via YAML config
- Access navigation data directly in templates (`app.nav`)
- Support for multi-level navigations (e.g., main, footer)
- Includes ready-to-use Pug templates and mixins
- Automatic active and path highlighting
- Configurable BEM class names
- Static, zero-runtime overhead
- Full compatibility with Nera v4.1.0+

## 🚀 Installation

Install the plugin in your Nera project:

```bash
npm install @nera-static/plugin-navigation
```

Then create the configuration file in your project:

```bash
mkdir -p config
touch config/navigation.yaml
```

This creates:

```
config/
└── navigation.yaml
```

The plugin ships a commented default at
`node_modules/@nera-static/plugin-navigation/config/navigation.yaml` — copy it
as a starting point. It is read from **your** project only; the packaged copy
is documentation, not a fallback.

Nera will automatically detect the plugin and load the configuration.

## ⚙️ Configuration

Define your navigation(s) in `config/navigation.yaml`.

### Single Navigation

```yaml
elements:
  - href: /index.html
    name: Home
  - href: /service/service.html
    name: Service
  - href: /prices.html
    name: Prices
  - href: /contact.html
    name: Contact
  - href: /about-us/index.html
    name: About us
```

Access in templates:

```pug
app.nav.elements
```

### Multiple Navigations

```yaml
elements:
  main:
    - href: /index.html
      name: Home
    - href: /service/service.html
      name: Service
  footer:
    - href: /imprint.html
      name: Imprint
```

Access in templates:

```pug
app.nav.main.elements
app.nav.footer.elements
```

With grouped navigations there is no single default, so `app.nav.elements` is
an empty array. The ready-made entry templates render whichever navigation
`app.nav.elements` holds, so **a grouped config must call a mixin with explicit
elements** — see [Mixins](#mixins) — otherwise you get an empty navigation.

Each element includes:

- `href` — **required.** An entry without a string `href` is skipped with a
  console warning naming its position; the build still succeeds, so a YAML typo
  makes one menu item quietly vanish.
- `name` — the link text. Not validated; an entry without one renders an empty
  link.
- `path` — **derived**, not user-supplied: the directory `href` lives in.

Any other keys you add pass through untouched and are available in templates.
A group whose value is not a list is skipped with a warning and yields `[]`.

### Class names

All class names are configurable. `nav_class` is the BEM block name and the
rest of the family derives from it:

```yaml
nav_class: nav            # -> .nav, .nav--list, .nav__item, .nav__link
active_class: nav__link--active
active_path_class: nav__link--active-path
```

Every key is optional. Omit them and you get the defaults above; set
`nav_class: mainmenu` and the whole family becomes `.mainmenu`,
`.mainmenu--list`, `.mainmenu__item`, `.mainmenu__link`,
`.mainmenu__link--active`. `active_class` and `active_path_class` override
just those two, independently of `nav_class`.

## 🧩 Usage

### Manual Rendering

Loop through `app.nav.*.elements` directly in your Pug templates.

### Mixins

Publishing copies eight files. Three are **entry templates** you can include
directly — they render `app.nav.elements` with no arguments, so they only suit
a single flat navigation:

| Entry template | Renders |
|---|---|
| `simple-navigation.pug` | `<nav>` with plain links |
| `link-list-navigation.pug` | `<ul class="nav nav--list">` |
| `pipe-separated-navigation.pug` | `<nav>` with `|`-separated links |

Three more under `partials/` define the **mixins**, each taking
`(elements, className, rootPath)`. Include the partial, not the entry template,
whenever you need to pass elements explicitly — which is always, for a grouped
config:

| Partial | Mixin |
|---|---|
| `partials/simple-navigation.pug` | `+simpleNav` |
| `partials/link-list-navigation.pug` | `+linkListNav` |
| `partials/pipe-separated-navigation.pug` | `+pipeSeparatedNav` |

The two files under `helper/` (`mixins.pug`, `setup.pug`) are shared internals
included by the partials; you never include them yourself.

```pug
include /vendor/plugin-navigation/partials/link-list-navigation

+linkListNav(app.nav.main.elements, 'nav--main')
```

The leading `/` makes the path resolve from your `views/` folder regardless of
where the including file sits. It requires **Nera v4.3.0+**, which is when the
renderer began setting Pug's `basedir`. On older generators use a path relative
to the including file instead, e.g. `../vendor/plugin-navigation/partials/…`.

`rootPath` (default `/`) is the directory that counts as the site root. It
decides when a link is marked with the active-path class: a page sitting
directly in the root has no parent section, so nothing is marked as its
ancestor.

Set it whenever your pages live under a shared prefix — a language prefix, or
a deployment into a subdirectory — otherwise a page directly inside that
prefix looks nested, and since every nav href shares the prefix, **the whole
menu** gets the active-path class:

```pug
//- Pages live at /de/…, so /de is this language's root
+linkListNav(app.nav.main_de.elements, 'nav--main', '/de')
```

## 🛠️ Template Publishing

Use the default templates provided by the plugin:

```bash
npx nera-navigation
```

This copies every template file — including `partials/` and `helper/`, which
the top-level templates include — to:

```
views/vendor/plugin-navigation/
```

Then include them in your layouts or pages as needed — see
[Mixins](#mixins) for which file to include and what each one renders.

Publishing **skips** if `views/vendor/plugin-navigation/` already exists, so
your edits are never overwritten. To pull in updated templates after a plugin
upgrade, discarding your changes to them:

```bash
npx nera-navigation --force
```

> **Upgrading from 2.x?** The class names live in these Pug files, so a site
> that published under 2.x keeps the old templates and `nav_class` will appear
> to do nothing. Run `--force` once to pick up the configurable class names.

## 🎨 Styling

The plugin uses BEM CSS methodology. These are the classes the templates
actually emit, with the default `nav_class: nav`:

```css
.nav { }                      /* link-list template only */
.nav--list { }                /* link-list template only */
.nav__item { }                /* link-list template only */
.nav__link { }                /* every template */
.nav__link--active { }        /* link matching the current page */
.nav__link--active-path { }   /* link that is an ancestor of it */
```

Rename the whole family with `nav_class`, or override the two state classes
individually — see [Class names](#class-names).

Two things worth knowing:

- `simple-navigation` and `pipe-separated-navigation` emit a bare `<nav>`
  carrying only the `className` you pass to the mixin. The block, list and item
  classes come from the link-list template alone.
- The separator in `pipe-separated-navigation` is a literal `&nbsp;|&nbsp;`
  text node with no element around it, so it **cannot be styled**. Use the
  link-list template with CSS separators if you need to style it.

## 📊 Generated Output

The plugin injects navigation data into `app.nav` without generating HTML. Use templates or mixins for output.

## 🧪 Development

```bash
npm install
npx vitest run      # single pass -- `npm test` is watch mode
npm run lint
```

Tests use [Vitest](https://vitest.dev) and validate:

- Navigation data structure
- Multi-level navigation support
- Template rendering
- Class handling and active link detection

## 🤝 Contributing

Issues and pull requests are welcome. See the
[Nera contributing guide](https://github.com/seebaermichi/nera/blob/main/CONTRIBUTING.md)
for plugin development, the hook contract, and local setup.

For this repo specifically:

- `npx vitest run` and `npm run lint` must pass (`npm test` is watch mode).
- Bump the version and update `CHANGELOG.md` **in the same commit** as the change.
- Template markup and BEM class names are a **public contract** — users style
  them from their own CSS, so changing one is a **major** bump. The default
  class names are load-bearing here: they are what every site published before
  3.0.0 styles against.
- Releases publish from CI on a pushed `v*` tag. Never run `npm publish`.

## 🧑‍💻 Author

Michael Becker  
[https://github.com/seebaermichi](https://github.com/seebaermichi)

## 🔗 Links

- [Plugin Repository](https://github.com/seebaermichi/nera-plugin-navigation)
- [NPM Package](https://www.npmjs.com/package/@nera-static/plugin-navigation)
- [Nera Static Site Generator](https://github.com/seebaermichi/nera)

## 🧩 Compatibility

- **Nera**: v4.1.0+ — the templates read `meta.fullPath`, which the generator
  began providing in 4.1.0. The root-absolute include form shown above
  additionally needs **v4.3.0+**; on older generators use a relative include.
- **Node.js**: >= 20.0.0
- **Plugin Utils**: `^1.2.0` — `publishAllTemplates`, which ships the
  `partials/` and `helper/` folders, arrived in 1.2.0
- **Plugin API**: Uses `getAppData()` for injecting navigation structure

## 📦 License

MIT
