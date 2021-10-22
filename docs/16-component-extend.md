# Mantra Extends Registering

Mantra has a number of default *hooks* to register some kind of assets (views, blocks, apis, etc.), but you can register your own for diffenent purposes.

To do this, you can use "Extend" hook:

```js
MantraAPI.Hooks(["component name"])
    .Extend([{
        Type: "[name for your extend]",
        ... extend properties ...
    }]);
```

You can add any properties for each "Extend" you define.

You can use [MantraAPI.GetExtendsByType](/docs/mantraapi-reference.md#mantraapi.getextendsbytype) to get all "extends" by type define by all components.

This is a real example for this *hook*:

```js
MantraAPI.Hooks("forms")
        .Post([{
            Command: "validate",
            Handler: FormsPostHandlers.Validate
        }])
        .Api([{
            APIName: "NewForm",
            APIHandler: FormsApiHandlers.NewForm
        }])
        .Extend([{
            Type: "formvalidator",
            Name: "email",
            Handler: FormsValidatorHandlers.IsEmail
        }, {
            Type: "formvalidator",
            Name: "notempty",
            Handler: FormsValidatorHandlers.NotEmpty
        }]);
```