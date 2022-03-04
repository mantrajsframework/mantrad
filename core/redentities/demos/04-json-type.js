"use strict";

const RedEntities = require("../lib/redentities");

const config = {
    provider: "sqlite",
    databasepath: "./demo.db"
}

const SampleSchema = {
    entities : [
        {
            name : "data",
            fields: [
                { name : "jsonproperty", type : "json" },
                { name : "created", type : "datetime"}
            ],
            indexes: [ ["created"] ]
        }
    ]
};

/*
 * Insert one row and retrive it
 */
(async () => {
    const db = RedEntities(config).Entities(SampleSchema);
    await db.RemoveAndCreateDatabase();
    await db.CreateSchema();

    await insertJsonEntities(db);
    await retrieveJsonEntities(db);
})();

async function insertJsonEntities(db) {
    const COUNT = 10;

    for( let i = 0; i < COUNT; i++ ) {
        await db.data.I().V( { jsonproperty : {
            data1: { v: db.NewId() },
            data2: { v: db.NewId() } 
        }}).R();
    }
}

async function retrieveJsonEntities(db) {
    await db.data.S().IA( async (entity) => {
        console.log(entity);
    });
}