# Mantra Development Paradigm

Mantra is based on some software and architecture development principles.

Each one of these principles, have great impact in the desing of a complex system but with them, we got:

* *Big* projects with a codebase extremely well organized.
* High maintenability.
* Easier evolutions.
* Simpler and incremental migrations.
* Extremely high reused of components.

These are the base principles:

* The system is based on *components*.
* A component is the minimal coding block.
* Mantra Framework acts as the *glue* between them (following microkernel architecture).
* Data persistance is transparent based on simple json models.
* Data models are extremely simple.
* A component can define: APIs, views, blocks, events, templates, middlewares, post and get routes, *prerequests* and *access conditions*, cron handlers and commands lines interfaces.
* High level functionality is achieved with orchestrating functionality from low level components.
* Decoupling of components are based on an event-driven design.

A Mantra project is composed by a number of components following Mantra paradigm.

The development paradigm for Mantra applications is based on the following rules:

* Any application is composed by independent coding blocks called *components*.
* A component should be as small as possible.
* A component defines and registers a number of features (APIs, views, blocks, templates, prerequests, etc.)
* A component implements a small number of consistent and coherent features.
* A component can access funcionality of other components using its exposed API.
* A component can have its own data repository.
* A component can define its own data model.
* The data model of a component should be as small as possible (only a few properties).
* Very high level functionality is developed orchestrating features of simpler components.

With this paradigm, the maintenability and incremental migration of any application is exponentialy simpler.