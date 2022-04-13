# mantraconfig.json  file

Every Mantra project consists of a mantraconfig.json file and a set of components.

The first task that Mantra does to start a new application of run a command, is to look for that files.

Basically, this file defines the properties of the applications of the project, properties such us:

* Locations where to find components.
* Location of frontend templates.
* Components properties if necesary.
* Properties of *core* components.
* Apps properties.
* Data persistance properties (based on RedEntities object-mapping project).
* Global vars and global templates vars.

Some of root properties con be overwritten in an specific app configuration, like frontend location or port to listen, allowing multiple frontends in same project for different but related apps (final user application, admin application and so on).

Given all main properties of the project in a simple file, you can have a mantraconfig.json file for development and a different file for production or testing creating a simple symbolic link named "mantraconfig.json" to the real file to use in any case.

Most of the properties are optional. Here you have a minimal sample:

```json
{
  "CurrentVersion": "1",
  "ComponentsLocations": ["components"],
  "Entities": {
    "default": {
      "provider": "sqlite",
      "databasepath": "./commandmantrademo.db"
    }
  },
  "DefaultComponents": ["getapi","simplecommand"]
}
```

And here another version with more stuff to define:

```json
{
   "CurrentVersion": "<current version of the project>",
   "ComponentsLocations": ["basecomponents"],
   "Apps": {
      "appsample1": {
         "Port": 8081
      },
      "appsample2": {
         "Port": 8083,
         "FrontendLocation": "frontendadmin",
         "LandingView": "admin.dashboard"
      },
      "appsample3": {
         "ActiveComponents": [
            "admin/cron,extend",
            "books/cron,extend",
            "hdlanalytics/cron,extend",
            "hdltasks/cron,extend",
            "master/cron,extend",
            "tasks/cron,extend"
         ],
         "ActiveServices": ["cron"]
      }
   },
   "Port": 8081,
   "LandingView": "landing.landing",
   "GlobalConfig": {
         "sitename": "Mantra Framework Site"
   },
   "ComponentsConfig": {
      "core": {
         "croncleanupevent": "*/5 * * * * *",
         "cronbackupevent": "0 */5 * * * *",
         "minifyhtml": false,
         "compressresponses": false,
         "translatejsapi": "resourceminifier.translatejsfiles",
         "translatecssapi": "resourceminifier.translatecssfiles",
         "baseurl": "http://core.localhost:8081/"
      },
      "logs": {
         "logToConsole": true,
         "daystoremoveoldlogs": 1
      },
   },
   "Entities": {
      "default": {
         "provider": "mysql",
         "host": "localhost",
         "database": "mysampleapp",
         "user": "mysamplemysqluser",
         "password": "12345"
      }
   },
   "DefaultComponents": [
       "mymantracomponent"
   ],
   "Injections": {

   },
   "ActiveServices": ["middleware","view","post","get"],
   "NotFoundRedirect": "/404.html",
   "GlobalTemplateVars": {
      "global-sitename": "My project name",
      "global-sitecompany": "Mantra Microkernel Project"
   }
}
```

You add more features to this configuration file while your project gets bigger and new features and components are added.

# Description of mantraconfig.json file properties

*"CurrentVersion"* (optional)

Indicates the current version of the mantra project, usually in the form of x.y.z numbers.

This property can be overwritten by specific app configuration.

*"ComponentsLocations"*
Array of strings indicating the local paths where Mantra will find project components.

When installing a new component or running an application, Mantra will find those folders.

*"Port"* (optional)

In the case when Mantra application runs an user interface or REST API, this number indicates the port to listen to.

This property can be overwritten by specific app configuration.

*"LandingView" (optional)

In the case when Mantra application runs an user interface, this property indicates the landing view to render for landing page of the ui (http://<yoursite>/).

This property can be overwritten by specific app configuration in its application section.

The content of this property can be:

* A view of a component as a landing page, in the usual format like : <component name>.<view name>. For instance, "landing.dashboard", rendering the view "dashboard" of a component named as "landing".
* A local redirect, for instance "/landingpage.html", which will render /ui/landingpage.html file as landing page of the site.

*"GlobalConfig"*

This entry indicates some global an common configuration parameters for the whole system (all applications in the sample project).

It defines a json object with the properties needed to include.

All those properties are accesed by Mantra.GlobalConfig( "propertyname" ).

*"BaseUrl"

This optional property sets the url of the project if needed.

This value can get retrieved by applications using Mantra.GetBaseUrl() method.

Can be overwritten in each specific applicacion at "Apps" section.

*"ComponentsConfig*"

JSON object with the configuration if needed for each component.

Each component of the project can set a number of properties to configure it according to specific needs inside the project.

This properties are available with Mantra.GetComponentConfig("<component name>") or Mantra.config.<component name>.

*"Injections*"
This property can be overwritten in App sections as well.

Injections consiste of an object with properties and values. These properties are considered *injections*, and their values are considered components APIs names in the Mantra standard format like "<component name>.<api name>", like in this example:

```js
"Injections": {
   "log_injection": "logs.add",
   "minifyhtmlapi_injection": "htmlminifier.minify",
   "translatejsapi_injection": "resourceminifier.translatejsfiles",
   "translatecssapi_injection": "resourceminifier.translatecssfiles"
}
```

This is, all those values for these key properties should be Mantra components APIs that should exists.

You can get specific injections with Mantra.GetInjection() method.

*"Entities"*

JSON object with data repositories accesing properties.

"Default" indicates the default properties.

With Mantra, some specific components can have their own data repositories, allowing multiple database within the same running application.

In this case, indicating the name of the component as property in "Entities" will be managed by the framework to instantiate the connection when calling the component, like this:

```
"Entities": {
   "default": {
      "provider": "mysql",
      "host": "localhost",
      "database": "mysampleapp",
      "user": "mysamplemysqluser",
      "password": "12345"
   },
   "mycomponent": "mysql",
      "host": "localhost",
      "database": "mycomponentdatabase",
      "user": "mysamplemysqluser",
      "password": "12345"
}
```

This is one of the nice feature of Mantra Microkernel Framework :-)

