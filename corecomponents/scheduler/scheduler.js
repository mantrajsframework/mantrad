/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const CronJob = require("cron").CronJob;

let allJobs = [];

class SchedulerStarter {
    async onSystemStarted( Mantra ) {
        if ( Mantra.IsServiceActive("cron") ) {
            for( const cron of Mantra.GetHooksByName("cron") ) {                
                allJobs.push( new CronJob( cron.CronConfig, cron.CronHandler, null, true, "Europe/Madrid" ) );
            }
        }
    }
}

module.exports = () => {
    return {
        Start: new SchedulerStarter()
    }
}