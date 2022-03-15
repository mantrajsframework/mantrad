Mantra is a framework based on [Node.js](https://nodejs.org/) to develop scalable and progressive projects with highly decoupled components following *lean* methodology with fast and high evolution.

Mantra is the core for building platforms, startups applications, enterprise systems or, virtually, any other kind of projects.

Mantra has been designed to develop high performance applications to be deployed in any scenario.

A Mantra project follows some design and software architecture principles defined in [Mantra Paradigm Development Principles](/docs/01-mantra-development-paradigm.md). With them, technical debt is minimized and testeability of components are extremely high.

Also, by its nature, the assets of a Mantra project are very well organized with separation of concerns and the code for common tasks tends to be minimal.

# Install with NPM

*mantrad* is the command line interface (cli) to manage Mantra applications. Install it with:

```bash
$ npm install -g mantrad
```

Or clone it and install globally with:

```bash
$ git clone https://github.com/mantrajsframework/mantrad
$ cd mantrad
$ npm install . -g
```

Check current version with:

```bash
$ mantrad version
```

# Mantra "Hello World"

Run your first Mantra project with [Mantra Hello World](/docs/24-mantra-hello-world.md) sample step by step.

# What it is?

Mantra is a Node.js framework for *lean*, scalable and high performance projects, based on small and highly decoupled components.

A Mantra application is based on multiple components that interact between them using a global interaction layer (Mantra API). 

Each component *exposes* assets (APIs, posts and gets controllers, data models, views, blocks, middlewares, cron jobs, commands, *prerequests*, access conditions, etc.). Mantra is in charge of the decoupled interaction between all of them. Any component can define any other asset with new functionality.

The framework intends to define simple components with very specific functionality, following S.O.L.I.D. and Dependency Injection principles, with extremely simple data models, easy updates, multiapplications within the same project and extremely well organized projects. 

Mantra depends on:

* [RedEntities](https://github.com/mantrajsframework/redentities) as object mapper for data repositories, another project of Mantra.
* [Express](https://expressjs.com/) as core web server.
* [Mustache](https://github.com/janl/mustache.js) template redering mecanism for views.

Mantra works and has been tested in Linux environments with Node.js 12.x, 13.x, 14.x, 15.x, 16.x and 17.x.

Currently, MySql, MariaDB, PostgreSql, Sqlite and Aurora databases are supported. Future versions will support more data providers and rendering engines.

# What kind of applications can be built with Mantra?

You can use Mantra for building many different kinds of applications:

* Scalable and high performance web applications.
* Multisite web applications (multiple sites using same set of components).
* Command line interface applications.
* Applications with no UI to run any kind of tasks.
* Microservices applications.
* Standalone applications with specific purposes.
* A mix of all above in the same project.

In the same Mantra project can live together all applications needed to run it: main UI, operation UI, maintenance apps, task scheduler, etc.

# Mantra application samples, components and projects

In adition to the documentation, the best way to learn how to write Mantra projects is reading samples.

You can find multiple samples at [Mantra Demos](https://github.com/mantrajsframework) repository or listed at [Mantra site demos section](http://www.mantrajs.com/mantrademos/showall).

Also, you can download for free many official components and projects ready to use from [Mantra site](https://www.mantrajs.com).

# Documentation and how-tos

Learn to build Mantra projects with this documentation and read how-to guides published continuosly at [Manta site how-to section](https://www.mantrajs.com/articles/showhowto).

You can also read this documentation at [Mantra site](https://www.mantrajs.com).

- [01 Mantra Development Paradigm](/docs/01-mantra-development-paradigm.md)
- [02 Mantra Hello World](/docs/02-mantra-hello-world.md)
- [03 Anatomy Of A Mantra Project](/docs/03-anatomy-of-a-mantra-project.md)
- [04 Component Assets](/docs/04-component-assets.md)
- [05 Mantra Component Definition](/docs/05-mantra-component-definition.md)
- [06 Component Hooks Registering](/docs/06-component-hooks-registering.md)
- [07 Component Views](/docs/07-component-views.md)
- [08 Component Blocks](/docs/08-component-blocks.md)
- [09 Component Apis](/docs/09-component-apis.md)
- [10 Component Gets](/docs/10-component-gets.md)
- [11 Component Posts](/docs/11-component-posts.md)
- [12 Component Cron](/docs/12-component-cron.md)
- [13 Component Middlewares](/docs/13-component-middlewares.md)
- [14 Component Access Conditions](/docs/14-component-access-conditions.md)
- [15 Component Prerequests](/docs/15-component-prerequests.md)
- [16 Component Extend](/docs/16-component-extend.md)
- [17 Component Commands](/docs/17-component-commands.md)
- [18 Component Configuration](/docs/18-component-configuration.md)
- [19 Component Events Subscription](/docs/19-component-events-subscription.md)
- [20 Component Entity Model](/docs/20-component-entity-model.md)
- [21 Mantra Data Access Layer](/docs/21-mantra-data-access-layer.md)
- [22 Installing And Uninstalling Components](/docs/22-installing-and-uninstalling-components.md)
- [23 Component Updating](/docs/23-component-updating.md)
- [24 Adapting Root Html Document To Mantra](/docs/24-adapting-root-html-document-to-mantra.md)
- [25 Mantra Services](/docs/25-mantra-services.md)
- [26 Html Templates](/docs/26-html-templates.md)
- [27 Mantra Bootstrap Process](/docs/27-mantra-bootstrap-process.md)
- [28 Mantra Core Commands](/docs/28-mantra-core-commands.md)
- [29 Mantra Core Components](/docs/29-mantra-core-components.md)
- [30 Mantra Core Events](/docs/30-mantra-core-events.md)
- [31 Mantra Logger](/docs/31-mantra-logger.md)
- [32 InstanceId](/docs/32-instanceid.md)
- [33 Mantra API Reference](/docs/33-mantra-API-reference.md)
- [34 Mantra Utils Reference](/docs/34-mantra-Utils-reference.md)
- [35 AssetsLocations Reference](/docs/35-assetslocations-reference.md)
- [36 mantraconfig.json File](/docs/36-mantraconfig-json-file.md)
- [37 mantracoreapi.js File Reference](/docs/37-mantracoreapi-js-file-reference.md)
- [38 Mantra Console API reference](/docs/38-mantra-console-api-reference.md)
- [39 Updating Components Data Models](/docs/39-updating-models.md)
- [40 Injections](/docs/40-mantra-injections.md)
- [41 Next Steps](/docs/41-next-steps.md)