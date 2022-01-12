/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const CoreConstants = global.gimport("coreconstants");
const DepsFactory = global.gimport("depsfactory");

module.exports = {
    AddGlobalVars: function(MantraAPI) {
        const sc = global.Mantra.MantraConfig;
    
        if ( sc.GlobalTemplateVars ) {
            MantraAPI.AddRenderValues( sc.GlobalTemplateVars );
        }

        MantraAPI.AddRenderValue( CoreConstants.MANTRA_INSTANCE_ID, global.Mantra.MantraConfig.InstanceId )
                 .AddRenderValue( CoreConstants.MANTRA_CURRENT_VERSION_BLOCK, global.Mantra.MantraConfig.CurrentVersion );
    },

    RenderContentWithValues( htmlContent, values ) {
        return DepsFactory.RenderHtml( htmlContent, values );
    },

    RenderRenderValues( values ) {
        for( const renderValue of Object.keys(values) ) {
            if ( typeof values[renderValue] == 'string' && values[renderValue].indexOf("{{") != -1 ) {
                if (values[renderValue]) {
                    values[renderValue] = this.RenderContentWithValues(values[renderValue], values);
                }
            }
        }
    },

    async LookupBlocksFromContents( MantraAPI, contents ) {
        let blocks = [];

        for( let content of contents ) {
            await this.LookupBlockFromContent( MantraAPI, content, blocks );
        }

        return blocks;
    },

    async LookupBlockFromContent( MantraAPI, content, blocks ) {
        const blocksParsed = this.GetBlocksFromHtml( content );

        for( const b of blocksParsed ) {
            if ( !blocks.includes(b) ) {
                let htmlBlock = await this.GetHtmlBlock( MantraAPI, b );

                if ( htmlBlock != "" ) {
                    blocks.push( b );
                    await this.LookupBlockFromContent( MantraAPI, htmlBlock, blocks );
                }
            }
        }
    },

    GetBlocksFromHtml( html ) {
        let blocks = [];

        for( const section of DepsFactory.ParseBlocks(html) ) {
            if ( section[0] == "name" ) blocks.push( section[1] );
        }

        return blocks;
    },

    async GetHtmlBlock( MantraAPI, blockName ) {        
        const htmlBlocks = await global.Mantra.Bootstrap.getHtmlBlocks(MantraAPI, [blockName], MantraAPI.req, MantraAPI.res );
        
        return htmlBlocks[blockName] ? htmlBlocks[blockName].blockHtml : ""; 
    }
}