# Mantra Bootstrap Process

When Mantra starts a new application (with command *startapp*), performs a number of steps and checks.

Basically, these steps are the following:

* Load [mantraconfig.json](/docs/36-mantraconfig-json-file.md) file configuration of the project.
* Verify the configuration file is fine checking some guards.
* Calculates the components and [services](/docs/25-mantra-services.md) that should be loaded, according to the application configuration.
* Check components dependencies and if someone should be updated.
* Load the components.
* Perform some internal actions to cache important data.
* Call onStart() method of the components that implements it.
* If service "view", "get" or "post" is active, call onServerStarter() of the components that implements it.
* If everything is ok, call onSystemStarted() of the components that implements it.

In that moment, the application is up & runnin as will be shown in the console.

***
To learn by example, go to [Mantra demos](https://www.mantrajs.com/mantrademos/showall) and [components](https://www.mantrajs.com/marketplacecomponent/components) sections of [Mantra site](https://www.mantrajs.com).