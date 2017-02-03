"use strict";

const
    expect = require('chai').expect,
    Greeting = require('models/greeting');

require('mocha-generators').install();

// readStream :: Stream(obj) -> [obj]
function readStream(stream) {
    const rows = [];
    stream.on('data', rows.push.bind(rows));
    return new Promise(resolve => stream.on('end', resolve.bind(null, rows)));
}

describe('Greeting', function() {
    
    const
        greeter = Greeting('World'),
        stdMessage = {message: 'Hello World'};
    
    it('provides hello message', function*() {
        expect(greeter.greet()).eql(stdMessage);
    });
    
    it('streams greetings', function*() {
        this.timeout(3000);
        const
            count = 3,
            expected = Array(count).fill(stdMessage),
            stream = yield* greeter.streamGreetings(count),
            actual = yield readStream(stream);
        
        expect(actual).eql(expected);
    });
    
});
