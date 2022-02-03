# Anatomy of a Mantra Project

A Mantra project is located in a folder with the following assets:

* Folders containing Mantra components (defined in mantraconfig.json configuration).
* Folders containing frontend (one or more), located at "/ui" folder.
* mantraconfig.json file with project and applications properties.

A single project can define one or more applications, according to mantraconfig.json properties.

Mantra looks up that file to start one of the applications with *startapp* command, such as:

```bash
$ mantrad startapp myapp
```

Any Mantra project can contain any number of frontends and components.

As an example:
```
`-- components
    `-- component-a
        |-- component-a.js
        |-- mantra.json
    `-- component-b
        |-- component-b.js
        |-- mantra.json
`-- ui
    `-- frontend
        |-- 404.html
        |-- browserconfig.xml
        |-- css
        |   |-- main.css
        |-- favicon.ico
        |-- index.html
        |-- js
        |   |-- main.js
|-- mantraconfig.json
```

Refer to [next section](/docs/02-mantraconfig.json-file.md) which describes mantraconfig.json file in detail.