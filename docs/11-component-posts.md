# Compoponent HTTP Posts Definition

A component can define a number of HTTP post handlers for building REST APIs.

To do that, the hook *Post* is used in *onStart* component method:

```js
MantraAPI.Hooks("<component name>")
    .Post([{
        Command: <name of the post route>,
        Handler: <async function handler for the HTTP post>,
        PreRequest: <array with pre requests to call before calling post handler>
        AccessCondition: <array with access conditions handlers to call before calling the post handler>
    }]);
```

As an example, consider this "post" registration:

```js
const BookPostHandlers = require("./bookposthandlers.js);

class BooksStarter {
    async onStart( MantraAPI ) {
        MantraAPI.Hooks("books")
            .Post([[{
                Command: "setpublicorprivate",
                Handler: BookPostHandlers.SetPublicOrPrivate,
                PreRequest: ["books.getbookentity"],
                AccessCondition: ["system.islogged"]
            }])
    }
}
```

With this, BookPostHandlers.SetPublicOrPrivate method will be called when a post is requested from the client with the route "/books/setpublicorprivate" is requested.

## Using *pre requests*

As with views, [prerequests](/docs/15-component-prerequests.md) are special handlers that manages the request of a post before Mantra call the post function handler.

This pre request handlers are useful to validate params, calculate some kind of info before calling the post function handler and the like.

By using them, the code needed for the post function handler can be as minimal as possible.

*Remember:* prerequests are pretended to be used to reduce the post function handler code lines to the minimun.

## Using *access conditions*

As with views, [access conditions](/docs/14-component-access-conditions.md) are handlers than can register a Mantra component to check if the post can be accessed or not according to any condition.

A typical scenario is the access condition for preventing an anonymous user to access a specific post.

*Remember:* access conditions are pretended to be used to reduce the post function handler code lines to the minimun.

## Brief method of defining posts

As with views, to avoid typing the hook regitering call in *onStart* method, you can describe the posts of the component in a specific module which file name should be named as "post.<component name>.js" that should be located at "/controllers/" folder of the component.

In this case, the module should define a number of properties named as the following:

* "<post_name>_accescondition" (optional): string or array of strings, defines the AccessCondition property for the post.
* "<post_name>_prerequest" (optional): defines de PreRequest property for the post.
* "<post_name>": property with the post handler to be called by the framework for the request "/<component name>/<view_name>"
  
Here there's an example:

```js
module.exports = {
    setpublicorprivate_accesscondition: ["system.islogged"],
    setpublicorprivate_prerequest: ["books.getbookentity"],
    setpublicorprivate: async (req,res) => {
        // ...
    } 
}
```

## Function handler for the post

All function handlers for posts in Mantra are defined as following:

```js
async (req,res) => {
    const MantraAPI = res.MantraAPI;

} 
```

Where *req* is the [Request object of Express framework](https://expressjs.com/en/4x/api.html#req), and *res* is the [Response object of Express framework](http://expressjs.com/en/4x/api.html#res).

As with views, in posts function handlers, Mantra API object is inyected as a property of res object as it can be seen above.

Mantra API have methods to manage the response of the post request:

* [MantraAPI.SendSuccess](/docs/33-mantra-API-reference.md#mantrapi.sendsuccess)
* [MantraAPI.SendFailure](/docs/33-mantra-API-reference.md#mantrapi.sendfailure)
* [MantraAPI.PostUnauthorizedCode](/docs/33-mantra-API-reference.md#mantraapi.postunauthorizedcode)
* [MantraAPI.PostRaw](/docs/33-mantra-API-reference.md#mantraapi.postraw)
* [MantraAPI.SendStatus](/docs/33-mantra-API-reference.md#mantraapi.sendstatus)
* [MantraAPI.SendError](/docs/33-mantra-API-reference.md#mantraapi.senderror)

## List posts defined by a component

You can get the list of post defined by a component with *show-posts* Mantra command:

```bash
$ mantrad show-posts <component name>
```

This is useful to verify that you have define you *posts* well.

***
To learn by example, go to [Mantra demos](https://www.mantrajs.com/mantrademos/showall) and [components](https://www.mantrajs.com/marketplacecomponent/components) sections of [Mantra site](https://www.mantrajs.com).