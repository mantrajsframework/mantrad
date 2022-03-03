# Component Blocks Definition

A block is a piece of HTML to be inserted in a view or a root document (like index.html).

The name of the file with the HTML of the block is considered the name of the block.

So, for this block file: "footer.html", the name "footer" will be considered as a block name and can be used to be inserted in any view using Mustache brackets:

```html
&lcub;&lcub;&lcub;footer&rcub;&rcub;&rcub;
```

Remember, by default Mantra uses Mustache rendering template to compose html documents.

The blocks of a component should be placed at "/ui/blocks" folder.

A component can define any number of blocks, and they can be overriden by the project and used by any view of other components.

Mantra will look for the blocks in the following order:

* '/ui/<current frontend>/templates/blocks/<block name>.html'
* '/ui/templates/blocks/<block name>.html'
* '/componentname/ui/blocks/<block name>.html'

In Mantra, multiple UIs frontends can be used in the sample project.

For a component named as "footer" and current front end named "mainsite" then will consider the following folders to look for:

* '/ui/mainsit/templates/blocks/footer' 
* '/ui/templates/blocks/footer' 
* '/ui/templates/blocks'
* '/footer/ui/blocks'

There three ways to register a block: explicity by the specific *hook*, implicity by methods definitions and anonymously.

## Defining a block using the hook "Block"

You can define your block using this hook, always in *onStart* method of the component:

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

Similarly to views, blocks accept prerequests and access conditions as well.

Let's give an example:

```js
MantraAPI.Hooks("contact")
    .Block([{
        BlockName: "contact-block",
        RenderHandler: ContactBlockHandlers.Contact
    }]);
```

With this, component "contact" registers a block with the name "contact-block" that will be handled by the function ContactBlockHandlers.Contact.

In any view o html document containing:

```html
&lcub;&lcub;&lcub;contact-block&rcub;&rcub;&rcub;
```

, Mantra will render the content of the file /blocks/contact-block.html".

## Implicity method to define a block

To avoid typing the hook regitering call in *onStart* method, you can describe the blocks of the component in a specific file which name should be named as "block.<component name>.js".

In this case, the component should define a number of properties named as the following:

* "<block_name>_accescondition" (optional): string or array of strings, defines the AccessCondition property for the block.
* "<block_name>_prerequest" (optional): defines de PreRequest property for the block.
* "<block_name>_js" (optional): string or array of strings, defines the js file or files to be included for the block.
* "<block_name>_css" (optional): string or array of strings, defines the css file or files to be included for the block.
* "<block_name>": property with the block function handler to be called by the framework when the block should be rendered.
* "<block_name>_isstatic" (optional): boolean indicating if the render handler should be called once, for static content that just need to be calculated once.

Here there's an example:

```js
"use strict";

module.exports = {
    actionsonarticleblock_accesscondition: ["system.islogged"],
    actionsonarticleblock: async (MantraAPI, html) => {
        let finalHtml;

        // Do something with html if necesary
        
        return finalHtml;
    }
}
```

With this example, a block with the name "actionsonarticleblock" is defined and its HTML content should be located at "/blocks/actionsonarticleblock.html".

## Defining an anonymous block

If your block doesn't need any rendering specific process or access conditions nor prerequests handling, then you can define the html block in the folders specificed above. Mantra will look up them as blocks as well.

## Using *pre requests*

In Mantra, *prerequests* are special handlers that manages the request of a view *before* Mantra call the view of block function handler.

This prerequest handlers are useful to validate query params, calculate some kind of info before calling the view function handler and the like.

By using them, the code needed for the view or block function handler can be as minimal as possible.

*Remember:* prerequests are intended to be used to reduce the view or block function handler code lines to the minimun.

## Using *access conditions*

In Mantra *access conditions* are handlers than can register a Mantra component to check if the view or a block can be accessed or not according to any condition.

A typical scenario is the access condition for preventing an anonymous user to access a specific view.

In the case of blocks, if the access condition returns false, then the block will not be rendered.

*Remember:* access conditions is pretended to be used to reduce the view function handler code lines to the minimun.

## Function handler for the block

Any block can be rendered without any function handler; in the case of it exists a function handler for it, then Mantra will call it before send back its HTML content.

The prototype for the block function handler is as follows:

```js
async (Mantra, html) => {
    let finalHtml;

    // Do some stuff, posibly modifing html content

    return finalHtml;
}
```

The html paramenter is the content of the block file.

## List blocks defined by a component

You can get a list of blocks defined by a component with Mantra default command *show-blocks*:

```bash
$ mantrad show-blocks <component name>
```

This is useful to verify that you have defined your block correctly.

## To remember about blocks:

Remember:

* Any block defined by any component can be rendered in any view of html root document of the project.
* A block can contain other blocks with no limitation of nesting.
* If a block doesn't need special rendering process nor prerequests or access conditions, define it anonymously.
* If the block always renders the same content, set *isstatic* property to true.

***
To learn by example, go to [Mantra demos](https://www.mantrajs.com/mantrademos/showall) and [components](https://www.mantrajs.com/marketplacecomponent/components) sections of [Mantra site](https://www.mantrajs.com).