# Red Entities fast CRUD summary

Here you have a fast reference to remember how to write typical CRUD sentences to work with the data of your applications.

Given this sample schema:

```js
const sampleSchema = {
    entities: [
        {
            name : "users",
            fields: [
                { name : "mail", type : "string" },
                { name : "password", type : "string" },
                { name : "created", type : "datetime" }
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

, you can write the following basic CRUD operations for any of the providers supported by Red Entitities.

## Select queries ( S() selector )

Select all fields of a single entity given its ID:

```js
const userEntity = await db.users.S().SingleById( userId );
```

Select field *name* of a single entity given its ID:

```js
const userEntity = await db.users.s("mail").SingleById( userId );
```

Get the number of users entities:

```js
const usersCount = await db.users.S().C();
```

Or...

```js
const usersCount = await db.users.S().Count();
```

Get an user given its mail: 

```js
const userEntity = await db.users.S().W("mail=?",mail).Single();
```

Check if an user given its mail exists:

```js
const userExists = await db.users.S().W("mail=?",mail).Exists();
```

Iterate over all user entities:

```js
await db.users.S().IA( await (userEntity) => {
    // Do something with userEntity
});
```

Get last user created according to *created* field:

```js
const lastUserCreated = await db.users.S().OB('created').T(1).R();
```

Get older user created according to *created* field:

```js
const olderUserCreated = await db.users.S().OB('created',false).T(1).R();
```

Get users entities paginated from position 10 and get 20:

```js
const userEntities = await db.users.S().L(10,20).R();
```

## Insert queries ( I() selector )

Insert a new user entity:

```js
const newUserId = await db.users.I().V( { mail: 'mantrarocks@mantrajs.com', password: 'fooIlovePizza' } ).R();
```

Insert a number of users entities:

```js
const newUsersId = await db.users.I().V( 
    [{ mail: 'mantrarocks@mantrajs.com', password: 'fooIlovePizza' },
     { mail: 'mantrarocks2@mantrajs.com', password: 'btcrocks' }] ).R();
```

## Update queries ( S() selector )

Update mail field of an user given its ID:

```js
await db.users.U().W('ID=?',userId).V( { mail: 'newmail@joo.com' }).R();
```

## Delete queries ( D() selector )

Delete an user entity given its id:

```js
await db.users.D().DeleteById( userId );
```

Delete an user given its mail:

```js
await db.users.D().W("mail=?",userMailToDelete).R();
```