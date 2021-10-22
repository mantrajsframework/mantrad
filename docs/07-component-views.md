# Component Views Definition

A component can define a number of web views and then handlers to render its contents.

A view is based on a html file and Mantra expects to find it inside "view" folder in the component directory.

To ways to register a view. The first one is using the *hook* of the name "View":

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

With this, BookViewsHandlers.ShowAllBooks method will be called when route "/books/showallbooks" is requested.

## Including js files
If property *Js* is included in the hook, then Mantra will include the file or files indicated automatically.

Mantra expect to find those files in /js folder of the module.

```js
MantraAPI.Hooks("books")
    .View([{
        Command: "showallbooks",
        Handler: BookViewsHandlers.ShowAllBooks,
        Js: "showallbooks"
    }])
```

With this, Mantra will include /books/js/showallbooks.js file in the response for that request.

On the other hand, the handler for a view can include explicity a js file calling MantraAPI.AddJs() method with the name of file.

## Including css files
Similarly, if property *Css* is included in the hook, then Mantra will include the file or files indicated automatically.

Mantra expect to find those files in /css folder of the module.

```js
MantraAPI.Hooks("books")
    .View([{
        Command: "showallbooks",
        Handler: BookViewsHandlers.ShowAllBooks,
        Css: "books"
    }])
```

With this, Mantra will include /books/css/books.js file in the response for that request.

On the other hand, the handler for a view can include explicity a js file calling MantraAPI.AddCss() method with the name of file.

## Using *pre requests*
As described in (TODO: link to the document), pre request are special handlers that manages the request of a view before Mantra call the view of block function handler.

This pre request handlers are useful to validate query params, calculate some kind of info before calling the view function handler and the like.

By using them, the code needed for the view or block function handler can be as minimal as possible.

*Remember:* pre requests is pretended to be used to reduce the view or block function handler code lines to the minimun.

## Using *access conditions*
As described in (TODO: link to the document), access conditions are handlers than can register a Mantra component the check if the view can be accessed or not according to any condition.

A typical scenario is the access condition for preventing an anonymous user to access a specific view.

*Remember:* access conditions is pretended to be used to reduce the view function handler code lines to the minimun.

## Managing not found requests

By default, a request with a route not registered within any of the components of the application, Mantra will render the document indicated in *"NotFoundRedirect"* property of mantraconfig.json file.

This behaviour can be changed implemeting a middleware that checks if the request route is registered or not usint MantraAPI methods and then rendering any other kind of view.

## Brief method of defining views

To avoid typing the hook regitering call in *onStart* method, you can describe the views of the component in a specific module which file name should be named as "view.<component name>.js".

In this case, the module should define a number of properties named as the following:
* "<view_name>_accescondition" (optional): string or array of strings, defines the AccessCondition property for the view.
* "<view_name>_prerequest" (optional): defines de PreRequest property for the view.
* "<view_name>_js (optional): string or array of strings, defines the js file or files for the view.
* "<view_name>_css (optional): string or array of strings, defines the css file or files for the view.
* "<view_name>": property with the view handler to be called by the framework for the request "/<component name>/<view_name>"
  
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

In views function handlers, MantraAPI object is inyected as a property of res object as it can be seen above.