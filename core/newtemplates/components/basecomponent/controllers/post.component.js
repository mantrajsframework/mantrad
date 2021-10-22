"use strict";

module.exports = {
    postmethod : async ( req, res ) => {
        const Mantra = res.MantraAPI;

        Mantra.SendStatus(200);
    }
}