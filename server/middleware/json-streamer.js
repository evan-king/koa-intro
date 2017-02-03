"use strict";

const
    stream = require('stream'),
    isJSON = require('koa-is-json'),
    Stringify = require('streaming-json-stringify');

/**
 * jsonStreamer
 * Better output handler, dealing with streams and JSON.
 * This is based on koa-json, but correctly handles streams
 * from koa-mongo.  koa-json incorrectly rejects mongo streams
 * as not a stream due to overly-stringent stream test conditions.
 * 
 * @author Evan King
 */
module.exports = function jsonStreamer(options) {
    options = options || {};
    const pretty = options.pretty || false;
    const spaces = options.spaces || 2;
    
    return function* filter(next) {
        yield *next;
        const body = this.body;
        
        // Pipe stream output through Stringify
        if(body && typeof body.pipe === 'function') {
            this.response.type = 'json';
            const stringify = Stringify();
            if(pretty) stringify.space = spaces;
            return this.body = body.pipe(stringify);
        }
        
        // Override JSON output with pretty-printing
        if(pretty && isJSON(body)) {
            return this.body = JSON.stringify(body, null, spaces);
        }
    }
}