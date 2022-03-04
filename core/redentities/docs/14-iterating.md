# 14 Red Entities iterating over values

When formatting a query, you can iterate over the results using IA() selector (IA = *iterate all*).

This selector expects an async function callback which recieves as parameter the instance of the entity.

As an example, to iterate over all users entities:

```js
let fnc = async (userEntity) => {
    // Do something with entity :)
}

await db.users.S().IA(fnc);
```