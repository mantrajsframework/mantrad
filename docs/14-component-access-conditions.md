# Component Access Condition Definition

Similarly to prerequests, there's other hook with the name of AccessCondition, acting like a *guard* before calling views, blocks, gets or posts handlers.

While prerequests are intended to *calculate* some info before calling final functions handlers, an access condition is intended to allow or not the view, post, get or block to be requested.

To register an access condition, "AccessCondition" hook should be used:

```js
MantraAPI.Hooks( "[name of the component]" )
    .AccessCondition([{
        Name: "[name of the access condition]",
        Handler: "[handler for the access condition]",
        onCancel: "[handler called when the access conditions returns false (optional)]"
    }]);
```

The access condition is identified by a name and is used in "accesscondition" properties in views, blocks, gets, and posts definitions.

Let's see an example:

```js
const AdminAccessConditionsHandlers = require("./adminaccessconditionshandlers.js");

MantraAPI.Hooks( "admin" )
    .AccessCondition([{
        Name: "admin.isuseradmin",
        Handler: AdminAccessConditionsHandlers.IsUserAdmin
    }]);
```

In this example, an access condition is defined with the name "admin.isuseradmin" and is handled by the function handler AdminAccessConditionsHandlers.IsUserAdmin. In views and blocks, no content will be rendered, in posts and gest, the call will be rejected.

If specific rejection method should be used (the handler of the access condition returns false), then you can use onCancel property:

```js
MantraAPI.Hooks( "admin" )
    .AccessCondition([{
        Name: "admin.isuseradmin",
        Handler: AdminAccessConditionsHandlers.IsUserAdmin,
        onCancel: async (Mantra) = {
            // Do something on rejection
        }
    }]);
```

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

# Defining an access condition implicity

You can define an access condition without registering it with its *hook*.

Mantra will look for access conditions within named as "accesscondistion.componanename.js" inside the "/controllers" folder of the component.

That module, is expected to contain the following properties:

* "<access condition name>": this property is the name of the access condition and it implements de handler.
* "<access condition name>.oncancel": optional handler to be called when the access condition returns false.

Here's an example defining two access conditions with names "isuserdev" and "checkcurrentuserisowner", considering a component called "admin":

```js
module.exports = {
    isuserdev: async (req,res) => {
        return res.MantraAPI.GetRequestData("security").isCurrentUserInRol("dev");
    },

    checkcurrentuserisowner: async (req,res) => {
        const componentEntity = res.MantraAPI.GetRequestData("componententityrequested");
        
        return componentEntity.userid == res.MantraAPI.GetRequestData("security").userId;
    }
}
```

With this example, two access conditions are defined: "admin.isuserdev" and "admin.checkcurrentuserisowner".

## List access conditions defined by a component

You can get the list of access conditions defined by a component with *show-accessconditions* Mantra command:

```bash
$ mantrad show-accessconditions <component name>
```

This is useful to verify that you have define your access conditions well.

# To remember

* An access condition defined in any component can be used in any other component.
* The access conditions are called in the order they are set for the view, block, post or get handler.
* It should implement a basic and simple operation related to the accesibility of an asset.
* Like prerequests, by using access condition, the code needed for the handler of the view, block, etc., is smaller, responsabilities are splited (and reusability better). 

***
To learn by example, go to [Mantra demos](https://www.mantrajs.com/mantrademos/showall) and [components](https://www.mantrajs.com/marketplacecomponent/components) sections of [Mantra site](https://www.mantrajs.com).