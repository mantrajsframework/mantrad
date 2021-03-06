# Mantra Instance ID of the application running

When an application is launched by Mantra, the framework creates a configuration parameter named as "Mantra instance ID", with an unique value that can be used by all rendering views with the rendering name of "miid".

This id is used to guarantee that the browser doesn't cache a resource (like js or css files) given their names when the version of the application changes.

Just an example:

```js
<script src="/vendors/&lcub;&lcub;miid&rcub;&rcub;pace.min.js"></script>
```

All files added by Mantra.AddJs() and Mantra.AddCss() includes automatically this intance ID.

This value can get retrieved calling to Mantra.GetInstanceId() and can be used with multiple purposes.

Mantra adds the property "sanitizedPath" to Express Request object (*res* parameters in handlers) with the path without the instance id if it is included in it.

***
To learn by example, go to [Mantra demos](https://www.mantrajs.com/mantrademos/showall) and [components](https://www.mantrajs.com/marketplacecomponent/components) sections of [Mantra site](https://www.mantrajs.com).