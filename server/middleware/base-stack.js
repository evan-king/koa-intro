"use strict";

const
    compose = require('koa-compose'),
    ErrorHandler = require('middleware/http-error-handler'),
    logRequests = require('middleware/log-requests');

module.exports = function(options) {
    
    const stack = [];
    
    // Log all requests
    stack.push(logRequests({clustered: options.clustered}));
    if(options.debug) stack.push(logRequests.timer);
    
    // Catch errors and respect response codes from HttpErrors
    stack.push(ErrorHandler.middleware({pretty: options.pretty}));
    
    // Let's always serve up JSON, in a naive manner
    if(options.pretty) stack.push(function*(next) {
        yield* next;
        
        // Don't do this in production, it's expensive
        this.body = JSON.stringify(this.body, null, 2);
    });
    
    stack.push(function*(next) {
        yield* next;
        if(typeof this.body != 'object') {
            this.body = {message: this.body};
        }
    });
    
    return compose(stack);
    
}