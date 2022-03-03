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
const SearchCommandHandlers = require("./searchcommandhandlers.js");

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

By default, you can see all commands defined in the project (apart from core commands) with:

```
$ mantrad
```

## Function handler for the command

The function handler for the command is like this:

```js
async (Mantra, param1, param2, param3, param4 ) => {

}
```

All parameters are optional.

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

## Implicit method to define a command

You can also define new commands without registering the *hook*.

You do so indicating the commands in a file named as "commands.yourcomponentname.js" inside "/controllers" folder of your component.

In that module, Mantra expects to find these properties to define new commands:

* <command name>_description: description for the command
* <command_name>: async method handler for the command that receives the parameters if needed.

As for example, consider the module /mycomponent/controllers/commands.mycomponent.js:

```js
module.exports = {
    mk_description: "test for marketplace",
    mk: async (Mantra, arg1, arg2, arg3, arg4 ) => {
        ///
    }
}
```

Giving this command, you can run it with:

```bash
$ mantrad mk p01 p02 p03 p04
```

## List commands defined by a component

You can get the list of commands defined by a component with *show-commands* Mantra command:

```bash
$ mantrad show-commands <component name>
```

This is useful to verify that you have defined your commands well.

***
To learn by example, go to [Mantra demos](https://www.mantrajs.com/mantrademos/showall) and [components](https://www.mantrajs.com/marketplacecomponent/components) sections of [Mantra site](https://www.mantrajs.com).