# Component Prerequests Definition

The main purpose of a framework should be to allow the reusability and maintenability of the projects built over it.

To reduce the coding block of a view function handler, "pre requests" are quite useful.

They are special function handler that are called by Mantra *before* calling the view function handler.

A prerequest is useful to validate the http request, collect specific data for the view or things like that.

As other kind of hooks, you can register a prerequest with the hook "Prerequest":

```js
MantraAPI.Hooks("[component name"])
    .PreRequest([{
        Name: "[name of the prerequest]",
        Handler: [handler for the prerequest]
    });
```

Prerequest are identified by a name, and they are used in the "prerequest" properties when defining views or blocks.

Let' see an example:

```js
MantraAPI.Hooks("resources")
    .PreRequest([{
        Name: "resources.getuseridfromurl",
        Handler: ResourcesPreRequestHandlers.GetResourceIdFromUrl
    }]);
```

This snipped defines a prerequest with the name "resources.getuseridfromurl".

In this case, is function handler for this prerequest is the function ResourcesPreRequestHandlers.GetResourceIdFromUrl.

Is useful to identify the prerequest with the prefix of the component which implements it.

## Brief method to define a prerequest
As with views, blocks and other Mantra assets, you can define the prerequests in a Node.js module within the component named as "prerequest.[component name].js".

Here an example:

```js
module.exports = {
    getarticleidfromurl: async (MantraAPI, req ) => {
        // ...
    }
}
```

## Function handler for the request

The prototype for a prerequest function handler is like this:

```js
async (MantraAPI, req ) => {
        // ...
    }
```

Where *req* is the [Request object of Express framework](https://expressjs.com/en/4x/api.html#req).

The function handler should return true or false:

* If returns true, then the http request process continues.
* If retunrs false, the request is stopped.

Usually, if the prerequest is used to retrieve or calculate some data before calling the view handler, MantraAPI.AddRequestData is used for this.

*Remember*: a prerequest defined in any component can be used in any other component.