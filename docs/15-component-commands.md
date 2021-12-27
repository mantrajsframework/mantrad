# Component Command Line Interface (cli) Definition

Usually, *command line interface* commands are useful for administration tasks in any application.

Any Mantra component can define its own commands with the hook *Command*:

```js
MantraAPI.Hooks( "<component name>" )
    .Command([{
        Name: "<name of the command>",
        Description: "Description for the command",
        Handler: <command function handler>
    }]);
```

As an example, consider this command registration:

```js
MantraAPI.Hooks( "search" )
    .Command([{
        Name: "remove-search-indexes",
        Description: "Remove all search indexes",
        Handler: SearchCommandHandlers.RemoveIndexes
    }]);
```

With this, you can run the command from the bash just with:

```bash
$ mantrad remove-search-indexes
```

You can see all commands defined in the project (apart from core commands) with:

```
$ mantra
```

## Function handler for the command

The function handler for the command is like:

```js
async (MantraAPI, <list of params> ) => {

}
```

## Command parameters

Optionally, you can set any number of parameters when running the command that Mantra will send to the function command handler as parameters:

```bash
$ mantrad books-show-book 9iIdss2a2
```

When running this, the parameter "9iIdss2a2" will be set as parameter of the function handler:

```js
async (MantraAPI, bookId) => { 
    // ... 
};
```