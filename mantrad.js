#!/usr/bin/env node

/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const Path = require("path");

require("gimport").init(__dirname);

const CoreConstants = global.gimport("coreconstants");
const MantradProcess = global.gimport("mantradprocess");
const MantradKeys = global.gimport("mantradkeys");
const MantraConfig = global.gimport("mantraconfig");
const MantraConsole = global.gimport("mantraconsole");
const MantraStartup = global.gimport("mantrastartup")();
const NodeVersionChecker = global.gimport("nodeversionchecker");

/*
 * Checks current node version compatibility
 */
if ( !NodeVersionChecker.CheckNodeVersion( CoreConstants.NODESUPPORTEDVERSIONS ) ) {
    MantraConsole.error( `Current node version of ${process.version} no supported`);
    MantraConsole.error( `Only supported ${CoreConstants.NODESUPPORTEDVERSIONS} node versions`)
}

/*
 * Starts a mantra application with
 * $ mantrad <command> [0..n params]
 */
(async () => {
    const args = getArgs();
    const existsMantraConfigFile = await MantraConfig.ExistsConfigFile(getFullPathToConfigFile());

    await checkMainGuards();

    switch( args.command ) {
        case '--help':
        case '-h': {
            if ( existsMantraConfigFile ) {
                const config = await loadMantraConfig();
            
                await MantraStartup.showHelp( config );
            } else {
                await MantraStartup.showDefaultHelp();
            }

            global.gimport("fatalending").exit();
        }
        case 'startapp': {
            const appName = args.arg1 ? args.arg1 : "";

            MantradProcess.fork(__dirname, appName);
            await MantradKeys.configureKeys( __dirname, [appName] );
        }
        break;
        case 'startall': {
            const config = await loadMantraConfig();
            const apps = config.Apps ? config.Apps : { main: {} };

            for( const appName of Object.keys(apps) ) {
                MantradProcess.fork(__dirname, appName);
                await MantradKeys.configureKeys( __dirname, [appName] );
            }
        }
        break;
        case 'install': {
            const config = await loadMantraConfig();

            await MantraStartup.install(config, args);
        }
        break;
        case 'version':
        case '-v': {
            await MantraStartup.showVersion();
            global.gimport("fatalending").exit();
        }
        case 'new-project': {
            await MantraStartup.newProject();
            global.gimport("fatalending").exit();
        }
        case 'npm-install': {
            const config = await loadMantraConfig();
            
            if ( args.arg1 == undefined ) {
                await global.gimport("npminstaller").runNpmInstall(config); 
            } else {
                await global.gimport("npminstaller").runNpmInstallForComponent(config, args.arg1); 
            }
            global.gimport("fatalending").exit();
        }
        default: {
            if ( existsMantraConfigFile ) {
                const config = await loadMantraConfig();
    
                await MantraStartup.performCommand(config, args);
            } else {
                MantraConsole.info(`No detected in this folder Mantra config file (${CoreConstants.MANTRACONFIGFILE}).`, false);
            }
            
            global.gimport("fatalending").exit();
        }
    }

    async function loadMantraConfig() {
        return MantraConfig.LoadFullConfig(Path.join(__dirname, CoreConstants.CORECOMPONENTSFOLDER), 
            getFullPathToConfigFile(), 
            process.cwd());
    }

    function getFullPathToConfigFile() {
        return Path.join(process.cwd(), CoreConstants.MANTRACONFIGFILE);
    }

    function getArgs() {
        let args = {};

        args.hasArgs = process.argv.length > 2;

        if ( args.hasArgs ) {
            args.command = process.argv.length == 2 ? "--help" : process.argv[2];
            args.arg1 = process.argv[3] ? process.argv[3] : undefined;
            args.arg2 = process.argv[4] ? process.argv[4] : undefined;
        }

        return args;
    }

    async function checkMainGuards() {
        if ( existsMantraConfigFile && !MantraConfig.IsJsonFileValid(getFullPathToConfigFile()) ) {
            global.gimport("fatalending").exitByError(`${CoreConstants.MANTRACONFIGFILE} json file format invalid. Check format and properties according to documentation`);
        }
    
        if ( !args.hasArgs && !existsMantraConfigFile ) {
            await MantraStartup.showDefaultHelp();
            global.gimport("fatalending").exit();
        }
        
        if ( !args.hasArgs && existsMantraConfigFile ) {
            const config = await loadMantraConfig();
            await MantraStartup.showHelp( config );
            global.gimport("fatalending").exit();
        }
    
        if ( !existsMantraConfigFile && ["startapp", "install", "npm-install"].indexOf(args.command) != -1 ) {
            MantraConsole.info(`No detected in this folder Mantra config file (${CoreConstants.MANTRACONFIGFILE}).`, false);
            global.gimport("fatalending").exit();
        }
    }
})();