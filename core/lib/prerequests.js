/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const MantraConsole = global.gimport("mantraconsole");

module.exports = {
    /*
     * Check prerequests for a component name and command
     * Returns true if should go on. false otherwise.
     * If false, then according to the prequest, a redirect will be preformed
     */
    async checkPR(componentName, command, req, res ) {
        const bootstrap = global.Mantra.Bootstrap;
        let resource;

        if ( bootstrap.ExistsView( componentName, command) ) {
            resource = bootstrap.GetView( componentName, command );
        } else if ( bootstrap.ExistsGet( componentName, command) ) {
            resource = bootstrap.GetGet( componentName, command );
        } else return true;

        if ( resource && typeof resource.PreRequest != 'undefined' ) {
            for( const prName of resource.PreRequest ) {
                const preRequest = bootstrap.GetPreRequest(prName);
                
                if ( preRequest ) {
                    if ( !(await preRequest.Handler( res.MantraAPI, req )) ) {
                        if ( preRequest.OnCancel ) {
                            await preRequest.OnCancel(res.MantraAPI);
                        } else {
                            res.redirect("/");
                        }
    
                        return false;
                    }
                } else {
                    MantraConsole.error( `Unable to call no existing prerequest of name '${prName}'`);
                    return false;
                }
            }
        }

        return true;
    }
}