/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const Chalk = require("chalk");

const AppConditionsChecker = global.gimport("appconditionschecker");
const ComponentInstaller = global.gimport("componentinstaller");
const CoreCommandsUtils = global.gimport("corecommandsutils");
const CoreConstants = global.gimport("coreconstants");
const DownloadComponent = global.gimport("downloadcomponent");
const InitialEventsCaller = global.gimport("initialeventscaller");
const InstallComponentImpl = global.gimport("installcomponentimpl");
const MantradArgs = global.gimport("mantradargs");
const MantraConsole = global.gimport("mantraconsole");
const MantraDB = global.gimport("mantradb");

module.exports = {
    InstallComponent: async (MantraAPI, componentName) => {
        await InstallComponentImpl.Install(MantraAPI, componentName, true);
        
        global.gimport("fatalending").exit();
    },

    UinstallComponent: async (MantraAPI, componentName) => {
        await UninstallComponentImpl(MantraAPI, componentName, true);
        
        global.gimport("fatalending").exit();
    },

    ReinstallComponent: async (Mantra, componentName) => {
        MantraConsole.info( "Remember: reinstalling a component involves remove its current model data repository.")

        const answer = await MantraConsole.question(`Reinstall component ${componentName} [Y]/N? `);

        if ( answer == "Y" || answer == "" ) {
            const uninstalled = await UninstallComponentImpl(Mantra, componentName, false);
    
            if ( uninstalled ) {
                await InstallComponentImpl.Install(Mantra, componentName, false);
            }
    
            MantraConsole.info( `Component ${componentName} re-installed with success`);
        }

        global.gimport("fatalending").exit();
    },

    DownloadComponent: async (Mantra, componentName) => {
        await DownloadComponent.Download( Mantra, componentName );

        global.gimport("fatalending").exit();
    },

    GzipComponent: async (Mantra, componentName) => {
        if ( !( await ExistsComponentInProject(componentName) ) ) {
            MantraConsole.warning( `Component '${componentName}' it is not installed in this project.` );
        } else {
            const ExecCommand = global.gimport("execcommand");
            const version = Mantra.GetComponentVersion(componentName);
            const componentRootLocation = Mantra.GetComponentLocation(componentName).replace(componentName, "");
            const fileToGenerate = `${componentName}@${version}.tar.gz`;
            const currentFolder = MantradArgs.getRootProjectFolder();
            const existsTarCommand = await CoreCommandsUtils.ExistsTarCommandInSystem();                ;

            if ( existsTarCommand ) {
                let command = `cd ${componentRootLocation}`;
                command += ` && tar --exclude=**/.git/* --exclude=**/node_modules/* -zcf ${fileToGenerate} ${componentName}`;
                command += ` && cd ${currentFolder}`;
                command += ` && mv ${componentRootLocation}${fileToGenerate} .`;
    
                await ExecCommand.exec( command );
                MantraConsole.info( `Component file ${fileToGenerate} generated successfully`, false);
            } else {
                MantraConsole.warning( `Unable to locate in system 'tar' command to run gzip-component`);
            }
        }

        global.gimport("fatalending").exit();
    },

    EnableComponent: async (MantraAPI, componentName) => {
        await EnableComponentImpl(MantraAPI, componentName);
        
        global.gimport("fatalending").exit();
    },

    DisableComponent: async (MantraAPI, componentName) => {
        if (!( await ExistsComponentInProject(componentName) ) ) {
            MantraConsole.warning(`Component '${componentName}' it is not installed in this project.`);
        } else {
            if ( !(await IsComponentEnabled(componentName) ) ) {
                MantraConsole.warning( `Component '${componentName}' it already disabled.` );
            } else {
                const answer = await MantraConsole.question(`Disable component ${componentName} [Y]/N? `);
    
                if (answer == "Y" || answer == "") {
                    await DisableComponent(MantraAPI, componentName);
                }
            }
        }
     
        global.gimport("fatalending").exit();
    },

    UpdateSystem: async (MantraAPI) => {
        return UpdateSystem(MantraAPI);
    },

    UpdateComponentsLocations: async (MantraAPI) => {
        let answer = await MantraConsole.question(`Check for components new locations to update [Y]/N? ` );

        if ( answer == "Y" || answer == "" ) { 
            await UpdateComponentsLocations(MantraAPI);
        }
    },

    NewComponent: async (MantraAPI) => {
        await CreateNewComponent();
    },
    
    ShowComponents: async (MantraAPI) => {
        let components = await CoreCommandsUtils.GetComponentsInstalled();

        components = MantraAPI.Utils.Underscore.sortBy(components, "name");

        MantraConsole.info( `${components.length} components installed` );

        for( let cmp of components ) {
            MantraConsole.info(`${cmp.name} - ${cmp.version} - ${cmp.enabled ? 'enabled':'disabled'}`, false);
        }
    },

    ShowApps: async( MantraAPI ) => {
        const apps = Object.keys(global.Mantra.MantraConfig.Apps).sort();
        const defaultApp = Object.keys(global.Mantra.MantraConfig.Apps)[0];

        if ( apps.length == 0 ) {
            MantraConsole.info( 'No apps defined yet at mantraconfig.json file');
        } else {
            MantraConsole.info( 'Your app(s):', false);
    
            for( const appName of apps ) {
                MantraConsole.info( `* ${appName}`, false)
            }
    
            MantraConsole.info('To run your app(s):', false);
    
            for( const appName of apps ) {
                MantraConsole.info( `$ mantrad startapp ${appName}`, false);
            }

            MantraConsole.info( `Default application: ${defaultApp}, run it with:`, false );
            MantraConsole.info( '$ mantrad startapp', false); 
        }
    },

    ShowComponent: async (MantraAPI, componentName ) => {
        let entitiesConfig = global.Mantra.MantraConfig.getEntitiesConfiguration();
        let mantraDB = MantraDB(entitiesConfig);

        const exists = await mantraDB.ExistsComponentByName( componentName );

        if ( exists ) {
            const cmp = await mantraDB.GetComponentByName( componentName );

            MantraConsole.info(`${cmp.name} - ${cmp.version} - ${cmp.enabled ? 'enabled':'disabled'}`, false);
            MantraConsole.info(`Located at ${cmp.location}`, false);
            
            // Show component hooks            
            const componentHooks = global.Mantra.Bootstrap.getHooksByComponent( componentName );
            if ( componentHooks.length ) {
                MantraConsole.info('Hooks registered by component:');
                console.log(componentHooks);
            } else {
                MantraConsole.info('No hooks registered by component');
            }
        } else {
            MantraConsole.warning(`Component of name ${componentName} doesn't exist or it is not installed`);
        }
    },

    ShowApis: async (MantraAPI, componentName) => {
        const apis = global.Mantra.Bootstrap.getHooksByName( CoreConstants.API_HOOK );
        let apiNames = [];

        for( const api of apis ) {
            if ( componentName == undefined || api.Component == componentName ) {
                apiNames.push(`${api.Component}.${api.APIName}`)
            }
        }

        if ( apiNames.length == 0 ) {
            MantraConsole.info("No apis detected");
        } else {
            apiNames = apiNames.sort();
            for( let i = 0; i < apiNames.length; i++ ) {
                MantraConsole.info( `(${i+1}) ${apiNames[i]}`, false );
            }
        }
    },

    ShowViews: async (MantraAPI, componentName) => {
        const views = global.Mantra.Bootstrap.getHooksByName( CoreConstants.VIEW_HOOK );
        let viewNames = [];

        for( const view of views ) {
            if ( componentName == undefined || view.Component == componentName ) {
                viewNames.push(`${view.Component}.${view.Command}. Route: '/${view.Component}/${view.Command}'`)
            }
        }

        if ( viewNames.length == 0 ) {
            MantraConsole.info("No views detected");
        } else {
            let i = 0;
            for( const viewName of viewNames.sort() ) {
                MantraConsole.info( `(${++i}) ${viewName}`, false );
            }
        }
    },

    ShowCrons: async (MantraAPI, componentName) => {
        const crons = global.Mantra.Bootstrap.getHooksByName( CoreConstants.CRON_HOOK );        
        let cronNames = [];
        let i = 0;

        for( const cron of crons ) {
            if ( componentName == undefined || cron.Component == componentName ) {
                cronNames.push(`${cron.Component}.${cron.CronHandler.name} Config: ${cron.CronConfig}`);
            }
        }

        if ( cronNames.length == 0 ) {
            MantraConsole.info("No crons jobs definitions detected");   
        } else {
            for( const cronName of cronNames.sort() ) {
                MantraConsole.info( `(${++i}) ${cronName}`, false );
            }
        }
    },

    ShowEventsSubscribers: async (MantraAPI, componentName) => {
        const events = global.Mantra.Bootstrap.getHooksByName( CoreConstants.EVENT_HOOK );
        let eventNames = [];

        for( const event of events ) {
            if ( componentName == undefined || event.Component == componentName ) {
                eventNames.push(`${event.Component} subscribed to '${event.EventName}'` )
            }
        }

        if ( eventNames.length == 0 ) {
            MantraConsole.info("No events subscribers detected");
        } else {
            let i = 0;
            for( const eventName of eventNames.sort() ) {
                MantraConsole.info( `(${++i}) ${eventName}`, false );
            }
        }

    },

    ShowBlocks: async (MantraAPI, componentName) => {
        const blockHooks = global.Mantra.Bootstrap.getHooksByName( CoreConstants.BLOCK_HOOK );
        let blockNames = [];
        
        for( const blockHook of blockHooks ) {
            if ( componentName == undefined || blockHook.Component == componentName ) {
                blockNames.push(`${blockHook.Component}: ${blockHook.BlockName}`)
            }
        }
        
        if ( blockNames.length == 0 ) {
            MantraConsole.info("No blocks detected");
        } else {
            let i = 0;
            for( const blockName of blockNames.sort() ) {
                MantraConsole.info( `(${++i}) ${blockName}`, false );
            }
        }
    },

    ShowAccessConditions: async (MantraAPI, componentName) => {
        const acHooks = global.Mantra.Bootstrap.getHooksByName( CoreConstants.ACCESSCONDITION_HOOK );
        let acNames = [];
        
        for( const acHook of acHooks ) {
            if ( componentName == undefined || acHook.Component == componentName ) {
                acNames.push(`${acHook.Component}: ${acHook.Name}`)
            }
        }
        
        if ( acNames.length == 0 ) {
            MantraConsole.info("No access conditions defined");
        } else {
            let i = 0;
            for( const acName of acNames.sort() ) {
                MantraConsole.info( `(${++i}) ${acName}`, false );
            }
        }
    },

    ShowPrerequests: async (MantraAPI, componentName) => {
        const prHooks = global.Mantra.Bootstrap.getHooksByName( CoreConstants.PREREQUEST_HOOK );
        let prNames = [];
        
        for( const prHook of prHooks ) {
            if ( componentName == undefined || prHook.Component == componentName ) {
                prNames.push(`${prHook.Component}: ${prHook.Name}`)
            }
        }
        
        if ( prNames.length == 0 ) {
            MantraConsole.info("No prerequests defined");
        } else {
            let i = 0;
            for( const prName of prNames.sort() ) {
                MantraConsole.info( `(${++i}) ${prName}`, false );
            }
        }
    },

    ShowMiddlewares: async (MantraAPI, componentName ) => {
        let middlewareHooks = global.Mantra.Bootstrap.getHooksByName( CoreConstants.MIDDLEWARE_HOOK );
        let middlewareNames = [];

        middlewareHooks.forEach( (m) => {
            if ( m.Weight == null ) m.Weight = 0;
        });

        middlewareHooks = MantraAPI.Utils.Underscore.sortBy( middlewareHooks, "Weight" );

        for( const middlewareHook of middlewareHooks ) {
            if ( componentName == undefined || middlewareHook.Component == componentName ) {
                middlewareNames.push(`Weight: ${middlewareHook.Weight} - ${middlewareHook.Component}: ${middlewareHook.MiddlewareHandler.name}`)
            }
        }

        if ( middlewareNames.length == 0 ) {
            MantraConsole.info("No middlewares detected");
        } else {
            let i = 0;
            for( const middlewareName of middlewareNames ) {
                MantraConsole.info( `(${++i}) ${middlewareName}`, false );
            }
        }
    },

    ShowPosts: async (MantraAPI, componentName) => {
        const posts = global.Mantra.Bootstrap.getHooksByName( CoreConstants.POST_HOOK );
        let postNames = [];
        
        for( const post of posts ) {
            if ( componentName == undefined || post.Component == componentName ) {
                postNames.push(`${Chalk.keyword("white")(post.Component + "." + post.Command)}. Route: '/${post.Component}/${post.Command}'`)
            }
        }

        if ( postNames.length == 0 ) {
            MantraConsole.info("No posts detected");
        } else {
            let i = 0;
            for( const postName of postNames.sort() ) {
                MantraConsole.info( `(${++i}) ${postName}`, false );
            }
        }
    },

    ShowGets: async (MantraAPI, componentName) => {
        const gets = global.Mantra.Bootstrap.getHooksByName( CoreConstants.GET_HOOK );        
        let getNames = [];

        for( const get of gets ) {
            if ( componentName == undefined || get.Component == componentName ) {
                getNames.push(`${Chalk.keyword("white")(get.Component + "." + get.Command)}. Route: '/${get.Component}/${get.Command}'`)
            }
        }

        if ( getNames.length == 0 ) {
            MantraConsole.info("No gets detected");
        } else {
            let i = 0;
            for( const getName of getNames.sort() ) {
                MantraConsole.info( `(${++i}) ${getName}`, false );
            }
        }
    },

    ShowCommands: async (MantraAPI, componentName) => {
        const commands = global.Mantra.Bootstrap.getHooksByName( CoreConstants.COMMAND_HOOK );
        let commandsToShow = [];

        for (const command of commands ) {
            if ( componentName == undefined || command.Component == componentName ) {
                commandsToShow.push( {
                    Command: command.Name,
                    Description: command.Description,
                    Component: (!command.Component || command.Component == "corecommands" ) ? "mantra" : command.Component
                })
            }    
        }

        if ( commandsToShow.length == 0 ) {
            MantraConsole.info("No commands detected");
        } else {
            for( const command of MantraAPI.Utils.Underscore.sortBy( commandsToShow, "Component" ) ) {
                MantraConsole.rawInfo(`${Chalk.white(command.Command)} (${Chalk.green(command.Component)}) : ${Chalk.yellow(command.Description)}`);
            }
        }
    },

    ShowExtends: async (MantraAPI, extendType) => {
        const extendsDefinitions = global.Mantra.Bootstrap.getHooksByName( CoreConstants.EXTEND_HOOK );

        let extendsToShow = [];

        for (const extendItem of extendsDefinitions ) {
            if ( extendType == undefined || extendType == extendItem.Type ) {
                extendsToShow.push( {
                    Type: extendItem.Type,
                    Component: extendItem.Component
                });
            }
        }

        if ( extendType && extendsToShow.length == 0 ) {
            MantraConsole.info( `No extends found of type ${extendType}` );
        } else {
            for( const extendItemToShow of MantraAPI.Utils.Underscore.sortBy( extendsToShow, "Component" ) ) {
                MantraConsole.rawInfo(`Extend type: ${Chalk.white(extendItemToShow.Type)}, defined by ${Chalk.green(extendItemToShow.Component)}`);
            }
        }
    },

    CheckHealth: async (MantraAPI) => {
        await InitialEventsCaller.callOnCheckHealthComponents(MantraAPI);
    },

    ShowComponentsToUpdate: async (MantraAPI) => {
        try {
            const componentsToUpdate = await GetComponentsToUpdate();
    
            if ( componentsToUpdate.length > 0 ) {
                for( let cmp of componentsToUpdate ) {
                    MantraConsole.info(`Component '${cmp.componentEntity.name}' should be updated from version ${cmp.componentEntity.version} to version ${cmp.componentLoaded.config.version}` );
                }
                MantraConsole.info("Run 'mantra update' to update the components.");
            } else {
                MantraConsole.info("All components are updated");
            }        
        }
        catch(error) {
            MantraConsole.error(error.message);
        }    
    },

    ShowComponentConfig: async (Mantra, componentName) => {
        if ( componentName == undefined ) {
            MantraConsole.warning("Expected the name of the component with show-component-config command");
        } else {
            const componentConfig = Mantra.GetComponentConfig(componentName);

            if ( Object.keys(componentConfig).length == 0 ) {
                MantraConsole.info( `Component '${componentName}' doesn't have any configuration properties`, false );
            } else {
                console.dir(componentConfig, {depth: null, colors: true})
            }
        }
    },

    CheckProject: async (Mantra) => {
        await AppConditionsChecker.checkConditionsBeforeStarting( Mantra );
    },

}

