/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const RedEntities = global.gimport("redentities");
const Path = require("path");

const CoreConstants = global.gimport("coreconstants");
const ComponentsInstaller = global.gimport("componentinstaller");
const MantraConsole = global.gimport("mantraconsole");
const MantraModel = global.gimport("mantramodel")();
const NpmInstaller = global.gimport("npminstaller")

let MantraConfig = {};

async function Perform(MantraAPI, siteName) {
    try {
        MantraConfig = global.Mantra.MantraConfig;

        MantraConsole.info('You are about to install Mantra application', false);
        MantraConsole.info('Previous entities data will be removed.', false);

        let answer = await MantraConsole.question("Install Mantra Framework and its components [Y]/N? ");

        if ( answer == "Y" || answer == "" ) {
            let componentsWithNodeDependencies = await NpmInstaller.getComponentsWithNpmDepedencies(MantraConfig);
            componentsWithNodeDependencies = componentsWithNodeDependencies.map( c => c.filename );

            if ( componentsWithNodeDependencies.length ) {
                MantraConsole.newline();
                MantraConsole.info( "The following components have node dependencies:", false);
                
                for( let cmpName of componentsWithNodeDependencies.sort() ) {
                    MantraConsole.info( ` * ${cmpName}`, false);
                }
                
                MantraConsole.newline();
                MantraConsole.info("Running mantrad npm-install command", false);
                MantraConsole.info(`If you already run this command, you can skip it.`, false)

                await NpmInstaller.runNpmInstall(MantraConfig);
                MantraConsole.info("mantrad npm-install completed. Completing the installation...", false);
            }
            
            await InstallMantraAsync();
            MantraConsole.info('Mantra application installed with success', false);
            MantraConsole.newline();
            MantraConsole.info("Run apps with:", false);

            for( let app of Object.keys(MantraConfig.Apps) ) {
                MantraConsole.info(`$ mantrad startapp ${app}`, false)
            }
        }

        global.gimport("fatalending").exit();
    }
    catch(error) {
        global.gimport("fatalending").exitByError(error);
    }
}

async function InstallMantraAsync() {
    const entities = await CreateProjectDatabases();

    MantraConsole.info( "Creating default values" );
    await InstallDefaultValues(entities);

    MantraConsole.info( "Database and Mantra Framework schema created" );                            
    MantraConsole.info( "Installing core components" );

    await InstallComponents( CoreConstants.CORE_COMPONENTS );

    if ( MantraConfig.DefaultComponents ) {
        MantraConsole.info( "Installing site components" );

        await InstallComponents( MantraConfig.DefaultComponents );
    }    
};

async function CreateProjectDatabases() {    
    const entitiesConfigNames = MantraConfig.getEntitiesConfigurationNames();

    if ( !entitiesConfigNames.includes(CoreConstants.DEFAULT_ENTITIES_CONFIGURATION) ) {
        MantraConsole.warning( `No 'default' entities configuration at ${CoreConstants.MANTRACONFIGFILE}` );
        global.gimport("fatalending").exit();
    }

    MantraConsole.info("Removing existing databases (if any)...");
    
    // Iterates over all entities configurations
    // Each one can have a different provider
    for( const entitiesConfigName of entitiesConfigNames ) {
        const dbEntitiesConfig = MantraConfig.getEntitiesConfiguration(entitiesConfigName);
        const redEntities = RedEntities(dbEntitiesConfig);
        await redEntities.Entities( { entities: [] } ).RemoveAndCreateDatabase( dbEntitiesConfig.database );   
    }

    // Create Mantra core database
    const redCoreEntities = RedEntities(MantraConfig.getEntitiesConfiguration("default"));
    const mantraSchema = MantraModel.LoadModel();
    const entities = redCoreEntities.Entities( mantraSchema );

    MantraConsole.info("Creating Mantra Framework core schema...");
    await entities.CreateSchema( mantraSchema ); 

    return entities;
}

async function InstallComponents( cmps ) {
    let ci = ComponentsInstaller(MantraConfig);

    for( const componentName of cmps ) {
        MantraConsole.info( `Installing "${componentName}"` );

        await ci.InstallComponent( componentName )
        await ci.EnableComponent( componentName );
    }
}

function InstallDefaultValues(entities) {
    // Mantrainstance entity
    let mantraInstanceDefault = require( Path.join( __dirname, "defaultvalues", "mantrainstance.json") );

    return new Promise( (resolve, reject) => {
        let inserts = [];
        mantraInstanceDefault.forEach( (item) => {
            inserts.push( entities.mantrainstance.I().V(item).R() );
        });
        
        Promise.all( inserts )
               .then( resolve )
               .catch( reject );
    });
}

module.exports = () => {    
    return {
        Description: "Installs new Mantra instance according to mantraconfig.json. Use: <site name> to install according to config file.",
        PerformCommand: Perform
    }
}