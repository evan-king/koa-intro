"use strict";

const
    co = require('co'),
    Stream = require('stream');

// wait :: int -> null
const wait = duration => new Promise(resolve => setTimeout(resolve, duration));

// trickleFeed :: (Stream -> [object]) -> null
function* trickleFeed(stream, data) {
    // end stream on empty
    if(!data.length) return stream.push(null);
    
    // delay, feed one item, and recurse on remaining data
    yield wait(250);
    stream.push(data.pop());
    yield* trickleFeed(stream, data);
}

module.exports = function(audience) {
    
    const API = {};
    

    // greet :: () -> 
    API.greet = function() {
        return {message: 'Hello ' + audience};
    }
    
    // streamGreatings* :: int -> Stream
    API.streamGreetings = function*(count) {
        yield wait(100);
        
        const
            s = new Stream.PassThrough({objectMode: true}),
            data = Array(count).fill(API.greet());
        
        co(trickleFeed(s, data));
        
        return s;
    }
    
    return API;
    
}
