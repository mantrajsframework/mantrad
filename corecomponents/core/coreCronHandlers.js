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