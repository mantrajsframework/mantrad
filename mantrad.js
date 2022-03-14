#!/usr/bin/env node

/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const Path = require("path");

require("gimport").init(__dirname);

const CoreConstants = global.gimport("coreconstants");
const MantradArgs = global.gimport("mantradargs");
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
    const args = await MantradArgs.getArgs();
    const existsMantraConfigFile = await MantraConfig.ExistsConfigFile(Path.join(MantradArgs.getRootProjectFolder(), CoreConstants.MANTRACONFIGFILE));
    let config = {};

    if ( existsMantraConfigFile ) {
        await checkMainGuards();
        config = await MantraConfig.LoadFullConfigFromProject( __dirname, MantradArgs.getRootProjectFolder() )
    }

    if ( !existsMantraConfigFile && ['startapp','startall','install','npm-install'].includes(args.command) ) {
        MantraConsole.info( `This command should be executed inside a project folder. No ${CoreConstants.MANTRACONFIGFILE} file found.`);
        global.gimport("fatalending").exit();
    }

    switch( args.command ) {
        case '--help':
        case '-h': {
            if ( existsMantraConfigFile ) {
                await MantraStartup.showHelp( config );
            } else {
                await MantraStartup.showDefaultHelp();
            }

            global.gimport("fatalending").exit();
        }
        case 'startapp': {
            const appName = args.arg1 ? args.arg1 : ( config.Apps ? Object.keys(config.Apps)[0] : "main" );
            MantraConsole.setAppName( appName );

            MantradProcess.fork( __dirname, appName );
            await MantradKeys.configureKeys( __dirname, [appName] );
        }
        break;
        case 'startall': {
            const apps = config.Apps ? config.Apps : { main: {} };

            for( const appName of Object.keys(apps) ) {
                MantradProcess.fork(__dirname, appName);
            }
            await MantradKeys.configureKeys( __dirname, Object.keys(apps) );
        }
        break;
        case 'install': {
            await MantraStartup.install(config, args);
        }
        break;
        case 'version':
        case '-v': {
            await MantraStartup.showVersion();
            global.gimport("fatalending").exit();
        }
        case 'download-project': {
            const DownloadProject = global.gimport("downloadproject");

            if ( args.hasArgs && args.arg1 ) {
                await DownloadProject.Download(args.arg1);
            } else {
                MantraConsole.info( "Project name missing. Use '$ mantrad download-project <project name>'", false);
            }

            global.gimport("fatalending").exit();
        }
        case 'new-project': {
            await MantraStartup.newProject();
            global.gimport("fatalending").exit();
        }
        case 'npm-install': {
            if ( args.arg1 == undefined ) {
                await global.gimport("npminstaller").runNpmInstall(config); 
            } else {
                await global.gimport("npminstaller").runNpmInstallForComponent(config, args.arg1); 
            }
            global.gimport("fatalending").exit();
        }
        default: {
            if ( existsMantraConfigFile ) {
                await MantraStartup.performCommand(config, args);
            } else {
                if ( args.hasArgs ) {
                    MantraConsole.warning("Uknown command or bad location", false );
                } else {
                    await MantraStartup.showDefaultHelp();
                }
            }
            
            global.gimport("fatalending").exit();
        }
    }

    async function checkMainGuards() {
        if ( existsMantraConfigFile && !MantraConfig.IsJsonFileValid(Path.join(MantradArgs.getRootProjectFolder(), CoreConstants.MANTRACONFIGFILE)) ) {
            global.gimport("fatalending").exitByError(`${CoreConstants.MANTRACONFIGFILE} json file format invalid. Check format and properties according to documentation`);
        }
    
        if ( !args.hasArgs && !existsMantraConfigFile ) {
            await MantraStartup.showDefaultHelp();
            global.gimport("fatalending").exit();
        }
        
        if ( !args.hasArgs && existsMantraConfigFile ) {
            const config = await MantraConfig.LoadFullConfigFromProject( __dirname, MantradArgs.getRootProjectFolder() );
            await MantraStartup.showHelp( config );
            global.gimport("fatalending").exit();
        }
    
        if ( !existsMantraConfigFile && ["startapp", "install", "npm-install"].indexOf(args.command) != -1 ) {
            MantraConsole.info(`No detected in this folder Mantra config file (${CoreConstants.MANTRACONFIGFILE}).`, false);
            global.gimport("fatalending").exit();
        }
    }
})();