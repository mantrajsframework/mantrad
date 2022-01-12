/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const path = require("path");
const ExtractValues = require("extract-values");
const Crypto = require("crypto");

const AssetsLocations = global.gimport("assetslocations");
const CoreConstants = global.gimport("coreconstants");
const DepsFactory = global.gimport("depsfactory");
const MantraAPIUtils = global.gimport("mantraapiutils");
const MantraResourceFiles = global.gimport("mantraresourcefiles");
const MantraConsole = global.gimport("mantraconsole");

const MantraComponentSchemaCache = global.gimport("mantracomponentschemacache");
const MantraDbConfigCache = global.gimport("mantradbconfigcache");
const MantraRegister = global.gimport("mantraregister");
const MantraUtils = global.gimport("mantrautils");
const RedEntities = require("redentities");
const VarCache = global.gimport("varcache");

class MantraAPI {
    constructor( componentsLoader, bootstrap, req, res ) {        
        this.componentsLoader = componentsLoader;
        this.bootstrap = bootstrap;
        this.req = req;
        this.res = res;
        this.renderValues = [];
        this.jsFiles = [];
        this.cssFiles = [];
        this.requestData = [];
        this.dataValues = {}; // Note: Should be initialized as object so that data values can be stringifies properly

        if ( req ) {
            this.isGet = req.method == 'GET';
            this.isPost = req.method == 'POST';
        }
    }

    /*
     * Get the name of the current running apps, one of App section of config file
     */
    GetAppName() {
        return global.Mantra.MantraConfig.AppName;
    }

    /*
     * Returns the base url indicated in config file for the component "core" and the key "baseurl"
     */
    GetBaseUrl() {
        return this.Config("core.baseurl");
    }

    /*
     * Returns the path requested
     */
    GetRequestPath() {
        return this.req.path;
    }

    /*
     * Returns hooks by its name
     */
    GetHooksByName( hookName ) {
        return this.bootstrap.getHooksByName(hookName);
    }

    /*
     * Returns Express response object of current request
     */
    GetResponse() {
        return this.res;
    }

    /*
     * Returns Express request object of current request
     */
    GetRequest() {
        return this.req;
    }


    /* 
     * Returns true if current request is a "GET"
     */
    IsGet() { return this.isGet; }

    /* 
     * Returns true if current request is a "POST"
     */
    IsPost() { return this.isPost; }

    /*
     * Redirects current request to other path
     * Params:
     *    path: path to redirect (relative or absolute)
     */
    async Redirect( path ) {
        this.res.redirect( path );
    }

    /*
     * Redirects current request to root
     */
    async RedirectToRoot() {
        this.res.redirect("/");
    }

    /*
     * Send a file using Express response.sendFile method
     * Params:
     *    fullPathToFile: <full path to file to send>
     */
    async SendFile( fullPathToFile ) {
        this.res.sendFile( fullPathToFile );
    }

    /*
     * Returns if current request path is the root index ('/')
     */
    IsIndex() {
        return this.req.path == "/";
    }

    /*
     * Renders a root document
     * Params:
     *   htmlRooDocument: file name (like "404.html") of document to render.
     *    This document should be located at frontend folder root
     * 
     */ 
    async RenderRoot( htmlRootDocument ) {        
        try {
            return this.SendHtml( await this.RenderContent( "", htmlRootDocument ) );
        } catch(err) {
            if ( err.code == 'ENOENT' ) {
                MantraConsole.warning(`Unable to locate ${htmlRootDocument} document`);
            } else {
                MantraConsole.error(err);
            }
        }
    }

    /*
     * Renders a view and returns its full html content (container not included)
     * Params:
     *    componentName: <name of the component>
     *    viewName: <name of the view to render (no extension file needed)
     */
    async RenderViewHtml( componentName, viewName ) {
        let viewPath = await this.GetAssetsLocations().GetViewLocation( componentName, viewName );

        if ( viewPath !== "" ) {            
            return this.RenderContent( await this.Invoke("static.getfile", { fullPathToFile: viewPath } ) );
        } else {
            MantraConsole.error( `Unable to locate ${componentName}.${viewName} view location`);
        }
    }

