'use strict';

// Imports dependencies and set up http server
const
  request = require('request'),
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()); // creates express http server
// Sets server port and logs message on success
var port = process.env.PORT || 8080;


app.listen(port, () => console.log('webhook is listening'));
app.get('/test', (req, res) => {
	console.log('test');
	res.sendStatus(200);
});
// Creates the endpoint for our webhook 
app.post('/webhook', (req, res) => {  
  
  console.log('Initiate request');
  let body = req.body;
  const ACCESS_TOKEN = "EAAHex127re4BAGgO6rTEoZCio9MHHXd5MGzjy4G0snZCBI7VdvnIZBPykRBmZBizJ3BufeyjWeBTMhf8ZCY5DOn4O8s9rJs0RJS9HP1JJRefI3mCcqE2dsrZAuxZCgAifAjE49ooNIJdxLzsVwZBqXYTKaC9rSTLSHy6JvwJwQ4NjxhoPfRxA7wq";
  // Checks this is an event from a page subscription
  if (body.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    console.log('======================== body.entry', body.entry);
    console.log('*******************************************');
    body.entry.forEach(function(entry) {
      // Gets the message. entry.messaging is an array, but 
      // will only ever contain one message, so we get index 0
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);
      const sender = webhook_event.recipient.id;
      const recicient = webhook_event.sender.id;
      const message = {
        "sender":{
          "id": sender
        },
        "recipient":{
          "id": recicient
        },
        "message":{
          "text":"hello, world! tounaf"
        }
      };
      
      console.log('=================== Replay', message);
      request({
        "uri" :"https://graph.facebook.com/v13.0/me/messages",
        "qs" : { "access_token": ACCESS_TOKEN },
        "method" : "POST",
        "json" : message
      }, (err, res, body) => {
        if(err) {
          console.log('Erro lors evoe' + err)
        } else {
          console.log('Message sent');
        }
      })
    
    });

    
    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});

// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = "bcdf-102-16-25-30" // "<YOUR_VERIFY_TOKEN>"
    
  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
  console.log('challenge', challenge);
  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
  
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
});
