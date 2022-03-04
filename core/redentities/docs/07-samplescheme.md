# 07 Sample schema

For the following samples, this scheme will be used:

```js
const sampleSchema = {
    entities: [
        {
            name : "users",
            fields: [
                { name : "mail", type : "string" },
                { name : "password", type : "string" },
                { name : "created", type : "datetime"}
            ],
            indexes: [ ["mail"], ["created"] ],
            restrictions: {
                unique: [ ["mail"] ]
            }
        }
    ]
}

const RedEntities = require("redentities")({
    provider: "mysql",
    host: "localhost",
    user: "myuser",
    password: "mypassword"
});

const db = RedEntities.Entities(sampleSchema);
```