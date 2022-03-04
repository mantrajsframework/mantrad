# 10 Red Entities insert sentences: I() selector

Inserting new values is easy using I() selector.

## Insert simple value

```js
const entityId = await db.users.I().V( { mail: "rd@redentities.com", password: "12345" }).R();
```

If any property of the entity is missing, the default value of the schema will be used instead.