    /*
     * Renders the content of the view in the container
     * Params:
     *    viewHtml: <html content to render in the container file>
     *    htmlContainerFile: <container file name, like "index.html", optional, "index.html" by default)
     */
    async RenderRawViewContentHtml( viewHtml, htmlContainerFile = CoreConstants.DEFAULT_ROOT_DOCUMENT ) {
        return this.RenderContent( viewHtml, htmlContainerFile );
    }        
    
    /*
     * Get the value of a global variable: section "GlobalTemplateVars" of config file
     * Params:
     *    globalVarKey: <key of the global variable>
     */
    GetGlobalVar( globalVarKey ) {
        const sc = global.Mantra.MantraConfig;
    
        if ( sc.GlobalTemplateVars && sc.GlobalTemplateVars[globalVarKey] ) {
            return sc.GlobalTemplateVars[globalVarKey];
        }   

        return "(unknown)";
    }

    /*
     * This is the main method to render contents in mantra UI
     * Params: 
     *    htmlViewContent: <html to render with blocks, data values, etc>
     *    htmlContainerFile: <optional, file of the container, like "index.html">
     */
    async RenderContent( htmlViewContent, htmlContainerFile ) {
        let docContainerHtml = ""; 
        let blocks = [];
        
        MantraAPIUtils.AddGlobalVars(this);

        if ( htmlContainerFile ) {
            let docContainerPath = path.join( global.Mantra.MantraConfig.FrontendLocation, htmlContainerFile || CoreConstants.DEFAULT_ROOT_DOCUMENT );
            docContainerHtml = await this.Invoke("static.getfile", { fullPathToFile: docContainerPath } );
        
            blocks = await MantraAPIUtils.LookupBlocksFromContents( this, [docContainerHtml, htmlViewContent] );
        } else {
            blocks = await MantraAPIUtils.LookupBlocksFromContents( this, [htmlViewContent] );
        }

        // Load blocks: add them to renderValues and invokes handlers if needed
        await this.loadBlocks( blocks );

        this.renderValues[ CoreConstants.MANTRA_JS_BLOCK ] = await MantraResourceFiles.GetJSFiles(this, this.jsFiles);
        this.renderValues[ CoreConstants.MANTRA_CSS_BLOCK ] = await MantraResourceFiles.GetCSSFiles(this, this.cssFiles); 
        
        // Render content in render values (including blocks)
        this.renderRenderValues();

        // Render view
        this.renderValues[ CoreConstants.MANTRA_CONTENT_BLOCK ] = MantraAPIUtils.RenderContentWithValues( htmlViewContent, this.renderValues );
        
        if ( htmlContainerFile ) {            
            // Render container if indicated
            return MantraAPIUtils.RenderContentWithValues( docContainerHtml, this.renderValues );
        }

        return this.renderValues[ CoreConstants.MANTRA_CONTENT_BLOCK ];
    }

    /*
     * Render a view and returns its full html content (container included)
     */
    async RenderFullViewHtml( componentName, viewName, htmlContainerFile ) {        
        let viewPath = await this.GetAssetsLocations().GetViewLocation( componentName, viewName );

        if ( viewPath !== "" ) {
            let viewHtml = await this.Invoke("static.getfile", { fullPathToFile: viewPath } );
            
            this.addJsInViewConfig( componentName, viewName );
            this.addCssInViewConfig( componentName, viewName );
                
            return this.RenderContent( viewHtml, htmlContainerFile );
        } else {
            MantraConsole.error( `Unable to locate ${componentName}.${viewName} view location`);
        }
    }

    renderRenderValues() {
        for( let renderValue of Object.keys(this.renderValues) ) {
            if ( typeof this.renderValues[renderValue] == 'string' && this.renderValues[renderValue].indexOf("{{") != -1 ) {
                if (this.renderValues[renderValue]) {
                    this.renderValues[renderValue] = MantraAPIUtils.RenderContentWithValues(this.renderValues[renderValue], this.renderValues);
                }
            }
        }
    }

