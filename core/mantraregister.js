/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const CronValidator = require("cron-validator");
const CoreConstants = global.gimport("coreconstants");

class MantraRegister {
    constructor( MantraAPI, componentName, activeServices ) {
        this.MantraAPI = MantraAPI;
        this.componentName = componentName;
        this.activeServices = activeServices;
    }

    R( hook, data ) {
        if ( this.shouldBeRegistered(hook) ) {
            for( let item of data.length ? data : [data] ) {
                item.Component = this.componentName;
                
                this.MantraAPI.Register( hook, item );
            }
        }

        return this;
    }

    View( data ) {
        const viewsToRegister = Array.isArray(data) ? data : [data];

        for( const viewData of viewsToRegister ) {
            this.checkPropertyExists( "Command", CoreConstants.VIEW_HOOK, viewData );
            this.checkPropertyExists( "Handler", CoreConstants.VIEW_HOOK, viewData );
            this.checkPropertyType( "Command", CoreConstants.VIEW_HOOK, viewData, 'string' );
            this.checkPropertyType( "Handler", CoreConstants.VIEW_HOOK, viewData, 'function' );
            this.checkOptionalPropertyType( "AccessCondition", CoreConstants.VIEW_HOOK, viewData, ['string', 'object'] );
            this.checkOptionalPropertyType( "PreRequest", CoreConstants.VIEW_HOOK, viewData, ['string', 'object'] );
            this.checkOptionalPropertyType( "Js", CoreConstants.VIEW_HOOK, viewData, ['object', 'string'] );
            this.checkOptionalPropertyType( "Css", CoreConstants.VIEW_HOOK, viewData, ['object', 'string'] );
        }
        
        return this.R( CoreConstants.VIEW_HOOK, data );
    }

    Get( data ) {
        const getsToRegister = Array.isArray(data) ? data : [data];

        for( const getData of getsToRegister ) {
            this.checkPropertyExists( "Command", CoreConstants.GET_HOOK, getData );
            this.checkPropertyExists( "Handler", CoreConstants.GET_HOOK, getData );
            this.checkPropertyType( "Command", CoreConstants.GET_HOOK, getData, 'string' );
            this.checkPropertyType( "Handler", CoreConstants.GET_HOOK, getData, 'function' );
            this.checkOptionalPropertyType( "AccessCondition", CoreConstants.GET_HOOK, getData, ['string', 'object'] );
            this.checkOptionalPropertyType( "PreRequest", CoreConstants.GET_HOOK, getData, ['string', 'object'] );
        }

        return this.R( CoreConstants.GET_HOOK, data );
    }

    Post( data ) {
        const postsToRegister = Array.isArray(data) ? data : [data];

        for( const postData of postsToRegister ) {
            this.checkPropertyExists( "Command", CoreConstants.POST_HOOK, postData );
            this.checkPropertyExists( "Handler", CoreConstants.POST_HOOK, postData );
            this.checkPropertyType( "Command", CoreConstants.POST_HOOK, postData, 'string' );
            this.checkPropertyType( "Handler", CoreConstants.POST_HOOK, postData, 'function' );
            this.checkOptionalPropertyType( "AccessCondition", CoreConstants.POST_HOOK, postData, ['string', 'object'] );
            this.checkOptionalPropertyType( "PreRequest", CoreConstants.POST_HOOK, postData, ['string', 'object'] );
        }

        return this.R( CoreConstants.POST_HOOK, data );
    }

    Api( data ) {
        const apisToRegister = Array.isArray(data) ? data : [data];

        for( const apiData of apisToRegister ) {
            this.checkPropertyExists( "APIName", CoreConstants.API_HOOK, apiData );
            this.checkPropertyExists( "APIHandler", CoreConstants.API_HOOK, apiData );
            this.checkPropertyType( "APIName", CoreConstants.API_HOOK, apiData, 'string' );
            this.checkPropertyType( "APIHandler", CoreConstants.API_HOOK, apiData, 'function' );
        }

        return this.R( CoreConstants.API_HOOK, data );
    }

