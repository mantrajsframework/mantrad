"use strict";

const Mustache = require("mustache");
const Path = require("path");

const CoreConstants = global.gimport("coreconstants");
const MantraUtils = global.gimport("mantrautils");

module.exports = {
    buildNewProject: async (projectInfo) => {
        const baseProjectPath = process.cwd();

        // Create folders
        const projectPath = Path.join(baseProjectPath, projectInfo.projectname);
        const sitePath = projectPath;
        const siteComponentsPath = Path.join(projectPath, "components" );
        
        await MantraUtils.EnsureDir( projectPath );
        await MantraUtils.EnsureDir( sitePath );
        await MantraUtils.EnsureDir( siteComponentsPath );

        // Copy mantraconfig.json
        let config = await MantraUtils.readTextFileAsync( Path.join(__dirname,"..","newtemplates", projectInfo.projectType.configtemplate) );
        config = Mustache.render(config, projectInfo);

        await MantraUtils.SaveTextFileAsync( Path.join(projectPath, CoreConstants.MANTRACONFIGFILE), config );

        // Copy frontend if needed
        if ( projectInfo.projectType.hasfrontend ) {
            const pathToFrontendTemplate = Path.join(__dirname,"..","newtemplates", "frontends", projectInfo.projectType.frontend ); 
            const pathToFrontendDestination = Path.join( sitePath, "ui", "frontend" ); 

            await MantraUtils.EnsureDir( pathToFrontendDestination );
            await MantraUtils.DeepCopy( pathToFrontendTemplate, pathToFrontendDestination );
        }
    }
}