# Component Prerequests Definition

The main purpose of a framework should be to allow the reusability and maintenability of the projects built over it.

To reduce the coding block of a view, post, get or block function handler, "prerequests" are quite useful.

They are special function handlers that are called by Mantra *before* calling the views, blocks, posts and gets functions handlers.

A prerequest is useful to validate the http request, collect specific data for the view or things like that.

By doing so, you can reduce the code needed by views, blocks, posts and gets handlers and split responsabilities better, one of the principles of Mantra applications.

As other kind of hooks, you can register a prerequest with the hook "PreRequest":

```js
Mantra.Hooks("[component name"])
    .PreRequest([{
        Name: "[name of the prerequest]",
        Handler: "[handler for the prerequest]",
        onCancel: "[handler called when the prerequest returns false, optional]"
    });
```

Prerequest are identified by a name, and they are used in the "prerequest" properties when defining views or blocks.

Let' see an example:

```js
const ResourcesPreRequestHandlers = require("./resourcesprerequesthandlers.js");

Mantra.Hooks("resources")
    .PreRequest([{
        Name: "resources.getuseridfromurl",
        Handler: ResourcesPreRequestHandlers.GetResourceIdFromUrl
    }]);
```

This snipped defines a prerequest with the name "resources.getuseridfromurl".

In this case, the function handler for this prerequest is the function ResourcesPreRequestHandlers.GetResourceIdFromUrl.

Is useful to identify the prerequest with the prefix of the component name which implements it.

## Defining a prereqeust implicity

As with views, blocks and other Mantra assets, you can define the prerequests in a Node.js module within the component named as "prerequest.[component name].js" inside "/controllers" folder of the component.

That module can define a number of prerequests exporting their properties:

* "<access condition name>": this property is the name of the prerequest and it implements de handler.
* "<access condition name>_oncancel": optional handler to be called when the prerequest returns false.

Here an example:

```js
module.exports = {
    getarticleidfromurl: async (Mantra, req) => {
        // ...
    },
 
    getarticleidfromurl_oncancel: async (Mantra) => {
        // ...
    }
}
```

## Function handler for the request

The prototype for a prerequest function handler is like this:

```js
async ( Mantra, req ) => {
    // ...
}
```

Where *req* is the [Request object of Express framework](https://expressjs.com/en/4x/api.html#req).

The function handler should return true or false:

* If returns true, then the http request process continues.
* If returns false, the request is stopped and oncancel is called (if present).

Usually, if the prerequest is used to retrieve or calculate some data before calling the view handler, [MantraAPI.AddRequestData](/docs/33-mantra-API-reference.md#mantraapi.addrequestdata) is used for this.

## Adding data for the view, block, post or gets handlers.

Prerequests are intended to be used to get some data to be used in the views, blocks, posts or gets handlers, like entities from database according to request params.

To do so, Mantra expects you to use:

* [Mantra.AddRequestData](/docs/33-mantra-API-reference.md#mantraapi.addrequestdata)
* [Mantra.GetRequestData](/docs/33-mantra-API-reference.md#mantraapigetrequestdata).

For instance:

```js
module.exports = {
    getmantrademoidfromurl: async (Mantra, req ) => {
        const parts = Mantra.Extend.Extractvalues( req.path, "/{component}/{mantrademoid}");
           
        if ( parts ) {
            Mantra.AddRequestData( "mantrademoid", parts.mantrademoid );
            return true;
        }

        return false;
    }
}
```

In this example, the prequests "getmantrademoidfromurl", adds the id extracted from the url to "mantrademoid" request data.

## List prerequests defined by a component

You can get the list of prerequests defined by a component with *show-prerequests* Mantra command:

```bash
$ mantrad show-prerequests <component name>
```

This is useful to verify that you have defined your prerequests well.

# To remember

* A prerequest defined in any component can be used in any other component.
* The prerequests are called in the order they are set for the view, block, post or get handler.
* It should implement a basic and simple operation (like get an entity from data models, etc).
* Like access conditions, by using prerequests, the code needed for the handler of the view, block, etc., is small and responsabilities are splitted (and reusability better). 

***
To learn by example, go to [Mantra demos](https://www.mantrajs.com/mantrademos/showall) and [components](https://www.mantrajs.com/marketplacecomponent/components) sections of [Mantra site](https://www.mantrajs.com).