    /*
     * Renders a view and ends the get requests by sending its content.
     * Params:
     *    view: component.viewname
     *    htmlContainerFile: main container for the view, optional, by default index.html
     */
    async RenderView( view, htmlContainerFile ) {
        const parts = this.Utils.ParseComponentPath( view );

        if ( parts.component && global.Mantra.ComponentsLoader.existsComponentByName(parts.component) ) {
            return this.SendHtml( await this.RenderFullViewHtml( parts.component, parts.asset, htmlContainerFile ? htmlContainerFile : "index.html") );
        } else {
            this.LogError( `View '${view}' not valid` );
            if ( parts.component ) this.LogError( `Component '${parts.component}' doesn't exist or it is not enabled`);
        }
    }

    ExistsBlock( componentName, blockName) {
        return this.bootstrap.ExistsBlock( componentName, blockName );
    }
    
    /*
     * Returns the html content for a view.
     * view: <component.viewname, view should be at component/views/<viewname>.html>
     */
    async GetViewHtml( view ) {
        const parts = this.Utils.ParseComponentPath( view );
        const viewLocation = await this.GetAssetsLocations().GetViewLocation( parts.component, parts.asset );

        return this.Utils.readTextFileAsync( viewLocation );
    }
    
    async ExistsView( view ) {
        const parts = this.Utils.ParseComponentPath( view );
        
        if (this.ExistsComponentByName(parts.component)) {
            const viewLocation = this.GetAssetsLocations().GetViewLocation( parts.component, parts.asset );
    
            return this.Utils.FileExists( viewLocation );
        }

        return false;
    }

    /*
     * Send html content over response object
     */
    async SendHtml( htmlContent ) {
        return this.res.header("Content-Type", "text/html").end( await DepsFactory.MinifyHtml(htmlContent) );
    }

    /*
     * Returns the html content of a view
     * view: component.viewname
     */
    async GetView( view ) {
        let parts = this.Utils.ParseComponentPath( view );
        let viewPath = await this.GetAssetsLocations().GetViewLocation( parts.component, parts.asset );

        if ( viewPath !== "" ) {
            return this.Invoke("static.getfile", { fullPathToFile: viewPath } );
        } else {
            throw new Error( `Unable to locate ${componentName}.${viewName} view location`);
        }
    }

    async RenderRawView( viewHtml, htmlContainer ) {
        return this.SendHtml( await this.RenderRawViewContentHtml( viewHtml, htmlContainer ) );
    }
    
    async EndGetRequest( data ) {
        this.res.end( data );
    }

    addJsInViewConfig( componentName, viewName ) {
        let cmp = this.bootstrap.GetView( componentName, viewName );
        
        if ( cmp && cmp.Js ) {
            let jsResources = Array.isArray(cmp.Js) ? cmp.Js : [cmp.Js];

            for( let jsResource of jsResources ) {
                // Checks if resources is given in form <component name>.<js resource>
                let parts = this.Utils.ParseComponentPath( jsResource );
                
                if ( parts ) {
                    this.AddJs(`${parts.component}.${parts.asset}`);                 
                } else {
                    this.AddJs(`${componentName}.${jsResource}`);
                }                
            }
        }
    }

    addCssInViewConfig( componentName, viewName ) {
        let cmp = this.bootstrap.GetView( componentName, viewName );

        if ( cmp && cmp.Css ) {
            let cssResources = Array.isArray(cmp.Css) ? cmp.Css : [cmp.Css];

            for( let cssResource of cssResources ) {
                // Checks if resources is given in form <component name>.<css resource>
                let parts = this.Utils.ParseComponentPath( cssResource );

                if ( parts ) {
                    this.AddCss(`${parts.component}.${parts.asset}`);
                } else {
                    this.AddCss(`${componentName}.${cssResource}`)
                }
            }
        }
    }

    async loadBlocks( blocksToLoad ) {
        let htmlBlocks = await this.bootstrap.getHtmlBlocks(this, blocksToLoad, this.req, this.res );

        for( let blockName of Object.keys( htmlBlocks ) ) {
            let b = htmlBlocks[blockName];
          
            this.AddRenderValue( blockName, b.blockHtml );

            if ( b.Css ) {
                if ( typeof b.Css == "string" ) {
                    this.AddCss( `${b.componentName}.${b.Css}` );
                } else if ( typeof b.Css == "object" ) {
                    for( let i = 0; i < b.Css.length; i++ ) {
                        this.AddCss( `${b.componentName}.${b.Css[i]}` );
                    }
                }
            }
    
            if ( b.Js ) {
                if ( typeof b.Js == "string" ) {
                    this.AddJs( `${b.componentName}.${b.Js}` );
                } else if ( typeof b.Js == "object" ) {
                    for( let i = 0; i < b.Js.length; i++ ) {
                        this.AddJs( `${b.componentName}.${b.Js[i]}` );
                    }
                }
            }
        }
    }

