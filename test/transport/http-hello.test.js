"use strict";

const
    expect = require('chai').expect,
    client = require('../index').getHttpTestClient();

require('mocha-generators').install();

describe('Empty application', function() {
    
    it('just always responds hello world', function*() {
        yield client.get('/').expect(200);
        yield client.get('/test').expect(200);
        
        const response = yield client.get('/hello/world').expect(200);
        
        expect(response.type).eql('application/json');
        expect(response.body).eql({message: 'Hello World'});
    });
    
});
