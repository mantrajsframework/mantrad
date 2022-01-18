/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const jsonValidator = require("jsonschema").Validator;

const AccessConditions = global.gimport("accessconditions");
const ActiveServices = global.gimport("activeservices");
const BootstrapFilesDef = global.gimport("bootstrapfilesdef");
const BootstrapRegister = global.gimport("bootstrapregister");
const BootstrapNotFoundMiddleware = global.gimport("bootstrapnotfoundmiddleware");
const ComponentsApiInstances = global.gimport("componentsapiinstances");
const ComponentsRepositoryInstances = global.gimport("componentsrepositoryinstances");
const CoreConstants = global.gimport("coreconstants");
const InjectionsInstances = global.gimport("injectionsinstances");
const MantraConsole = global.gimport("mantraconsole");
const MantraDB = global.gimport("mantradb");
const MantraUtils = global.gimport("mantrautils");
const StaticBlocksCache = global.gimport("varcache")();

let singleBootstrap;

class Bootstrap {
    constructor() {
        this.htmlBlocks = [];
        this.hooks = [];
        this.hooks[CoreConstants.ACCESSCONDITION_HOOK] = [];
        this.hooks[CoreConstants.API_HOOK] = [];
        this.hooks[CoreConstants.APIEXTEND_HOOK] = [];
        this.hooks[CoreConstants.BLOCK_HOOK] = [];
        this.hooks[CoreConstants.COMMAND_HOOK] = [];
        this.hooks[CoreConstants.CRON_HOOK] = [];
        this.hooks[CoreConstants.DAL_HOOK] = [];
        this.hooks[CoreConstants.EVENT_HOOK] = [];
        this.hooks[CoreConstants.EXTEND_HOOK] = [];
        this.hooks[CoreConstants.GET_HOOK] = [];
        this.hooks[CoreConstants.MIDDLEWARE_HOOK] = [];
        this.hooks[CoreConstants.POST_HOOK] = [];
        this.hooks[CoreConstants.PREREQUEST_HOOK] = [];
        this.hooks[CoreConstants.VIEW_HOOK] = [];

        this.indexedAccessConditions = [];
        this.indexedBlocks = [];
        this.indexedComponentExtendByType = [];
        this.indexedGets = [];
        this.indexedPosts = [];
        this.indexedPreRequests = [];
        this.indexedViews = [];        

        this.apiHandlers = [];
    }
    
    GetMantraDB() { return this.MantraDB; }

    getHooksByName( hookName ) {
        return this.hooks[hookName];
    }

    getHooksByComponent( componentName ) {
        let hooks = [];

        for( const hookName of Object.keys(this.hooks) ) {
            for( let hook of this.hooks[hookName] ) {
                if ( hook.Component == componentName ) {
                    hook.HookName = hookName;
                    hooks.push(hook);
                }
            }
        }

        return MantraUtils.Underscore.sortBy( hooks, "HookName" );
    }

    /*
     * Loads all components configured
     * checking if Mantra DB is ready
     */
    async loadComponents() {
        MantraConsole.info('Loading components...');
        const mc = global.Mantra.MantraConfig;
        const entitiesConfig = global.Mantra.MantraConfig.getEntitiesConfiguration();
        let componentsToLoad;

        this.MantraDB = MantraDB(entitiesConfig);

        if ( !(await this.MantraDB.IsDatabaseInstalled()) ) {
            global.gimport("fatalending").exitByError( "Database not installed or unreachable ");
        }
        
        if ( mc.ActiveComponents ) {
            componentsToLoad = mc.ActiveComponents.concat( CoreConstants.CORE_COMPONENTS );
        } else {
            componentsToLoad = await this.MantraDB.GetComponentsInstalledAndEnabled();
            
            if ( mc.InactiveComponents ) {
                for( const cmpToRemove of mc.InactiveComponents ) {
                    const index = componentsToLoad.indexOf(cmpToRemove);
    
                    if ( index > -1 ) {
                        componentsToLoad.splice( componentsToLoad.indexOf(cmpToRemove), 1 );
        
                        MantraConsole.info(`Component deactivated: ${cmpToRemove}`);
                    } else {
                        MantraConsole.error(`Component to deactivate '${cmpToRemove}' no existing or disabed`);
                    }
                }
            }
        }

        componentsToLoad = [...new Set(componentsToLoad)];
            
        global.Mantra.ComponentsLoader.loadComponents( mc.getComponentsLocations(), componentsToLoad );

        mc.ComponentActiveServices = ActiveServices.extractActiveServicesByComponent( componentsToLoad );

        MantraConsole.info(`${componentsToLoad.length} components loaded`);
    }

