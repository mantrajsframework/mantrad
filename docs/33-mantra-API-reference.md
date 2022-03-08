# Mantra API Reference

## Considrerations about Mantra API object

In a Mantra project, any interaction between the framework and within the components, is performed using an single instance object of the class MantraAPI, usually named as Mantra in handlers. One interaction = one instace of that object.

This API object is created by Mantra by each *interaction* with your project, like:

* In any request for a view, get or post routes.
* In an event handler.
* In middlewares handlers.
* In rendering blocks.
* When running access conditions and prerequests.
* etc.

This is, when any component handler of any kind is called by Mantra Framework, a Mantra API object is created by the framework so that the handler doesn't need to create it.

This is extremely important in Mantra Framework because, mainly, of performance: Mantra API object is heavy to create and load with initial values, and that's the reason why Mantra uses only one instance the this object in any *interaction*, and that's why API calls or DAL calls between components, should send this instance as well.

This is how prerequests, for instance, can add data for the view handlers calling AddRequestData() method and share common data for the next handler call.

Anyway, and despite it is not recommended (depending on the case), you can get a new instance of Mantra API object with:

```js
const Mantra = global.Mantra.MantraAPIFactory();
```

Mantra is a high performance framework because in any request or *interaction* between components, a Mantra API object is shared.

## Mantra API methods reference

Mantra API object is the heart of the framework, all it's represented by its methods. To develop Mantra applications, you need to master this object.

