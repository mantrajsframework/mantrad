# 13 Red Entities delete sentences: D() selector

Deleting entities with Red Entities is fast using D() selector:

Remove and entity by its id:

```js
await db.users.D().DeleteById(userIdToRemove);
```

Remove and entity by any other field value:

```js
await db.users.D().W("mail=?",mail).R();
```

D() selectors returns the number of rows removed.