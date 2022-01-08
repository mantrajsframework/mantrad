"use strict";

const Exec = require('child_process').exec;
const Path = require("path");

const MantraConsole = global.gimport("mantraconsole");
const MantraServer = global.gimport("mantraserver");

const ComponentsLoader = global.gimport("componentsloader")();

module.exports = {
    /*
     * Looks for all components in the project and un 'npm install' for those
     * ones which have package.json file.
     */
    runNpmInstall: async (mantraConfig) => {
        MantraServer.initGlobal(mantraConfig);
        const api = global.Mantra.MantraAPIFactory();
        const components = await getComponentsWithPackageFile(api, mantraConfig);
        
        if (components.lengt == 0 ) {
            MantraConsole.info( 'No components with Node dependencies detected' );
            return;
        }

        let answer = await MantraConsole.question('Npm install for components with npm dependencies? [Y]/N? ');
    
        if (answer == "Y" || answer == "") {    
            for (const component of components) {
                const componentPath = Path.join( component.path, component.filename );
                await execNpmInstall( component, componentPath );
            }
        }
    },

    runNpmInstallForComponent: async (mantraConfig, componentName, ask = true ) => {
        if ( !(ComponentsLoader.existsComponentLocation( componentName, mantraConfig.getComponentsLocations() )) ) {
            MantraConsole.warning( `Component '${componentName}' not found in components locations: ${mantraConfig.ComponentsLocations}` );
            return;
        }

        if ( ask ) {
            let answer = await MantraConsole.question(`Npm install for component '${componentName}' with npm dependencies? [Y]/N? `);

            if ( !(answer == "Y" || answer == "") ) return;
        }
    
        MantraServer.initGlobal(mantraConfig);
        const api = global.Mantra.MantraAPIFactory();

        const component = ComponentsLoader.getComponentLocation(componentName, mantraConfig.getComponentsLocations());
        const componentPath = Path.join( component.path, component.filename );
        const hasNodeDependencies = await existsPackageFile(api, componentPath);

        if (hasNodeDependencies) {
            await execNpmInstall( component, componentPath );
        } else {
            MantraConsole.warning( "The component has no Node dependencies" );
        }    
    },

    getComponentsWithNpmDepedencies: async (mantraConfig) => {
        MantraServer.initGlobal(mantraConfig);
        const api = global.Mantra.MantraAPIFactory();

        return getComponentsWithPackageFile( api, mantraConfig );
    },

    hasComponentNpmDependencies: async (mantraConfig, componentName) => {
        const fullPathsComponentsLocations = mantraConfig.getComponentsLocations();

        if ( !(ComponentsLoader.existsComponentLocation( componentName, fullPathsComponentsLocations )) ) {
            throw Error( `Component '${componentName}' not found in components locations: ${mantraConfig.ComponentsLocations}` );
        }
        MantraServer.initGlobal(mantraConfig);
        
        const api = global.Mantra.MantraAPIFactory();
        const component = ComponentsLoader.getComponentLocation(componentName, fullPathsComponentsLocations );
        const componentPath = Path.join( component.path, component.filename );
     
        return await existsPackageFile(api, componentPath);
    }
};

async function execNpmInstall( component, componentPath ) {
    const componentName = component.filename;
    const command = `(cd ${componentPath} && rm -rfd node_modules && npm install)`; // a)
    
    try {
        MantraConsole.info(`npm installing component '${componentName}'...`);
        
        const npmMessage = await ExecShellCommand(command);
        
        MantraConsole.info('npm says...', false);
        MantraConsole.rawInfo(npmMessage);
        MantraConsole.info(`npm installing ended for component '${componentName}'`);
    } catch (error) {
        MantraConsole.error(`npm installing failed for component '${componentName}' for command '${command}'`);
        MantraConsole.error(`npm says... ${error}`);
    }
}

async function existsPackageFile( MantraAPI, fullPathToComponent ) {
    return MantraAPI.Utils.FileExists( Path.join(fullPathToComponent, 'package.json') );
}

function ExecShellCommand(cmd) {
    return new Promise((resolve, reject) => {
        Exec(cmd, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve(stdout ? stdout : stderr);
            }
        });
    });
}

async function getComponentsWithPackageFile(api, mantraConfig) {
    const components = ComponentsLoader.getComponentsLocations(mantraConfig.getComponentsLocations());
    let npmComponents = [];

    for (const component of components) {
        const componentPath = Path.join(component.path, component.filename);

        if (await existsPackageFile( api, componentPath )) {
            npmComponents.push( component );
        }
    }

    return npmComponents;
}

/* Notes
 a) The shell commands are used inside () to create a "subshell". If not, then npm dependencies are installed in mantra root directory.
*/