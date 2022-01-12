/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const Path = require("path");

const CoreConstants = global.gimport("coreconstants");
const MantraConsole = global.gimport("mantraconsole");
const MantraUtils = global.gimport("mantrautils");

module.exports = {
    lookupFilesDefinitions: async (MantraAPI, components) => {
        for( const componentName of Object.keys(components) ) {
            const folders = await MantraUtils.ReadDirectories( components[componentName].pathToComponent );

            folders.push( components[componentName].pathToComponent );

            for( const folder of folders ) {
                for( const fullPathToFile of await MantraUtils.ListFiles( folder ) ) {
                    if (fullPathToFile.endsWith("js")) {
                        await lookupHookFromFile( MantraAPI, fullPathToFile, componentName );
                    }
                }
            }
        }
    },

    /*
     * Looks for all blocks defined in <component>/blocks folder and register
     * them if they are not registered yet with attributes
     */
    lookupAnonymousBlocks: async (MantraAPI, components) => {
        // Lookup block without explicit registration with MantraAPI.Hooks().Block()
        for( const componentName of Object.keys(components) ) {
            for( const blocksLocation of MantraAPI.GetAssetsLocations().getBlocksLocations() ) {
                const blocksFolder = Path.join(  components[componentName].pathToComponent, blocksLocation );
                
                await lookupAnonymousBlocksFromFolder( MantraAPI, componentName, blocksFolder );
            }
        }
    }
}

async function lookupAnonymousBlocksFromFolder(MantraAPI, componentName, blocksFolder) {        
    if ( await MantraUtils.ExistsDirectory( blocksFolder) ) {
        for( const blockFile of await MantraUtils.ListFiles( blocksFolder ) ) {
            if ( blockFile.endsWith(".html") ) {
                const blockName = Path.parse(Path.basename(blockFile)).name;
                const blockAlreadyDefined = MantraAPI.ExistsBlock(componentName, blockName);

                if ( !blockAlreadyDefined ) {
                    MantraAPI.Hooks(componentName)
                        .Block( {
                            BlockName: blockName
                        });
                }
            }
        }
    }
}

async function lookupHookFromFile( MantraAPI, fullPathToFile, componentName ) {
    switch( lookupFileType( Path.basename(fullPathToFile), componentName ) ) {
        case CoreConstants.HOOKTYPES_ACCESSCONDITION: {
            lookupAccessConditionFile( MantraAPI, require(fullPathToFile), componentName );
        }
        break;
        case CoreConstants.HOOKTYPES_COMMAND: {
            lookupCommandFile( MantraAPI, require(fullPathToFile), componentName );
        }
        break;
        case CoreConstants.HOOKTYPES_API: {
            lookupApiFile( MantraAPI, require(fullPathToFile), componentName );
        }
        break;
        case CoreConstants.HOOKTYPES_BLOCK: {
            lookupBlockFile( MantraAPI, require(fullPathToFile), componentName );
        }
        break;
        case CoreConstants.HOOKTYPES_CRON: {
            lookupCronFile( MantraAPI, require(fullPathToFile), componentName );
        }
        break;
        case CoreConstants.HOOKTYPES_DAL: {
            lookupDalFile( MantraAPI, require(fullPathToFile), componentName );
        }
        break;
        case CoreConstants.HOOKTYPES_EVENT: {
            lookupEventFile( MantraAPI, require(fullPathToFile), componentName );
        }
        break;
        case CoreConstants.HOOKTYPES_MIDDLEWARE: {
            lookupMiddlewareFile( MantraAPI, require(fullPathToFile), componentName );
        }
        break;
        case CoreConstants.HOOKTYPES_POST: {
            lookupPostFile( MantraAPI, require(fullPathToFile), componentName );
        }
        break;
        case CoreConstants.HOOKTYPES_GET: {
            lookupGetFile( MantraAPI, require(fullPathToFile), componentName );
        }
        break;
        case CoreConstants.HOOKTYPES_PREREQUEST: {
            lookupPrerequestFile( MantraAPI, require(fullPathToFile), componentName );
        }
        break;
        case CoreConstants.HOOKTYPES_VIEW: {
            lookupViewFile( MantraAPI, require(fullPathToFile), componentName );
        }
    }   
}