    async RenderLandingPage() {
        return this.RenderRoot(CoreConstants.DEFAULT_ROOT_DOCUMENT);
    }

    /*
     * Renders a template from its full location and data
     * Params:
     *    pathToTemplate: <full path to template>
     *    data: <object with data to render>
     * Returns template rendered
     */
    async RenderTemplateFromFile( pathToTemplateFile, data ) {
        let templateHtml = await this.Invoke("static.getfile", { fullPathToFile: pathToTemplateFile } );

        return DepsFactory.RenderHtml(templateHtml, data);
    }
    
    /*
     * Renders a template file with data
     * The template file is indicated as "<component name>/<template file name>" (with no ".html" extension).
     * Looks firstly for the template file at /<site location>/ui/templates/<template file>.
     * If data is an array, then template file is rendered by each element.
     * If it doesn't exist, then looks for the template file at /<component>/ui/templates/<template file>.
     * 
     * Params:
     *    templateFile: local path to template inside site templates location (set in config) or componente templates folder, like "pager/basepager" (no need to add .html extension)
     *    data: data to render (object for one item or array of objects)
     */
    async RenderTemplate( templatefile, data ) {        
        const parts = ExtractValues(templatefile, "{componentName}/{template}");
        let templateHtml;

        let pathToTemplate = await this.GetAssetsLocations().GetTemplateLocation( parts.componentName, parts.template );

        if ( pathToTemplate != "" ) {
            templateHtml = await this.Invoke("static.getfile", { fullPathToFile: pathToTemplate } );
        } else {
            throw Error(`Unable to locate template ${templatefile}`);
        }

        if ( Array.isArray(data) ) {
            let html = "";

            for( const item of data ) {
                html += this.RenderHtml( templateHtml, item );
            }    

            return html;
        } else {
            return this.RenderHtml( templateHtml, data);
        }
    }

    RenderHtml( templateHtml, data ) {
        return DepsFactory.RenderHtml( templateHtml, data );
    }

    async Render( html ) {
        const blocks = MantraAPIUtils.GetBlocksFromHtml( html );

        await this.loadBlocks(blocks);

        MantraAPIUtils.AddGlobalVars(this);

        return DepsFactory.RenderHtml( html, this.renderValues );
    }

    /*
     * Returns the full path of a component
     * Params:
     *    componentName: <name of the component>
     * Exception launched if component doesn't exist
     */
    GetComponentLocation(componentName) {                
        if ( this.componentsLoader.existsComponentByName(componentName) ) {
            return this.componentsLoader.getComponentByName( componentName ).pathToComponent;
        }
        
        throw Error(`Unkown component ${componentName}`)
    }

    /*
     * Returns the version of a component
     * Params:
     *    componentName: <name of the component>
     * Exception launched if component doesn't exist
     */
    GetComponentVersion(componentName) {        
        if ( this.componentsLoader.existsComponentByName(componentName) ) {
            return this.componentsLoader.getComponentByName( componentName ).config.version;
        }

        throw Error(`Unkown component ${componentName}`)
    }

    async InstallSchema( componentName ) {
        return new Promise( (resolve, reject) => {
            let redEntities = this.ComponentEntities(componentName);
    
            redEntities
                .CreateSchema()
                .then( resolve )
                .catch( reject );
        });        
    }

    /*
     * Install a new schema given its definition
     * Params:
     * componentName: <name of the component which install the schema. According to this name, gets the right db configuration>
     * jsonSchema: <json of the schema to install>
     * removesIfExists: <if true, and if entities already exists, then they are removed and resintalled. If false, if an entity exists, then it is not removed. Default true>
     */
    async InstallDynamicSchema( componentName, jsonSchema, removesIfExists = true ) {
        return new Promise( (resolve, reject) => {
            let dbconfigname = this.GetComponentDbConfig( componentName );            

            let redEntities = RedEntities( global.Mantra.MantraConfig.getEntitiesConfiguration(dbconfigname) )
                              .Entities( jsonSchema );
    
            redEntities
                .CreateSchema(removesIfExists)
                .then( resolve )
                .catch( reject );
        });        
    }

