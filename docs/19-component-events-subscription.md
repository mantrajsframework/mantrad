# Component Events Definition

Mantra implements a a publisher/subscriber events model.

This is a design pattern extremely useful to decouple components behaviour

The way to define an event subcriber function handler is using the hook "Event":

```js
MantraAPI.Hooks("[component name"])
    .Event([{
        EventName: "[name of the event]",
        EventHandler: [handler for the event]
    });
```

Let's see an example:
```js
MantraAPI.Hooks("admin")
    .Event([{
        EventName: "system.cleanup",
        EventHandler: AnalyticsEventHandlers.SystemCleanup
    });
```

This is defition, when "sytem.cleanup" event is launched, then AnalyticsEventHandlers.SystemCleanup function is called.

## Brief method to subscribe to events

Similary to views, blocks and other Mantra assets, you can define the subscription to events in a Node.js module within any component with the name of "event.[component name].js", like this:

```js
"use strict";

module.exports = {
    users_removed: async (eventData) => {
        // ...
    }
}
```

Due to "." is not allowed in json property names, Mantra replace "-" by "." when registering an event subscribing in this way, so in the example, the component is subscribed to "users.removed" event.

## Emitting an event

To emit an event, any component can call the API MantraAPI.EmitEvent method.

The first parameter is the name of the event, the second one is a json object with parameters or data to be send to the event subscribers.

## Function handler for the event subscription

The prototype for the function event handler is like this:

```js
async (eventData) => {
    const MantraAPI = eventData.MantraAPI;
    
    //...
}
```

eventData is the json object used when emitting the event.

As indicated above, the property eventData.MantraAPI contains the MantraAPI object instance.

## Importan notes about events in Mantra

In current Mantra version:

* When there exist more than one event subscriber, Mantra doesn't call their function handlers in any specific order.
* Events are useful to orchestrate high level functionality by "orchestration" components.
* If the function handler for an event crashes, Mantra catch the error, log it the continues calling to the rest of subscribers.

***
To learn by example, go to [Mantra demos](https://www.mantrajs.com/mantrademos/showall) and [components](https://www.mantrajs.com/marketplacecomponent/components) sections of [Mantra site](https://www.mantrajs.com).