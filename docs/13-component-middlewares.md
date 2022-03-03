# Component Middewares Definition

A component can register any number of middleware handlers that will be called ordered by their weights in HTTP posts, get or view calls for any request.

Because Mantra relies on Express, its middlewares consists of the same concept defined by this web framework.

To register a middleware, the hook *Middleware* is used in *onStart* component method:

```js
MantraAPI.Hooks("<component name>")
    .Middleware([{
        MiddlewareHandler: <function handler for the middleware>,
        Weight: <integer with the weight of the middleware (optional), default: 0>
    }]);
```

As an example, consider this middleware registration:

```js
const RedirectMiddlewareHandlers = require("./redirectmiddlewarehandlers.js");

MantraAPI.Hooks("redirect")
    .Middleware([{
        MiddlewareHandler: RedirectMiddlewareHandlers.CheckOrigin,
        Weight: -500
    }]);
```

In this example, the method RedirectMiddlewareHandlers.CheckOrigin will be called in the middleware chain with a weight of -500.

The weight of the middleware determines the order by which they are called.

## Brief method of defining middlewares

To avoid typing the hook regitering call in *onStart* method, you can describe the middlewares of the component in a specific module which file name should be named as "middleware.<component name>.js", located at "/controllers" folder of the component.

In this case, the module should define a number of properties named as the following:

* "<middleware_name>_weight" (optional): weight of the middleware. Default is zero.
* "<middleware_name>": middleware function handler

## Middleware weights and order calling

When starting a Mantra application, the bootstrap process registers all middlewares in the order of their weights from lowest to highest.

If two middlewares have the same weight, the will be called with no specific order.

## Function handler for the middleware

A Mantra middleware is exactly the same than Express middlewares, so their handlers should be defined with a function like:

```js
async (req,res,next) => {
    const Mantra = res.MantraAPI;
    
    // ...

    next();
}
```

As Mantra posts, gets and views handlers, *req* is the [Request object of Express framework](https://expressjs.com/en/4x/api.html#req), *res* is the [Response object of Express framework](http://expressjs.com/en/4x/api.html#res) and *next* is a function to be called if the middleware chain should continue.

## List middlewares defined by a component

You can get the list of middlewares defined by a component with *show-middlewares* Mantra command:

```bash
$ mantrad show-middlewares <component name>
```

This is useful to verify that you have defined you middlewares well.

***
To learn by example, go to [Mantra demos](https://www.mantrajs.com/mantrademos/showall) and [components](https://www.mantrajs.com/marketplacecomponent/components) sections of [Mantra site](https://www.mantrajs.com).