function lookupFileType( fileName, componentName ) {
    const resource = MantraUtils.ExtractValues(fileName, "{resourcetype}.{component}.{extension}");

    if (resource && resource.component == componentName ) {
        switch( resource.resourcetype ) {
            case CoreConstants.ACCESSCONDITION_HOOK: {
                return CoreConstants.HOOKTYPES_ACCESSCONDITION;
            }
            case CoreConstants.COMMAND_HOOK: {
                return CoreConstants.HOOKTYPES_COMMAND;
            }
            case CoreConstants.API_HOOK: {
                return CoreConstants.HOOKTYPES_API;
            }
            case CoreConstants.BLOCK_HOOK: {
                return CoreConstants.HOOKTYPES_BLOCK;
            }
            case CoreConstants.EVENT_HOOK: {
                return CoreConstants.HOOKTYPES_EVENT;
            }
            case CoreConstants.PREREQUEST_HOOK: {
                return CoreConstants.HOOKTYPES_PREREQUEST;
            }
            case "dal": {
                return CoreConstants.HOOKTYPES_DAL;
            }
            case CoreConstants.VIEW_HOOK: {
                return CoreConstants.HOOKTYPES_VIEW;
            }
            case CoreConstants.POST_HOOK: {
                return CoreConstants.HOOKTYPES_POST;
            }
            case CoreConstants.GET_HOOK: {
                return CoreConstants.HOOKTYPES_GET;
            }
            case CoreConstants.MIDDLEWARE_HOOK: {
                return CoreConstants.HOOKTYPES_MIDDLEWARE;
            }
            case CoreConstants.CRON_HOOK: {
                return CoreConstants.HOOKTYPES_CRON;
            }
        }
        
        MantraConsole.warning( `File name '${fileName}' of component '${componentName}' doesn't match with Mantra pattern to define hooks`)
    }
    
    return CoreConstants.HOOKTYPES_UNKNOWN;
}

function lookupApiFile( MantraAPI, resourceModule, componentName ) {
    for( const apiName of Object.keys(resourceModule) ) {
        MantraAPI.Hooks(componentName)
            .Api( {
                APIName: apiName,
                APIHandler: resourceModule[apiName]
            });
    }   
}

function lookupViewFile( MantraAPI, resourceModule, componentName ) {
    for( const viewName of Object.keys(resourceModule) ) {
        if ( !viewName.endsWith("_prerequest") && !viewName.endsWith("_accesscondition") ) {
            if ( viewName != 'any' ) {
                MantraAPI.Hooks(componentName)
                    .View( {
                        Command: viewName,
                        Handler: resourceModule[viewName],
                        PreRequest: extraResource(resourceModule, viewName, "prerequest"),
                        AccessCondition: extraResource(resourceModule, viewName, "accesscondition")
                    } );
            }
        }
    }   

    // "*" view should be placed at the end of views hooks, cause 
    // it is registered in express after all views
    if ( resourceModule["any"] ) {
        let attributes = {
            Command: "*",
            Handler: resourceModule["any"],
            PreRequest: resourceModule['any_prerequest'] ? resourceModule['any_prerequest'] : undefined,
            AccessCondition: resourceModule['any_accesscondition'] ? resourceModule['any_accesscondition'] : undefined,
        };

        MantraAPI.Hooks(componentName)
            .View( attributes );
    }
}

function lookupCommandFile( MantraAPI, resourceModule, componentName ) {
    for( const commandName of Object.keys(resourceModule) ) {
        if ( !commandName.endsWith("_description") ) {
            MantraAPI.Hooks(componentName)
                .Command( {
                    Name: commandName,
                    Description: extraResource(resourceModule, commandName, "description"),
                    Handler: resourceModule[commandName]
                });
        }
    }   
}

function lookupBlockFile( MantraAPI, resourceModule, componentName ) {
    for( const blockName of Object.keys(resourceModule) ) {
        if ( !blockName.endsWith("_prerequest") && !blockName.endsWith("_accesscondition") && !blockName.endsWith("_isstatic") ) {
            MantraAPI.Hooks(componentName)
                .Block( {
                    BlockName: blockName,
                    RenderHandler: resourceModule[blockName],
                    Js: extraResource(resourceModule, blockName, "js"),
                    Css: extraResource(resourceModule, blockName, "css"),
                    PreRequest: extraResource(resourceModule, blockName, "prerequest"),
                    AccessCondition: extraResource(resourceModule, blockName, "accesscondition"),
                    IsStatic: extraResource(resourceModule, blockName, "isstatic")
                } );
         }
    }   
}

function lookupEventFile( MantraAPI, resourceModule, componentName ) {
    for( const eventName of Object.keys(resourceModule) ) {
        MantraAPI.Hooks(componentName)
            .Event( {
                EventName: eventName.replace("_","."),
                EventHandler: resourceModule[eventName]
            } );
    }   
}

