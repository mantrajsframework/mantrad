"use strict";

const RedEntities = require("redentities");
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
    const redEntities = RedEntities(MantraConfig.getEntitiesConfiguration());
    const mantraSchema = MantraModel.LoadModel();
    const entities = redEntities.Entities( mantraSchema );

    MantraConsole.info("Removing existing database (if any)...");

    for( const dbname of MantraConfig.getEntitiesConfigurationNames() ) {
        let dbEntitiesConfig = MantraConfig.getEntitiesConfiguration(dbname);

        await entities.RemoveAndCreateDatabase( dbEntitiesConfig.database )
    }
    
    MantraConsole.info("Creating Mantra Framework schema...");
    await entities.CreateSchema( mantraSchema ); 

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