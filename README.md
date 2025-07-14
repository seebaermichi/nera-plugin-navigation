# @nera-static/plugin-navigation

A plugin for the [Nera](https://github.com/seebaermichi/nera) static site generator to create navigations from config files. Supports mixins and templates for easy rendering.

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
- `pipe-separated-navigation.pug`
- `link-list-navigation.pug`

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

## 🧑‍💻 Author

Michael Becker
[GitHub](https://github.com/seebaermichi)

## 📦 License

MIT
