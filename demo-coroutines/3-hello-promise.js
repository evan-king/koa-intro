"use strict";

const 
    co = require('co'),
    wait = require('./random-wait');

const done = () => console.log('done');

const helloPromise = co.wrap(function*(audience) {
    yield wait();
    console.log(`Hello ${audience}`);
});

helloPromise('World')
    .catch(ex => console.log(ex))
    .then(done);