    Block( data ) {
        const blocksToRegister = Array.isArray(data) ? data : [data];

        for( const blockData of blocksToRegister ) {
            this.checkPropertyExists( "BlockName", CoreConstants.BLOCK_HOOK, blockData );
            this.checkPropertyType( "BlockName", CoreConstants.BLOCK_HOOK, blockData, 'string' );
            this.checkOptionalPropertyType( "Js", CoreConstants.BLOCK_HOOK, blockData, ['object','string'] );
            this.checkOptionalPropertyType( "Css", CoreConstants.BLOCK_HOOK, blockData, ['object', 'string'] );
            this.checkOptionalPropertyType( "AccessCondition", CoreConstants.BLOCK_HOOK, blockData, ['string', 'object'] );
            this.checkOptionalPropertyType( "PreRequest", CoreConstants.BLOCK_HOOK, blockData, ['string', 'object'] );
            this.checkOptionalPropertyType( "RenderHandler", CoreConstants.BLOCK_HOOK, blockData, ['function'] );
            this.checkOptionalPropertyType( "IsStatic", CoreConstants.BLOCK_HOOK, blockData, ['boolean'] );
        }
        
        return this.R( CoreConstants.BLOCK_HOOK, data );
    }

    Middleware( data ) {
        const middlewaresToRegister = Array.isArray(data) ? data : [data];

        for( const middlewareData of middlewaresToRegister ) {
            this.checkPropertyExists( "MiddlewareHandler", CoreConstants.MIDDLEWARE_HOOK, middlewareData );
            this.checkPropertyType( "MiddlewareHandler", CoreConstants.MIDDLEWARE_HOOK, middlewareData, 'function' );
            this.checkOptionalPropertyType( "Weight", CoreConstants.MIDDLEWARE_HOOK, middlewareData, ['number'] );
        }

        return this.R( CoreConstants.MIDDLEWARE_HOOK, data );
    }

    Event( data ) {
        const eventsToRegister = Array.isArray(data) ? data : [data];

        for( const eventData of eventsToRegister ) {
            this.checkPropertyExists( "EventName", CoreConstants.EVENT_HOOK, eventData );
            this.checkPropertyType( "EventName", CoreConstants.EVENT_HOOK, eventData, 'string' );
            this.checkPropertyExists( "EventHandler", CoreConstants.EVENT_HOOK, eventData );
            this.checkPropertyType( "EventHandler", CoreConstants.EVENT_HOOK, eventData, 'function' );
        }

        return this.R( CoreConstants.EVENT_HOOK, data );
    }

    Cron( data ) {   
        const cronsToRegister = Array.isArray(data) ? data : [data];

        for( const cronItem of cronsToRegister ) {
            this.checkPropertyExists( "CronConfig", CoreConstants.CRON_HOOK, cronItem );
            this.checkPropertyExists( "CronHandler", CoreConstants.CRON_HOOK, cronItem );
            this.checkPropertyType( "CronConfig", CoreConstants.EVENT_HOOK, cronItem, 'string' );
            this.checkPropertyType( "CronHandler", CoreConstants.EVENT_HOOK, cronItem, 'function' );
            cronItem.CronConfig = this.checkAndTranslateCronConfiguration( cronItem.CronConfig );
        }
        
        return this.R( CoreConstants.CRON_HOOK, data );
    }

    AccessCondition( data ) {
        const acToRegister = Array.isArray(data) ? data : [data];

        for( const acData of acToRegister ) {
            this.checkPropertyExists( "Name", CoreConstants.ACCESSCONDITION_HOOK, acData );
            this.checkPropertyExists( "Handler", CoreConstants.ACCESSCONDITION_HOOK, acData );
            this.checkPropertyType( "Name", CoreConstants.ACCESSCONDITION_HOOK, acData, 'string' );
            this.checkPropertyType( "Handler", CoreConstants.ACCESSCONDITION_HOOK, acData, 'function' );

        }
        
        return this.R( CoreConstants.ACCESSCONDITION_HOOK, data );
    }
        
    PreRequest( data ) {
        const prToRegister = Array.isArray(data) ? data : [data];

        for( const prData of prToRegister ) {
            this.checkPropertyExists( "Name", CoreConstants.PREREQUEST_HOOK, prData );
            this.checkPropertyExists( "Handler", CoreConstants.PREREQUEST_HOOK, prData );
            this.checkPropertyType( "Name", CoreConstants.PREREQUEST_HOOK, prData, 'string' );
            this.checkPropertyType( "Handler", CoreConstants.PREREQUEST_HOOK, prData, 'function' );

        }
        
        return this.R( CoreConstants.PREREQUEST_HOOK, data );
    }
    
    Command( data ) {
        const cmdsToRegister = Array.isArray(data) ? data : [data];

        for( const cmdData of cmdsToRegister ) {
            this.checkPropertyExists( "Name", CoreConstants.COMMAND_HOOK, cmdData );
            this.checkPropertyExists( "Description", CoreConstants.COMMAND_HOOK, cmdData );
            this.checkPropertyExists( "Handler", CoreConstants.COMMAND_HOOK, cmdData );
            this.checkPropertyType( "Name", CoreConstants.COMMAND_HOOK, cmdData, 'string' );
            this.checkPropertyType( "Description", CoreConstants.COMMAND_HOOK, cmdData, 'string' );
            this.checkPropertyType( "Handler", CoreConstants.COMMAND_HOOK, cmdData, 'function' );
        }
        
        return this.R( CoreConstants.COMMAND_HOOK, data );
    }