    async UninstallSchema( componentName, schema ) {
        return new Promise( (resolve, reject) => {
            let redEntities = this.ComponentEntities(componentName);

            redEntities
                .RemoveSchema(schema)
                .then( resolve )
                .catch( reject );
        });        
    }

    /*
     * Updates a new schema for component
     * This method is complex and involves changes in DB
     * It should be called from an onUpdate method of Start class of the component
     * Recommended to make database backup before calling this method
     * Params:
     *    componentName: <name of the component to update>
     *    currentVersion: <current version of the component installed in system, as indicated in previous mantra.json>
     *    versionToUpdate: <new version to update of the component, as indicated in current mantra.json>
     *    updateEntityFnc: <optional callback function: async (entityName, entity, db) {}, to be called for each current entity instance for each entity in current db>
     */
    async UpdateSchema( componentName, currentVersion, versionToUpdate, updateEntityFnc ) {
        // 1) Renombrar entidades de la versión actual
        const SUFIXFORTEMPORALENTITY = "_temporal";

        let currentSchema = await this.GetSchemaByVersion( componentName, currentVersion );
        let tempSchema = await this.RenameSchemaEntities( componentName, currentSchema, SUFIXFORTEMPORALENTITY );

        // 2) Crear las entidades de la nueva versión
        let newSchema = await this.GetSchemaByVersion( componentName, versionToUpdate );
        let redEntities = this.ComponentEntities(componentName);

        await redEntities.CreateFromSchema(newSchema);

        // 3) Trasvasar información de la versión actual a la nueva        
        if ( updateEntityFnc ) {
            let dbTemporal = await this.ComponentEntitiesFromSchema( componentName, tempSchema );
            let db = this.ComponentEntities( componentName );

            for( let entity of currentSchema.entities ) {
                let entityName = entity.name.replace(SUFIXFORTEMPORALENTITY,"");

                await dbTemporal[entity.name].S().IterateAll( async (e) => {
                    return updateEntityFnc(entityName, e, db );
                });
            }
        }

        // 4) Eliminar la versión anterior
        await this.UninstallSchema( componentName, tempSchema );
    }

    /*
     * Load the json for a schema according to the
     * path: <componentname>.<schemaname>
     */
    async LoadSchema( schema ) {
        const parts = this.Utils.ParseComponentPath(schema);

        return this.componentSchemaCache.GetSchema( this, parts.component, parts.asset );
    }

    async GetSchemaByVersion( componentName, version ) {
        const componentLocation = this.GetComponentLocation(componentName);
        const schema = `${componentName}.${version}`;
        const pathToVersionModel = path.join( componentLocation, "model", `${schema}.schema.json` );
    
        if ( this.Utils.FileExistsSync( pathToVersionModel ) ) {
            return require(pathToVersionModel);
        } else {
            let defaultPathToModel = path.join( componentLocation, "model", `${componentName}.schema.json` );
            return require(defaultPathToModel);
        }
    }

    async RenameSchemaEntities( componentName, schema, sufix ) {
        let dbconfigname = this.GetComponentDbConfig( componentName );            

        return RedEntities( global.Mantra.MantraConfig.getEntitiesConfiguration(dbconfigname) )
                    .Entities(schema)
                    .RenameSchemaEntities( sufix );
    }

    /*
     * Returns RedEntities instance configured with a component model
     */
    ComponentEntities( componentName ) {         
        this.componentEntitiesCache = this.componentEntitiesCache || VarCache();

        if ( !this.componentEntitiesCache.Exists(componentName) ) {
            this.componentEntitiesCache
                   .Add( componentName, RedEntities( global.Mantra.MantraConfig.getEntitiesConfiguration( this.GetComponentDbConfig( componentName ) ) )
                   .Entities( this.componentSchemaCache.GetSchema( this, componentName ) ) );
        }

        return this.componentEntitiesCache.Get( componentName );
    }

