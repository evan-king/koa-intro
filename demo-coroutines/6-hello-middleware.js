"use strict";

const
    co = require('co'),
    Middleware = require('co-compose'),
    wait = require('./random-wait');

const
    middleware = new Middleware(),
    done = () => console.log('done');

let count = 0;
function* hello(next) {
    let idx = ++count;
    yield wait();
    console.log(`Hello (${idx})`);
    
    if(typeof next === 'object') yield* next;
    //try { yield* next; } catch(ex) { console.log(ex); }
    //yield next;
    
    yield wait();
    console.log(`World (${idx})`);
}

const helloThrice = middleware.compose([hello, hello, hello]);

co(helloThrice)
    .catch(ex => console.log(ex))
    .then(done);
