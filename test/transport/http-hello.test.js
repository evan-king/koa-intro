"use strict";

const
    expect = require('chai').expect,
    client = require('../index').getHttpTestClient();

require('mocha-generators').install();

describe('Empty application', function() {
    
    it('just always returns 404', function*() {
        yield client.get('/').expect(404);
        yield client.get('/test').expect(404);
        
        const response = yield client.get('/hello/world').expect(404);
        
        expect(response.headers['content-type']).eql('text/plain; charset=utf-8');
        expect(response.text).eql('Not Found');
    });
    
});
