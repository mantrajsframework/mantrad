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
    const COUNT = 10000;
    await db.RemoveAndCreateDatabase();
    await db.CreateSchema();

    console.log(`Inserting ${COUNT} entities...`);
    for( let i = 0; i < COUNT; i++ ) {
        if ( i % 100 == 0 ) console.log(`Inserted ${i+1}`);
        await insertOneEntity(db);
    }
    
    console.log("Iterating...");
    let i = 0;
    db.users.S().IA( async (userEntity) => {
        console.log(++i, userEntity);
    });
})();

async function insertOneEntity(db) {
    await db.users.I().V( {
        mail: db.NewId(),
        password: db.NewId()
    }).R();
}