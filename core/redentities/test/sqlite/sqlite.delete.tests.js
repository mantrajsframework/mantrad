/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

const assert = require("chai").assert;

const RedEntitiesConfig = require("../providersconfig.json").sqliteproviderconfig;
const RedEntitiesTestUtils = require("../lib/redentitiestestutils");
const testSchema = require("../testschema.json");

const RedEntities = require("../../lib/redentities")(RedEntitiesConfig);
const db = RedEntities.Entities(testSchema);

async function insertSampleUserEntity() {
    let entity = { name: RedEntitiesTestUtils.EntityShortId(), alias: RedEntitiesTestUtils.EntityShortId() };

    entity.ID = await db.Insert( "users" )
        .Values( entity )
        .Run()

    return entity;
}

describe( 'Sqlite Redentities delete tests', () => {
    before( async () => {
        await db.RemoveAndCreateDatabase( RedEntitiesConfig.database );
        await RedEntities.Entities( testSchema ).CreateSchema();            
    });

    it( '# Sqlite Delete simple entity by ID', async () => {
        let user = await insertSampleUserEntity();
        await db.Delete("users").DeleteById( user.ID );

        assert.equal( 0, await db.users.S().W("ID=?", user.ID).C() );
    });

    it( '# Sqlite Delete simple entity by field', async () => {
        let user = await insertSampleUserEntity();
        await db.Delete("users").Where( "name = ?", user.name ).Run();
    });

    it( '# Sqlite Delete get query string', async () => {
        let user = await insertSampleUserEntity();
        let sqlQuery = await db.Delete("users").Where( "name = ?", user.name ).Q();

        assert.isString( sqlQuery );
    });
});