"use strict";

const Path = require("path");
const CoreConstants = global.gimport("coreconstants");

const TESTASSETS_FOLDER = "testassets";
const TESTCOMPONENTS_FOLDER = "testcomponents";
const PATH_TO_COMPONENTS = Path.join( __dirname, TESTASSETS_FOLDER, TESTCOMPONENTS_FOLDER );

module.exports = {
    initializeMantra: async () => {
        const pathToCoreComponents = Path.join(process.cwd(), CoreConstants.CORECOMPONENTSFOLDER);
        const pathToConfigFile = Path.join(process.cwd(), "test", "testassets", "mantraconfig.json");
        const fullPathToSite = process.cwd();
    
        const config = global.gimport("mantraconfig").LoadFullConfig(pathToCoreComponents, pathToConfigFile, fullPathToSite);
    
        const MantraServer = global.gimport("mantraserver");

        MantraServer.initGlobal( config );
    
        await global.Mantra.ComponentsLoader.loadComponents([PATH_TO_COMPONENTS]);
    }
}