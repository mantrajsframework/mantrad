/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const MantraConsole = global.gimport("mantraconsole");
const Path = require("path");
const VarCache = global.gimport("varcache");

const KEYWORDS = {
    COMPONENT: "component",
    FRONTEND: "frontend",
    FRONTENDTEMPLATES: "frontendtemplates",
    TEMPLATES: "templates"
}

const LOCATIONS = {
    BLOCKS_LOCATIONS: ['frontendtemplates.blocks', 'templates.blocks', 'component.ui/blocks', 'component.blocks'],
    CSS_LOCATIONS: ['component.ui/css', 'component.css'],
    JS_LOCATIONS: ['component.ui/js', 'component.js'],
    TEMPLATES_LOCATIONS: ['component.ui/templates', 'component.templates'],
    VIEWS_LOCATIONS: ['frontendtemplates.views', 'templates.views', 'component.ui/views', 'component.views']
}

let locationsCache = VarCache();

class AssetsLocationsAPI {
    constructor(Mantra) { this.Mantra = Mantra; }
    
    async ExistsView( view ) {
        return (await this.GetAsset( LOCATIONS.VIEWS_LOCATIONS, view, "html" )).exists;
    }

    async GetViewLocation( componentName, viewName ) {
        let asset = await this.GetAsset( LOCATIONS.VIEWS_LOCATIONS, `${componentName}.${viewName}`, "html" );

        return asset.exists ? asset.fullpath : "";
    }

    async GetBlockLocation( componentName, blockName ) {
        let asset = await this.GetAsset( LOCATIONS.BLOCKS_LOCATIONS, `${componentName}.${blockName}`, "html" );

        return asset.exists ? asset.fullpath : "";
    }

    async GetTemplateLocation( componentName, templateName ) {
        let locations = [ Path.join( global.Mantra.MantraConfig.SiteTemplatesLocation, global.Mantra.MantraConfig.FrontendName ),
            Path.join( global.Mantra.MantraConfig.SiteTemplatesLocation, componentName ),
            Path.join( global.Mantra.MantraConfig.SiteTemplatesLocation ) ];

        // Templates can be defined without the existence of a component
        if ( global.Mantra.ComponentsLoader.existsComponentByName(componentName) ) {
            locations = locations.concat(LOCATIONS.TEMPLATES_LOCATIONS);
        }

        const asset = await this.GetAsset( 
            locations,
            `${componentName}.${templateName}`, "html" );

        return asset.exists ? asset.fullpath : "";
    }   

    async GetJsLocation( componentName, fileName ) {
        if (componentName == KEYWORDS.FRONTEND ) {
            return fileName;
        }

        let asset = await this.GetAsset( LOCATIONS.JS_LOCATIONS, `${componentName}.${fileName}`, "js" );

        return asset.exists ? asset.relativepath : "";
    }

    async GetFullJsLocation( componentName, fileName ) {
        if (componentName == KEYWORDS.FRONTEND ) {
            return Path.join( global.Mantra.MantraConfig.FrontendLocation, fileName );
        }

        let asset = await this.GetAsset( LOCATIONS.JS_LOCATIONS, `${componentName}.${fileName}`, "js" );

        return asset.exists ? asset.fullpath : "";
    }

    async GetCssLocation( componentName, fileName ) {
        if (componentName == KEYWORDS.FRONTEND ) {
            return fileName;
        }
        
        let asset = await this.GetAsset( LOCATIONS.CSS_LOCATIONS, `${componentName}.${fileName}`, "css" );
        
        return asset.exists ? asset.relativepath : "";
    }

    async GetFullCssLocation( componentName, fileName ) {
        if (componentName == KEYWORDS.FRONTEND ) {
            return Path.join( global.Mantra.MantraConfig.FrontendLocation, fileName );
        }

        let asset = await this.GetAsset( LOCATIONS.CSS_LOCATIONS, `${componentName}.${fileName}`, "css" );

        return asset.exists ? asset.fullpath : "";
    }

    GetSchemaLocation( componentName, schemaName ) {
        const componentLocation = this.Mantra.GetComponentLocation(componentName);
        let schema = "";
    
        if ( schemaName ) {
            schema = schemaName;
        } else {
            schema = GetSchemaNameFromComponent(this.Mantra, componentName);
        }
    
        return Path.join( componentLocation, "model", `${schema}.schema.json` );
    }

