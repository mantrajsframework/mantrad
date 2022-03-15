# Mantra Injections

There's a special property at [mantraconfig.json](/docs/36-mantraconfig-json-file.md) project configuration file named as "Injections".

That property defines a number of key / values entries where the keys indicate specific APIs implemented by the components of the project.

The purpose of Mantra injections is to provide some simple mecanism to implement the *dependency injection* principle but indicating differents specific APIs according to the environment.

This is, Injections is intended to indicate different versions of them according to the environment: testing, development, pre-production, CI/CD, production, etc.

For instance, given this Injection implementation for a development environment with its version of mantraconfig.json files:

```json
"Injections": {
    "log_injection": "logs.toconsole",
    "minifyhtmlapi_injection": "htmlminifier.simpleminify"
}
```

, we can have a different configuration for "log_injection" and "minifyhtmlapi_injection" for production environment, with its own version of mantraconfig.json file, like this:

```json
"Injections": {
    "log_injection": "logs.todatabase",
    "minifyhtmlapi_injection": "htmlminifier.fullminifyandofuscate"
}
```

By doing so, where "log_injection" and "minifyhtmlapi_injection" injections are used, will get differents APIs to invoke according to the enviroment (development or production).

The clients of those *injections* will use them indistinctly, but when invoking them (the APIs that points to), the behaviour will be different.
 
Current injections of the project can be get and invoked using "injection" property of Mantra API object; for "log_injection" of the sample, and given that that API implements a method which receives a Mantra object and a string, the client can invoke them by:

```js
await Mantra.injections.log_injection(Mantra, "new message");
```

The behaviour of that call will be different according to the environment, this is, the injections properties in the mantraconfig.json file used.

Remember: include as "injections" all those APIs which behaviour should be different according to the environment.