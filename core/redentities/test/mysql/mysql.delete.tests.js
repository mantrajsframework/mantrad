const { assert } = require("chai");

const RedEntitiesConfig = require("../providersconfig.json").mysqlproviderconfig;
const testSchema = require("../testschema.json");

const RedEntities = require("../../lib/redentities")(RedEntitiesConfig);
const RedEntitiesTestUtils = require("../lib/redentitiestestutils");
const db = RedEntities.Entities(testSchema);

async function insertSampleUserEntity() {
    let entity = { name: RedEntitiesTestUtils.EntityShortId(), alias: RedEntitiesTestUtils.EntityShortId() };

    entity.ID = await db.Insert( "users" )
        .Values( entity )
        .Run()

    return entity;
}

describe( 'Mysql Redentities delete tests', () => {
    before( async () => {
        await db.RemoveAndCreateDatabase( RedEntitiesConfig.database );
        await RedEntities.Entities( testSchema ).CreateSchema();            
    });

    after( async() => {
        await require("../../lib/providers/mysql/MySqlConnector").ClearPool();
    });

    it( '# Mysql Delete simple entity by ID', async () => {
        let user = await insertSampleUserEntity();
        await db.Delete("users").DeleteById( user.ID );

        assert.equal( 0, await db.users.S().W("ID=?", user.ID).C() );
    });

    it( '# Mysql Delete simple entity by field', async () => {
        let user = await insertSampleUserEntity();
        await db.Delete("users").Where( "name = ?", user.name ).Run();
    });

    it( '# Mysql Delete get query string', async () => {
        let user = await insertSampleUserEntity();
        let sqlQuery = await db.Delete("users").Where( "name = ?", user.name ).Q();

        assert.isString( sqlQuery );
    });
});