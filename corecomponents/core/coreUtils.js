/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

module.exports = {
    GetComponentAndCommand: (path) => {
        let s = path.split('/');

        if ( s.length >= 3 ) {
            const componentName = s[1];
            s.shift();
            s.shift();

            return {
                componentName: componentName,
                command: s.join('/')
            }
        }

        return undefined;
    }
}