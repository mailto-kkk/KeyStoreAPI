/*global describe:false, it:false, before:false, after:false*/

'use strict';

var kraken = require('kraken-js'),
    express = require('express'),
    expect = require('chai').expect,
    httpStatus = require('http-status'),
    supertest = require('supertest');

var os = require('os');
var _ = require('lodash');

// This gets the ip of the server that will execute this integration test
/*
 var ip = _.chain(os.networkInterfaces())
 .values()
 .flatten()
 .filter(function (val) {
 return (val.family === 'IPv4' && val.internal === false);
 })
 .pluck('address')
 .first()
 .value();
 */

var ip = '127.0.0.1';
var api = supertest('http://' + ip + ':8001');

describe('key Store', function () {

    describe('Store the key through /object endpoint', function () {

        it('should return HTTP status 201 (Created) ', function (done) {
            var request = {
			  "key3": "value3"
			};

            api.post('/object')
                .set('Content-type', 'application/json')
                .set('Authorization', 'Basic T0NUZXN0aW5nOlByb3RlY3QkMQ==')
                .send(request)
                .end(function (err, res) {
                    expect(httpStatus.CREATED).to.equal(res.statusCode);
                    done(err);
                });
        });

        

    });
	
	
    describe('Get the key through /object/{Key} endpoint', function () {
        it('should return HTTP status 200 with the key value ', function (done) {
            var request = {
			};

            api.get('/object/key1')
                .set('Content-type', 'application/json')
                .set('Authorization', 'Basic T0NUZXN0aW5nOlByb3RlY3QkMQ==')
                .send(request)
                .end(function (err, res) {
                    expect(httpStatus.OK).to.equal(res.statusCode);
                    done(err);
                });
        });       

    });
	
	describe('Get the key through /object/{Key} endpoint with timestamp', function () {
        it('should return HTTP status 200 with the key value ', function (done) {
            var request = {
				'query': {'timestamp': '1347794787'}
			};

            api.get('/object/key1')
                .set('Content-type', 'application/json')
                .set('Authorization', 'Basic T0NUZXN0aW5nOlByb3RlY3QkMQ==')
                .send(request)
                .end(function (err, res) {
                    expect(httpStatus.OK).to.equal(res.statusCode);
                    done(err);
                });
        });       

    });
	
	describe('Get the key through /object/{Key} endpoint', function () {
        it('should return HTTP status 404(if the key is not there in DB) ', function (done) {
            var request = {
			};

            api.get('/object/Key_Not_In_DB')
                .set('Content-type', 'application/json')
                .set('Authorization', 'Basic T0NUZXN0aW5nOlByb3RlY3QkMQ==')
                .send(request)
                .end(function (err, res) {
                    expect(httpStatus.NOT_FOUND).to.equal(res.statusCode);
                    done(err);
                });
        });       

    });
});
