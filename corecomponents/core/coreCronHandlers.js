/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

module.exports = {
    EmitCleanUpEvent: async () => {
        let api = global.Mantra.MantraAPIFactory();
        
        try {            
            return api.EmitEvent( "system.cleanup", {} );
        } catch(err) {
            await api.LogError(err.message, err);
        }
    },

    EmitBackupEvent: async () => {
        let api = global.Mantra.MantraAPIFactory();

        try {
            return api.EmitEvent( "system.backup", {} );
        } catch(err) {
            await api.LogError(err.message, err);
        }
    }
}