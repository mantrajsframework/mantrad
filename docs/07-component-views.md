# Component Views Definition

A component can define a number of web views and then handlers to render its contents.

A view is based on a html file and Mantra expects to find it inside "ui/views" folder in the component directory.

There are two ways to register a view. The first one is using the *hook* of the name "View":

```js
MantraAPI.Hooks("[component name]")
    .View([{
        Command: [name of the view route],
        Handler: [async function handler for the view],
        Js: [array with js files to include | js file to include (optional)],
        Css: [array with css files to include | css file to include (optional)],
        PreRequest: [array with pre requests to call before calling view handler (optional)],
        AccessCondition: [array with access conditions handlers to call before calling view handler (optional)]
    }]);
```

As an example, consider this view registration:

```js
const BookViewHandlers = require("./bookviewhandlers.js");

class BooksStarter {
    async onStart( MantraAPI ) {
        MantraAPI.Hooks("books")
            .View([{
                Command: "showallbooks",
                Handler: BookViewsHandlers.ShowAllBooks
            }])
    }
}
```

With this, BookViewsHandlers.ShowAllBooks method will be called when route "/books/showallbooks" is requested from the browser client.

## Including js files

If property *Js* is included in the hook, then Mantra will include the file or files indicated automatically each time that route is requested.

Mantra expect to find those files in "/ui/js" folder of the module.

```js
MantraAPI.Hooks("books")
    .View([{
        Command: "showallbooks",
        Handler: BookViewsHandlers.ShowAllBooks,
        Js: "mainbooks"
    }])
```

With this, Mantra will include "/books/ui/js/mainbooks.js" file in the response for that request.

On the other hand, the handler for a view can include explicity a js file calling [MantraAPI.AddJs()](/docs/33-mantra-API-reference.md#mantraapi.addjs) method with the name of file.

## Including css files

Similarly, if property *Css* is included in the hook, then Mantra will include the css file or files indicated automatically.

Mantra expect to find those files in "/ui/css" folder of the module.

```js
MantraAPI.Hooks("books")
    .View([{
        Command: "showallbooks",
        Handler: BookViewsHandlers.ShowAllBooks,
        Css: "bookstyles"
    }])
```

With this, Mantra will include "/books/ui/css/bookstyles.css" file in the response for that request.

On the other hand, the handler for a view can include explicity a js file calling [MantraAPI.AddCss()](/docs/33-mantra-API-reference.md#mantraapi.addcss) method with the name of file.

A component can define any number of views, and they can be overriden by the project and used by any view of other components.

Mantra will look for the views in the following order:

* '/ui/<current frontent>/templates/views/<view name>.html' 
* '/ui/templates/views/<view name>.html' 
* '/componentname/ui/views/<view name>.html'

In Mantra, multiple UIs frontends can be used in the sample project.

## Using *pre requests*

As described at [Mantra Prerequests](/docs/15-component-prerequests.md), a *prerequest* are special handlers that manages the request of a view *before* Mantras call the view or block function handler.

These prerequest handlers are useful to validate query params, calculate some kind of info before calling the block or view function handler and the like.

By using them, the code needed for the view or block function handler can be as minimal as possible.

A component can define any number of prerequests than can be used by any other components.

A prerequest can save data to be used by the following requests to be called or by the final view, post, get or block handlers using [Mantra.AddRequestData()](/docs/33-mantra-API-reference.md#mantraapi.addrequestdata).

*Remember:* prerequests are pretended to be used to reduce the view or block function handler code lines to the minimun.

## Using *access conditions*

As described at [Mantra Access Conditions](/docs/14-component-access-conditions.md), access conditions are handlers that a component can register indicating if a view, post, get ot block can be accessed or not according to any kind of circumstances.

A typical scenario is the access condition for preventing an anonymous user to access a specific view, for instance.

Prerequests handlers are invoked by Mantra *before* access conditions handlers.

As prerequests, a component can define any number of access conditions assets to be used by other components.

*Remember:* access conditions is pretended to be used to reduce the view function handler code lines to the minimun.

## Managing not found requests

By default, a request with a route not registered within any of the components of the application, Mantra will render the document indicated in *"NotFoundRedirect"* property of [mantraconfig.json](/docs/36-mantraconfig-json-file.md) file.

This behaviour can be changed implemeting a middleware that checks if the request route is registered or not usint Mantra API methods and then rendering any other kind of view.

## Brief method of defining views

To avoid typing the hook registering call in *onStart* method, you can describe the views of the component in a specific module which file name should be named as "view.<component name>.js" inside "controllers" folder of the component.

In this case, the module should define a number of properties named as the following:

* "<view_name>_accescondition" (optional): string or array of strings, defines the AccessCondition property for the view.
* "<view_name>_prerequest" (optional): string or array of strings, defines de PreRequest property for the view.
* "<view_name>_js (optional): string or array of strings, defines the js file or files to be included for the view.
* "<view_name>_css (optional): string or array of strings, defines the css file or files to be included for the view.
* "<view_name>": property with the view handler to be called by the framework for the request route "/<component name>/<view_name>"
  
Here there's an example:

```js
module.exports = {
    addnew_accesscondition: ["system.islogged", "admin.isuseradmincheck"],
    addnew_prerequest: ["workflow.getdataaftercompleted"],
    addnew_js: "addnew",
    addnew_css: "addnewstyles",
    addnew: async (req,res) => {
        // ...
    } 
}
```

## Function handler for the view

All function handlers for views in Mantra are defined as following:

```js
async (req,res) => {
    const Mantra = res.MantraAPI;

} 
```

Where *req* is the [Request object of Express framework](https://expressjs.com/en/4x/api.html#req), and *res* is the [Response object of Express framework](http://expressjs.com/en/4x/api.html#res).

In views function handlers, Mantra API object is inyected as a property of res object as it can be seen above.

## List views defined by a component

You can get a list of views defined by a component with Mantra default command *show-views*:

```bash
$ mantrad show-views <component name>
```

This is useful to verify that you have defined your view correctly.

***
To learn by example, go to [Mantra demos](https://www.mantrajs.com/mantrademos/showall) and [components](https://www.mantrajs.com/marketplacecomponent/components) sections of [Mantra site](https://www.mantrajs.com).