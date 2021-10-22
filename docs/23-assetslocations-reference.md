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

Get an asset location checking if exists.

Params:
* folders: array with the locations to look for. The method will look within them in the order indicated in the array. It returns the first coincidence.
* asset: asset in the format <component name>.<asset name>
* extension: extension of the asset

Returns an object with the result: 

```json
{
    exists: <true | false>,
    fullpath: <full path to asset if exists, including asset file name an extension>,
    relativepath: <relative path to the asset>
}
```

This method is useful if a component defines its own assets that can define other components.

For instance:

```js
let asset = await MantraAPI.GetAssetsLocations().GetAsset( ["forms", "ui/forms"], `users.showlogin`, "form.json" );
```

This call will look for a file with the name "showlogin.form.json" in the component "users". It will look for inside folders "/users/forms" and "/users/ui/forms".

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