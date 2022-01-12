/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const Mustache = require("mustache");
const Path = require("path");

const CoreConstants = global.gimport("coreconstants");
const MantraUtils = global.gimport("mantrautils");

module.exports = {
    buildComponent: async (componentInfo) => {
        const componentLocation = Path.join( process.cwd(), componentInfo.location, componentInfo.name );
        const templateLocation = Path.join( __dirname, "..", "newtemplates", "components", componentInfo.template );
        
        await MantraUtils.EnsureDir( componentLocation );

        // mantra.json
        let mantraJson = await MantraUtils.readTextFileAsync( Path.join( templateLocation, CoreConstants.COMPONENTS_CONFIGFILENAME) );
        mantraJson = Mustache.render( mantraJson, componentInfo );

        await MantraUtils.SaveTextFileAsync( Path.join( componentLocation, CoreConstants.COMPONENTS_CONFIGFILENAME ), mantraJson);
        
        // Main component file
        let main = await MantraUtils.readTextFileAsync( Path.join( templateLocation, "component.js" ) );
        main = Mustache.render( main, componentInfo );

        await MantraUtils.SaveTextFileAsync( Path.join( componentLocation, `${componentInfo.name}.js` ), main );
        
        const pathToControllers = Path.join(componentLocation, "controllers" );
        await MantraUtils.EnsureDir( pathToControllers );
        
        // View file
        const pathToViews = Path.join(componentLocation, "ui", "views" );
        await MantraUtils.EnsureDir( pathToViews );

        await MantraUtils.CopyFile( Path.join( templateLocation, "ui", "views", "defaultview.html"),
                                    Path.join( componentLocation, "ui", "views", "defaultview.html") );

        let viewFile = await MantraUtils.readTextFileAsync( Path.join( templateLocation, "controllers", "view.component.js" ) );
        viewFile = Mustache.render( viewFile, componentInfo );
        await MantraUtils.SaveTextFileAsync( Path.join( componentLocation, "controllers", `view.${componentInfo.name}.js` ), viewFile );

        // Block file
        const pathToBlocks = Path.join(componentLocation, "ui", "blocks" );
        await MantraUtils.EnsureDir( pathToBlocks );

        await MantraUtils.CopyFile( Path.join( templateLocation, "ui", "blocks", "defaultblock.html"),
                                    Path.join( componentLocation, "ui", "blocks", "defaultblock.html") );

        await MantraUtils.CopyFile(Path.join(templateLocation, "controllers", "block.component.js"),
                                   Path.join(componentLocation, "controllers", `block.${componentInfo.name}.js`));

        // Api file
        await MantraUtils.CopyFile( Path.join( templateLocation, "controllers", "api.component.js" ),
                                    Path.join( componentLocation, "controllers", `api.${componentInfo.name}.js` ) );

        // Post file
        await MantraUtils.CopyFile( Path.join( templateLocation, "controllers", "post.component.js" ),
                                    Path.join( componentLocation, "controllers", `post.${componentInfo.name}.js` ) );

        // Event file
        await MantraUtils.CopyFile( Path.join( templateLocation, "controllers", "event.component.js" ),
                                    Path.join( componentLocation, "controllers", `event.${componentInfo.name}.js` ) );

        // Prerequest file
        await MantraUtils.CopyFile( Path.join( templateLocation, "controllers", "prerequest.component.js" ),
                                    Path.join( componentLocation, "controllers", `prerequest.${componentInfo.name}.js` ) );

        // Middleware file 
        await MantraUtils.CopyFile( Path.join( templateLocation, "controllers", "middleware.component.js" ),
                                    Path.join( componentLocation, "controllers", `middleware.${componentInfo.name}.js` ) );

        // Cron file 
        await MantraUtils.CopyFile( Path.join( templateLocation, "controllers", "cron.component.js" ),
                                    Path.join( componentLocation, "controllers", `cron.${componentInfo.name}.js` ) );

        // Model
        const pathToModel = Path.join(componentLocation, "model" );
        await MantraUtils.EnsureDir( pathToModel );

        let modelFile = await MantraUtils.readTextFileAsync( Path.join( templateLocation, "model", "component.schema.json" ) );
        modelFile = Mustache.render( modelFile, componentInfo );
        await MantraUtils.SaveTextFileAsync( Path.join( componentLocation, "model", `${componentInfo.name}.schema.json` ), modelFile );

        // Dal
        let dalFile = await MantraUtils.readTextFileAsync( Path.join( templateLocation, "model", "dal.component.js" ) );
        dalFile = Mustache.render( dalFile, componentInfo );
        await MantraUtils.SaveTextFileAsync( Path.join( componentLocation, "model", `dal.${componentInfo.name}.js` ), dalFile );
    }
}