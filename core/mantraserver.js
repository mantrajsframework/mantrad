"use strict";

const componentsLoader = new global.gimport("componentsloader");
const mantraAPI = global.gimport("mantraapi");
const MantraConsole = global.gimport("mantraconsole");

let App = undefined;

class MantraServer {
    /*
     * Initialize global Mantra vars
     */
    initGlobal(mantraConfig) {
        if (!global.Mantra) {
            global.Mantra = {
                MantraConfig: mantraConfig,
                Bootstrap: global.gimport("bootstrap")(),
                ComponentsLoader: componentsLoader(),
                MantraAPIFactory: (req, res) => {
                    let mantraApiObj = mantraAPI(global.Mantra.ComponentsLoader, global.Mantra.Bootstrap, req, res);

                    // Extend API with ApiExtend hooks
                    mantraApiObj.Extend = global.Mantra.Bootstrap.GetApiExtendObject();

                    return mantraApiObj;
                },
                Initialized: false // Indicates if the project has been initialized
            }
        }
    }

    async startComponents() {
        return global.Mantra.Bootstrap.startComponents();
    }

    /* 
     * Initializes all components and bootstrap processes
     */
    async initialize( mantraConfig ) {            
        this.initGlobal( mantraConfig );

        let api = global.Mantra.MantraAPIFactory();
        let coreConfig = api.GetComponentConfig("core");
        const mc = global.Mantra.MantraConfig;
        
        if ( isViewOrPostServiceActive(mc) ) {
            //const bodyParser = require("body-parser");
            const Express = require("express");
            App = Express();
            
            App.disable('view cache');
            App.use( require("express-session")( { secret: getSecret(), resave: true, saveUninitialized: true, cookie: { maxAge: 60*1000*60*24*30 }} ) ); // Session cookie expires in 40 days
            App.use( Express.json() );
            App.use( Express.urlencoded({ limit: '5mb', extended: true }) );
            App.use( require("cookie-parser")() );
            
            if ( coreConfig.compressresponses && coreConfig.compressresponses == true ) {
                App.use( require("compression")() );
            }

            await this.startComponents();
            await global.Mantra.Bootstrap.startServer( App, api );
        } else {
            await this.startComponents();
        }
        
        await global.Mantra.Bootstrap.systemStarted( api );
        await global.Mantra.Bootstrap.checkOnStartupHealth( api );
    
        api = global.Mantra.MantraAPIFactory(); // Force to create the object with all stuff already created (like Extend properties)
        await api.EmitEvent( "system.startup", {} );

        if ( isViewOrPostServiceActive(mc) && coreConfig.compressresponses && coreConfig.compressresponses == true ) {
            await MantraConsole.info( 'Compression enabled in server' );
        }

        global.Mantra.Initialized = true;
    }
    
    /*
     * Initializes all components and bootstrap processes and start server
     */
    async startServer( mantraConfig ) { 
        await this.initialize( mantraConfig );
        const mc = global.Mantra.MantraConfig;

        if ( isViewOrPostServiceActive(mc) ) {
            return App.listen( mc.Port, () => {
                MantraConsole.info( `App server running & listening in port ${mc.Port}`)
            });
        }
    }
}

function isViewOrPostServiceActive(mantraConfig) {
    return mantraConfig.isServiceActive("view") || mantraConfig.isServiceActive("post");
}

function getSecret() {
    const ShortId = require("shortid");

    return `${ShortId.generate()}-${ShortId.generate()}-${ShortId.generate()}-${ShortId.generate()}`;
}

module.exports = new MantraServer();