    getComponentsApiInstances() {
        return ComponentsApiInstances.GetApiInstances();
    }

    getInjectionsInstances() {
        return InjectionsInstances.GetInjectionsInstances();
    }

    getComponentsRepositoryInstances() {
        return ComponentsRepositoryInstances.GetRepositoryInstances();
    }

    async startComponents() {
        await this.loadComponents();
        MantraConsole.info("Starting components...");
        
        loadDefaultComponentsConfigurations();

        let mantraAPI = global.Mantra.MantraAPIFactory();

        await this.callOnStartComponents( mantraAPI );

        const components = global.Mantra.ComponentsLoader.getComponents();

        await BootstrapFilesDef.lookupFilesDefinitions( mantraAPI, components );
        await BootstrapFilesDef.lookupAnonymousBlocks( mantraAPI, components );
        
        this.apiHandlers = BootstrapRegister.registerAPIs( this.hooks[CoreConstants.API_HOOK] );
        
        ComponentsApiInstances.BuildApiInstances( this.hooks[CoreConstants.API_HOOK] );
        ComponentsRepositoryInstances.BuildRepositoryInstances( mantraAPI, this.hooks[CoreConstants.DAL_HOOK] );
        InjectionsInstances.BuildInjectionsInstances( global.Mantra.MantraConfig.Injections, ComponentsApiInstances.GetApiInstances() );
        
        await this.checkMantraIsInitialized( mantraAPI );
        
        this.indexHooks();
                
        process.on('SIGINT', async () => {
            await this.callOnStopComponents( mantraAPI );
            process.exit();
        });

        process.on('SIGTERM', async () => {
            await this.callOnStopComponents( mantraAPI );
            process.exit();
        });

        MantraConsole.info("Components started");
    }

    async startServer( app, MantraAPI ) {        
        if ( await this.checkComponentsAreUpdated() ) {
            global.gimport("fatalending").exit();
        }
        
        const isMiddleware = global.Mantra.MantraConfig.isServiceActive(CoreConstants.MIDDLEWARE_HOOK); 
        const isView = global.Mantra.MantraConfig.isServiceActive(CoreConstants.VIEW_HOOK);
        const isGet = global.Mantra.MantraConfig.isServiceActive(CoreConstants.GET_HOOK);
        const isPost = global.Mantra.MantraConfig.isServiceActive(CoreConstants.POST_HOOK);

        if ( isMiddleware || (isGet || isPost || isView) ) {
            MantraConsole.info("Service: activating middleware...");

            BootstrapRegister.registerMiddlewares(app, this.getMiddlewaresOrderedByWeight() );
        }

        if ( isView ) {
            MantraConsole.info("Service: activating view...");

            BootstrapRegister.registerViews( app, this.hooks[CoreConstants.VIEW_HOOK] );
        }

        if ( isGet ) {
            MantraConsole.info("Service: activating get...");

            BootstrapRegister.registerGets( app, this.hooks[CoreConstants.GET_HOOK] );
        }

        if ( isPost ) {
            MantraConsole.info("Service: activating post...");

            BootstrapRegister.registerPosts( app, this.hooks[CoreConstants.POST_HOOK] );
        }
        
        if ( isView || isPost || isGet ) {                
            app.use( BootstrapNotFoundMiddleware.NotFound );
        }

        this.createApiExtend();

        if (global.Mantra.MantraConfig.isServiceActive(CoreConstants.VIEW_HOOK) ) {
            await this.checkIfResourcesExistAndResolvePaths();
        }

        this.callOnServerStartedComponents( app, MantraAPI );
    }

    createApiExtend() {
        this.apiExtendObject = {};

        for( let ae of this.hooks[CoreConstants.APIEXTEND_HOOK] ) {
            this.apiExtendObject[ae.Name] = ae.Handler();
        }
    }

    GetApiExtendObject() {
        if ( !this.apiExtendObject || MantraUtils.Underscore.isEmpty(this.apiExtendObject) ) {
            this.createApiExtend();
        }
        
        return this.apiExtendObject;
    }

