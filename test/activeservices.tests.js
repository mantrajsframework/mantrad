const assert = require("chai").assert;

require("gimport").initm( process.cwd() );

let ActiveServices = undefined;

describe( 'AssetsLocations tests', () => {
    before( async () => {
        await require("./testshelper").initializeMantra();
        
        ActiveServices = global.gimport("activeservices");
    }),

    it( '# extractActiveServicesByComponent test 1 component', () => {
        const result = ActiveServices.extractActiveServicesByComponent( ["component"]);

        assert.isTrue( result["component"] != null );
        assert.isTrue( result["component"].length == 1 )
        assert.isTrue( result["component"][0] == '*' )
    });
});
