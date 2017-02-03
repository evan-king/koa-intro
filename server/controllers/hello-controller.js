"use strict";

const Greeting = require('models/greeting');

exports.hello = function*() {
    const greeter = Greeting(this.audience);
    this.body = greeter.greet();
}

exports.helloStream = function*() {
    const greeter = Greeting('World');
    this.body = yield* greeter.streamGreetings(10);
}

exports.home = function*() {
    this.redirect('/hello/World');
}

exports.fail = function*() {
    throw new Error('goodbye');
}
