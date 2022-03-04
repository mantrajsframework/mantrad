const assert = require("chai").assert;

const RedEntitiesConfig = require("../providersconfig.json").mysqlproviderconfig;
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

describe( 'Mysql Redentities update tests', () => {
    before( async () => {
        await db.RemoveAndCreateDatabase( RedEntitiesConfig.database );
        await RedEntities.Entities( testSchema ).CreateSchema();            
    });

    after( async() => {
        await require("../../lib/providers/mysql/MySqlConnector").ClearPool();
    });

    it( '# Mysql Update simple entity', async () => {
        let newAlias = RedEntitiesTestUtils.EntityShortId();
        let user = await insertSampleUserEntity();
        await db.users.U().W("ID = ?", user.ID).V( ["alias"], [newAlias] ).R();
        let entity = await db.users.S().SingleById(user.ID);

        assert.equal( newAlias, entity.alias );
    });

    it( '# Mysql Update simple entity with object', async () => {
        let newAlias = RedEntitiesTestUtils.EntityShortId();
        let user = await insertSampleUserEntity();
        await db.users.U().W("ID = ?", user.ID).V( { alias: newAlias } ).R();
        let entity = await db.users.S().SingleById(user.ID);

        assert.equal( newAlias, entity.alias );
    });

    it( '# Mysql Update date time entity', async() => {
        let now = new Date(new Date().toUTCString())

        let entityId = await db.datetimetype.I().V( { value: now } ).R();
    
        let newDateTime = new Date(new Date().toUTCString())

        await db.datetimetype.U().W("ID=?",entityId).V( ["value"], [newDateTime]).R();
    });

    it( '# Mysql get update query string', async () => {
        let newAlias = RedEntitiesTestUtils.EntityShortId();
        let user = await insertSampleUserEntity();
        let sqlQuery = await db.users.U().W("ID = ?", user.ID).V( { alias: newAlias } ).Q();

        assert.isString( sqlQuery );
    });

    it( '# Sqlite update and check JSON stringified', async () => {
        let v = [];
        let values = { Name: JSON.stringify(v), alias: v };
        let id = await db.users.I().V( values ).R();

        v.push("element");

        await db.users.U().W("ID=?",id).V({ name: JSON.stringify(v) }).R();

        let entity = await db.users.S().SingleById(id);

        let v2 = JSON.parse(entity.name);

        assert.equal(v[0], v2[0]);
    });
});