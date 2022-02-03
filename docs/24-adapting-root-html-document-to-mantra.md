# Adapting root html document to be used with Mantra

Any html template can be used with Mantra. Actually, despite in current version of the framework (1.x) Mustache is used as the rendering engine, you can include any UI library (Angular, Vue. etc.).

To use a html template as a front end in Mantra, three Mantra blocks must be included:

* mantra-css-files, for including css files.
* mantra-content-view, to render the content of the views.
* mantra-js-files, for including js files.

That's all!

Here there's a minimal example:

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        &lcub;&lcub;&lcub;mantra-css-files&rcub;&rcub;&rcub;
    </head>
    <body>
        &lcub;&lcub;&lcub;mantra-content-view&rcub;&rcub;&rcub;
        &lcub;&lcub;&lcub;mantra-js-files&rcub;&rcub;&rcub;
    </body>
</html>
```

***
To learn by example, go to [Mantra demos](https://www.mantrajs.com/mantrademos/showall) and [components](https://www.mantrajs.com/marketplacecomponent/components) sections of [Mantra site](https://www.mantrajs.com).