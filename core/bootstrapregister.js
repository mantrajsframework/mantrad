"use strict";

const MantraConsole = global.gimport("mantraconsole");

module.exports = {
    registerAPIs( apis ) {
        let apiHandlers = [];

        for( let api of apis ) {
            let fullApiName = `${api.Component}.${api.APIName}`;
            apiHandlers[fullApiName] = api;
        }

        return apiHandlers;
    },

    registerGets( app, resources ) {
        for( let resource of resources ) {
            try {
                const urlPath = `/${resource.Component}/${resource.Command}`;

                app.get( urlPath, resource.Handler );
            } catch(err) {
                MantraConsole.error( `Unable to register resource (get) with path ${urlPath}. Check configuration.`);
            }
        }
    },

    registerMiddlewares( app, middlewares ) {
        for( let middleware of middlewares ) {
            try {
                app.use( middleware.MiddlewareHandler );
            } catch(err) {
                MantraConsole.error( 'Unable to register middleware', middleware );
            }
        }
    },

    registerPosts( app, posts ) {
        for( let post of posts ) {
            const urlPath = `/${post.Component}/${post.Command}`;

            try {
                app.post( urlPath, post.Handler );
            } catch(err) {
                MantraConsole.error( `Unable to register post with path ${urlPath}. Check configuration.`);
            }
        }
    },

    registerViews( app, views ) {
        for( let view of views ) {
            try {
                const urlPath = `/${view.Component}/${view.Command}`;

                app.get( urlPath, view.Handler );
            } catch(err) {
                MantraConsole.error( `Unable to register view with path ${urlPath}. Check configuration.`);
            }
        }
    }
}