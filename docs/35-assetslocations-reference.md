# AssetsLocations

With MantraAPI.GetAssetsLocations(), you get an object with methods to locate where components assets (views, blocks, etc) are located in the project.

* [AssetsLocations.ExistsView](#assetslocations.existsview)

* [AssetsLocations.GetAsset](#assetslocations.getasset)
  
* [AssetsLocations.GetBlockLocation](#assetslocations.getblocklocation)

* [AssetsLocations.GetCssLocation](#assetslocations.getcsslocation)

* [AssetsLocations.GetFullCssLocation](#assetslocations.getfullcsslocation)

* [AssetsLocations.GetFullJsLocation](#assetslocations.getfulljslocation)

* [AssetsLocations.GetJsLocation](#assetslocations.getjslocation)

* [AssetsLocations.GetSchemaLocation](#assetslocations.getschemalocation)

* [AssetsLocations.GetTemplateLocation](#assetslocations.gettemplatelocation)

* [AssetsLocations.GetViewLocation](#assetslocations.getviewlocation)

## AssetsLocations.ExistsView

```js
async existsView( viewName )
```

Returns true if a view exists.

viewName is in the format [component name].[view name].

## AssetsLocations.GetAsset

```js
async GetAsset( folders, asset, extension)
```

Get an asset location checking if exists. This method is very important to give the ability to components to override assets definitions (html, js, css, etc.) in a specific project.

Params:
* folders: array with the locations to look for. GetAsset() will look within them in the order indicated in the array. It returns the first coincidence.
It considers the following key strings:
    * "component": will look inside the component folder.
    * "templates": Will look inside the component templates folder (/component/ui/templates)
    * "frontendtemplates": Will look inside the UI templates folder of the application UI: /ui/templates

If none of those key values are indicated, then assumes "component" as default.

* asset: asset in the format "<component name>.<asset name>"
* extension: extension of the asset

Returns an object with the result: 

```json
{
    "exists": <true | false>,
    "fullpath": "<full path to asset if exists, including asset file name an extension>",
    "relativepath": "<relative path to the asset>"
}
```

This method is useful if a component defines its own assets that can define or be overriden by other components.

Some examples:

```js
const asset = await Mantra.GetAssetsLocations().GetAsset( ["forms", "ui/forms"], "users.showlogin", "form.json" );
```

In this example:

* "["forms", "ui/forms"]", indicates to look for inside "/users/forms" and "/users/ui/forms" folders.
* "users.showlogin", indicates the the asset to look for is defined by "users" component and the name of the file is "showlogin"
* "form.json" is the extension of the file to look for, this is, "showlogin.form.json" 

By this, GetAssets() will look for:

* /users/forms/showlogin.form.json, if not, the tryies:
* /users/ui/forms/showlogin.form.json

Another example:

```js
const asset = await Mantra.GetAssetsLocations().GetAsset( ["frontendtemplates.blocks"], "cookieswarning.ckblock", "html" );
```
In this example:

* "["frontendtemplates.blocks"]", indicates to look for inside "/ui/templates/block" folder of the application UI.
* "cookieswarning.ckblock", indicates that the asset to look for is defined by the component "cookieswarning" and the name of the file is "ckblock".
* "html" is the extension, so the file to look for is "ckblock.html".

This call will get the location of an html asset that should be placed at: "/ui/templates/blocks/cookieswarning/ckblok.html".

Note: because the process to look up assets can be intensive, Mantra caches them to improve performance.

With this, a component can expect that some kind of asset (html, css, js and so on files), should be overriden specifically by others components.

## AssetsLocations.GetBlockLocation

```js
async GetBlockLocation( componentName, blockName )
```

Returns the relative path to a block given its component and block name.


## AssetsLocations.GetCssLocation

```js
async GetCssLocation( componentName, fileName )
```

Returns the relative path to a css file given its component and file name.

## AssetsLocations.GetFullCssLocation

```js
async GetFullCssLocation( componentName, fileName )
```

Returns the absolute path to a css file given its component and file name.

## AssetsLocations.GetFullJsLocation

```js
async GetFullJsLocation( componentName, fileName )
```

Returns the absolute path to a js file given its component and file name.

## AssetsLocations.GetJsLocation

```js
async GetJsLocation( componentName, fileName )
```

Returns the relative path to a js file given its component and file name.

## AssetsLocations.GetSchemaLocation

```js
GetSchemaLocation( componentName, schemaName )
```

Returns the relative path to the schema model given its component and schema name.

## AssetsLocations.GetTemplateLocation

```js
async GetTemplateLocation( componentName, templateName )
```

Returns the relative path to a template file its component and template name.

## AssetsLocations.GetViewLocation

```js
async GetViewLocation( componentName, viewName )
```    

Returns the relative path to a view its component and view name.

***
To learn by example, go to [Mantra demos](https://www.mantrajs.com/mantrademos/showall) and [components](https://www.mantrajs.com/marketplacecomponent/components) sections of [Mantra site](https://www.mantrajs.com).