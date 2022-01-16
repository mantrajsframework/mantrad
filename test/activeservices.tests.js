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

        assert.isTrue( Object.keys(result).length == 1 );
        assert.isTrue( result["component"] != null );
        assert.isTrue( result["component"].length == 1 );
        assert.isTrue( result["component"][0] == '*' );
    });

    it( '# extractActiveServicesByComponent test multiple', () => {
        const result = ActiveServices.extractActiveServicesByComponent( ["component1", "component2"]);

        assert.isTrue( Object.keys(result).length == 2 );
        assert.isTrue( result["component1"] != null );
        assert.isTrue( result["component1"].length == 1 )
        assert.isTrue( result["component2"] != null );
        assert.isTrue( result["component2"].length == 1 )
        assert.isTrue( result["component1"][0] == '*' );
        assert.isTrue( result["component2"][0] == '*' );
    });

    it( '# extractActiveServicesByComponent test 1 component with 1 service', () => {
        const result = ActiveServices.extractActiveServicesByComponent( ["component/api"]);

        assert.isTrue( Object.keys(result).length == 1 );
        assert.isTrue( result["component"] != null );
        assert.isTrue( result["component"].length == 1 );
        assert.isTrue( result["component"][0] == 'api' );
    });

    it( '# extractActiveServicesByComponent test 1 component with services', () => {
        const result = ActiveServices.extractActiveServicesByComponent( ["component/api,middleware,get"]);

        assert.isTrue( Object.keys(result).length == 1 );
        assert.isTrue( result["component"] != null );
        assert.isTrue( result["component"].length == 3 );
        assert.isTrue( result["component"].includes('api') );
        assert.isTrue( result["component"].includes('middleware') );
        assert.isTrue( result["component"].includes('get') );
    });
});
