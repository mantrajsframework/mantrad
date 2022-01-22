/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const componentsLoader = new global.gimport("componentsloader");
const mantraAPI = global.gimport("mantraapi");
const MantraConsole = global.gimport("mantraconsole");
const AppConditionsChecker = global.gimport("appconditionschecker");

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

        let Mantra = global.Mantra.MantraAPIFactory();
        const mc = global.Mantra.MantraConfig;

        
        if ( isViewOrPostServiceActive(mc) ) {
            const Express = require("express");
            App = Express();
            
            App.disable('view cache');
            App.use( require("express-session")( { secret: getSecret(), resave: true, saveUninitialized: true, cookie: { maxAge: 60*1000*60*24*30 }} ) ); // Session cookie expires in 40 days
            App.use( Express.json() );
            App.use( Express.urlencoded({ limit: '5mb', extended: true }) );
            App.use( require("cookie-parser")() );
            
            await this.startComponents();
            await global.Mantra.Bootstrap.startServer( App, Mantra );
        } else {
            await this.startComponents();
        }
        
        await AppConditionsChecker.checkConditionsBeforeStarting( Mantra, mc );
        await global.Mantra.Bootstrap.systemStarted( Mantra );
        await global.Mantra.Bootstrap.checkOnStartupHealth( Mantra );
    
        Mantra = global.Mantra.MantraAPIFactory(); // Force to create the object with all stuff already created (like Extend properties)
        await Mantra.EmitEvent( "system.startup", {} );

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
                MantraConsole.info( `App server running & listening at port ${mc.Port}`)
            });
        }
    }
}

function isViewOrPostServiceActive(mantraConfig) {
    return mantraConfig.isServiceActive("view") || mantraConfig.isServiceActive("post") || mantraConfig.isServiceActive("get");
}

function getSecret() {
    const ShortId = require("shortid");

    return `${ShortId.generate()}-${ShortId.generate()}-${ShortId.generate()}-${ShortId.generate()}`;
}

module.exports = new MantraServer();