async function UninstallComponent( MantraAPI, componentName ) {
    try {
        let ci = ComponentInstaller(global.Mantra.MantraConfig);
        await ci.UninstallComponent( componentName );

        MantraConsole.info("Component uninstalled with success");
        
        return true;
    }
    catch(error) {
        MantraConsole.error(error.message);
        return false;
    }
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

async function DisableComponent( MantraAPI, componentName ) {
    try {
        let ci = ComponentInstaller(global.Mantra.MantraConfig);
        await ci.DisableComponent( componentName );

        MantraConsole.info("Component disabled with success");
    }
    catch(error) {
        MantraConsole.error(error.message);
    }
}

async function UpdateSystem(MantraAPI) {
    try {
        let ci = ComponentInstaller(global.Mantra.MantraConfig);
        let componentsToUpdate = await ci.GetComponentsToUpdate();

        if ( componentsToUpdate.length > 0 ) {
            for( let cmp of componentsToUpdate ) {
                MantraConsole.info(`Component '${cmp.componentEntity.name}' should be updated from version ${cmp.componentEntity.version} to version ${cmp.componentLoaded.config.version}` );
                let answer = await MantraConsole.question( 'Update component [Y]/N? ' );
                
                if ( answer == "Y" || answer == "" ) {
                    await UpdateComponent( MantraAPI, ci, cmp );
                }            
            }
        } else {
            MantraConsole.info("All components are updated");
        }        
    }
    catch(error) {
        MantraConsole.error(error.message);
    }    
}

async function UpdateComponent( MantraAPI, componentInstaller, cmp ) {
    try {
        // Call onUpdate of the component
        if (cmp.componentLoaded.component.Install && cmp.componentLoaded.component.Install.onUpdate) {
            await cmp.componentLoaded.component.Install.onUpdate(MantraAPI, cmp.componentEntity.version, cmp.componentLoaded.config.version);
        } else {
            MantraConsole.warning("Component doesn't expose installer property");
        }

        // Update component version in system
        await componentInstaller.UpdateComponentVersion( cmp.componentEntity.name, cmp.componentLoaded.config.version);

        MantraConsole.info("Component updated with success!");
    } catch(err) {
        MantraConsole.error(`Exception when updating component ${cmp.componentEntity.name}`);
        MantraConsole.error(err);
    }
}

async function UpdateComponentsLocations(MantraAPI) {
    try {
        let mc = global.Mantra.MantraConfig; 
        
        let entitiesConfig = global.Mantra.MantraConfig.getEntitiesConfiguration();
        let mantraDB = MantraDB(entitiesConfig);
        
        let cmpInstalledAndEnabled = await mantraDB.GetComponentsInstalledAndEnabled();
        
        await global.Mantra.ComponentsLoader.updateComponentsLocations( mc.getComponentsLocations(), cmpInstalledAndEnabled, mantraDB );
        
        MantraConsole.info("Components locations has been updated with success");
    } catch(err) {
        MantraConsole.error(`Exception when updating components locations`);
        MantraConsole.error(err);
    }
}

async function CreateNewComponent() {
    let componentInfo = {};
    
    componentInfo.name = await MantraConsole.question('New component name: ', false);
    componentInfo.description = await MantraConsole.question('Description: ', false);
    componentInfo.location = await CoreCommandsUtils.GetComponentLocation();
    componentInfo.template = "basecomponent";

    await global.gimport("componentbuilder").buildComponent(componentInfo);

    MantraConsole.info(`Component '${componentInfo.name} 'created!`, false);
    MantraConsole.info(`To install new component, run: $ mantrad install-component ${componentInfo.name}`, false);
}

async function GetComponentsToUpdate() {
    let ci = ComponentInstaller(global.Mantra.MantraConfig);
    return ci.GetComponentsToUpdate();
}

async function ExistsComponentInProject( componentName ) {
    const components = await CoreCommandsUtils.GetComponentsInstalled();
    const componentNameToCheck = CoreCommandsUtils.ExtractComponentName(componentName);
    
    for( const component of components ) {
        if ( component.name == componentNameToCheck ) return true;
    }

    return false;
}

async function IsComponentEnabled(componentName) {
    const components = await CoreCommandsUtils.GetComponentsInstalled();

     for( const component of components ) {
        if ( component.name == componentName ) return component.enabled;
    }

    return false;
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

async function UninstallComponentImpl( Mantra, componentName, askQuestion ) {
    let uninstalled = false;

    if ( !( await ExistsComponentInProject(componentName) ) ) {
        MantraConsole.warning( `Component '${componentName}' it is not installed in this project.` );
    } else {
        let answer = "Y";

        if ( askQuestion ) {
            answer = await MantraConsole.question(`Uninstall component ${componentName} [Y]/N? `);
        }

        if ( answer == "Y" || answer == "" ) {
            uninstalled = await UninstallComponent(Mantra, componentName);

            if ( uninstalled ) {
                MantraConsole.info( `Remember to remove component name from 'DefaultComponents' at ${CoreConstants.MANTRACONFIGFILE} if will no longer be a default component.`, false );
            }
        }
    }

    return uninstalled;
}