    /*
    * Get an asset location checking if exists
    * locations: array with the locations to look for
    * asset: asset in the format <component>.<asset>
    * extension: extension of the asset
    * Returns an object with the result: 
    * {
    *    exists: <true | false>,
    *    fullpath: <full path to asset if exists, including asset file name an extension>,
    *    relativepath: <relative path to the asset>
    * }
    */
    async GetAsset( locations, asset, extension) {
        const key = `${locations.join('.')}.${asset}.${extension}`;

        if (locationsCache.Exists(key)) {
            return locationsCache.Get(key);
        }

        let parts = this.Mantra.Utils.ParseComponentPath(asset);
        const file = `${parts.asset}.${extension}`;

        for (let location of locations) {
            const fullPath = GetLocationFullPath( this.Mantra, location, parts.component, file );

            if (await this.Mantra.Utils.FileExists(fullPath)) {
                if ( location.indexOf('.') > -1 ) location = location.split('.')[1];

                const value = {
                    exists: true,
                    fullpath: fullPath,
                    relativepath: Path.join(parts.component, location, file)
                }

                locationsCache.Add(key, value);

                return value;
            }
        }

        return {            
            exists: false
        }
    }

    GetBlocksLocations() {
        return LOCATIONS.BLOCKS_LOCATIONS;
    }

    /*
     * Given a location with keywords like 'component', 'template' or 'frontendtemplate'
     * returns its traslation for a specific component name
     */
    TranslateLocationFromKeyWords( MantraAPI, location, componentName ) {
        let base = location.split('.');
    
        if (base.length == 2) {
            switch (base[0]) {
                case KEYWORDS.COMPONENT: {
                    return Path.join(MantraAPI.GetComponentLocation(componentName), base[1]);
                }
                case KEYWORDS.TEMPLATES: {
                    return Path.join(global.Mantra.MantraConfig.SiteTemplatesLocation, componentName, base[1]);
                }
                case KEYWORDS.FRONTENDTEMPLATES: {
                    return Path.join(global.Mantra.MantraConfig.SiteTemplatesLocation, global.Mantra.MantraConfig.FrontendName, componentName, base[1]);
                }
                default:
                    throw new Error( `Unkown location type of ${base[0]}` );
            }
        } else {
            return Path.join(MantraAPI.GetComponentLocation(component), location);
        }
    }
}

/*
 * Returns the schema name for a component
 * Tries to check if schema with name <component name>.<component version>.schema.json exists.
 * If exists, returns <component name>.<component version>. If not, default schema name is returned (<component name>).
 */
function GetSchemaNameFromComponent(MantraAPI, componentName) {
    const componentLocation = MantraAPI.GetComponentLocation(componentName);
    const componentVersion = MantraAPI.GetComponentVersion(componentName);
    let schema = `${componentName}.${componentVersion}`;
    const pathToVersionModel = Path.join( componentLocation, "model", `${schema}.schema.json` );

    if ( MantraAPI.Utils.FileExistsSync( pathToVersionModel ) == false ) {
        schema = componentName;
    }

    return schema;
}

function GetLocationFullPath( MantraAPI, location, component, file ) {
    if ( Path.isAbsolute(location) ) {
        return Path.join(location,file);
    }

    let base = location.split('.');

    if (base.length == 2) {
        switch (base[0]) {
            case KEYWORDS.COMPONENT: {
                return Path.join(MantraAPI.GetComponentLocation(component), base[1], file);
            }
            case KEYWORDS.TEMPLATES: {
                return Path.join(global.Mantra.MantraConfig.SiteTemplatesLocation, component, base[1], file);
            }
            case KEYWORDS.FRONTENDTEMPLATES: {
                return Path.join(global.Mantra.MantraConfig.SiteTemplatesLocation, global.Mantra.MantraConfig.FrontendName, component, base[1], file);
            }
            default:
                MantraConsole.error( `Unkown location type of ${base[0]}` );
        }
    } else {
        return Path.join(MantraAPI.GetComponentLocation(component), location, file);
    }
}

module.exports = (Mantra) => new AssetsLocationsAPI(Mantra)