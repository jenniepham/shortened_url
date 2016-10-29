'use strict';

var express = require('express');
var app = express();
var urlList = ['https://jennie-api-project-jpdomo.c9users.io'];

function isURL(aUrl){
    
    aUrl = aUrl.toString()
    
    if (aUrl.indexOf('http') === -1) {
        
        return false;
    }
    
    else if (aUrl.indexOf('.') === -1){
    return false;
}
   else {
   return true;
   }
}



app.get('/', function(request, response){
   
   response.end('Enter valid URL as a parameter to generate a shortened URL. \nValid URL must contain valid protocol & domain.\nExample output:\n"original url": "http://www.google.com"\n"shortened url":"/12"'); 
   console.log("Site opened");
 
    
});


app.get('/:url', function(request, response){
   var url = request.params.url;
   
    if (urlList[url]) {
       
       response.redirect(urlList[url]);
       console.log("redirecting to " + urlList[url]);
   }
   
   else if (!isNaN(url) && !urlList[url]){
       response.send("Invalid shortened URL!");
       console.log("Invalid shortened URL!");
   }
   
   else {response.send("Invalid URL");}
   

});



app.get('/:url*', function(request, response){
   

   var link = request.url.slice(1);

  var hostname = request.headers.host; // hostname = 'localhost:8080'
  var pathname = request.url.pathname; // pathname = '/MyApp'  
   
   
   if ( isURL(link.toString())  === false ) {
    
       response.send("Invalid URL");
       console.log("Invalid URL");
   }
    
  else {
      
     urlList.push(link); 
     var result = "original url: " + urlList[urlList.length-1]  + "\nshortened url: " + hostname + pathname + (urlList.length - 1);
     response.end(result);
     console.log("created and added shortened URL to array");
        
      
  }
    
    
    
    
});

app.listen(process.env.PORT, function(){
    
    console.log("listening on port " + process.env.POR);
    
});