# Component HTTP Gets Definition

A component can define a number of HTTP GET handlers for building REST APIs.

To do that, the hook *Get* is used in *onStart* component method:

```js
MantraAPI.Hooks("<component name>")
    .Get([{
        Command: [name of the post route],
        Handler: [async function handler for the HTTP GET],
        PreRequest: <array with pre requests to call before calling get handler>
        AccessCondition: <array with access conditions handlers to call before calling the get handler>
    }]);
```

As an example, consider this "get" registration:

```js
class BooksStarter {
    async onStart( MantraAPI ) {
        MantraAPI.Hooks("books")
            .Get([[{
                Command: "downloadbook",
                Handler: BookGetHandlers.DownloadBook,
                PreRequest: ["books.getbookentity"],
                AccessCondition: ["system.islogged", "books.bookexists"]
            }])
    }
}
```

With this, BookGetHandlers.DownloadBook method will be called when a "get" is requested from the client with the route "/books/downloadbook" is requested.

## Using *pre requests*
As with views, [pre request](/docs/component-prerequests.md) are special handler that manages the request of a "get" before Mantra calls the get function handler.

This pre request handlers are useful to validate params, calculate some kind of info before calling the get function handler and the like.

By using them, the code needed for the get function handler can be as minimal as possible.

*Remember:* pre requests is pretended to be used to reduce the "get" function handler code lines to the minimun.

## Using *access conditions*
As with views, [access conditions](/docs/component-access-conditions.md) are handlers than can register a Mantra component the check if the "get" can be accessed or not according to any condition.

A typical scenario is the access condition for preventing an anonymous user to access a specific "get" request.

*Remember:* access conditions is pretended to be used to reduce the "get" function handler code lines to the minimun.

## Brief method of defining "gets"

As with views, to avoid typing the hook registering call in *onStart* method, you can describe the "gets" of the component in a specific module which file name should be named as "get.<component name>.js".

In this case, the module should define a number of properties named as the following:
* "<get_name>_accescondition" (optional): string or array of strings, defines the AccessCondition property for the "get" request.
* "<get_name>_prerequest" (optional): defines de PreRequest property for the "get" request.
* "<get_name>": property with the get handler to be called by the framework for the request "/<component name>/<get_name>"
  
Here there's an example:
```js
module.exports = {
    downloadbook_accesscondition: ["system.islogged", "books.bookexists"],
    downloadbook_prerequest: ["books.getbookentity"],
    downloadbook: async (req,res) => {
        // ...
    } 
}
```

## Function handler for the "get" request
All function handlers for gets requests in Mantra are defined as following:

```js
async (req,res) => {
    const MantraAPI = res.MantraAPI;

    // ...
} 
```

Where *req* is the [Request object of Express framework](https://expressjs.com/en/4x/api.html#req), and *res* is the [Response object of Express framework](http://expressjs.com/en/4x/api.html#res).

As with views, in gest function handlers, MantraAPI object is inyected as a property of res object as it can be seen above.