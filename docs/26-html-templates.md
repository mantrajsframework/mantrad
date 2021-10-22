# Component Templates Definition

A *template* is a snippet of html code used to render some specific item on a final view.

MantraAPI has a number of methods to manage templates when rendering a view.

Templates are named with "<component name>/<file name of the template>".

Mantra expects to locate templates in two specific locations with this order:

* Inside the component folder under a folder named as "/templates"
* Inside de "ui" folder ("/ui/templates/<component name>/"). 

Having some templates in a common place allow its reuse along all applications of the Mantra project.

As an example, given this template in file "bookrow.html":

```html
<div class="row">
    <div class="col">
        {{booktitle}}
    </div>
</div>
```

When performing MantraAPI.RenderTemplate with this:

```js
let bookrowHtml = MantraAPI.RenderTemplate( "books/bookrow", { booktitle: "Lord of the Rings})
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
* Mantra will look for the template "/ui/templates/books/bookrow.html"
* If it doesn't exist, then will try to look for the template at "/<components location>/books/templates/bookrow.html"

*Remember:* in current version of Mantra (1.x), Mustache is the rendering engine used.