    async checkMantraIsInitialized( MantraAPI ) {
        const mantraDB = MantraDB(global.Mantra.MantraConfig.getEntitiesConfiguration());
        const isMantraInitialized = await mantraDB.IsMantraInitialized();

        if ( !isMantraInitialized ) {
            await this.initializeComponents( MantraAPI );
            await mantraDB.SetInitialized();
        }
    }

    // Call onInitialize() on each component if present
    async initializeComponents( MantraAPI ) {
        await this.iterateOverComponents( async (cmpInstance, componentName) => {
            if ( cmpInstance.Install && cmpInstance.Install.onInitialize ) {
                try {
                    await cmpInstance.Install.onInitialize( MantraAPI );
                } catch(err) {
                    MantraConsole.error( `Exception calling onInitialize on component ${componentName}. ${err}` );
                }

            }
        });
    }
    
    // Call onStart() on each component
    async callOnStartComponents( mantraAPI ) {
        // Start core components first to initialize some useful apis for the app components
        await this.iterateOverComponents( async (cmpInstance, componentName) => {
            if ( CoreConstants.CORE_COMPONENTS.includes(componentName) ) {
                try {
                    await cmpInstance.Start.onStart(mantraAPI);
                } catch(err) {
                    MantraConsole.error( `Exception calling onStart on component ${componentName}. ${err}` );
                }
            }
        });

        await this.iterateOverComponents( async (cmpInstance, componentName) => {
            if ( !CoreConstants.CORE_COMPONENTS.includes(componentName) ) {
                try {
                    await cmpInstance.Start.onStart(mantraAPI);
                } catch(err) {
                    MantraConsole.error( `Exception calling onStart on component ${componentName}. ${err}` );
                }
            }
        });
    }

    // Call onStop() on each component
    async callOnStopComponents( mantraAPI ) {
        await this.iterateOverComponents( async (cmpInstance, componentName) => {
            if ( cmpInstance.Start.onStop ) {
                try {
                    await cmpInstance.Start.onStop( mantraAPI );
                } catch(err) {
                    MantraConsole.error( `Exception calling onStop on component ${componentName}. ${err}` );
                }
            }
        });
    }

    async checkOnStartupHealth( MantraAPI ) {   
        await this.iterateOverComponents( async (cmpInstance, componentName) => {
            if ( cmpInstance.Start.onCheckStartupHealth ) {
                try {
                    await cmpInstance.Start.onCheckStartupHealth(MantraAPI);
                } catch(err) {
                    MantraConsole.error( `Exception calling onCheckStartupHealth on component ${componentName}. ${err}` );
                }
            }
        });
    }

    async callOnCheckHealthComponents( mantraAPI ) {
        await this.iterateOverComponents( async (cmpInstance,componentName) => {
            if ( cmpInstance.Start.onCheckHealth ) {
                MantraConsole.info(`Checking health for component ${componentName}`, false);

                try {
                    await cmpInstance.Start.onCheckHealth( mantraAPI );                    
                } catch(err) {
                    MantraConsole.error( `Exception calling onCheckHealth on component ${componentName}. ${err}` );
                }
            }
        });
    }

    // Call onServerStarted() on each component
    async callOnServerStartedComponents( app, mantraAPI ) {
        await this.iterateOverComponents( async (cmpInstance, componentName) => {
            if ( cmpInstance.Start.onServerStarted ) {
                try {
                    await cmpInstance.Start.onServerStarted( app, mantraAPI );
                } catch(err) {
                    MantraConsole.error( `Exception calling onServerStarted on component ${componentName}. ${err}` );
                }
            }
        });
    }

    // call onSystemStarted on each component
    async systemStarted( mantraAPI ) {
        await this.iterateOverComponents( async (cmpInstance, componentName) => {
            if ( cmpInstance.Start.onSystemStarted ) {
                try {
                    await cmpInstance.Start.onSystemStarted( mantraAPI );
                } catch(err) {
                    MantraConsole.error( `Exception calling onSystemStarted on component ${componentName}. ${err}` );
                }
            }
        });
    }

