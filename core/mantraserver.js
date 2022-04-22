/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const { nanoid } = require("nanoid");

const componentsLoader = new global.gimport("componentsloader");
const mantraAPI = global.gimport("mantraapi");
const MantraConsole = global.gimport("mantraconsole");
const InitialEventsCaller = global.gimport("initialeventscaller");

let App = undefined;

class MantraServer {
    /*
     * Initialize global Mantra vars
     * Receives the content of mantraconfig.json file.
     * If loadAllComponents is true, then all enabled components ared loaded
     */
    initGlobal(mantraConfig, loadAllEnabledComponents = false) {
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

            global.Mantra.MantraConfig.LoadAllEnabledComponents = loadAllEnabledComponents;
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
        
        await InitialEventsCaller.callOnSystemStarted( Mantra );
        await InitialEventsCaller.checkOnStartupHealth( Mantra );
    
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
                    MantraConsole.info( `App server running & listening at port ${mc.Port}`);
                    MantraConsole.info("Double Ctrl+C to close. Double Ctrl+R to restart");
            }).on('error', (err) => {
                if ( err.code == 'EADDRINUSE' ) {
                    MantraConsole.error( `Seems that port ${mc.Port} is already used!`);
                } else {
                    MantraConsole.error(`Something bad happened: ${err.code}, ${String.fromCodePoint(0x1F625)}`);
                    MantraConsole.error('And here is the error...');
                    MantraConsole.info(err,false);
                    MantraConsole.error("Don't worry, you can fix it");
                }
                global.gimport("fatalending").exit();
            });
        }
    }
}

function isViewOrPostServiceActive(mantraConfig) {
    return mantraConfig.isServiceActive("view") || mantraConfig.isServiceActive("post") || mantraConfig.isServiceActive("get");
}

function getSecret() {
    return `${nanoid(12)}-${nanoid(12)}-${nanoid(12)}-${nanoid(12)}`;
}

module.exports = new MantraServer();