    ComponentEntitiesFromSchema( componentName, schema ) {         
        return RedEntities( global.Mantra.MantraConfig.getEntitiesConfiguration(this.GetComponentDbConfig( componentName )) )
                            .Entities( schema );
    }

    DynamicComponentEntities( componentName, jsonSchema ) {
        this.componentEntitiesCache = this.componentEntitiesCache || VarCache();
        let schemaHash = Crypto.createHash('md5').update(JSON.stringify(jsonSchema)).digest('hex');

        if ( !this.componentEntitiesCache.Exists(schemaHash) ) {
            let dbconfigname = this.GetComponentDbConfig( componentName );            

            this.componentEntitiesCache.Add( schemaHash, RedEntities( global.Mantra.MantraConfig.getEntitiesConfiguration(dbconfigname) )
                .Entities( jsonSchema ) );
        }

        return this.componentEntitiesCache.Get( schemaHash );
    }

    GetInstanceId() {
        return global.Mantra.MantraConfig.InstanceId;
    }

    /*
     * Returns the db configuration name for a component from global configuration
     */
    GetComponentDbConfig( componentName ) {
        return this.cmpDbConfiguration.GetComponentEntitiesConfigName(componentName);
    }

    Register( hook, data ) {
        this.bootstrap.Register( hook, data );

        return this;
    }
    
    GetExtendsByType( type ) {
        return this.bootstrap.GetComponentExtends().filter( (hook) => hook.type == type );
    }

    Hooks( componentName ) {
        return MantraRegister( this, componentName, global.Mantra.MantraConfig.ComponentActiveServices[componentName] );
    }

    /*
     * Adds data to be used in rendering using render engine template
     * in views, blocks, etc.
     * Params:
     *    key: <key name of the variable to render>
     *    value: <value for the key>
     */
    AddRenderValue( key, value ) {
        this.renderValues[key] = value;

        return this;
    }

    /*
     * Adds data to be used in rendering using render engine template
     * in views, blocks, etc.
     * Params:
     *    values: <json object with keys the their values to render>
     */
    AddRenderValues( values ) {
        for( const key of Object.keys(values) ) {
            this.renderValues[key] = values[key];
        }
        
        return this;
    }

    /*
     * Adds data to be used by client with MantraAPI.data property
     * Params:
     *    key: <key for the property>
     *    value: <value for the property>
     */
    AddDataValue( key, value ) {
        this.dataValues[key] = value;

        return this;
    }

    GetDataValues() {
        return this.dataValues;
    }
    
    /*
     * Adds data to be used in same request.
     * Params:
     *    key: <key for the property to be used during the request management>
     *    value: <value for that key>
     */
    AddRequestData( key, value ) {
        this.requestData[key] = value;

        return this;
    }

    /* 
     * Gets especific data added previously with AddRequestData() to be
     * used in the same request.
     */
    GetRequestData( key ) {
        return this.requestData[key];
    }

    /*
     * Gets all data values added previusly with AddRenderValue() used to
     * rendering with render engine template.
     */
    GetRenderValues() {
        return this.renderValues;
    }

    PostRaw( data ) {
        this.res.json( data );
    }

    PostUnauthorizedCode() {
        this.res.status(401);
        this.res.send("Unauthorized");
    }

    SendStatus(statusCode) {
        this.res.status(statusCode).end();
    }
    
    SendError( message ) {
        this.res.status(500);
        this.res.send( message );
    }

    /*
     * Send a post response indicating success
     * Params:
     *    dataPayload: <data to be sent with the post response, optional>
     */
    PostSuccess( dataPayload = {} ) {
        this.res.json( { success: true, payload: dataPayload } );
    }


    /*
     * Send a post response indicating failure
     * Params:
     *    message: <message indicating the error>
     *    dataPayload: <data to be sent with the post response, optional>
     */
    PostFailed( message, dataPayload = {} ) {
        this.res.json( { success: false, message: message, payload: dataPayload } );
    }

