# Navigation - Nera plugin
This is a plugin for the static side generator [Nera](https://github.com/seebaermichi/nera) to create the 
navigation.  

## Usage
### Installation
At first, you need to place this plugin in the `src/plugins` folder of your Nera project.  

### Configuration
If everything is in place, you should set up the `navigation/config/navigation.yaml` file. Here you can 
configure one navigation or multiple navigations.  

Let's at first have a look at how to configure one navigation.
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
With this configuration you would get an array `app.nav.elements` which you could use to render your navigation on 
your own or use one of the given mixins in `navigation/views/helper/mixins.pug`.  

If you want to configure more than one navigation, you should add the following to your config file.
```yaml
elements:
  main:
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
  footer:
    - href: /imprint.html
      name: Imprint
    - href: /data-protection/index.html
      name: Data protection
```
Now you will have access to an `app.nav.main.elements` and `app.nav.footer.elements` array with all the data for your 
two 
navigation 
elements. 

### Render navigation
#### Custom
To render your navigation you can either create your own markup while iterating through the elements of `app.nav.
elements` (if you have only one navigation) or `app.nav.main.elements` (or whatever you named your navigation for 
multiple navigation elements). Each navigation element has three properties:
* href
* name
* path

#### Use build in templates
This plugin also comes with a couple of pre-defined mixins and templates which you could use as well.  
If you have only one navigation you could include one of the three templates in `navigation/views/` in your layout, 
like follows:
```jade
//- /src/views/layout/layout.pug
...
body
    include ../../src/plugins/navigation/views/simple-navigation
```
With this you would get just a nav tag with links for each element. The other two templates 
`navigation/views/pipe-separated-navigation.pug` and `navigation/views/link-list-navigation.pug` are a bit more 
advanced and render your elements with pipes in between or within an `ul` tag with list items for each element.

#### Use build in mixins
If you have multiple navigation elements, like one for the main navigation and one for the footer navigation, you 
could use the build in mixins in `navigation/views/mixins` to render your navigation. See example below:
```jade
//- /src/views/layout/layout.pug
...
body
    include ../../src/plugins/navigation/views/mixins/pipe-separated-navigation
    +pipeSeparatedNav(app.nav.main.elements, app.nav.main.className) //- the class name is optional
```
This will use all elements of your main navigation and render it separated by a pipe. The surrounding nav tag will 
either get the default class `nav` or whatever you added in the `navigation/config/navigation.yaml` as `nav_class`.
