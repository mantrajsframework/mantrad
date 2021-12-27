# Component Blocks Definition

A block is a piece of HTML to be inserted in a view or a root document (link index.html).

Mantra expects to find the blocks of a component inside the folder "blocks".

Two ways to register a block.

The first one, is using the hook of the name "Block":

```js
MantraAPI.Hooks(["component name"])
    .Block([{
        BlockName: "[unique name of the block]",
        RenderHandler: [block function handler (optional)]
        Js: [array with js files to include | js file to include (optional)],
        Css: [array with css files to include | css file to include (optional)],
        PreRequest: [array with pre requests to call before calling view handler (optional)],
        AccessCondition: [array with access conditions handlers to call before calling view handler (optional)],
        IsStatic: [boolean indicating if then render handler should be called once (optional)]
    }]);
```

Similarly to views, blocks accept prerequest and access conditions as well.

Let's give an example:

```js
MantraAPI.Hooks("contact")
    .Block([{
        BlockName: "contact-block",
        RenderHandler: ContactBlockHandlers.Contact
    }]);
```

With this, component "contact" registers a block with the name "contact-block" that will be handled by the function ContactBlockHandlers.Contact.

In any view o html document cotaining "{{{contact-block}}}", Mantra will render the content of the file /blocks/contact-block.html".

## Using *pre requests*
As described in (TODO: link to the document), pre request are special handlers that manages the request of a view before Mantra call the view of block function handler.

This pre request handlers are useful to validate query params, calculate some kind of info before calling the view function handler and the like.

By using them, the code needed for the view or block function handler can be as minimal as possible.

*Remember:* pre requests is pretended to be used to reduce the view or block function handler code lines to the minimun.

## Using *access conditions*
As described in (TODO: link to the document), access conditions are handlers than can register a Mantra component the check if the view or a block can be accessed or not according to any condition.

A typical scenario is the access condition for preventing an anonymous user to access a specific view.

In the case of blocks, if the access condition returns false, then the block will not be rendered.

*Remember:* access conditions is pretended to be used to reduce the view function handler code lines to the minimun.

## Brief method of defining views

To avoid typing the hook regitering call in *onStart* method, you can describe the blocks of the component in a specific module which file name should be named as "block.<component name>.js".

In this case, the module should define a number of properties named as the following:
* "<block_name>_accescondition" (optional): string or array of strings, defines the AccessCondition property for the block.
* "<block_name>_prerequest" (optional): defines de PreRequest property for the block.
* "<block_name>_js" (optional): string or array of strings, defines the js file or files for the block.
* "<block_name>_css" (optional): string or array of strings, defines the css file or files for the block.
* "<block_name>": property with the block function handler to be called by the framework when the block should be rendered.
* "<block_name>_isstatic" (optional): boolean indicating if the render handler should be called once, for static content that just need to be calculated once.

Here there's an example:

```js
"user strict";

module.exports = {
    actionsonarticleblock_accesscondition: ["system.islogged"],
    actionsonarticleblock: async (MantraAPI, html) => {
        // ...    
    }
}
```

With this example, a block with the name "actionsonarticleblock" is defined and its HTML content should be located at "/blocks/actionsonarticleblock.html".

## Function handler for the block
Any block can be rendered without any function handler; in the case of it exists a function handler for it, then Mantra will call it before send back its content.

The prototype for the block function handler is as following:

```js
async (MantraAPI, html) => {
    let finalHtml;
    // Do some stuff, posible modifing html content

    return finalHtml;
}
```

The html paramenter is the content of the block file.

## Two important things about blocks
Remember:
* Any block defined by any component can be rendered in any view of html root document of the project.
* A block can contain other blocks with no limitation of nesting.