    /*
     * Adds a javascript file placed at "js" folder.
     * The resource is indicated with "componentname.filename" format, 
     * or "frontend.assets/js/start.js" format, where "frontend" is the location of the current frontend.
     * The parameter resource can be an array with multiple js files.
     */
    AddJs( resource ) {
        if ( Array.isArray(resource) ) {
            for( const jsFile of resource ) {
                if ( !this.jsFiles.includes(jsFile) ) {
                    this.jsFiles.push(jsFile);
                }
            }
        } else {
            if ( !this.jsFiles.includes(resource) ) {
                this.jsFiles.push(resource);
            }
        }

        return this;
    }

    GetJsResources() {
        return this.jsFiles;
    }

    /*
     * Adds a css file placed at "css" folder.
     * The resource is indicated with "componentname.filename" format,
     * or "frontend.assets/css/styles.css" format, where "frontend" is the location of the current frontend.
     * The parameter resource can be an array with multiple css files.
     */
    AddCss( resource ) {
        if ( Array.isArray(resource) ) {
            for( const cssFile of resource ) {
                if ( !this.cssFiles.includes(cssFile) ) {
                    this.cssFiles.push( cssFile );                    
                }
            }
        } else {
            if ( !this.cssFiles.includes(resource) ) {
                this.cssFiles.push( resource );
            }        
        }

        return this;
    }

    GetCssResources() {
        return this.cssFiles;
    }

    /*
     * Returns true if the api path exists within the components, given
     * in the way of <component name>.<api name>
     */
    ExistsComponentApi( api ) {
        return this.bootstrap.existsApi(api);
    }

    /*
     * Returns true if a component with the name indicated as parameter exists
     */
    ExistsComponentByName( componentName ) {
        return this.componentsLoader.existsComponentByName(componentName);
    }

    /*
     * Invokes an api method defined by a component
     * Params:
     *    apiToCall: <method of the api to call: component.apiname>
     *    data: <data to pass to the api method, optional>
     */
    async Invoke( apiToCall, data = {} ) {
        const apiParts = this.Utils.ParseComponentPath( apiToCall );
        
        if ( this.isApiToCallRight(apiToCall, apiParts) ) {
                return this.bootstrap.Invoke(this, apiToCall, data )
            }
        else {
            throw Error(`Unable to call API ${apiToCall}. Bad format API string or no existing API`)
        }
    }

    GetExtendsByType( type ) {
        return global.Mantra.Bootstrap.GetExtendsByType(type);
    }

    /*
     * Returns config for a component
     * Check mantraconfig.json file configuration first. If it is not indicated,
     * looks for 'defaultconfig' property in mantra.json file of the component
     */
    GetComponentConfig( componentName ) {
        const cnf = global.Mantra.MantraConfig.ComponentsConfig[componentName];

        if ( cnf ) return cnf;

        MantraConsole.warning(`Unknown config for component ${componentName}` );
        throw Error( `Unknown config for component ${componentName}`);
    }

    IsServiceActive(service) {
        if ( ['view','post','get','middleware','cron'].includes(service) == false ) {
            throw Error( `Unknown service ${service}` );
        }
        return global.Mantra.MantraConfig.isServiceActive(service);

    }
    /*
     * Returns a component property
     * componentProperty is in the syntax <component name>.<component property>
     */
    Config( componentProperty ) {
        const parts = this.Utils.ParseComponentPath( componentProperty );

        if (parts == null ) throw Error( `Unkown syntax for property component ${componentProperty}`);
        
        try {
            return global.Mantra.MantraConfig.ComponentsConfig[parts.component][parts.asset]
        } catch(err) {
            throw Error( `Unknown config for component ${componentName}`);
        }
    }

    GlobalConfig( property ) {
        return global.Mantra.MantraConfig.GlobalConfig[property];
    }

    /*
     * Emit an event to be managed by events received defined by components
     * Params:
     *    eventName: <name of the event>
     *    eventData: <data for the event, optional>
     */
    async EmitEvent( eventName, eventData ) {
        eventData.MantraAPI = this;
       
        return this.bootstrap.EmitEvent( eventName, eventData );
    }
    
    async LogInfo( description, data, key, counter ) {
        return this.addNewLog( 'info', description, data, key, counter );
    }

    async LogWarning( description, data, key, counter ) {
        return this.addNewLog( 'warning', description, data, key, counter );
    }

    async LogError( description, data, key, counter ) {
        return this.addNewLog( 'error', description, data, key, counter );
    }

