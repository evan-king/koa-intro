"use strict";

const cluster = require('cluster');

module.exports = function(options) {
    return function* logger(next) {
        const args = [
            new Date().toISOString(),
            this.method.toUpperCase(),
            this.url,
        ];
        
        if(options.clustered) args.push('wid:', cluster.worker.id);
        
        console.log(args.join(' '));
        yield* next;
    }
}

let responseCount = 0;
let avgResponse = 0;
module.exports.timer = function*(next) {
    const start = Date.now();
    yield* next;
    const delta = Math.ceil(Date.now() - start);
    
    avgResponse = (avgResponse * responseCount++ + delta) / responseCount;
    console.log(
        "response", delta+'ms',
        "avg", Math.round(avgResponse)+"ms"
    );
    this.set('X-Response-Time', delta + 'ms');  
}