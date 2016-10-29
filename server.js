'use strict';

var express = require('express');
var app = express();
require('dotenv').config();

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

var MongoUrl = process.env.MONGODB_URI;
var urlList = [];
var listEntry;
var link;


MongoClient.connect(MongoUrl, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to get server");
  
  findDocuments(db, function() {
     db.close();
    });
    
});

var findDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('url');
  // Find some documents
  collection.find({}, {"_id": false}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    callback(docs);
    urlList = docs;
    listEntry = urlList.length;
    console.log(urlList);
  });
};


   
   var insertDocuments = function(db, callback){
    var collection = db.collection('url');
    
    collection.insert({'no':listEntry.toString(), 'short-url':link});
    console.log({'no':listEntry, 'short-url':link});

};


function isURL(aUrl){
    
    aUrl = aUrl.toString();
    
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
////////////////////////////////////////////
app.get('/:url', function(request, response){
   var url = request.params.url;
   var specificDoc = [];
   
if (!isNaN(url)){
var findOne = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('url');
  // Find some documents
  collection.find({'no': url}, {_id: false}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records for provided shortened url");
    callback(docs);
    specificDoc = docs;
    console.log(docs);
    console.log(specificDoc.length);
  });
};

MongoClient.connect(MongoUrl, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to get server");
  
  findOne(db, function() {
     db.close();
    });
    
});
}

setTimeout(function(){
   
    if (specificDoc.length == 1) {
       
       response.redirect(specificDoc[0]['short-url']);
       console.log("redirecting to " + specificDoc[0]['short-url']);
   }
   
   else if (!isNaN(url) && specificDoc.length == 0){
       response.send("Invalid shortened URL!");
       console.log("Invalid shortened URL!");
   }
   
   else {response.send("Invalid URL");}
}, 300);

});


///////////////////////////

app.get('/:url*', function(request, response){
   

   link = request.url.slice(1);

  var hostname = request.headers.host; // hostname = 'localhost:8080'
 

   if ( isURL(link.toString())  === false ) {
    
       response.send("Invalid URL");
       console.log("Invalid URL");
   }
    
  else {
      
    MongoClient.connect(MongoUrl, function(err,db){
       assert.equal(null, err);
       console.log("Connected successfully to post server");
       
        insertDocuments (db, function() {
     db.close();
    });
        
    });
    
     var result = "original url: " + link + "\nshortened url: " + hostname + "/" + listEntry;
     response.end(result);
     console.log("created and added shortened URL to array");
        
      
  }
    
    
});

app.listen(process.env.PORT, function(){
    
    console.log("listening on port " + process.env.POR);
    
});