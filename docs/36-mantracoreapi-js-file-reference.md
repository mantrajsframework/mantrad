# mantracoreapi.js File Reference

This file is added for all HTTP view requests and needs jQuery library.

Defines for the client side a object named as MantraAPI with some useful methods.

During the process of rendering a view, all data added to be loaded in the client side (using MantraAPI.AddDataValue method in the server side), will be added to MantraAPI.data property.

These are the methods:

## MantraAPI.PostAsync

```js
async MantraAPI.PostAsync( component, command, data )
```

Performs a post ajax call the a post route indicated as parameters.

Params:
* component: [component name of the component to handle the post call]
* command: [command to be called]
* data: [data to be indicated as parameter in the call, optional]
  
Returns the result data of the post call.

## MantraAPI.Post

```js
MantraAPI.Post( apicall, data, onsuccess, onerror )
```

Same than "PostAsync" method but indicating callbacks as parameters.

Params:
* apicall: [api to call, given in component.command format]
* data: [data to be indicated as parameter of the call]
* onsucess: [callback function handler to be called when the http post call completes with sucess. Receives as parameter the result of the call]
* onerror: [callback function handler to be called when the http post call completes with failure. Receives the message with the error]

## MantraAPI.Get

```js
MantraAPI.Get( apicall, onsuccess, onerror )
```

Performs an http get call.

Params:
* apicall: [api to call, given in component.command format]
* onsucess: [callback function handler to be called when the http get call completes with sucess. Receives as parameter the result of the call]
* onerror: [callback function handler to be called when the http get call with failure. Receives the message with the error]

## MantraAPI.RedirectTo

```js
MantraAPI.RedirectTo( url )
```

Redirect to url indicated as parameter.