    /*
     * Index some hooks by name so that improving performance when retrieving them
     */
    indexHooks() {
        for( const block of this.hooks[CoreConstants.BLOCK_HOOK] ) {
            this.indexedBlocks[ block.BlockName ] = block;
        }
        
        for( const post of this.hooks[CoreConstants.POST_HOOK] ) {
            this.indexedPosts[ `/${post.Component}/${post.Command}` ] = post;
        }

        for( const view of this.hooks[CoreConstants.VIEW_HOOK] ) {
            this.indexedViews[ `/${view.Component}/${view.Command}` ] = view;
        }

        for( const resource of this.hooks[CoreConstants.GET_HOOK] ) {
            this.indexedGets[ `/${resource.Component}/${resource.Command}` ] = resource;
        }

        for( const ac of this.hooks[CoreConstants.ACCESSCONDITION_HOOK] ) {
            this.indexedAccessConditions[ac.Name] = ac;
        }

        for( const pr of this.hooks[CoreConstants.PREREQUEST_HOOK] ) {
            this.indexedPreRequests[pr.Name] = pr;
        }

        for( const ce of this.hooks[CoreConstants.EXTEND_HOOK] ) {
            if ( !this.indexedComponentExtendByType[ce.Type] ) {
                this.indexedComponentExtendByType[ce.Type] = [];
            }

            this.indexedComponentExtendByType[ce.Type].push( ce );
        }
    }

    /*
     * Return array of middlewares ordered by their weight. If weight property is missing, 0 is the default
     */
    getMiddlewaresOrderedByWeight() {
        this.hooks[CoreConstants.MIDDLEWARE_HOOK].forEach( (m) => {
            if ( m.Weight == null ) m.Weight = 0;
        });

        return MantraUtils.Underscore.sortBy( this.hooks[CoreConstants.MIDDLEWARE_HOOK], "Weight" );
    }

    GetPost( componentName, command ) {
        return this.indexedPosts[`/${componentName}/${command}`];
    }

    GetView( componentName, command ) {
        let index = `/${componentName}/${command}`;
        let view = this.indexedViews[index];

        if ( !view ) { // Check if "*" is set as command for this view
            index = `/${componentName}/*`;
            view = this.indexedViews[index];
        }
     
        return view; 
    }

    ExistsBlock( componentName, blockName) {
        for( const block of this.hooks[CoreConstants.BLOCK_HOOK]) {
            if ( block.Component == componentName && block.BlockName == blockName ) {
                return true;
            }
        }

        return false;
    }

    ExistsView( componentName, command ) {
        let index = `/${componentName}/${command}`;
        let view = this.indexedViews[index];

        if ( !view ) { // Check if "*" is set as command for this view
            index = `/${componentName}/*`;
            view = this.indexedViews[index];
        }
     
        return view != undefined;
    }

    GetGet( componentName, command ) {
        let index = `/${componentName}/${command}`;
        let get = this.indexedGets[index];

        if ( !get ) { // Check if "*" is set as command for this view
            index = `/${componentName}/*`;
            get = this.indexedGets[index];
        }
     
        return get; 
    }

    ExistsGet( componentName, command ) {
        let index = `/${componentName}/${command}`;
        let get = this.indexedGets[index];

        if ( !get ) { // Check if "*" is set as command for this view
            index = `/${componentName}/*`;
            get = this.indexedGets[index];
        }
     
        return get != undefined; 
    }

    ExistsAccessCondition( name ) {
        return this.indexedAccessConditions[name] !== undefined;
    }

    GetAccessCondition( name ) {
        return this.indexedAccessConditions[name];
    }

    GetPreRequest( name ) {
        return this.indexedPreRequests[name];
    }

    GetExtendsByType( type ) {
        return this.indexedComponentExtendByType[type];
    }
    