*"DefaultComponents"*

Array with the names of the components to install by default when installing the project in a new machine.

*"ActiveServices"*

This property is an array of strings indicating the services to run when running the application:

* "middleware": indicates to run components middlewares.
* "view": indicates to run and activate views.
* "post": indicates to run and activate HTTP POST calls.
* "get": indicates to run and activate HTTP GET calls.
* "cron": indicates to run and activate components cron definition jobs.

Indicating which services to activate in each application, you can tune the needs for specific applications.

This property can be overwritten by specific app configuration.

*"NotFoundRedirect"* (optional)

Indicates the html file to render when a route is not found. Only needed if the application defines an user interface.

This property can be overwritten by specific app configuration.

*"GlobalTemplateVars"* (optional)

This json object indicates a number of properties available for all views within the application, useful for global variables like name of the site and so one.

As an example:

* "global-sitename": "your project name"
* "global-sitecompany": "company of the project"

With this, in any html view or template, property "{{global-sitename}}" and "{{global-sitecompany}}" will be available.

# Overwritting properties y *"Apps"* section

A Mantra project can define a number of diffents applications; each application configuration goes inside "Apps" section; most of the properties of an app, overwrites roots properties.

The general schema for "Apps" property is as following:

```
"Apps": {
   "app-one": {
      ... properties ...
   },
   "app-two": {
      ... properties ...
   },
   ...
}
```

The name of the application is the name of the properties under "Apps" (in the case, "app-one", "app-two" and the like).

By doing so, you can start an specific Mantra application with:

```bash
$ mantrad startapp app-one
```

The properties than can be used to overwrite root ones, are the following:
* "ActiveServices"
* "FrontendLocation"
* "LandingView"
* "Port"

Two properties are "Apps" specific:

*"ActiveComponents"*

By default, all services (cron, views, middlewares, gets and posts) defined and registered by all components are active (loaded by bootstrap process when running the application).

However, for specific applications which only need some services from some specific components, can indicated exactly which ones should be loaded when starting the application.

"ActiveComponents" is an array indicating with string which components and its services to be loaded in the format "<componentname>/<services to activate separated by comma>", like this sample:

```
"Apps": {
   "hdltasks": {
      "ActiveComponents": [
         "admin/cron,componentextend",
         "hdlanalytics/cron,componentextend",
         "master/cron,componentextend",
      ],
      "ActiveServices": [
         "cron"
      ]
   }
}
```

In this sample,for "hdltasks" application, only will be loaded services "cron" and "componentextend" for components "admin", "hdlanalytics" and "master", and only "cron" service will be loaded when starting the application.

*"InactiveComponents"*

This property is an array of strings indicating a number of components than shouldn't be loaded when starting the application:

```
"Apps": {
   "adminapp": {
      "InactiveComponents": ["books", "authors", "pdfgenerator"]
   }
}
```

In this case, when running "adminapp", "books", "authors" and "pdfgenerator" will not be loaded.

Using *"ActiveComponents"* and *"InactiveComponents"* you can control exactly which services and components should be loaded for any specific application, if this feature is needed.

# Some mantraconfig.json file samples

Here you can check a basic mantraconfig.json files example:

```
{
  "CurrentVersion": "3",
  "ComponentsLocations": [
    "components"
  ]
   "Apps": {
    "mainapp": {
      "LandingView": "landing.landingpageview"
    },
  },
  "Port": 8081,
  "ComponentsConfig": {
    "core": {
      "croncleanupevent": "0 */5 * * * *",
      "cronbackupevent": "0 */5 * * * *",
      "minifyhtml": true,
      "compressresponses": true,
      "enablesecurity": true,
      "baseurl": "http://192.168.1.187:8081/"
    },
    "Entities": {
      "default": {
        "provider": "mysql",
        "host": "localhost",
        "database": "pay_core",
        "user": "mysqluser",
        "password": "**************"
      },
    },
    "DefaultComponents": [
      "admin",
      "date",
      "dbremoveolder",
      "deltatohtml",
      "eventasync"
    ]
   "ActiveServices": [
      "middleware",
      "view",
      "post",
      "get"
    ],
    "NotFoundRedirect": "/404.html",
    "GlobalTemplateVars": {
      "global-sitename": "Your site name",
      "global-sitecompany": "Your company name",
      "global-privacyandtermslink": "/content/privacidad-y-terminos",
      "global-contactsupportlink": "/contact/support",
      "global-usersitelink": "http://localhost:8081"
    }
  }
}
```

In mantra-demos GitHub project, you can find several working Mantra applications.

# Multiple mantraconfig.json file

Usually, mantraconfig.json file is environment specific (development, production, etc.).

Mantra always looksup "mantraconfig.json" file, so, to have multiple versions of this file according to the environment, is recommendable to have that file as a link to real configuration files using command *ls*.

By doing so, you can have "dev.mantraconfig.json" and "prod.mantraconfig.json" files with differents configurations an "mantraconfig.json" file as a link to one of them according to the environment.

***
To learn by example, go to [Mantra demos](https://www.mantrajs.com/mantrademos/showall) and [components](https://www.mantrajs.com/marketplacecomponent/components) sections of [Mantra site](https://www.mantrajs.com).