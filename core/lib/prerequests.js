"use strict";

module.exports = {
    /*
     * Check prerequests for a component name and command
     * Returns true if should go on. false otherwise.
     * If false, then according to the prequest, a redirect will be preformed
     */
    async checkPR(componentName, command, req, res ) {
        let resource;
        const bootstrap = global.Mantra.Bootstrap;

        if ( bootstrap.ExistsView( componentName, command) ) {
            resource = bootstrap.GetView( componentName, command );
        } else if ( bootstrap.ExistsGet( componentName, command) ) {
            resource = bootstrap.GetGet( componentName, command );
        } else return true;


        if ( resource && typeof resource.PreRequest != 'undefined' ) {
            for( const prName of resource.PreRequest ) {
                const preRequest = bootstrap.GetPreRequest(prName);
                
                if ( !preRequest ) throw Error(`Unable to locate PreRequest ${prName} for path ${req.path}`);

                if ( !(await preRequest.Handler( res.MantraAPI, req )) ) {
                    if ( preRequest.OnCancel ) {
                        await preRequest.OnCancel(res.MantraAPI);
                    } else {
                        res.redirect("/");
                    }

                    return false;
                }
            }
        }

        return true;
    }
}