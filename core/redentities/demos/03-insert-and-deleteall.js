"use strict";

const RedEntities = require("../lib/redentities");

const config = {
    provider: "sqlite",
    databasepath: "./demo.db"
}

const UsersSchema = {
    entities : [
        {
            name : "users",
            fields: [
                { name : "mail", type : "string" },
                { name : "password", type : "string" },
                { name : "created", type : "datetime"}
            ],
            indexes: [ ["mail"], ["created"] ]
        }
    ]
};

/*
 * Insert one row and retrive it
 */
(async () => {
    const db = RedEntities(config).Entities(UsersSchema);
    const COUNT = 100;
    await db.RemoveAndCreateDatabase();
    await db.CreateSchema();

    console.log(`Inserting ${COUNT} entities...`);
    for( let i = 0; i < COUNT; i++ ) {
        if ( i % 10 == 0 ) console.log(`Inserted ${i+1}`);
        await insertOneEntity(db);
    }
    
    console.log("Removing removing...");

    const ids = await db.users.S("ID").R();
    for( const id of ids.map( i=>i.ID) ) {
        await db.users.D().DeleteById(id);
    };

    let count = await db.users.S().C();

    console.log(`${count} entities in table`);
})();

async function insertOneEntity(db) {
    await db.users.I().V( {
        mail: db.NewId(),
        password: db.NewId()
    }).R();
}