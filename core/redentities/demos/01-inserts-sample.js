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
    await db.RemoveAndCreateDatabase();
    await db.CreateSchema();

    await insertOneEntity(db);
    await insertAndRetrieveByMail(db);
})();

async function insertOneEntity(db) {
    const userId = await db.users.I().V( {
        mail: db.NewId(),
        password: db.NewId()
    }).R();
    
    const userEntity = await db.users.S().SingleById(userId);
    
    console.log(userEntity);
}

async function insertAndRetrieveByMail(db) {
    const userId = await db.users.I().V( {
        mail: "mail@mail.com",
        password: db.NewId()
    }).R();
    
    const userEntity = await db.users.S().W("mail=?","mail@mail.com").Single();
    
    console.log(userEntity);
}
