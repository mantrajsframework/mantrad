"use strict";

module.exports = {
    cronsample_config: "*/1 * * * * *",
    cronsample: async () => {
        console.log( new Date() );
    }
}