# @nera-static/plugin-navigation

A plugin for the [Nera](https://github.com/seebaermichi/nera) static site generator to create navigations from config files. Supports mixins and templates for easy rendering.

## ✨ Features

-   **Flexible Navigation Structure**: Define one or more navigations via YAML config
-   **Template Integration**: Access navigation data in your templates (`app.nav`)
-   **Multi-Level Support**: Support for multi-level navigations (e.g. main, footer)
-   **Built-in Templates**: Includes ready-to-use Pug templates and mixins:
    -   Pipe-separated links
    -   Link lists
    -   Mixin-powered flexible layout
-   **Active State Management**: Automatic active/path highlighting support
-   **Zero Runtime**: Static navigation structure, no client-side processing
-   **Nera v4.1.0 Compatible**: Optimized for the latest Nera architecture

## 🚀 Installation

You can install this plugin by running the following in the root folder of your Nera project:

```bash
npm install @nera-static/plugin-navigation
```

Then create a `navigation.yaml` file inside your project’s `config/` directory:

```
config/
└── navigation.yaml
```

Nera will automatically detect the plugin and load your navigation configuration. No additional setup or imports are required.

## ⚙️ Configuration

### Single Navigation

Example `navigation/config/navigation.yaml`:

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

Access it in your templates via:

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

Use:

```pug
app.nav.main.elements
app.nav.footer.elements
```

Each element has: `href`, `name`, `path`.

## 🧩 Rendering Options

### Custom Rendering

Use the `app.nav.*.elements` arrays in your templates manually or via your own loops.

### Built-in Templates

If you like to, include one of the built-in templates in `views/`:

```pug
include ../../src/plugins/navigation/views/simple-navigation
```

Other available templates:

-   `pipe-separated-navigation.pug`
-   `link-list-navigation.pug`

### Built-in Mixins

If using multiple navigations, use the mixins in `views/mixins/`:

```pug
include ../../src/plugins/navigation/views/mixins/pipe-separated-navigation

+pipeSeparatedNav(app.nav.main.elements, app.nav.main.className)
```

> The optional `nav_class` value can be set in the YAML config.

## 🧪 Development

```bash
npm install
npm run test
```

## 🎨 CSS Classes (BEM Methodology)

The generated HTML uses BEM (Block Element Modifier) CSS classes for consistent styling:

```css
/* Navigation Block */
.nav {
    /* Main navigation container */
}

/* Navigation Elements */
.nav__list {
    /* Navigation list container */
}
.nav__item {
    /* Individual navigation item */
}
.nav__item--inline {
    /* Inline item modifier */
}
.nav__link {
    /* Navigation link */
}
.nav__separator {
    /* Pipe separator element */
}

/* Navigation Modifiers */
.nav__link--active {
    /* Currently active link */
}
.nav__link--active-path {
    /* Parent path link */
}
```

## 📋 Version History

All changes are documented in [CHANGELOG.md](./CHANGELOG.md).

## 🧑‍💻 Author

Michael Becker  
[https://github.com/seebaermichi](https://github.com/seebaermichi)

## 🔗 Links

-   [Plugin Repository](https://github.com/seebaermichi/nera-plugin-navigation)
-   [NPM Package](https://www.npmjs.com/package/@nera-static/plugin-navigation)
-   [Nera Static Site Generator](https://github.com/seebaermichi/nera)
-   [Plugin Documentation](https://github.com/seebaermichi/nera-plugins#plugins)

## 📦 License

MIT
