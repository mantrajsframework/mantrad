#!/usr/bin/env node

"use strict";

const Path = require("path");

require("gimport").init(__dirname);

const CoreConstants = global.gimport("coreconstants");
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

    if ( existsMantraConfigFile && !MantraConfig.IsJsonFileValid(getFullPathToConfigFile()) ) {
        global.gimport("fatalending").exitByError(`${CoreConstants.MANTRACONFIGFILE} json file format invalid. Check format and properties according to documentation`);
    }

    if ( !args.hasArgs && !existsMantraConfigFile ) {
        await MantraStartup.showDefaultHelp();
        MantraConsole.info(`No detected Mantra config file (${CoreConstants.MANTRACONFIGFILE})`, false);
        global.gimport("fatalending").exit();
    }
    
    if ( !args.hasArgs && existsMantraConfigFile ) {
        const config = await loadMantraConfig();
        await MantraStartup.showHelp( config );
        global.gimport("fatalending").exit();
    }

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
            const config = await loadMantraConfig();

            await MantraStartup.startApp(config, args);
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
                MantraConsole.warning( `Unknown command of ${args.command}`, false);
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
})();