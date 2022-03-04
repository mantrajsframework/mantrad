/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

const assert = require("chai").assert;

const RedEntitiesConfig = require("../providersconfig.json").postgresqlproviderconfig;
const RedEntitiesTestUtils = require("../lib/redentitiestestutils");
const testSchema = require("../testschema.json");

const RedEntities = require("../../lib/redentities")(RedEntitiesConfig);
const db = RedEntities.Entities(testSchema);

describe( 'Postgres Redentities insert tests', () => {
    before( async () => {
        await db.RemoveAndCreateDatabase( RedEntitiesConfig.database );
        await RedEntities.Entities( testSchema ).CreateSchema();            
    });

    after( async () => {
        await require("../../lib/providers/postgresql/PostgresqlConnector").ClearPool();
    });

    it( '# Postgres Insert simple entity', async () => {
        let values = { name: RedEntitiesTestUtils.EntityShortId(), alias: RedEntitiesTestUtils.EntityShortId() };
        await db.users.I().V( values ).R();
    });

    it( '# Postgres Insert simple entity and check ID', async () => {
        let entityId = await db.users.I().V( {nName: RedEntitiesTestUtils.EntityShortId(), alias: "foo" } ).R();

        assert.equal( "string", typeof entityId );
    });

    it( '# Postgres Insert boolean value with boolean value', async () => {
        let entityId = await db.booleantype.I().V( { value: true }).R();

        assert.equal( "string", typeof entityId );
    });

    it( '# Postgres Insert boolean value with string value', async () => {
        let entityId = await db.booleantype.I().V( { value: "true" }).R();

        assert.equal( "string", typeof entityId );
    });

    it( '# Postgres Insert datetime value', async () => {
        let now = new Date(new Date().toUTCString())

        let entityId = await db.datetimetype.I().V( { value: now } ).R();
    
        assert.equal( "string", typeof entityId );
    });

    it( '# Postgres Insert default values', async () => {        
        let entityId = await db.defaultvalues.I().V( { f0 : "somevalue"} ).R();

        assert.equal( "string", typeof entityId );
    });

    it( '# Postgres Insert json value', async() => {
        let entityId = await db.jsontable.I().V( { j0 : { title: "The Coder Habits"}} ).R();

        assert.equal( "string", typeof entityId );
    });

    it( '# Postgres Insert simple json value and retrieve', async() => {
        let jsonTest = { a:20 };

        let entityId = await db.jsontable.I().V( { j0 : jsonTest } ).R();

        let jsonRetrieved = await db.jsontable.S().W("ID=?", entityId).R();

        assert.equal( "string", typeof entityId );
        assert.equal( JSON.stringify(jsonTest), JSON.stringify(jsonRetrieved[0].j0) );
    });

    it( '# Postgres Insert empty json value and retrieve', async() => {
        let jsonTest = {};

        let entityId = await db.jsontable.I().V( { j0 : jsonTest } ).R();

        let jsonRetrieved = await db.jsontable.S().W("ID=?", entityId).R();

        assert.equal( "string", typeof entityId );
        assert.equal( JSON.stringify(jsonTest), JSON.stringify(jsonRetrieved[0].j0) );
    });

    it( '# Postgres Insert array of json value and retrieve', async() => {
        let jsonTest = [{a:10},{a:20},{a:30}];

        let entityId = await db.jsontable.I().V( { j0 : jsonTest } ).R();

        let jsonRetrieved = await db.jsontable.S().W("ID=?", entityId).R();

        assert.equal( "string", typeof entityId );
        assert.equal( JSON.stringify(jsonTest), JSON.stringify(jsonRetrieved[0].j0) );
    });

    it( '# Postgres Insert complex json value and retrieve', async() => {
        let jsonTest = {
            book: 'bookname',
            title: 'title',
            ISBN: '2393939202033',
            userId: '88c8c8cosls',
            owners: [{a:10},{a:20},{a:30}]
        }

        let entityId = await db.jsontable.I().V( { j0 : jsonTest } ).R();

        let jsonRetrieved = await db.jsontable.S().W("ID=?", entityId).R();

        assert.equal( "string", typeof entityId );
        assert.equal( JSON.stringify(jsonTest), JSON.stringify(jsonRetrieved[0].j0) );
    });

    it( '# Postgres Insert float value', async() => {
        let entityId = await db.floattable.I().V( { f : 1.9 } ).R();

        assert.equal( "string", typeof entityId );
    });

    it( '# Postgres Insert string with quote entity', async () => {
        let alias = "O'Brian";
        let values = { name: RedEntitiesTestUtils.EntityShortId(), alias: alias };
        let entityId = await db.users.I().V( values ).R();

        let entity = await db.users.S().SingleById(entityId);

        assert.equal( entity.alias, alias );
    });

    it( '# Postgres Insert longtext', async () => {
        let text = "Su última novela es El proyecto de mi vida.()&";
        let values = { t: text };
        let entityId = await db.longtexttype.I().V( values ).R();

        let entity = await db.longtexttype.S().SingleById(entityId);
        assert.equal( entity.t, text );
    });

    it( '# Postgres Insert longtext with accents, quotes and symbols', async () => {
        let text = "'''Su última novela es El/ proy\"ecto de<>&%$()-_ mi vida.()&";
        let values = { t: text };
        let entityId = await db.longtexttype.I().V( values ).R();

        let entity = await db.longtexttype.S().SingleById(entityId);
        assert.equal( entity.t, text );
    });

    it( '# Postgres get query string', async () => {
        let alias = "O'Brian";
        let values = { name: RedEntitiesTestUtils.EntityShortId(), alias: alias };
        let sqlQuery = await db.users.I().V( values ).Q();

        assert.isString( sqlQuery );
    });

    it( '# Postgres insert and check JSON stringified', async () => {
        let v = ["admin"];
        let values = { name: JSON.stringify(v), alias: v };
        let id = await db.users.I().V( values ).R();

        let entity = await db.users.S().SingleById(id);
        let v2 = JSON.parse(entity.name);

        assert.equal(v[0], v2[0]);
    });
});