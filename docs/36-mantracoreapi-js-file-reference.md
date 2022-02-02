# mantracoreapi.js File Reference

This file is added for all HTTP view requests and is intended to be used so that the components can add client side properties and methods.

By client side we mean the browser.

Simply defines for the client side a object named as MantraAPI.

During the process of rendering a view, all data added to be loaded in the client side (using Mantra.AddDataValue method in the server side), will be added to MantraAPI.data property.

Components can add its own js files to extend MantraAPI client object.