    ApiExtend( data ) {
        const apisToRegister = Array.isArray(data) ? data : [data];

        for( const apiData of apisToRegister ) {
            this.checkPropertyExists( "Name", CoreConstants.APIEXTEND_HOOK, apiData );
            this.checkPropertyExists( "Handler", CoreConstants.APIEXTEND_HOOK, apiData );
            this.checkPropertyType( "Name", CoreConstants.APIEXTEND_HOOK, apiData, 'string' );
            this.checkPropertyType( "Handler", CoreConstants.APIEXTEND_HOOK, apiData, 'function' );

        }
        
        return this.R( CoreConstants.APIEXTEND_HOOK, data );
    }

    DAL( data ) {
        const dalsToRegister = Array.isArray(data) ? data : [data];

        for( const dalData of dalsToRegister ) {
            this.checkPropertyExists( "Method", CoreConstants.DAL_HOOK, dalData );
            this.checkPropertyExists( "Handler", CoreConstants.DAL_HOOK, dalData );
            this.checkPropertyType( "Method", CoreConstants.DAL_HOOK, dalData, 'string' );
            this.checkPropertyType( "Handler", CoreConstants.DAL_HOOK, dalData, 'function' );

        }
        
        return this.R( CoreConstants.DAL_HOOK, data );
    }

    Extend( data ) {
        const extendsToRegister = Array.isArray(data) ? data : [data];

        for( const extendData of extendsToRegister ) {
            this.checkPropertyExists( "Type", CoreConstants.EXTEND_HOOK, extendData );
            this.checkPropertyType( "Type", CoreConstants.EXTEND_HOOK, extendData, 'string' );
         
        }
        
        return this.R( CoreConstants.EXTEND_HOOK, data );
    }

    checkPropertyExists( propertyName, hookType, data ) {
        if ( !data[propertyName] ) throw Error(`'${propertyName}' property missing at ${hookType} of component ${this.componentName}. Data: ${JSON.stringify(data)}`);    
    }

    checkPropertyType( propertyName, hookType, data, type ) {
        const types = Array.isArray(type) ? type : [type];

        for( const t of types ) {
            if ( typeof data[propertyName] == t ) return;
        }

        throw Error(`'${propertyName}' invalid property type at ${hookType} of component ${this.componentName}. Data: ${JSON.stringify(data)}`)
    }    

    checkOptionalPropertyType( propertyName, hookType, data, type ) {
        if ( data[propertyName] ) {
            this.checkPropertyType( propertyName, hookType, data, type );
        }
    }

    isCronAlias( cronConfig ) {
        return Object.keys(CoreConstants.CRONALIASES).includes(cronConfig);
    }

    checkAndTranslateCronConfiguration( cronConfig ) {
        if ( this.isCronAlias(cronConfig) ) {
            return CoreConstants.CRONALIASES[cronItem.CronConfig];
        } 

        if ( CronValidator.isValidCron(cronConfig, { seconds: true }) ) {
            return cronConfig;
        } else {
            const componentConfig = this.MantraAPI.GetComponentConfig( this.componentName );
            if ( componentConfig[cronConfig] == null ) {
                throw Error(`Unable to load ${cronConfig} configuration for component ${this.componentName} when configuring cron`);
            }

            const componentConfigCronConfig = componentConfig[cronConfig]; 

            if ( this.isCronAlias(componentConfigCronConfig) ) {
                return CoreConstants.CRONALIASES[componentConfigCronConfig];
            } 

            if ( !CronValidator.isValidCron(componentConfigCronConfig, { seconds: true }) ) {
                throw Error(`Invalid cron config of ${componentConfigCronConfig} in component ${this.componentName}`);
            }

            return componentConfigCronConfig;
        }
    }
    
    // Check if "ComponentActiveServices allows to register this"
    // activeServices is undefined for core components
    shouldBeRegistered(hook) {
        return CoreConstants.IsCoreComponent(this.componentName) || 
               (this.activeServices && (this.activeServices.includes("*") || 
               this.activeServices.includes(hook)))
    }
}

module.exports = (MantraAPI, componentName, activeServices) => new MantraRegister(MantraAPI, componentName, activeServices);