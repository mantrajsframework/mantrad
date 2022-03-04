/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

const assert = require("chai").assert;

const RedEntitiesConfig = require("../providersconfig.json").postgresqlproviderconfig;
const RedEntities = require("../../lib/redentities")(RedEntitiesConfig);
const RedEntitiesTestUtils = require("../lib/redentitiestestutils");

const testSchema = require("../testschema.json");
const db = RedEntities.Entities(testSchema);

describe( 'Postgres Redentities tests', () => {
    before( async () => {
        await db.RemoveAndCreateDatabase( RedEntitiesConfig.database );
    });

    after( async () => {
        await require("../../lib/providers/postgresql/PostgresqlConnector").ClearPool();
    });

    it( '# Postgres Check if no existing schema exists', async () => {
        let schema = {
            entities: [
                {   name: RedEntitiesTestUtils.EntityShortId(),
                    fields: [
                        { name: "Name", type: "string" },
                        { name: "Age", type : "integer" }
                    ]
                }
            ]
        }

        let exists = await RedEntities.Entities( schema ).ExistsSchema();

        assert.isFalse( exists );
    });


    it( '# Postgres Check existing schema', async () => {
        let testSchema = {
            entities: [
                {
                    name: RedEntitiesTestUtils.EntityShortId(),
                    fields: [
                        { name: "title", type: "string" }
                    ]
                }
            ]
        }

        let db = RedEntities.Entities( testSchema );
        await db.CreateSchema();
        
        let exists = await db.ExistsSchema();
        assert.isTrue( exists );
    });

    it( '# Postgres Create schema with one entity', async () => {
        let testSchema = {
            entities: [
                {
                    name: RedEntitiesTestUtils.EntityShortId(),
                    fields: [
                        { name: "title", type: "string" },
                        { name: "alias", type: "string" }
                    ]
                }
            ]
        }

         await RedEntities.Entities( testSchema ).CreateSchema();
    });

    it( '# Postgres Create schema with multiple entities', async () => {
        let testSchema = {
            entities: [
                {
                    name: RedEntitiesTestUtils.EntityShortId(),
                    fields: [
                        { name: "title", type: "string" },
                        { name: "alias", type: "string" }
                    ]
                },
                {
                    name: RedEntitiesTestUtils.EntityShortId(),
                    fields: [
                        { name: "userx", type: "string" },
                        { name: "password", type: "string" }
                    ]
                },
            ]
        }

        await RedEntities.Entities( testSchema ).CreateSchema();
    });

    it( '# Postgres GetFieldDefinitionInSchema test', () => {
        let testSchema = {
            entities: [
                {
                    name: "book",
                    fields: [
                        { name: "title", type: "string" },
                        { name: "alias", type: "string" }
                    ]
                }
            ]
        }

        let db = RedEntities.Entities(testSchema);

        let definition = db.GetFieldDefinitionInSchema( "book", "title" );

        assert.equal( definition.name, "title" );
        assert.equal( definition.type, "string" );
    });

    it( '# Postgres RenameSchemaEntities test', async () => {
        let testSchema = {
            entities: [
                {
                    name: "book",
                    fields: [
                        { name: "title", type: "string" },
                        { name: "alias", type: "string" }
                    ]
                }
            ]
        }

        let re = RedEntities.Entities(testSchema);
        await re.CreateSchema();
        await re.RenameSchemaEntities( "t" );
        let exists = await re.ExistsTable( "bookt" );

        assert.isTrue(exists);
    });
    
    it( '# Postgres check entities populated', async () => {
        let testSchema = {
            entities: [
                {
                    name: "book",
                    fields: [
                        { name: "title", type: "string" },
                        { name: "alias", type: "string" }
                    ]
                }
            ]
        }

        let re = await RedEntities.Entities(testSchema);
        
        await re.CreateSchema();

        assert.isTrue( typeof re.book.I == 'function' );
        assert.isTrue( typeof re.book.S == 'function' );
        assert.isTrue( typeof re.book.D == 'function' );
        assert.isTrue( typeof re.book.U == 'function' );
    })

    it( '# Postgres NewId test', () => {
        let newId = db.NewId();

        assert.isString( newId );
    });

    it( '# Postgres RenameSchemaEntities', async() => {
        let entityName = RedEntitiesTestUtils.EntityShortId();
        let sufix = "_n";

        let schema = {
            entities: [
                {   name: entityName,
                    fields: [
                        { name: "Name", type: "string" },
                        { name: "Age", type : "integer" }
                    ] 
                }   
            ]
        }

        let db = RedEntities.Entities( schema );
        await db.CreateSchema();

        assert.isTrue( await db.ExistsSchema() );

        await db.RenameSchemaEntities( sufix );

        assert.isTrue(await db.ExistsTable( entityName+sufix ));
    });

    it( '# Postgres Exists database', async() => {
        assert.isTrue( await db.ExistsDatabase( RedEntitiesConfig.database ) );
    });
});