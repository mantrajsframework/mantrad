# Component assets

Mantra intends to split the functionality of a complex and scalable application in several and small Mantra components.

To do that, some specific assets and functionality has their own space in the component that the framework will *glue* in during the run time of the application.

As described in the following sections, a component can define a number of *assets*.

* Access condition handlers
* APIs
* Blocks
* Cron jobs
* Events
* Js and css files for specific files
* Middlewares
* Posts
* Prerequest handlers
* Templates
* Views
* Component extends

With all this stuff, you can develop applications with the codebase extremely ordered, maximazing the reused of functionaly (inside the project and in other projects) and you can afford *big* systems with hundreds of components without incresing the dificulty of its maintanability and evolution.