"use strict";

const
    koa = require('koa'),
    base = require('middleware/base-stack');

module.exports.startServer = function(config) {
    
    const app = koa();
    
    // Use a standardized partial application stack from elsewhere
    app.use(base({
        clustered: config.processes > 1,
        pretty: config.debug,
        debug: config.debug
    }));
    
    // Handle requests with 'Hello World' response
    app.use(function*(next) {
        this.body = 'Hello World';
    });
    
    // Begin
    app.listen(config.port);
    console.log('LISTENING ON: ' + config.port);
    
    return app;
};
