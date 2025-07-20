# @nera-static/plugin-navigation

A plugin for the [Nera](https://github.com/seebaermichi/nera) static site generator to create navigations from config files. Supports mixins and templates for easy rendering and styling.

## ✨ Features

- Define one or more navigations via YAML config
- Access navigation data directly in templates (`app.nav`)
- Support for multi-level navigations (e.g., main, footer)
- Includes ready-to-use Pug templates and mixins
- Automatic active and path highlighting
- Static, zero-runtime overhead
- Full compatibility with Nera v4.1.0+

## 🚀 Installation

Install the plugin in your Nera project:

```bash
npm install @nera-static/plugin-navigation
```

Then create the configuration file:

```bash
mkdir -p config
touch config/navigation.yaml
```

This creates:

```
config/
└── navigation.yaml
```

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

Each element includes `href`, `name`, and `path`.

## 🧩 Usage

### Manual Rendering

Loop through `app.nav.*.elements` directly in your Pug templates.

## 🛠️ Template Publishing

Use the default templates provided by the plugin:

```bash
npx @nera-static/plugin-navigation run publish-template
```

This copies template files to:

```
views/vendor/plugin-navigation/
```

Then include them in your layouts or pages as needed.

## 🎨 Styling

The plugin uses BEM CSS methodology:

```css
.nav { }
.nav__list { }
.nav__item { }
.nav__item--inline { }
.nav__link { }
.nav__separator { }
.nav__link--active { }
.nav__link--active-path { }
```

Override or extend these classes in your project’s CSS.

## 📊 Generated Output

The plugin injects navigation data into `app.nav` without generating HTML. Use templates or mixins for output.

## 🧪 Development

```bash
npm install
npm test
npm run lint
```

Tests use [Vitest](https://vitest.dev) and validate:

- Navigation data structure
- Multi-level navigation support
- Template rendering
- Class handling and active link detection

## 🧑‍💻 Author

Michael Becker
[https://github.com/seebaermichi](https://github.com/seebaermichi)

## 🔗 Links

- [Plugin Repository](https://github.com/seebaermichi/nera-plugin-navigation)
- [NPM Package](https://www.npmjs.com/package/@nera-static/plugin-navigation)
- [Nera Static Site Generator](https://github.com/seebaermichi/nera)

## 🧩 Compatibility

- **Nera**: v4.1.0+
- **Node.js**: >= 18
- **Plugin API**: Uses `getAppData()` for injecting navigation structure

## 📦 License

MIT
