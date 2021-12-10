MantraAPI = {};

MantraAPI.PostAsync = function( component, command, data ) {
    return new Promise( (resolve,reject) => {
        let url = "/"+component+"/"+command;
        let dataToSend = JSON.stringify(data);
        
        $.ajax( {
            method: "POST",
            type: "POST",
            url: url, 
            data: { mantraPostData: dataToSend }
        })
        .done( function(result) { resolve(result); })
        .fail( function( jqXHR, msg ) { reject(jqXHR.responseJSON); })
    });
}

MantraAPI.RedirectTo = function( url ) {
    window.location = url;
}

MantraAPI.Post = function( apicall, data, onsuccess, onerror ) {
    let apicallparts = apicall.split(".");
    let url = "/"+apicallparts[0]+"/"+apicallparts[1];
    let dataToSend = JSON.stringify(data);
    
    $.ajax( {
        method: "POST",
        url: url, 
        data: { mantraPostData: dataToSend }
    })
    .done( function(result) { 
        if ( result.success && onsuccess ) onsuccess(result.payload);
        else if ( !result.success && onerror ) onerror(result);
        else console.error(result);
    })
    .fail( function( jqXHR, msg ) {
        console.error( jqXHR.responseJSON, msg);
        if ( onerror ) onerror(msg);
    });
}

MantraAPI.Get = function( apicall, onsuccess, onerror ) {
    let apicallparts = apicall.split(".");
    let url = "/"+apicallparts[0]+"/"+apicallparts[1];
    
    $.ajax( {
        method: "GET",
        url: url
    })
    .done( function(result) { 
        onsuccess(result);
    })
    .fail( function( jqXHR, msg ) {
        console.error( jqXHR.responseJSON, msg);
        if ( onerror ) onerror(msg);
    });
}