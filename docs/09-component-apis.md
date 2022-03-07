# Component API Definition

A component can define a number of API methods so that they can be called and used by other components.

The functionality of the component should be exposed in its API.

To register an API method, you need to use hook "Api" in *onStart* component method:

```js
Mantra.Hooks("<component name>")
    .Api([{
        APIName: "name of the method",
        APIHandler: <handler for the api>
    }
```

Just as an example:

```js
const BooksApiHandlers = require("./booksapihandlers.js);

class BooksStarter {
    async onStart( Mantra ) {
        Mantra.Hooks("books")
            .Api([{
                APIName: "addnewbook",
                APIHandler: BooksApiHandlers.AddNewBook
            }
    }
}
```

In this case, the api *addnewbook* is defined by the component "books".

Any component can invoke this API with [Invoked Mantra API method](/docs/33-mantra-API-reference.md#mantraapi.invoke):

```js
Mantra.Invoke("books.addnewbook", <json object with params> );
```

Despite you can use "Invoke", the recommended way to invoke Mantra components APIs is in this way:

```js
Mantra.api.books.addnewbook( Mantra, <param1>, <param2>... );
```

*Remember:* if the method is *asynchronous*, then you should use *await* when calling it.

## Brief method of defining a component API

To avoid typing the hook regitering call in *onStart* method, you can describe the API of the component in a specific module which file name should be named as "api.<component name>.js". This files should be located at "/controllers/" component folder.

In this case, Mantra automatically will register all methods contained in that module file as APIs for the component.

Here an example:

```js api.books.js
module.exports = {
    getbookscount: async (Mantra, params) => {
        // ...
    }   
}
```

With this file, Mantra will register "books.getbookscount" as an API for books component.

## Listing APIs defined by a component

You can check all API registered in the project by using *show-apis* Mantra command:

```bash
$ mantrad show-apis <component name>
```

***
To learn by example, go to [Mantra demos](https://www.mantrajs.com/mantrademos/showall) and [components](https://www.mantrajs.com/marketplacecomponent/components) sections of [Mantra site](https://www.mantrajs.com).