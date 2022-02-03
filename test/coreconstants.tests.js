const assert = require("chai").assert;
const CronValidator = require("cron-validator");

const TestsHelper = require("./testshelper");
require("gimport").initm( process.cwd() );

const CoreConstants = global.gimport("coreconstants");

describe( 'CoreComponents tests', () => {
    it( '# Check default modules', () => {
        for( const coreComponent of CoreConstants.CORE_COMPONENTS ) {
            assert.isTrue( CoreConstants.IsCoreComponent(coreComponent) );
        }
    });

    it( '# Check cron aliases names', () => {
        for( const cronAlias of Object.keys(CoreConstants.CRONALIASES) ) {
            assert.isTrue( typeof cronAlias == 'string' );
        }
    });

    it( '# Check cron aliases values', () => {
        for( const cronAlias of Object.keys(CoreConstants.CRONALIASES) ) {
            const cronConfig = CoreConstants.CRONALIASES[cronAlias];

            assert.isTrue( CronValidator.isValidCron(cronConfig, { seconds: true }));
        }
    });

    it( '# Check node versions supported', () => {
        for( const nodeVersion of CoreConstants.NODESUPPORTEDVERSIONS ) {
            assert.isNumber( nodeVersion );
            assert.isTrue( nodeVersion >= 12 );
        }
    });

    it( '# Check Mantra web site constant', () => {
        assert.isTrue( TestsHelper.isValidUrl(CoreConstants.MANTRAWEBSITE) );
    });

    it( '# Check Mantra api endpoint constant', () => {
        assert.isTrue( TestsHelper.isValidUrl(CoreConstants.APIMANTRAWEBSITEENDPOINT) );
    });

    it( '# Check Mantra support mail constant', () => {
        assert.isTrue( TestsHelper.isValidMail(CoreConstants.MANTRASUPPORTMAIL) );
    });
});