* [MantraAPI.GetAppName](#mantraapi.getappname)

* [MantraAPI.GetAssetsLocations](#mantraapi.getassetslocations)

* [MantraAPI.GetComponentDependencies](#mantraapi.getcomponentdependencies)]

* [MantraAPI.GetBaseUrl](#mantraapi.getbaseurl)

* [MantraAPI.GetRequestPath](#mantraapi.getrequestpath)

* [MantraAPI.GetHooksByName](#mantraapi.gethooksbyname)

* [MantraAPI.GetResponse](#mantraapi.getresponse)

* [MantraAPI.GetRequest](#mantraapi.getrequest)

* [MantraAPI.IsGet](#mantraapi.isget)
 
* [MantraAPI.IsPost](#mantraapi.ispost)

* [MantraAPI.Redirect](#mantraapi.redirect)

* [MantraAPI.RedirectToRoot](#mantraapi.redirecttoroot)

* [MantraAPI.SendFile](#mantraapi.sendfile)

* [MantraAPI.IsIndex](#mantraapi.isindex)

* [MantraAPI.RenderRoot](#mantraapi.renderroot)

* [MantraAPI.RenderViewHtml](#mantraapi.renderviewhtml)

* [MantraAPI.RenderRawViewContentHtml](#mantraapi.renderrawviewcontenthtml)

* [MantraAPI.GetGlobalVar](#mantraapi.getglobalvar)

* [MantraAPI.RenderContent](#mantraapi.rendercontent)

* [MantraAPI.RenderFullViewHtml](#mantraapi.renderfullviewhtml)

* [MantraAPI.RenderView](#mantraapi.renderview)

* [MantraAPI.ExistsBlock](#mantraapi.existsblock)

* [MantraAPI.GetViewHtml](#mantraapi.getviewhtml)

* [MantraAPI.ExistsView](#mantraapi.existsview)

* [MantraAPI.SendHtml](#mantraapi.sendhtml)

* [MantraAPI.GetView](#mantraapi.getview)

* [MantraAPI.GetInstanceId](#mantraapi.getinstanceid)
  
* [MantraAPI.RenderRawView](#mantraapi.renderrawview)

* [MantraAPI.EndGetRequest](#mantraapi.endgetrequest)

* [MantraAPI.RenderLandingPage](#mantraapi.renderlandingpage)

* [MantraAPI.RenderTemplateFromFile](#mantraapi.rendertemplatefromfile)

* [MantraAPI.RenderTemplate](#mantraapi.rendertemplate)

* [MantraAPI.RenderHtml](#mantraapi.renderhtml)

* [MantraAPI.Render](#mantraapi.render)

* [MantraAPI.GetComponentLocation](#mantraapi.getcomponentlocation)

* [MantraAPI.GetComponentVersion](#mantraapi.getcomponentversion)

* [MantraAPI.InstallSchema](#mantraapi.installschema)

* [MantraAPI.InstallDynamicSchema](#mantraapi.installdynamicschema)

* [MantraAPI.UninstallSchema](#mantraapi.uninstallschema)

* [MantraAPI.UpdateSchema](#mantraapi.updateschema)

* [MantraAPI.LoadSchema](#mantraapi.loadschema)

* [MantraAPI.GetSchemaByVersion](#mantraapi.getschemabyversion)

* [MantraAPI.RenameSchemaEntities](#mantraapi.renameschemaentities)

* [MantraAPI.ComponentEntities](#mantraapi.componententities)

* [MantraAPI.ComponentEntitiesFromSchema](#mantraapi.componententitiesfromschema)

* [MantraAPI.DynamicComponentEntities](#mantraapi.dynamiccomponententities)

* [MantraAPI.GetComponentDbConfig](#mantraapi.getcomponentdbconfig)

* [MantraAPI.GetExtendsByType](#mantraapi.getextendsbytype)

* [MantraAPI.GetInjection](#mantraapi.getinjection)

* [MantraAPI.GlobalConfig](#mantraapi.globalconfig)

* [MantraAPI.AddRenderValue](#mantraapi.addrendervalue)

* [MantraAPI.AddRenderValues](#mantraapi.addrendervalues)

* [MantraAPI.AddDataValue](#mantraapi.adddatavalue)

* [MantraAPI.GetDataValues](#mantraapi.getdatavalues)

* [MantraAPI.AddRequestData](#mantraapi.addrequestdata)

* [MantraAPI.GetRequestData](#mantraapi.getrequestdata)

* [MantraAPI.GetRenderValues](#mantraapi.getrendervalues)

* [MantraAPI.PostRaw](#mantraapi.postraw)

* [MantraAPI.PostUnauthorizedCode](#mantraapi.postunauthorizedcode)

* [MantraAPI.SendStatus](#mantraapi.sendstatus)

* [MantraAPI.SendError](#mantraapi.senderror)

* [MantraAPI.SendSuccess](#mantraapi.sendsuccess)

* [MantraAPI.SendFailure](#mantraapi.sendfailure)

* [MantraAPI.AddJs](#mantraapi.addjs)

* [MantraAPI.AddCss](#mantraapi.addcss)

* [MantraAPI.ExistsComponentApi](#mantraapi.existscomponentapi)

* [MantraAPI.ExistsComponentByName](#mantraapi.existscomponentbyname)

* [MantraAPI.Invoke](#mantraapi.invoke)

* [MantraAPI.GetExtendsByType](#mantraapi.getextendsbytype)

* [MantraAPI.GetComponentConfig](#mantraapi.getcomponentconfig)

* [MantraAPI.IsServiceActive](#mantraapi.isserviceactive)

* [MantraAPI.Config](#mantraapi.config)

* [MantraAPI.EmitEvent](#mantraapi.emitevent)

* [MantraAPI.LogInfo](#mantraapi.loginfo)

* [MantraAPI.LogWarning](#mantraapi.logwarning)

* [MantraAPI.LogError](#mantraapi.logerror)

* [MantraAPI.ConsoleQuestion](#mantraapi.consolequestion)

* [MantraAPI.ExtractResource](#mantraapi.extractresource)

* [MantraAPI.UpdateSchema](#mantraapi.updateschema)

* [MantraAPI.UpdateSchemaWithCurrentEntities](#mantraapi.updateschemawithcurrententities)

# MantraAPI methods definitions

## MantraAPI.GetAppName

```js
GetAppName()
```

Returns a string with the name of the current running application.

## MantraAPI.GetAssetsLocations

```js
GetAssetsLocations()
```

Returns the [Assets Locations](/docs/35-assetslocations-reference.md) instance with methods to locate assets within the project.

## MantraAPI.GetComponentDependencies

```js
GetComponentDependencies( componentName )
```

Returns in an array the name of the components that a component depends on. 

## MantraAPI.GetBaseUrl

```js
GetBaseUrl()
```

Returns a string with the base url property indicated in "BaseUrl" property in mantraconfig.json file. This property can be set gobally or by each app.

## MantraAPI.GetRequestPath

```js
GetRequestPath()
```

Returns a string with the current requested path. 

Sends the ["path" property](http://expressjs.com/en/4x/api.html#req.path) of Request Express object.

## MantraAPI.GetHooksByName

```js
GetHooksByName( hookName )
```

Returns an array of json objects with all hooks (like "view", "post", etc.) registered by all components in the system.

Each json object of the hook have the properties indicated when they were registered in the onStart() method of the component.

Available hooks are:

* "accesscondition"
* "api"
* "block"
* "command"
* "componentextend"
* "cron"
* "event"
* "get"
* "middleware"
* "post"
* "prerequest"
* "view"

## MantraAPI.GetResponse

```js
GetResponse()
```

Returns the [Response Express](http://expressjs.com/en/4x/api.html#res) object of the current request.

## MantraAPI.GetRequest

```js
GetRequest()
```

Returns the [Request Express](http://expressjs.com/en/4x/api.html#req) object of the current request.

## MantraAPI.IsGet

```js
IsGet()
```

Returns a boolean indicating if current request is a HTTP GET request.

## MantraAPI.IsPost

```js
IsPost()
```

Returns a boolean indicating if current request is a HTTP POST request.


## MantraAPI.Redirect

```js
async Redirect( path )
```

Redirects current request to the path indicated as parameter.

Equivalent to use [Response.redirect()](http://expressjs.com/en/4x/api.html#res.redirect) method of Express.

## MantraAPI.RedirectToRoot

```js
async RedirectToRoot()
```

Redirects current request to the root ("/").

Equivalent to use [Response.redirect("/")](http://expressjs.com/en/4x/api.html#res.redirect) method of Express.


## MantraAPI.SendFile

```js
async SendFile( fullPathToFile )
```

Send a file to the current request. The file should be located with its full path indicated in the parameter.

Equivalent to user [Response.sendfile()](http://expressjs.com/en/4x/api.html#res.sendFile) method of Express.

## MantraAPI.IsIndex

```js
IsIndex()
```

Returns a boolean indicating if current request path is the root ("/").

## MantraAPI.RenderRoot

```js
async RenderRoot( htmlRootDocument )
```

Send as response the rendering of the full html document indicated as parameter.

The file to render should be placed under the frontend application folder.

As an example:

```js
await MantraAPI.RenderRoot("/404.html");
```

## MantraAPI.RenderViewHtml

```js
async RenderViewHtml( componentName, viewName )
```

Renders a view and returns its full html content (container not included).

Params:
* componentName: <name of the component>
* viewName: <name of the view to render (no extension file needed)

As an example:

```js
let viewHtml = await Mantra.RenderViewHtml( "books", "showfullbook" );
```

## MantraAPI.RenderRawViewContentHtml

```js
async RenderRawViewContentHtml( viewHtml, htmlContainerFile = 'index.html' ) {
```

Render the content of the html view indicated in viewHtml in the container indicated in htmlContainerFile and returns the resulting html content.

Params:
 * viewHtml: <html content to render in the container file>
 * htmlContainerFile: <container file name, default "index.html">

## MantraAPI.GetGlobalVar

```js
GetGlobalVar( globalVarKey )
```

Get the value of a global variable, included in section "GlobalTemplateVars" of mantraconfig.json file.

Returns '(unknown)' if the key entry doesn't exist.

As an example:

```js
let globalSiteName = Mantra.GetGlobalVar( "global-sitename" )
```

## MantraAPI.RenderContent

```js
async RenderContent( htmlViewContent, htmlContainerFile )
```

This is the main method to render contents in mantra UI. Returns the rendering html document for the html view indicated in htmlViewConent. 

Params: 
* htmlViewContent: <html to render with blocks, data values, etc>
* htmlContainerFile: <optional, file of the container, like "index.html">

## MantraAPI.RenderFullViewHtml

```js
async RenderFullViewHtml( componentName, viewName, htmlContainerFile )
```

Render a view of a component and returns its full html content (container included).

Params:
* componentName: <name of the component which defines the view>
* viewName: <name of the view>.
* htmlContainerFile: <html content of the container where render the view>

## MantraAPI.RenderView

```js
RenderView( view, htmlContainerFile )
```

This is the main method to be used in views function handlers to render component views.
Renders a view and ends the get requests by sending its content.

Params:
* view: <view to render in the format component.viewname>
* htmlContainerFile: <optional, main container for the view, by default index.html>

As an example:

```js
await RenderView( "books.showfullbookinfo" )
```

This sample sends back as response of a request the rendering of the view "showfullbookinfo" (expected to be located at /books/views/showfullbookinfo.html) within the default document root of "index.html".

## MantraAPI.ExistsBlock

```js
ExistsBlock( componentName, blockName)
```

Returns true if a block exists.

Params:
* componentName: <component name>
* blockName: <name of the block to check if exists>

## MantraAPI.GetViewHtml

```js
async GetViewHtml( pathToView )
```

Returns the html content for a view. Return the view html content "as it is", without the rendering process.

Param:
* pathToView: <relative path to the file containing the view: /component/views/<viewname>.html>

## MantraAPI.ExistsView

```js
async ExistsView( view )
```

Returns true if a view exists.

Param:
* view: <view in the form of "[component name].[view name]", like "users.showuser">

## MantraAPI.SendHtml

```js
async SendHtml( htmlContent )
```

Sends html content over response object of the current request.

Param:
* htmlContent: <raw html content to send>
* 

## MantraAPI.GetView

```js
async GetView( view )
```
Returns the html content of a view.

Param:
* view: <view in the form of "[component name].[view name]", like "users.showuser">

## MantraAPI.GetInstanceId

```js
GetInstanceId()
```

Returns the current instance id of the application running. 

For more details about instance id, see [Instance Id](/docs/32-instanceid.md) document.

## MantraAPI.RenderRawView

```js
async RenderRawView( viewHtml, htmlContainer )
```

Renders the html content of a view in the root container html document.

Params:
* viewHtml: <html content of the view>
* htmlContainer: <root document container, optional, default "index.html">

## MantraAPI.EndGetRequest

```js
async EndGetRequest( data )
```

Ends current request sending back the data indicated as parameter.

This is equivalent to call [Response.end(data)](https://expressjs.com/en/api.html#res.end) method of Express object.

## MantraAPI.RenderLandingPage

```js
async RenderLandingPage()
```

Renders default "index.html" document.

## MantraAPI.RenderTemplateFromFile

```js
async RenderTemplateFromFile( pathToTemplateFile, data )
```
Renders a template from its full location and data

Params:
* pathToTemplate: <full path to template>
* data: <json object with data to render within the template>

Returns the html document template rendered.

## MantraAPI.RenderTemplate

```js
async RenderTemplate( templatefile, data )
```
Renders a template file with data. The template file is indicated as "<component name>/<template file name>" (with no ".html" extension).

firstly looks for the template file at /<site location>/ui/templates/<component name>/<template file>.

If it doesn't exist in that location, then looks for the template file at /<component>/ui/templates/<template file>.

If data is an array, then template file is rendered by each element.

Params:
* templateFile: <local path to template inside site templates location (set in config) or component templates folder, like "pager/basepager" (no need to add .html extension)>
* data: <json object with data to render | array object with json data to render, in this case, the template is rendered by each array item>
  

## MantraAPI.RenderHtml

```js
RenderHtml( templateHtml, data )
```

Renders the text html document with data.

Params:
* templateHtml: <html text document to render>
* data: <json object with data to render>

Returns the html document rendered.

## MantraAPI.Render

```js
async Render( html )
```

Renders the html document indicated as parameter.

Al data to render within the document, should be indicated previously with Mantra.AddRenderValue o Mantra.AddRenderValues.

If the document contains blocks, then they are rendered as well.

Retursn the document fully rendered.

## MantraAPI.GetComponentLocation

```js
GetComponentLocation(componentName)
```

Returns de full path to the location of a component given its name.

Exception launched if component doesn't exist.

## MantraAPI.GetComponentVersion

```js
GetComponentVersion(componentName)
```

Returns the version of a component. This version is de "version" property of mantra.json file for the component.

## MantraAPI.InstallSchema

```js
async InstallSchema( componentName )
```

This method installs the schema of a component.

This schema (or database model), should be placed at /<compoponent name>/model/<component name>.schema.json.

The method loads that file and uses [RedEntities](https://github.com/mantrajsframework/redentities) to create the database.

The database type for the component should be indicated in "Entities" propery of mantraconfig.json.

See more información about [Mantra entities management](/docs/20-component-entity-model.md).

Usually, this method is called at onInstall() method in the [component definition](/docs/05-mantra-component-definition.md).

InstallSchema() looks for the schema that match de component version. If no exists, then the default one will be used.

For instance:

```js
await Mantra.InstallSchema( "users" );
```

If users has "1.0.3" version (indicated at "version" property at its mantra.json file), then InstallSchema() will try to locate first the model "/users/model/users.1.0.3.schema.json". If it doesn't exist, then "/users/model/users.schema.json" will be used.

## MantraAPI.InstallDynamicSchema

```js
async InstallDynamicSchema( componentName, jsonSchema, removesIfExists = true )
```

Install a new schema given its json definition. This is one of the advanced features of Mantra.

Params:
* componentName: <name of the component which install the schema. According to this name, gets the right db configuration>
* jsonSchema: <json of the schema to install>
* removesIfExists: <if true, and if entities already exists, then they are removed and resintalled. If false, if an entity exists, then it is not removed. Default true>

## MantraAPI.UninstallSchema

```js
async UninstallSchema( componentName, schema )
```

Removes current schema for the componente indicated as parameter.

Param:
* componentName: <name of the component which schema will be removed>
* schema: <optional, json object with the schema. If not included, Mantra will use the default component schema mode located at "/component/model" folder>
  
As with InstallSchema() method, the schema (or database model), should be placed at /<compoponent name>/model/<component name>.schema.json.

The method loads that file and uses [RedEntities](https://github.com/mantrajsframework/redentities) to uninstall (remove) the database.

The database type for the component should be indicated in "Entities" propery of mantraconfig.json.

See more información about [Mantra entities management](/docs/component-entity-model.md).

Usually, this method is called at onUninstall() method in the [component definition](/docs/05-mantra-component-definition.md).

UninstallSchema() looks for the schema that match de component version. If no exists, then the default one will be used.


## MantraAPI.UpdateSchema

```js
async UpdateSchema( componentName, currentVersion, versionToUpdate, updateEntityFnc )
```

Updates a new schema for a component. This method is complex and involves changes in DB.

It should be called from an onUpdate() method of the [component definition](/docs/05-mantra-component-definition.md).

onUpdate() is called by Mantra when running *update* command and if it detects changes in "version" property of mantra.json file of the component:

```bash
$ mantrad update
```

As with any other important update in any software system, it is *recommended* to make database backups before calling this method, and, of course, test the update in development or pre-production environments first.

Params:
* componentName: <name of the component to update>
* currentVersion: <current version of the component installed in system, as indicated in previous mantra.json>
* versionToUpdate: <new version to update of the component, as indicated in current mantra.json>
* updateEntityFnc: <optional callback function: async (entityName, entity, db) {}, to be called for each current entity instance for each entity in current db>

Basically, the updating to a new schema version process performs this steps:
1) Renames current entities with the sufix "_temporal".
2) Creates the new version of the schema.
3) To load old data to be stored at new schema (and maybe with changes or conversion in the data entities), then calls to updateEntityFnc() calback by each entity in the old schema.
4) Removes temporal entities renamed at step 1.

The callback function, if it is given, is called by each entity (row) in the database tables of the schema of the component, and has this prototype:

```js
async function(entityName, entity, newdb)
```

Where:
* entityName: <name of the entity (table), as defined in the schema>
* entity: <json object with the data of the entity (row)>
* newdb: <RedEntities instance with the new db created and where the data of the old one should be saved>

*Remember*: one of the Mantra main concepts to scacle applications is that entities should be small (one, two of three tables by each component as much), the entities should be defined with simple types and entities for each components should not store "very long" data sets.

If long data sets are needed, then third options should be used.

Refer to [Updating Components Data Models](/docs/39-updating-components-data-models.md) of the documentation to read same examples.


## MantraAPI.UpdateSchemaWithCurrentEntities

```js
async UpdateSchemaWithCurrentEntities(componentName, currentVersion, versionToUpdate)
```

Same than UpdateSchema but with the difference that Mantra is in charge of move current data entities to new data model. Use this method to easily update the model when its changes only consists of minimal changes in the new version of the schema, like:

* New properties with default values.
* Property removed.
* Adition of new indexes.

Refer to [Updating Components Data Models](/docs/39-updating-components-data-models.md) of the documentation to read same examples.

## MantraAPI.LoadSchema

```js
async LoadSchema( schema )
```

Load the json for a schema according to the

Param:
* schema: <path to the schema in typical definition of component assets: <component name>.<schema name> >. Mantra expects to locate the schema at "/<component name>/model/<component name>.schema.json" file.

Returns the json object with the schema loaded.

## MantraAPI.GetSchemaByVersion

```js
async GetSchemaByVersion( componentName, version )
```

Loads a component schema.

Params:
* componentName: <name of the component>
* version: <optional, indicates the version of the schema>

Given the sample "GetSchemaByVersion( "users" ), then will return "/users/model/users.schema.json" json object file.

Given the sample "GetSchemaByVersion( "users", "1.2.0" ), then will return "/users/model/users.1.2.0.schema.json" json object file.

## MantraAPI.RenameSchemaEntities

```js
async RenameSchemaEntities( componentName, schema, sufix )
```

Renames the entities of the schema adding to the a sufix.

Params:
* componentName: <name of the component>
* schema: <json object with the schema>
* sufix: <string with the sufix to rename the entities (table names>

## MantraAPI.ComponentEntities

```js
ComponentEntities( componentName )
```

Returns a RedEntities instance configured with the schema of the component. The instance is returned initialized with the model schema of the component. 

Refer to [RedEntities](https://github.com/mantrajsframework/redentities) with the API of this library.

## MantraAPI.ComponentEntitiesFromSchema

```js
ComponentEntitiesFromSchema( componentName, schema )
```

Creates a new RedEntities instance intialized with a specific schema for the given component.

Refer to [RedEntities](https://github.com/mantrajsframework/redentities) with the API of this library.

Params:
* componentName: <name of the component>
* schema: <json schema object with the model>

*Remember*: component name is needed to load the database configuration for the component in "Entities" property of mantraconfig.json file.

## MantraAPI.DynamicComponentEntities

```js
DynamicComponentEntities( componentName, schema )
```

Returns a RedEntities instance initialized with a specific schema for the given component.

Because the creation of RedEntities object is quite heavy, this object is cached internally, unlike ComponentEntitiesFromSchema() method.

Refer to [RedEntities](https://github.com/mantrajsframework/redentities) with the API of this library.

Params:
* componentName: <name of the component>
* schema: <json schema object with the model>

*Remember*: component name is needed to load the database configuration for the component in "Entities" property of [mantraconfig.json](/docs/36-mantraconfig-json-file.md) file.

## MantraAPI.GetComponentDbConfig

```js
GetComponentDbConfig( componentName )
```

Returns the json object with the database access properties indicated for the component, according to property "Entities" in [mantraconfig.json](/docs/36-mantraconfig-json-file.md) file.

Remember this is one of the principles in a Mantra application: a component can use its own database instance.

If no specific configuration is provided, "default" will be returned.

## MantraAPI.GetExtendsByType

```js
GetExtendsByType( type )
```

Returns an array with all extends for the given type.

With [Extends](/docs/16-component-extend.md), any component can define its own types of *hooks* for multiple purposes.


## MantraAPI.GetInjection

```js
GetInjection( inyectionKey )
```

Returns the value of an injection as indicated in Injections section of mantraconfig.json file.

## MantraAPI.GlobalConfig

```js
GlobalConfig( "propertyname" )
```

Returns the value of property indicated in GlobalConfig section of mantraconfig.json file.

## MantraAPI.AddRenderValue

```js
AddRenderValue( key, value )
```

Adds data to be used in rendering using render engine template in views, blocks, etc.

Params:
* key: <key name of the variable to render>
* value: <value for the key>
  
For example, by running Mantra.AddRenderValue( "name", "Mantra Microkernel Framework" ), when rendering any html piece of code with Mustache syntax like:

```html
<p>{{name}}</p>
```

, will be rendered as:

```html
<p>Mantra Microkernel Framework</p>
```

## MantraAPI.AddRenderValues

```js
AddRenderValues( values )
```

Adds data to be used in rendering using render engine template in views, blocks, etc.

Params:
* values: <json object with keys the their values to render>
 
## MantraAPI.AddDataValue

```js
AddDataValue( key, value )
```

Adds data to be used by javascript browser client with MantraAPI.data property

Params:
* key: <key for the property>
* value: <value for the property>

All keys indicated with AddDataValue(), will be inserted in MantraAPI.data object.

Given AddDataValue( 'title', 'Lord of the Rings' ), then, javascript browser client, will have MantraAPI.data.title property with value 'Lord of the Rings'.

## MantraAPI.GetDataValues

```js
GetDataValues()
```

Returns a hash table with all data values indicated previously with call to AddDataValue(). The keys of the hash table are the keys indicated when calling AddDataValue().

## MantraAPI.AddRequestData

```js
AddRequestData( key, value )
```

Adds data to be used in same request.

Params:
* key: <key for the property to be used during the request management>
* value: <value for that key>

When Mantra manages a request (http get, post, etc.), multiple calls are performed (core middlewares, component middlewares, prerequests hooks if present, etc.). Any of those calls can enrich the request data adding info to it.

An example of this, is performed when a prequest hook checks the id of the entity included in the url, then that prerequest adds the entity with AddRequestData() so that the view handler can have it.

This decouples the code so that the view handler can be minimal.

Usually, request data is added in [prerequest](/docs/15-component-prerequests.md) hooks.

## MantraAPI.GetRequestData

```js
GetRequestData( key )
```

Gets especific data added previously with AddRequestData() to be used in the same request.

## MantraAPI.GetRenderValues

```js
GetRenderValues()
```

Gets the hash table with all data values added previusly with AddRenderValue() or AddRenderValues() used to render with then rendering template engine (Mustache by default in current version).


## MantraAPI.PostRaw

```js
PostRaw( data )
```

Ends the current post request sending the json object indicated as parameter.

## MantraAPI.PostUnauthorizedCode

```js
PostUnauthorizedCode()
```

Ends the current post request with HTTP status code 401 (Unauthorized).

More about HTTP status code [here](#https://developer.mozilla.org/en-US/docs/Web/HTTP/status).

## MantraAPI.SendStatus

```js
SendStatus(statusCode)
```

Ends the current request with the http status indicated as parameter.

More about HTTP status code [here](#https://developer.mozilla.org/en-US/docs/Web/HTTP/status).

## MantraAPI.SendError

```js
SendError( message )
```

Ends the current request with HTTP status code status 500 (Internal Server Error)

More about HTTP status code [here](#https://developer.mozilla.org/en-US/docs/Web/HTTP/status).

## MantraAPI.SendSuccess

```js
SendSuccess( dataPayload = {} )
```

Ends a request with a response indicating success and an optional payload.

Params:
* dataPayload: <optional, data to be sent with the post response, optional>
    
The method will response a json object with the property "success" to true:

```json
{ success: true, payload: dataPayload }
```

## MantraAPI.SendFailure

```js
SendFailure( message, dataPayload = {} )
```

Ends a request with a response indicating failure and an optional payload.

Params:
* dataPayload: <optional, data to be sent with the post response, optional>
    
The method will response a json object with the property "success" to false:

```json
{ success: false, payload: dataPayload }
```

## MantraAPI.AddJs

```js
AddJs( resource )
```

Adds to the current request a javascript file placed at "js" folder. The "resource" parameter indicates which js file to include following one of these two formats options:

* "componentname.filename": Mantra will look for a js file inside "/componentname/ui/js", in the folder of the component indicated in the first part of the parameter.
* "frontend.pathtofile": in this case, "frontend" is a special key string indicating to Mantra that the file should be found in the UI assets of the current application.

All js files added with AddJs() in the same request, will be rendered at "mantra-js-files" Mustache tag indicated in html root document.

See [Adapting Root Html Document to Mantra](/22-docs/adapting-root-html-document-to-mantra.md) for more infor about Mantra Mustache tags.

Also, the parameter can be an array with a number of js resources to include.

You can also define the js files to include in on specific view indicating "<viewname>_js": property in its definition.

Some examples:

```js
Mantra.AddJs( "cookieswarning.alertck" ); // Will include /cookieswarning/ui/js/alertck.js file.

Mantra.AddJs( "frontend.assets/js/popupmessages.js"; // Will include the file /assets/js/popupmessages.js that should be at the UI folder of the current application

Mantra.AddJs( ["alerts.showalert", "seo.settitle"] ); // Will include those two js files.
```

Remember: files to add in the next rendering process (js and css) are not ordered in anyway.

## MantraAPI.AddCss

```js
AddCss( resource )
```

Adds to the current request a css file placed at "css" folder. Like AddJs, the "resource" parameter indicates which css file to include following one of these two formats options:

* "componentname.filename": Mantra will look for a css file inside "/componentname/ui/js", in the folder of the component indicated in the first part of the parameter.
* "frontend.pathtofile": in this case, "frontend" is a special key string indicating to Mantra that the file should be found in the UI assets of the current application.

All css files added with AddCss() in the same request, will be rendered at "mantra-css-files" Mustache tag indicated in html root document.

See [Adapting Root Html Document to Mantra](/docs/adapting-root-html-document-to-mantra.md) for more infor about Mantra Mustache tags.

Also, the parameter can be an array with a number of js resources to include.

You can also define the css files to include in on specific view indicating "<viewname>_css": property in its definition.

Some examples:

```js
Mantra.AddCss( "cookieswarning.alertckstyle" ); // Will include /cookieswarning/ui/css/alertckstyle.css file.

Mantra.AddCss( "frontend.assets/css/alertckstyle.css"; // Will include the file /assets/css/alertckstyle.css that should be at the UI folder of the current application

Mantra.AddCss( ["alerts.showalertstyle", "seo.settitlestyle"] ); // Will include those two css files.
```

## MantraAPI.ExistsComponentApi

```js
ExistsComponentApi( api )
```

Returns true if there is registered an api path, given in the format of "component name.api name".

Remember: files to add in the next rendering process (js and css) are not ordered in anyway.

## MantraAPI.ExistsComponentByName

```js
ExistsComponentByName( componentName )
```

Returns true if a component with the name indicated as parameter exists.

## MantraAPI.Invoke

```js
async Invoke( apiToCall, data = {} )
```

Invokes an API method defined by a component.

Params:
* apiToCall: <method of the api to call: component.apiname>
* data: <data to pass to the api method, optional>

Returns the value returned by the API method.

This method is equivalent to use "api" property shorcut:

```js
Mantra.api.componentname.apiname
```

See [Component APIs](/docs/09-component-apis.md) for more info about API registration.

## MantraAPI.ExistsComponentExtend

```js
```

## MantraAPI.GetComponentExtend

```js
```

## MantraAPI.GetComponentConfig

```js
GetComponentConfig( componentName )
```

Returns the full config json object for a component given its name.

See [Component Config](/docs/18-component-configuration.md) for more info about components configuration.

## MantraAPI.IsServiceActive

```js
IsServiceActive(service)
```

Returns true if the service indicated as parameter is active in current running application.

Available Mantra services are 'view','post','get','middleware' and 'cron'.

See [Mantra Services](/docs/25-mantra-services.md) for more information.

## MantraAPI.Config

```js
Config( componentProperty )
```

Returns a component property componentProperty is in the format "component name"."component property".

This method is equivalent to use "config" property shortcut:

```js
Mantra.config.componentname.property
```

Se [Components Configuration](/docs/18-component-configuration.md) for more details about component configurations.


## MantraAPI.EmitEvent

```js
async EmitEvent( eventName, eventData )
```

Emits an event to be managed by components events subscribers.

Params:
* eventName: <name of the event>
* eventData: <data for the event, optional>
  
See [Component Events](/docs/19-component-events-subscription.md) for more information about Mantra events.

## MantraAPI.LogInfo

```js
async LogInfo( description, data = "", key = "", counter = 0 )
```

Adds an info message to log.

Params:
* description: <description of the log>
* data: <string data to add to the log trace, optional>
* key: <string key associated with the log trace, optional>
* counter: <counter for the log trace in the case multiple logs at the same time, optional>

## MantraAPI.LogWarning

```js
async LogWarning( description, data = "", key = "", counter = 0 )
```

Adds a warning message to log.

Params:
* description: <description of the log>
* data: <string data to add to the log trace, optional>
* key: <string key associated with the log trace, optional>
* counter: <counter for the log trace in the case multiple logs at the same time, optional>

## MantraAPI.LogError

```js
async LogError( description, data = "", key = "", counter = 0 )
```

Adds an error message to log.

Params:
* description: <description of the log>
* data: <string data to add to the log trace, optional>
* key: <string key associated with the log trace, optional>
* counter: <counter for the log trace in the case multiple logs at the same time, optional>

## MantraAPI.ConsoleQuestion

```js
async ConsoleQuestion( question )
```

Useful for [Component Commands](/docs/17-component-commands.md), awaits to a console question to by typed by the user. The response is returned as string.

## MantraAPI.ExtractResource

```js
async ExtractResource( resource )
```

Given a resource path, returns a json object indicating information about if it is a frontend or a component resource.

The json returned is like this:

```json
{
    exists: <true if the resource exists>,
    isFrontendResource: <true if it is a front end resource>,
    isComponentResource: <true if it is a component resource>,
    fileType: <extension of the resource>,
    isMimeType: <true if it is a MIME type>
}
```

***
To learn by example, go to [Mantra demos](https://www.mantrajs.com/mantrademos/showall) and [components](https://www.mantrajs.com/marketplacecomponent/components) sections of [Mantra site](https://www.mantrajs.com).