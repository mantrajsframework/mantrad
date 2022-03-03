# Component Templates Definition

A *template* is a snippet of HTML code used to render some specific item on a final view.

Mantra API has a number of methods to manage templates when rendering a view.

Templates are named with "<component name>/<file name of the template>".

Mantra expects to locate templates in two specific locations with this order:

* Inside de "template" folder of the current frontent ("/ui/<current frontent>/templates/<component name>/<template file>"). 
* Inside de "ui" folder ("/ui/templates/<component name>/<template file>"). 
* Inside the component folder under a folder named as "/ui/templates/<template file>"

Having some templates in a common place allow its reuse along all applications of the Mantra project.

As an example, given this template in file "bookrow.html":

```html
<div class="row">
    <div class="col-md-12">
        {{booktitle}}
    </div>
</div>
```

When performing Mantra.RenderTemplate with this:

```js
const bookrowHtml = Mantra.RenderTemplate( "books/bookrow", { booktitle: "Lord of the Rings" });
```

The result for this code snippet will be:

```html
<div class="row">
    <div class="col">
        Lord of the Rings
    </div>
</div>
```

When running this:

* Mantra will look for the template "/ui/[current frontend]/templates/books/bookrow.html"
* If it doesn't exist, Mantra will look for the template "/ui/templates/books/bookrow.html"
* If it doesn't exist, then will try to look for the template at "/[components location]/books/templates/bookrow.html"

*Remember:* in current version of Mantra, Mustache is the rendering engine used.

***
To learn by example, go to [Mantra demos](https://www.mantrajs.com/mantrademos/showall) and [components](https://www.mantrajs.com/marketplacecomponent/components) sections of [Mantra site](https://www.mantrajs.com).