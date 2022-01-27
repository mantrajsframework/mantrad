"use strict";

module.exports = {
    getmethod : async ( req, res ) => {
        const Mantra = res.MantraAPI;

        Mantra.SendStatus(200);
    }
}