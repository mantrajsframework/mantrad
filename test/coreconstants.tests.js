const assert = require("chai").assert;

require("gimport").initm( process.cwd() );

const CoreConstants = global.gimport("coreconstants");

describe( 'CoreComponents tests', () => {
    it( '# Check default modules', () => {
        for( const coreComponent of CoreConstants.CORE_COMPONENTS ) {
            assert.isTrue( CoreConstants.IsCoreComponent(coreComponent) );
        }
    });
});