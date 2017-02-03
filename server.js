"use strict";

const koa = require('koa');

module.exports.startServer = function(config) {
    
    const app = koa();
    
    // Begin
    app.listen(config.port);
    console.log('LISTENING ON: ' + config.port);
    
    return app;
};
