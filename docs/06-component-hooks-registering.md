# Component Hooks Registering

Mantra follows a microkernel software architecture and acts like a *glue* for the components in all its essential functionality.

In some way, Mantra can be considered as a *hook system*, cause all components assets are exposed by *hook* that components exposes.

These *hooks* definitions are defined at *onStart* method in each component. 

As we will see in this documentation, most of those *hooks* can be defined implicity as well following some naming conventions in the files of the component, reducing in that way the code needed.

Components can define a number of services, like views, bloks, apis, and the like.

To do so, a component should indicated what exactly registers in *onStart* method of the component, as indicated in [Component Definition section](/docs/05-mantra-component-definition.md).

This is what we call a *Mantra hook*.

Each kind of hook is described in the following sections.

As an example, consider this:

```js
class BooksStarter {
    async onStart( Mantra ) {
        MantraAPI.Hooks("books")
            .Api([{
                APIName: "addnewbook",
                APIHandler: BooksApiHandlers.AddNewBook
            }
            .Cron({
                CronConfig: "0 */5 * * * *",
                CronHandler: BooksCronHandlers.DownloadAmazonCover
            })
            .Event([ {
                EventName: "users.removed",
                EventHandler: BooksEventHandlers.OnUserRemoved
            }])
            .View([{
                Command: "showallbooks",
                Handler: BookViewsHandlers.ShowAllBooks
            }])
    }
}
```

In this case, a component named as *books* defines:

* An API of the name *addnewbook" than will be handled by BooksApiHandlers.AddNewBook method.
* A cron job for running every 5 minutos that will be handled by BooksCronHandlers.DownloadAmazonCover.
* It defines an event handler for "user.removed" event; when this event happens, then BooksEventHandlers.OnUserRemoved will be called.
* A view with the route "/books/showallbooks" that will be handled by BookViewsHandlers.ShowAllBooks method.

Each kind of hook has its own properties, some optionals and other mandatory, and as said above, they can also be defined implicity.

To avoid to type programmatically all hooks for a component in *onStart* method, some of then can be automatically registered by Mantra *by description* according to file names definitions, as described in the following sections.

***
To learn by example, go to [Mantra demos](https://www.mantrajs.com/mantrademos/showall) and [components](https://www.mantrajs.com/marketplacecomponent/components) sections of [Mantra site](https://www.mantrajs.com).