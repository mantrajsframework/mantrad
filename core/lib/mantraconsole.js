/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const Chalk = require("chalk");
const Moment = require("moment");

let currentAppName = "";

module.exports = {
    setAppName: (appName) => {
        currentAppName = appName;
    },

    rawInfo(msg) { console.log(msg); },

    info(msg, withDate) {
        ShowMessage( msg, 'green', withDate );
    },

    warning(msg, withDate) {
        ShowMessage( msg, 'orange', withDate );
    },

    error(msg, withDate) {
        ShowMessage( msg, 'red', withDate );
    },

    async question(msg, allowEmpty) {        
        const ae = typeof allowEmpty == 'boolean' ? allowEmpty : true;        
        let answer = await Question(msg);

        while( !ae && answer == "" ) {
            answer = await Question(msg);
        }

        return answer;
    },
    
    newline() {
        console.log('');
    },

    async questionWithOpts( msg, opts ) {
        let i = 0;

        for( const opt of opts ) {
            console.log( Chalk.keyword('white')(`${++i}) ${opt}`) );
        }

        let optSelected = parseInt( await Question(msg) );

        while( !(optSelected > 0 && optSelected < opts.length+1) ) {
            console.log( Chalk.keyword('orange')(`Selecte between ${1} and ${opts.length}`) );

            optSelected = parseInt( await Question(msg) );
        }

        return optSelected-1;
    }
}

function ShowMessage( msg, color, withDate) {
    let showDate = typeof withDate == 'undefined' ? true : withDate;

    if ( currentAppName && currentAppName !== "" ) {
        if (showDate) {
            console.log( `(${currentAppName}) ${Chalk.keyword(color)(FormatWithDateTime(msg))}` );
        } else {
            console.log( `(${currentAppName}) ${Chalk.keyword(color)(msg)}` );
        }
    } else {
        if (showDate) {
            console.log( `${Chalk.keyword(color)(FormatWithDateTime(msg))}` );
        } else {
            console.log( `${Chalk.keyword(color)(msg)}` );
        }
    }
}

function FormatWithDateTime(msg) {
    return `${Moment(Date.now()).format("DD-MM-YYYY HH:mm:ss")} - ${msg}`;
}

async function Question(msg) {
    const rli = require("readline").createInterface(process.stdin, process.stdout);

    return new Promise( (resolve,reject) => {        
        rli.question(msg, (answer) => {
            rli.close();
            resolve(answer);
        } );
    })
}