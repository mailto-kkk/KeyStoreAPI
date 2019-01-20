/*global describe:false, it:false, before:false, after:false, afterEach:false*/

'use strict';

var commonUtil = require('../../lib/commonUtil');
var objectService = require('../../services/objectService');
var objectModel = require('../../models/objectModel');
var Q = require('q');
var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var sinon = require('sinon');
var httpStatus = require('http-status');

var sinonChai = require('sinon-chai');
chai.use(sinonChai);
require('sinon-as-promised');

//========================================================================================TestCases starts below

describe('objectService::Object Service TestSuite', () => {

    let logUtilStub;

    before(function (done) {
        // Stub the logUtil to ensure that log details are not printed while executing unit tests
        let logUtil = require('../../lib/logUtil');
        logUtilStub = sinon.stub(logUtil, 'msg',
            function (level, controller, model, lib, method, info) {
                return '';
            });
        done();
    });

    after(function (done) {
        logUtilStub.restore();
        done();
    });
	
	describe('Method: createKey() - store the value in DB ', () => {

        let responseStub,insertEntityStub;

        it('should save value in DB', (done) => {

			let returnEntities = {
				"key": "key3",
				"value": "value3",
				"timestamp": 1547982523
			}
			
            let response = {
                'Content-Type': 'application/json; charset=utf-8',
                'Status': httpStatus.CREATED,
				'body': returnEntities
            };

           
			let request = {
                'body': {'key3': 'value3'}
            };
			
			let expectedVal = {
                'Content-Type': 'application/json; charset=utf-8',
                'Status': httpStatus.CREATED,
				'body': returnEntities
            };
			
			insertEntityStub = sinon.stub(objectModel, 'insertEntity');
            insertEntityStub.resolves(returnEntities);
			
            responseStub = sinon.stub(commonUtil, 'sendResponse');
            responseStub.returns(response);
			
			

           objectService.createKey(request, response).then(function (actual) {	
                expect(actual).to.deep.equal(expectedVal);                
                expect(commonUtil.sendResponse).to.have.been.calledOnce;
                insertEntityStub.restore();
				responseStub.restore();
                done();
            });
			
			

        }); //end it		
        

    }); //end describe for Method: createKey()

	describe('Method: getKey() - Get the value from DB ', () => {

        let sendResponseStub,getEntityStub,isPageNotFoundStub;

        it('should return corresponding value from DB, if the key is present along with the matching timestamp', (done) => {

			let returnEntities = 
				[
					{ "VALUE": "value4"}
				];
			
            let response = {
                'Content-Type': 'application/json; charset=utf-8',
                'Status': httpStatus.OK,
				'body': returnEntities
            };

           let request = {
                'params': {'key': 'key1'},
                'query': {'timestamp': '1347794787'}
            };

			
			let expectedVal = {
                'Content-Type': 'application/json; charset=utf-8',
                'Status': httpStatus.OK,
				'body': returnEntities
            };
			
			getEntityStub = sinon.stub(objectModel, 'getEntity');
            getEntityStub.resolves(returnEntities);
			
            sendResponseStub = sinon.stub(commonUtil, 'sendResponse');
            sendResponseStub.returns(response);
			
			

           objectService.getKey(request, response).then(function (actual) {				
                expect(actual).to.deep.equal(expectedVal);                
                expect(commonUtil.sendResponse).to.have.been.calledOnce;
                getEntityStub.restore();
                sendResponseStub.restore();
                done();
            });
			
			

        }); //end it

		it('should return empty value, if the key is present(but not with the matching timestamp) ', (done) => {

			let returnEntities = {};
				
			
            let response = {
                'Content-Type': 'application/json; charset=utf-8',
                'Status': httpStatus.OK,
				'body': returnEntities
            };

           let request = {
                'params': {'key': 'key1'},
                'query': {'timestamp': '1447719628'}
            };

			
			let expectedVal = {
                'Content-Type': 'application/json; charset=utf-8',
                'Status': httpStatus.OK,
				'body': returnEntities
            };
			
			getEntityStub = sinon.stub(objectModel, 'getEntity');
            getEntityStub.resolves([]);
			
            
			
			isPageNotFoundStub = sinon.stub(objectService, 'isPageNotFound');
            isPageNotFoundStub.returns(response);
			
			
			

           objectService.getKey(request, response).then(function (actual) {				
                
				expect(actual).to.deep.equal(expectedVal);                
                expect(objectService.isPageNotFound).to.have.been.calledOnce;
                getEntityStub.restore();
                isPageNotFoundStub.restore();
                done();
            });
			
			

        }); //end it

        

    }); //end describe for Method: getKey()
	
	
    describe('Method: isPageNotFound() - renders 404 as HTTP status ', () => {

        let sendResponseStub,sendResponseWoBodyStub,getEntityStub;

        it('should return HTTP status 404 (NOT_FOUND) if key is not in the DB', (done) => {

            let response = {
                'Content-Type': 'application/json; charset=utf-8',
                'Status': httpStatus.NOT_FOUND
            };

            let request = {
                'params': {'key': 'Key1'}
            };

            let expectedVal = {
                'Content-Type': 'application/json; charset=utf-8',
                'Status': httpStatus.NOT_FOUND
            };

			
			let returnEntities = [];
			
            sendResponseWoBodyStub = sinon.stub(commonUtil, 'sendResponseWoBody');
            sendResponseWoBodyStub.returns(response);
			
			getEntityStub = sinon.stub(objectModel, 'getEntity');
            getEntityStub.resolves([]);

            var returnRes = objectService.isPageNotFound(request, response);
			
			getEntityStub.restore();
            sendResponseWoBodyStub.restore();
            done();
			
			

        }); //end it

        

    }); //end describe for Method: isPageNotFound()


    

}); //end describe


