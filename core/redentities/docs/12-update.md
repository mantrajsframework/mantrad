# 12 Red Entities update sentences: S() selector

Updating entities is done using U() selector and indicating the new values to update in V() selector.

```js
await db.U().W("ID=?", userId).V( { mail: "newmail@redentities.com" } ).R();
```

V() syntax allows to indicate values to update using arrays with field names and its fields values:

```js
await db.U().W("ID=?", userId).V(["mail"], ["newmail@redentities.com"]).R();
```

First parameters or V() is an array with the names of the fields to update; the second one is an array with the new values.