    async ConsoleQuestion( question ) {
        return MantraConsole.question(question);
    }

    async ExtractResource( resource ) {
        let localFile = path.join( global.Mantra.MantraConfig.FrontendLocation, resource );        
        let isFrontendResource = await this.Utils.FileExists( localFile );
        let extension = path.extname(resource);

        let result = {
            exists: false,
            isFrontendResource: false,
            isComponentResource: false,
            fileType: "",
            isMimeType: this.Utils.IsMIMEType( extension )
        };

        if ( isFrontendResource ) {            
            result.exists = true;
            result.isFrontendResource = true;
            result.fullPathToResource = localFile;            
            result.fileType = extension.substr(1);
        } else {
            let componentResourceParts = ExtractValues( resource, "/{componentName}/{resource}/{file}");
            let componentsLoader = global.Mantra.ComponentsLoader;
        
            if ( componentResourceParts === null ) { return result; }
                    
            if (componentsLoader.existsComponentByName(componentResourceParts.componentName) &&
                result.isMimeType ) {
                let cmp = componentsLoader.getComponentByName(componentResourceParts.componentName);
                let fullPath = path.join(cmp.pathToComponent, componentResourceParts.resource, componentResourceParts.file);
        
                let exists = await this.Utils.FileExists(fullPath);
        
                if (exists) {
                    result.exists = true;
                    result.isComponentResource = true;
                    result.fullPathToResource = fullPath;
                    result.fileType = extension.substr(1);
                }
            }
        }    
        
        return result;
    }

    GetAssetsLocations() {
        return AssetsLocations(this);
    }

    // Helper functions    
    isApiToCallRight( apiToCall, apiParts ) {
        return apiParts &&
               (apiParts.component && apiParts.asset) &&
               this.componentsLoader.existsComponentByName(apiParts.component) &&
               this.bootstrap.existsApi(apiToCall)
    }

    async addNewLog( type, description, data = "", key = "", counter = 0) {
        const logApi = this.Config("core.logapi");

        if ( global.Mantra.Initialized && logApi && logApi !== "" ) {
            const logData = {
                type: type,
                key: key,
                counter: counter,
                description: description,
                data: data ? data : ""
            }
    
            return this.Invoke( logApi, logData );
        } else {
            console.log( `Mantra log of type ${type}` );
            console.log( "Description: ", description);
            if ( data !== "" ) console.log("Data:", JSON.stringify(data, null, 4));
            if ( key !== "") console.log(`Key: ${key}` );
        }
    }

    async getHtmlBlock( blockName ) {        
        const htmlBlocks = await this.bootstrap.getHtmlBlocks(this, [blockName], this.req, this.res );
        
        return htmlBlocks[blockName] ? htmlBlocks[blockName].blockHtml : ""; 
    }
}

// Lazy load properties for MantraAPI
Object.defineProperty( MantraAPI.prototype, "api", {
    get: function() {
        this.apiLazyLoad = this.apiLazyLoad || this.bootstrap.getComponentsApiInstances();
        return this.apiLazyLoad;
    }
});

Object.defineProperty( MantraAPI.prototype, "dal", {
    get: function() {
        this.dalLazyLoad = this.dalLazyLoad || this.bootstrap.getComponentsRepositoryInstances();
        return this.dalLazyLoad;
    }
});

Object.defineProperty( MantraAPI.prototype, "cmpDbConfiguration", {
    get: function() {
        this.cmpDbConfigurationLazyLoad = this.cmpDbConfigurationLazyLoad || MantraDbConfigCache();
        return this.cmpDbConfigurationLazyLoad;
    }
});

Object.defineProperty( MantraAPI.prototype, "componentSchemaCache", {
    get: function() {
        this.componentSchemaCacheLazyLoad = this.componentSchemaCacheLazyLoad || MantraComponentSchemaCache();
        return this.componentSchemaCacheLazyLoad;
    }
});

Object.defineProperty( MantraAPI.prototype, "Utils", {
    get: function() {
        this.UtilsLazyLoad = this.UtilsLazyLoad || MantraUtils;
        return this.UtilsLazyLoad;
    }
})

module.exports = ( componentsLoader, bootstrap, req, res ) => {
    return new MantraAPI( componentsLoader, bootstrap, req, res );
}