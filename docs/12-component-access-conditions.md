# Component Access Condition Definition

Similarly to prerequest, there's other hook with the name of "access condition".

While prerequests are intended to *calculate* some info before calling view function handler, an access condition is intended to allow or not the view to be requested.

To register an access condition, "AccessCondition" hook should be used:

```js
MantraAPI.Hooks( "[name of the component]" )
    .AccessCondition([{
        Name: "[name of the access condition]",
        Handler: [handler for the access condition]
    }]);
```

The access condition is identified by a name and is used in "accesscondition" properties in views and blocks definitions.

Let's see an example:

```js
MantraAPI.Hooks( "admin" )
    .AccessCondition([{
        Name: "admin.isuseradmin",
        Handler: AdminAccessConditionsHandlers.IsUserAdmin
    }]);
```

In this example, an access condition is defined with the name "admin.isuseradmin" and is handled by the function handler AdminAccessConditionsHandlers.IsUserAdmin;

# Access condition function handler

The prototype for an access condition function handler is like this:

```js
async (req,res) => {
    //
}
```

Where *req* is the [Request object of Express framework](https://expressjs.com/en/4x/api.html#req), and *res* is the [Response object of Express framework](http://expressjs.com/en/4x/api.html#res).

The access condition should return true or false:
* If returns true, then next function handlers of the request are called.
* If returns false, then the request is rejected. In this case, the same access condition function handler can redirect to other path and the calling chain is stopped. If the property "Redirect" is defined when indicating the access condition in the view, then the request is redirect to the url defined in that property.