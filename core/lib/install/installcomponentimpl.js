/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */

"use strict";

const ComponentInstaller = global.gimport("componentinstaller");
const CoreCommandsUtils = global.gimport("corecommandsutils");
const CoreConstants = global.gimport("coreconstants");
const MantraConsole = global.gimport("mantraconsole");
const MantraDB = global.gimport("mantradb");
const NpmInstaller = global.gimport("npminstaller");

module.exports = {
    Install: async ( Mantra, componentName, askQuestion ) => {
        let installed = false;
        const componentNameToInstall = CoreCommandsUtils.ExtractComponentName(componentName);
    
        if ( await ExistsComponentInProject(componentNameToInstall) ) {
            MantraConsole.warning( `Component '${componentNameToInstall}' is already installed.` );
            MantraConsole.warning( `If you are installing a different version, uninstall it first.` );
        } else {
            let answer = "Y";
    
            if (askQuestion) {
                answer = await MantraConsole.question(`Install component ${componentNameToInstall} [Y]/N? `);
            }
    
            if (answer == "Y" || answer == "") {
                installed = await InstallComponent(Mantra, componentNameToInstall, true);
    
                if (installed) {
                    MantraConsole.info(`Remember to add the component name to 'DefaultComponents' at ${CoreConstants.MANTRACONFIGFILE} if will be a default component.`, false);
                }
            }
    
            if ( installed ) {
                await EnableComponentImpl( Mantra, componentNameToInstall );
            }
        }
        
        return installed;
    }    
}

async function EnableComponentImpl(Mantra, componentName) {
    if ( !( await ExistsComponentInProject(componentName) ) ) {
        MantraConsole.warning( `Component '${componentName}' it is not installed in this project.` );
    } else {
        if ( (await IsComponentEnabled(componentName) ) ) {
            MantraConsole.warning( `Component '${componentName}' it already enabled.` );
        } else {
            const answer = await MantraConsole.question(`Enable component ${componentName} [Y]/N? `);
    
            if ( answer == "Y" || answer == "" ) {
                await EnableComponent(Mantra, componentName);
            }      
        }
    }
}

async function InstallComponent( MantraAPI, componentName, askIfNpmNeeded = false ) {
    try {
        // Check if component has Node dependencies
        if (await NpmInstaller.hasComponentNpmDependencies(global.Mantra.MantraConfig, componentName)) {
            MantraConsole.info( 'Component has Node dependencies. Npm installing for the component...');
            await NpmInstaller.runNpmInstallForComponent(global.Mantra.MantraConfig, componentName, askIfNpmNeeded );
        }

        let ci = ComponentInstaller( global.Mantra.MantraConfig );
        await ci.InstallComponent( componentName );

        MantraConsole.info("Component installed with success");

        return true;
    }
    catch(error) {
        MantraConsole.error(error.message);
        return false;
    }
}

async function ExistsComponentInProject( componentName ) {
    const components = await GetComponentsInstalled();
    const componentNameToCheck = CoreCommandsUtils.ExtractComponentName(componentName);
    
    for( const component of components ) {
        if ( component.name == componentNameToCheck ) return true;
    }

    return false;
}

async function GetComponentsInstalled() {
    const entitiesConfig = global.Mantra.MantraConfig.getEntitiesConfiguration();
    const mantraDB = MantraDB(entitiesConfig);
    
    return mantraDB.GetAllComponents();
}

async function IsComponentEnabled(componentName) {
    const components = await GetComponentsInstalled();

     for( const component of components ) {
        if ( component.name == componentName ) return component.enabled;
    }

    return false;
}

async function EnableComponent( MantraAPI, componentName ) {
    try {        
        let ci = ComponentInstaller(global.Mantra.MantraConfig);
        await ci.EnableComponent( componentName );

        MantraConsole.info("Component enabled with success");
    }
    catch(error) {
        MantraConsole.error(error.message);
    }
}