    async getHtmlBlocks(MantraAPI, blocksToLoad, req, res) {
        let blocks = [];

        for( let i = 0; i < blocksToLoad.length; i++ ) {
            let blockName = blocksToLoad[i];
            
            if ( this.indexedBlocks[blockName] ) { // May be a mustache variable, not a block                
                let b = this.indexedBlocks[blockName];
                let shouldRender = true;

                if ( b.AccessCondition ) {
                    let ac = await AccessConditions.checkAC( b.AccessCondition, req, res );
                    shouldRender = ac.allowed;

                    if ( ac.onCancel ) await ac.onCancel(MantraAPI);

                    // Pending, if false, check if ac should be called a false callback functions
                }

                if ( shouldRender ) {
                    if ( b.IsStatic == true && StaticBlocksCache.Exists( getStaticBlockCacheKey(b)) ) {
                        blocks[b.BlockName] = StaticBlocksCache.Get(`blockstaticcache${b.Component}${b.BlockName}`);
                    } else {
                        const pathToBlockFile = await MantraAPI.GetAssetsLocations().GetBlockLocation( b.Component, b.BlockName );
                        let newBlock = {
                            blockName: b.BlockName,
                            componentName: b.Component,
                            Css: b.Css,
                            Js: b.Js
                        }                   
    
                        if ( pathToBlockFile != "" ) {
                            newBlock.pathToBlockFile = pathToBlockFile;
                            newBlock.blockHtml = await MantraAPI.Invoke("static.getfile", { fullPathToFile: pathToBlockFile } );
    
                            if ( b.RenderHandler ) {
                                newBlock.blockHtml = await b.RenderHandler( MantraAPI, newBlock.blockHtml, b.BlockName );                            
                            }
                
                            blocks[b.BlockName] = newBlock;        
                            checkIfAddToBlockCache( b, newBlock );
                        } else {
                            if ( b.RenderHandler ) {
                                newBlock.pathToBlockFile = "";
                                newBlock.blockHtml = await b.RenderHandler( MantraAPI, newBlock.blockHtml, b.BlockName );                
    
                                blocks[b.BlockName] = newBlock;            
                                checkIfAddToBlockCache( b, newBlock );
                            } else {
                                await MantraAPI.LogError(`Block file for ${b.BlockName} doesn't exist or it is not accesible`);
                            }
                        }                    
                    }
                } else {
                    blocks[b.BlockName] = "";
                }
            }
        }

        return blocks;
    }

    Register( hook, data ) {
        this.hooks[hook].push( data );
    }

    GetComponentExtends() {
        return this.hooks[CoreConstants.EXTEND_HOOK];
    }

    IsPostSecurized( path ) {
        if ( this.indexedPosts[path] ) {
            const postHook = this.indexedPosts[path];

            return typeof postHook.Securized != 'undefined' ? postHook.Securized : false;
        }

        throw Error(`Post not registered: ${path}`);
    }

    IsGet( path ) {
        return this.indexedGets[path] ? true : false;
    }

    IsGetSecurized( path ) {
        if ( this.indexedGets[path] ) {
            const postHook = this.indexedGets[path];

            return postHook.Securized ? postHook.Securized : false;
        }

        throw Error(`Get not registered: ${path}`);
    }

    async InvokeAPI( MantraAPI, componentName, method, data ) {
        let apiDefinition = this.apiHandlers[`${componentName}.${method}`]; 

        if ( apiDefinition == null ) throw Error(`Unknown API of "${fullApiName}"`);

        if ( apiDefinition.DataValidationSchema != null ) {
            const vresult = (new jsonValidator()).validate( data, apiDefinition.DataValidationSchema );

            if ( vresult.errors.length != 0 ) throw Error(`Data validation error calling ${fullApiName}`); 
        }

        return this.apiHandlers[fullApiName].APIHandler(MantraAPI, data);
    }

    async Invoke( MantraAPI, fullApiName, data ) {
        const apiDefinition = this.apiHandlers[fullApiName]; 

        if ( apiDefinition == null ) throw Error(`Unknown API of "${fullApiName}"`);

        if ( apiDefinition.DataValidationSchema != null ) {
            const vresult = (new jsonValidator()).validate( data, apiDefinition.DataValidationSchema );

            if ( vresult.errors.length != 0 ) throw Error(`Data validation error calling ${fullApiName}`); 
        }

        return this.apiHandlers[fullApiName].APIHandler(MantraAPI, data)
    }
    
    existsApi( fullApiName ) {
        return this.apiHandlers[fullApiName] != null;
    }

    async EmitEvent( eventName, eventData ) {
        for( const ev of this.hooks[CoreConstants.EVENT_HOOK] ) {
            if ( ev.EventName == eventName ) {
                try {
                    await ev.EventHandler( eventData );
                } catch(err) {
                    eventData.MantraAPI.LogError( `Error when emitting event ${ev.EventName}`, err );
                }
            }
        };
    }

