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
    yield wait();
    console.log(`Hello World (${++count})`);
    if(typeof next === 'object') yield* next;
}

const helloThrice = middleware.compose([hello, hello, hello]);

co(helloThrice)
    .catch(ex => console.log(ex))
    .then(done);
