/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const CronJob = require("cron").CronJob;

let allJobs = [];

class SchedulerStarter {
    async onSystemStarted( MantraAPI ) {
        if ( global.Mantra.MantraConfig.isServiceActive("cron") ) {
            for( let c of MantraAPI.GetHooksByName("cron") ) {                
                
                console.log(c);
                //allJobs.push( new CronJob( c.CronConfig, c.CronHandler, null, true, "Europe/Madrid" ) );
            }
        }
    }
}

module.exports = () => {
    return {
        Start: new SchedulerStarter()
    }
}