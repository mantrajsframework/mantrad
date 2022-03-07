# Mantra Console API Reference

Mantra Console API object is get as an Utils property:

```js
const MantraConsole = Mantra.Utils.Console;
```

This object has a number of useful and common methods to manage console messages and prompts.

Because of the nature of Node.js, within the same application, the same process.stdin and process.stdout should be used in the application running in the same process.

* [Mantra.Utils.Console.error](#mantra.utils.console.error)

* [Mantra.Utils.Console.getReadlineInterface](#mantra.utils.console.getreadlineinterface)

* [Mantra.Utils.Console.info](#mantra.utils.console.info)

* [Mantra.Utils.Console.newline](#mantra.utils.console.newline)

* [Mantra.Utils.Console.question](#mantra.utils.console.question)

* [Mantra.Utils.Console.questionWithOpts](#mantra.utils.console.questionwithopts)

* [Mantra.Utils.Console.rawInfo](#mantra.utils.console.rawinfo)

* [Mantra.Utils.Console.warning](#mantra.utils.console.warning)


## Mantra.Utils.Console.error

```js
error(msg, withDate = true)
```

Shows in the console an information message in red.

Param:
* msg: string with the message to show.
* withDate: if true, then the message includes the date time.

## Mantra.Utils.Console.getReadlineInterface

Property that returns the ReadLine interface used by Mantra, equivalent to:

```js
const readLineInterface = require("readline").
                            createInterface({input: process.stdin, output: process.stdout});
```
## Mantra.Utils.Console.info

```js
info(msg, withDate = true)
```

Shows in the console an information message in green.

Param:
* msg: string with the message to show.
* withDate: if true, then the message includes the date time.

## Mantra.Utils.Console.newline

```js
newLine()
```

Simply adds a new empty line to the console.

## Mantra.Utils.Console.question

```js
async question(msg, allowEmpty)
```

Prompts a question and returns the result typed by the user.

Params:
* msg: question message to show.
* allowEmpty: if true, then the methods accepts no entry as a result.

## Mantra.Utils.Console.questionWithOpts

```js
async questionWithOpts( msg, opts )
```

Prompts a question expecting a number for some options.

Params:
* msg: question message to show.
* opts: array with string messages to show with the options.

For instance:

```js
const optionSelected = await Mantra.Utils.Console.questionWithOpts( "Choose option:", 
    ["Add item", "Delete Item", "Show all items"] );
```

Returns a zero-base number with de option typed by the user.

## Mantra.Utils.Console.rawInfo

```js
rawInfo(msg)
```

Show in the console the string message of the parameter. Equivalent to console.log() method.

Param:
* msg: string with the message to show.

## Mantra.Utils.Console.warning

```js
warning(msg, withDate = true)
```

Shows in the console a warning message in orange.

Param:
* msg: string with the message to show.
* withDate: if true, then the message includes the date time.

***
To learn by example, go to [Mantra demos](https://www.mantrajs.com/mantrademos/showall) and [components](https://www.mantrajs.com/marketplacecomponent/components) sections of [Mantra site](https://www.mantrajs.com).