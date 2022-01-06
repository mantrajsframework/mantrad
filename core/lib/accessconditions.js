"use strict";

const MantraConsole = global.gimport("mantraconsole");

module.exports = {
    /*
     * Checks access conditions for the current state of a request
     * Returns an object: {
     *    allowed: <boolean indicating if all access conditions passed>
     *    accessConditionToInvoke: <if allowed is false, access condition which return false>
     * }
     */
    async checkAC( conditions, req, res ) {
        for( const ac of conditions ) {
            let acName = "";
            const t = typeof ac;
            let goOn;

            switch( typeof ac ) {
                case 'string': {
                    acName = ac;
                }
                break;
                case 'object': {
                    acName = ac.Name;    
                }
                break;
                case 'function': {
                    return { allowed: await ac( req, res ) };    
                }
                default: throw Error( `Unkown type or ${t} for access condition ${ac}`);
            }

            if (global.Mantra.Bootstrap.ExistsAccessCondition( acName )) {
                const accessConditionToInvoke = global.Mantra.Bootstrap.GetAccessCondition( acName );
                goOn = await accessConditionToInvoke.Handler( req, res );
    
                if ( !goOn ) {
                    return { allowed: false, 
                             accessConditionFalse: accessConditionToInvoke, 
                             redirect: ac.Redirect ? ac.Redirect : "/" };
                }
            } else {
                MantraConsole.error( `Unable to call no existing access condition of name '${acName}'`);
            }
        }    

        return { allowed: true };       
    }
}