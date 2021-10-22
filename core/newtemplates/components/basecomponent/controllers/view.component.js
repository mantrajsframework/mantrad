"use strict";

module.exports = {
    defaultview: async (req,res) => {
        const Mantra = res.MantraAPI;

        Mantra.RenderView( "{{name}}.defaultview" );
    }
}
