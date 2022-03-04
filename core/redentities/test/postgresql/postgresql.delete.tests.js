/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

const { assert } = require("chai");

const RedEntitiesConfig = require("../providersconfig.json").postgresqlproviderconfig;
const RedEntitiesTestUtils = require("../lib/redentitiestestutils");
const RedEntities = require("../../lib/redentities")(RedEntitiesConfig);

const testSchema = require("../testschema.json");
const db = RedEntities.Entities(testSchema);

describe( 'Postgres Redentities delete tests', () => {
    before( async () => {
        await db.RemoveAndCreateDatabase( RedEntitiesConfig.database );
        await RedEntities.Entities( testSchema ).CreateSchema();            
    });

    after( async () => {
        await require("../../lib/providers/postgresql/PostgresqlConnector").ClearPool();
    });

    it( '# Postgres Delete simple entity by ID', async () => {
        let user = await RedEntitiesTestUtils.InsertSampleUserEntity(db);
        await db.Delete("users").DeleteById( user.ID );

        assert.equal( 0, await db.users.S().W("ID=?", user.ID).C() );
    });

    it( '# Postgres Delete simple entity by field', async () => {
        let user = await RedEntitiesTestUtils.InsertSampleUserEntity(db);
        await db.Delete("users").Where( "name = ?", user.name ).Run();
    });

    it( '# Postgres Delete get query string', async () => {
        let user = await RedEntitiesTestUtils.InsertSampleUserEntity(db);
        let sqlQuery = await db.Delete("users").Where( "name = ?", user.name ).Q();

        assert.isString( sqlQuery );
    });
});