    async checkIfResourcesExistAndResolvePaths() {
        const MantraAPI = global.Mantra.MantraAPIFactory();
        const hooksToCheck = this.hooks[CoreConstants.VIEW_HOOK].concat(this.hooks[CoreConstants.BLOCK_HOOK]);

        for (const hook of hooksToCheck) {
            if (hook.Css) {
                let cssFiles = typeof hook.Css == 'object' ? hook.Css : [hook.Css];

                for (let cssFile of cssFiles) {
                    let pathToResource = `/${hook.Component}/css/${cssFile}.css`;
                    let resource = await MantraAPI.Invoke("static.iscomponentresource", pathToResource);

                    if ( !resource.isComponentResource ) {
                        let parts = MantraUtils.ParseComponentPath( cssFile );

                        if (parts) {
                            pathToResource = `/${parts.component}/css/${parts.asset}.css`;
                            resource = await MantraAPI.Invoke("static.iscomponentresource", pathToResource);

                            if ( !resource.isComponentResource ) {
                                MantraConsole.warning( `Warning: unable to locate component resource ${pathToResource}`);
                            }
                        }
                    }            
                }
            }

            if (hook.Js) {
                let jsFiles = typeof hook.Js == 'object' ? hook.Js : [hook.Js];

                for (let jsFile of jsFiles) {
                    let pathToResource = `/${hook.Component}/js/${jsFile}.js`;
                    let resource = await MantraAPI.Invoke("static.iscomponentresource", pathToResource);

                    if ( !resource.isComponentResource ) {
                        let parts = MantraUtils.ParseComponentPath( jsFile );

                        if (parts) {
                            pathToResource = `/${parts.component}/js/${parts.asset}.js`;
                            resource = await MantraAPI.Invoke("static.iscomponentresource", pathToResource);

                            if ( !resource.isComponentResource ) {
                                MantraConsole.warning( `Warning: unable to locate component resource ${pathToResource}`);
                            }
                        }
                    }
                }
            }
        }
    }

    async iterateOverComponents( fnc ) {
        const components = global.Mantra.ComponentsLoader.getComponents();
        
        for( const componentName of Object.keys(components) ) {
            await fnc( components[componentName].component, componentName );
        }
    }

    async checkComponentsAreUpdated() {
        const mantraDB = MantraDB(global.Mantra.MantraConfig.getEntitiesConfiguration());
        const componentsEnabled = await global.Mantra.ComponentsLoader.getComponentsNamesLoaded();
        let componentsToUpdate = 0;

        for(const componentName of componentsEnabled) {
            if ( !global.Mantra.MantraConfig.InactiveComponents.includes(componentName) ) {
                let componentEntity = await mantraDB.GetComponentByName(componentName);
                let componentLoaded = global.Mantra.ComponentsLoader.getComponentByName(componentName);

                if ( !componentLoaded ) {
                    MantraConsole.error( `Unable to load component ${componentName}`);
                } else if ( componentEntity.version != componentLoaded.config.version ) {
                    MantraConsole.warning(`Component '${componentEntity.name}' should be updated from ${componentEntity.version} version to ${componentLoaded.config.version} version`, false)
                    componentsToUpdate++;
                }
            }
        }

        if ( componentsToUpdate ) {
            MantraConsole.info("Run 'mantrad update' to update components", false);
        }

        return componentsToUpdate;
    }
}

/*
 * Checks if any component configuration is missing in site configuration.
 * If so, set in site configuration its default config
 */
function loadDefaultComponentsConfigurations() {
    let cmps = global.Mantra.ComponentsLoader.getComponents();
    let mc = global.Mantra.MantraConfig;

    for( let cmpName of Object.keys(cmps) ) {
        const component = cmps[cmpName]

        if ( component.config.defaultconfig && !mc.ComponentsConfig[cmpName] ) {
            global.Mantra.MantraConfig.ComponentsConfig[cmpName] = component.config.defaultconfig;
            
            MantraConsole.warning( `Inhering default configuration for component '${cmpName}'` );
        }
    }
}

function getStaticBlockCacheKey(block) {
    return `blockstaticcache${block.Component}${block.BlockName}`;
}

function checkIfAddToBlockCache( block, newBlock ) {
    if ( block.IsStatic == true ) {
        StaticBlocksCache.Add( getStaticBlockCacheKey(block), newBlock);
    }
}

module.exports = () => {
    singleBootstrap = new Bootstrap();
  
    return singleBootstrap;
};