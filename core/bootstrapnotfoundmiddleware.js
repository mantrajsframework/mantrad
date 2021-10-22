"use strict";

const Path = require("path");
const MantraConsole = global.gimport("mantraconsole");

module.exports = {
    NotFound: async (req, res) => {
        let mc = global.Mantra.MantraConfig; 

        // Check if is other kind of frontend document        
        if ( await res.MantraAPI.Utils.FileExists( Path.join( mc.FrontendLocation, req.path ) ) ) {
            res.MantraAPI.RenderRoot(req.path);
        } else {
            MantraConsole.warning(`Unknown path requested for ${req.path}`);
        
            if ( mc.NotFoundRedirect ) {
                if ( await res.MantraAPI.Utils.FileExists( Path.join( mc.FrontendLocation, mc.NotFoundRedirect ) ) ) {
                    res.MantraAPI.RenderRoot(mc.NotFoundRedirect);
                } else {
                    MantraConsole.warning(`Not found file ${mc.NotFoundRedirect} doesn't exist`);
                    res.MantraAPI.SendStatus(404);    
                }
            } else {
                res.MantraAPI.SendStatus(404);
            }
        }
    }
}