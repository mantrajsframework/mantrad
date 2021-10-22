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