# Component API Definition

A component can define a number of API methods to be called and used by other components.

The functionality of the component should be exposed in its API.

To register an API method, you need to use hook "Api" in *onStart* component method:

```js
MantraAPI.Hooks("<component name>")
    .Api([{
        APIName: "name of the method",
        APIHandler: <handler for the api>
    }
```

Just as an example:

```js
class BooksStarter {
    async onStart( MantraAPI ) {
        MantraAPI.Hooks("books")
            .Api([{
                APIName: "addnewbook",
                APIHandler: BooksApiHandlers.AddNewBook
            }
    }
}
```

In this case, the api *addnewbook* is defined for component "books".

Any component can invoke this component by:

```js
MantraAPI.Invoke("books.addnewbook", <params> );
```

Or this:

```js
MantraAPI.api.books.addnewbook( MantraAPI, <params> );
```

*Remember:* if the method is *asynchronous*, then you should use *await* when calling it.

## Brief method of defining an API

To avoid typing the hook regitering call in *onStart* method, you can describe the API of the component in a specific module which file name should be named as "api.<component name>.js".

In this case, Mantra automatically will register all methods contained in that module file as APIs for the component.

Here an example:

```js api.books.js
"use strict";

module.exports = {
    getbookscount: async (MantraAPI, params) => {
        // ...
    }   
}
```

With this file, Mantra will register "books.getbookscount" as an API for books component.

*Remember:* you can check all API registered in the project by using *show-apis* Mantra command.