"use strict";

const CronJob = require("cron").CronJob;

var allJobs = [];

class SchedulerStarter {
    async onStart( MantraAPI ) {
    }

    async onSystemStarted( MantraAPI ) {
        if ( global.Mantra.MantraConfig.isServiceActive("cron") ) {
            let cronRegistered = MantraAPI.GetHooksByName("cron");
    
            for( let i = 0; i < cronRegistered.length; i++ ) {
                
                let c = cronRegistered[i];
                let newJob = new CronJob( c.CronConfig, c.CronHandler, null, true, "Europe/Madrid");
                
                allJobs.push( newJob );
            }
        }
    }
}

var MantraComponent = {};

MantraComponent.Start = new SchedulerStarter();

module.exports = () => {
    return MantraComponent;
}