function lookupAccessConditionFile( MantraAPI, resourceModule, componentName ) {
    for (const prName of Object.keys(resourceModule)) {
        if ( !prName.endsWith("_oncancel")) {
            MantraAPI.Hooks(componentName)
                .AccessCondition({
                    Name: `${componentName}.${prName}`,
                    Handler: resourceModule[prName],
                    OnCancel: extraResource(resourceModule, prName, "oncancel")
                });
        }
    }   
}

function lookupPrerequestFile( MantraAPI, resourceModule, componentName ) {
    for( const prName of Object.keys(resourceModule) ) {
        if ( !prName.endsWith("_oncancel")) {
           MantraAPI.Hooks(componentName)
                .PreRequest( {
                    Name: `${componentName}.${prName}`,
                    Handler: resourceModule[prName],
                    OnCancel: extraResource(resourceModule, prName, "oncancel")
                 });
        }
    }   
}

function lookupPostFile( MantraAPI, resourceModule, componentName ) {
    for (const postName of Object.keys(resourceModule)) {
        if (!postName.endsWith("_accesscondition") && !postName.endsWith("_prerequest") && !postName.endsWith("_datavalidationschema")) {
            MantraAPI.Hooks(componentName)
                .Post({
                    Command: postName,
                    Handler: resourceModule[postName],
                    DataValidationSchema: extraResource(resourceModule, postName, "datavalidationschema"),
                    AccessCondition: extraResource(resourceModule, postName, "accesscondition"),
                    PreRequest: extraResource(resourceModule, postName, "prerequest")
                });
        }
    }   
}

function lookupGetFile( MantraAPI, resourceModule, componentName ) {
    for (const getName of Object.keys(resourceModule)) {
        if (!getName.endsWith("_accesscondition") && !getName.endsWith("_prerequest") && !getName.endsWith("_datavalidationschema")) {
            MantraAPI.Hooks(componentName)
                .Get({
                    Command: getName,
                    Handler: resourceModule[getName],
                    DataValidationSchema: extraResource(resourceModule, getName, "datavalidationschema"),
                    AccessCondition: extraResource(resourceModule, getName, "accesscondition"),
                    PreRequest: extraResource(resourceModule, getName, "prerequest")
                });
        }
    }   
}

function lookupDalFile( MantraAPI, resourceModule, componentName ) {
    for (const repositoryMethod of Object.keys(resourceModule)) {
        MantraAPI.Hooks(componentName)
            .DAL( {
                Method: repositoryMethod,
                Handler: resourceModule[repositoryMethod]
            });
    }
}

function lookupMiddlewareFile( MantraAPI, resourceModule, componentName ) {
    for (const middlewareMethod of Object.keys(resourceModule)) {
        if ( !middlewareMethod.endsWith("weight") ) {
            if ( existsExtraResource(resourceModule, middlewareMethod, "weight") ) {
                MantraAPI.Hooks(componentName)
                    .Middleware({
                        MiddlewareHandler: resourceModule[middlewareMethod],
                        Weight: extraResource( resourceModule, middlewareMethod, "weight")
                    });
            } else {
                MantraAPI.Hooks(componentName)
                    .Middleware({
                        MiddlewareHandler: resourceModule[middlewareMethod]
                    });
            }    
        }
    }
}

function lookupCronFile( MantraAPI, resourceModule, componentName ) {
    for( const cronMethod of Object.keys(resourceModule) ) {
        if ( !cronMethod.endsWith("config") ) {
            if ( existsExtraResource(resourceModule, cronMethod, "config") ) {
                MantraAPI.Hooks(componentName)
                    .Cron( {
                        CronHandler: resourceModule[cronMethod],
                        CronConfig: extraResource( resourceModule, cronMethod, "config" )
                    });
            } else {
                MantraConsole.warning(`No existing cron config for '${cronMethod}' method in component '${componentName}'`)
            }
        }
    }
}

/*
 * Returns true if exists a in the module resourceModule, a function
 * named a "<resourceName>_<sufix>"
 */
function existsExtraResource(resourceModule, resourceName, sufix) {
    return resourceModule[`${resourceName}_${sufix}`] != null;
}

/*
 * Checks if there exists in the module resourceModule, a function
 * named as "<resourceName>_<sufix>"; if so, it is return, if not, undefined is returned.
 */
function extraResource(resourceModule, resourceName, sufix ) {
    return resourceModule[`${resourceName}_${sufix}`] ? resourceModule[`${resourceName}_${sufix}`] : undefined;
}