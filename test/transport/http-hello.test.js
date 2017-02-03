"use strict";

const
    expect = require('chai').expect,
    client = require('../index').getHttpTestClient();

require('mocha-generators').install();

describe('Hello application', function() {
    
    describe('GET /', function() {
        
        it('redirects to /hello/World', function*() {
            const response = yield client.get('/').expect(302);
            expect(response.headers.location).eql('/hello/World');
        });
        
    });
    
    describe('GET /hello/fail', function() {
        
        it('suffers internal failure', function*() {
            const response = yield client.get('/hello/fail').expect(500);
            
            expect(response.body).property('errorCode').a('number');
            expect(response.body).property('errorMessage').a('string');
        });
        
        
    });
    
    describe('GET /hello/:audience', function() {
        
        function* get(name, pass) {
            const response = yield client
                .get('/hello/'+name)
                .expect(pass ? 200 : 400);
            
            pass
                ? expect(response.body).eql({message: 'Hello '+name})
                : expect(response.body.errorDetails.reason).eql('grammar');
        }
        
        it('accepts capitalized names', get.bind(null, 'Dave', true));
        it('rejects lowercase names', get.bind(null, 'dave', false));
        
    });
    
    describe('GET /hello/stream', function() {
        this.timeout(5000);
        
        it('streams greetings', function*() {
            const response = yield client
                .get('/hello/stream')
                .expect(200);
            
            expect(response.body).eql(Array(10).fill({message: 'Hello World'}));
        });
        
    });
    
    describe('POST /hello', function() {
        
        function* post(name, pass) {
            const response = yield client
                .post('/hello')
                .send({audience: name})
                .expect(pass ? 200 : 400);
            
            console.log(response.body);
            
            pass
                ? expect(response.body).eql({message: 'Hello '+name})
                : expect(response.body.errorDetails.reason).eql('grammar');
        }
        
        it('accepts capitalized names as POST body', post.bind(null, 'Dave', true));
        it('rejects lowercase names', post.bind(null, 'dave', false));
    });
    
    
    it('returns not found on invalid paths', function*() {
        const response = yield client.get('/arbitrary/path').expect(404);
        
        expect(response.type).eql('text/plain');
        expect(response.text).eql('Not Found');
        expect(response.body).eql({});
    });
    
});
