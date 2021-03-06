/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";


const MantraConsole = global.gimport("mantraconsole");
const CoreConstants = global.gimport("coreconstants");
const MantraDB = global.gimport("mantradb");
const MantraUtils = global.gimport("mantrautils");

module.exports = {
    /*
    * Extract the component name from the indicated parameter.
    * If receives <component name>@<version>, returns the name of the component.
    */
    ExtractComponentName: ( componentName ) => {
        const componentsParts = MantraUtils.ExtractValues(componentName, "{component}@{version}");
        
        let componentNameResult = componentName;
        
        if ( componentsParts ) {
            componentNameResult = componentsParts.component;
        }

        return componentNameResult;
    },

    GetComponentsInstalled: async () => {
        const entitiesConfig = global.Mantra.MantraConfig.getEntitiesConfiguration();
        const mantraDB = MantraDB(entitiesConfig);
        
        return mantraDB.GetAllComponents();
    },
    
    GetComponentLocation: async () => {
        const mc = global.Mantra.MantraConfig;
    
        if ( mc.ComponentsLocations.length > 1 ) {
            return mc.ComponentsLocations[ await MantraConsole.questionWithOpts( 'Choose location: ', mc.ComponentsLocations ) ];
        } else {
            return mc.ComponentsLocations[0];
        }
    },
    
    GetUserCredentialsToDownloadComponent: async () => {
        MantraConsole.info( "Get your license key at 'https://www.mantrajs.com/licenses/userlicense'", false);

        const userMail = await MantraConsole.question(`Your user mail at ${CoreConstants.MANTRAWEBSITE}: `);
        const licenseKey = await MantraConsole.question('Your license key: ');
    
        return {
            userMail: userMail,
            licenseKey: licenseKey
        }
    },
    
    ExistsTarCommandInSystem: async () => {
        const ExistsCommand = global.gimport("existscommand");
        
        return ExistsCommand.CheckCommandExists("tar");
    }   
}