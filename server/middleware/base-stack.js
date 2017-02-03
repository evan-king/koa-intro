"use strict";

const
    compose = require('koa-compose'),
    ErrorHandler = require('middleware/http-error-handler'),
    jsonStreamer = require('middleware/json-streamer'),
    logRequests = require('middleware/log-requests');

module.exports = function(options) {
    
    const stack = [];
    
    // Log all requests
    stack.push(logRequests({clustered: options.clustered}));
    if(options.debug) stack.push(logRequests.timer);
    
    // Catch errors and respect response codes from HttpErrors
    stack.push(ErrorHandler.middleware({pretty: options.pretty}));
    
    // Handle output translation for json (object streams to strings and pretty-printing)
    stack.push(jsonStreamer({pretty: options.pretty}));
    
    // Let's always serve up JSON, in a naive manner
    stack.push(function*(next) {
        yield* next;
        if(this.body && typeof this.body != 'object') {
            this.body = {message: this.body};
        }
    });
    
    return compose(stack);
    
}