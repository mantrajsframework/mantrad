# Mantra Hello World

Mantra has a number of commands to create new projects and components.

To create a new project as an example, run "new-project" command:

```
$ mantra new-project
```

Follow the instruccions:

```
27-04-2021 12:11:26 - New project with Mantra version: 1.0.15
Project name: helloworldmantra
Project app name: coreapp
Select database provider
1) MySql flavours
2) Sqlite3
Select provider: 2
Database name: mantradb
Select project type
1) Microservices (API REST)
2) HTML 5 boilerplate 8.0.0
3) Bare (Bootstrap 4 Starter Template)
4) HTML5UP - Twenty

Select project type: 4
27-04-2021 12:11:57 - Mantra project created with success
27-04-2021 12:11:57 - To complete installation, run:
27-04-2021 12:11:57 - $ cd helloworldmantra && mantra install
```

Locate at the folder of the project and install core components:

```
$ cd helloworldmantra && mantra install
```

Select YES to install Mantra:

```
You are about to install Mantra application
Install Mantra Framework and its components [Y]/N? Y
27-04-2021 12:13:29 - Removing existing database (if any)...
27-04-2021 12:13:29 - Creating Mantra Framework schema...
27-04-2021 12:13:29 - Creating default values
27-04-2021 12:13:29 - Database and Mantra Framework schema created
27-04-2021 12:13:29 - Installing core components
27-04-2021 12:13:29 - Installing "core"
27-04-2021 12:13:29 - Installing "static"
27-04-2021 12:13:29 - Installing "scheduler"
27-04-2021 12:13:29 - Installing "logs"
27-04-2021 12:13:29 - Installing "corecommands"
27-04-2021 12:13:29 - Installing site components
Mantra application installed with success
Run apps with:
$ mantra startapp coreapp
```

Finally, run the application defined in the steps above with the command "startapp":

```
$ mantra startapp coreapp
```

Then you get:

```
27-04-2021 12:14:49 - Starting Mantra App 1.0.15
27-04-2021 12:14:50 - Loading components...
27-04-2021 12:14:50 - 5 components loaded
27-04-2021 12:14:50 - Starting components...
27-04-2021 12:14:50 - Components started
27-04-2021 12:14:50 - Service: activating middleware...
27-04-2021 12:14:50 - Service: activating view...
27-04-2021 12:14:50 - Service: activating get...
27-04-2021 12:14:50 - Service: activating post...
27-04-2021 12:14:50 - Mantra "coreapp" application started
27-04-2021 12:14:50 - App server running & listening in port 8080
```

Open a browser and go to http://localhost:8080

Here it is! Your first Mantra project.

# Basic intro to Mantra with this "hello world" project

In the next sections you have detailed descriptions about a Mantra project, its architecture based on microkernel pattern, components, multiple UI, multi components data repository, hooks, templates and a lot of more stuff.

In the above example, we have built a simple project based on TWENTY HTML5 template with this files structure:

```
.
├── components
├── mantraconfig.json
├── mantradb.db
└── ui
    └── frontend
        ├── assets
        │   ├── css
        │   ├── js
        │   ├── sass
        │   └── webfonts
        ├── contact.html
        ├── images
        ├── index.html
        ├── left-sidebar.html
        ├── LICENSE.txt
        ├── no-sidebar.html
        ├── README.txt
        └── right-sidebar.html
```

Explanation:
* You have create an application with the name "coreapp" within the project (you can have multiple applications in the same project).
* mantraconfig.json describes the main properties of the project.
* "components" folder will contain all components.
* "mantradb.db" file is the Sqlite database choosen in the steps above (Mysql flavours and Sqlite currently supported, to be extended in 2.x version of Mantra)
* "ui" folder will contain all frontends (the same project can contain a number of frontends for different purposes within it)

# Adding your first Mantra component

Now, let's create the base of a new component inside this project using the command "new-component":

```
$ mantra new-component
```

Will ask you the name for the component:

```
27-04-2021 12:24:30 - Loading components...
27-04-2021 12:24:30 - 5 components loaded
27-04-2021 12:24:30 - Starting components...
27-04-2021 12:24:30 - Components started
New component name: myfirstcomponent
Description: First component for Hello World Mantra project
Component 'myfirstcomponent 'created!
To install new component, run: $ mantra install-component myfirstcomponent
```

Now, you should install the component and enable it:

```
$ mantra install-component myfirstcomponent
```

Then you have:

```
27-04-2021 12:26:24 - Loading components...
27-04-2021 12:26:24 - 5 components loaded
27-04-2021 12:26:24 - Starting components...
27-04-2021 12:26:24 - Components started
Install component myfirstcomponent [Y]/N? Y
27-04-2021 12:26:26 - Component installed with success
```

Finally, you must enable the component with "enable-component command":

```
$ mantra enable-component myfirstcomponent
```

Then you got:

```
27-04-2021 12:27:16 - Loading components...
27-04-2021 12:27:16 - 5 components loaded
27-04-2021 12:27:16 - Starting components...
27-04-2021 12:27:16 - Components started
Enable component myfirstcomponent [Y]/N? Y
27-04-2021 12:27:17 - Component enabled with success
```

If you look now at the project structure, you'll see the new component folder:

```
.
├── components
│   └── myfirstcomponent
│       ├── controllers
│       │   ├── api.myfirstcomponent.js
│       │   ├── block.myfirstcomponent.js
│       │   ├── cron.myfirstcomponent.js
│       │   ├── event.myfirstcomponent.js
│       │   ├── middleware.myfirstcomponent.js
│       │   ├── post.myfirstcomponent.js
│       │   ├── prerequest.myfirstcomponent.js
│       │   └── view.myfirstcomponent.js
│       ├── model
│       │   ├── dal.myfirstcomponent.js
│       │   └── myfirstcomponent.schema.json
│       └── ui
│       |   ├── blocks
│       |   │   └── defaultblock.html
│       |   └── views
│       |       └── defaultview.html
│       ├── myfirstcomponent.js
│       └── mantra.json
├── mantraconfig.json
├── mantradb.db
└── ui
    └── frontend
        ├── assets
        │   ├── css
        │   ├── js
        │   ├── sass
        │   └── webfonts
        ├── contact.html
        ├── images
        ├── index.html
        ├── left-sidebar.html
        ├── LICENSE.txt
        ├── no-sidebar.html
        ├── README.txt
        └── right-sidebar.html
```

There's a lot stuff there described in this documentation.

For the moment, open "/components/myfirstcomponent/myfirstcomponent.js" have a look to the basic design of a Mantra component.

```js
"use strict";

class myfirstcomponentStarter {
    async onStart(Mantra) {
        console.log('New component myfirstcomponent installed!');
    }
}

class myfirstcomponentInstallation {
    async onInstall(Mantra) {}

    async onUninstall(Mantra) {}

    async onInitialize(Mantra) {}

    async onUpdate(Mantra, currentVersion, versionToUpdate) {}
}

module.exports = () => {
    return {
        Start: new myfirstcomponentStarter(),
        Install: new myfirstcomponentInstallation()
    };
}
```