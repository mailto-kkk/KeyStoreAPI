'use strict';

var logger = require('../lib/logUtil');
var commonUtil = require('../lib/commonUtil');
var httpStatus = require('http-status');
var objectModel = require('../models/objectModel');

function objectService() {
}

module.exports = objectService;

/*
    Used to store the keys along with it's value
 */
objectService.createKey = function(request,response) {
    var key=Object.keys(request.body);
    var value=request.body[key];
     return objectModel.insertEntity(key,value)
        .then(function(insertedData){
            if(insertedData){
                return commonUtil.sendResponse(response, httpStatus.CREATED, insertedData);
            } else {
                logger.msg('ERROR', 'objectService', '', '', 'createKey', 'Undefined error in createKey - ' + err.stack);
                return commonUtil.sendResponseWoBody(response, httpStatus.INTERNAL_SERVER_ERROR);
            }
        }, function (err) {
            logger.msg('ERROR', 'objectService', '', '', 'createKey', 'Undefined error in createKey - ' + err.stack);
            return commonUtil.sendResponseWoBody(response, httpStatus.INTERNAL_SERVER_ERROR);
        });
};

/*
    Used to get the values for the given key
 */
objectService.getKey = function(request,response) {
    var  timestamp= request.query.timestamp;
    var  key= request.params.key;
    return objectModel.getEntity(key,timestamp)
        .then(function(data){
            //console.log("data in the getKey response is "+JSON.stringify(data));
            if(data){
                if(data[0]){
                    return commonUtil.sendResponse(response, httpStatus.OK, data[0]);
                }else{
                    // If data is not there, check the DB with only 'Key'. If 'data' is not there, put as 404.
                    logger.msg('INFO', 'objectService', '', '', 'getKey', 'Data is not present in DB ');
                    return objectService.isPageNotFound(request, response);
                }
            } else {
                logger.msg('ERROR', 'objectService', '', '', 'getKey', 'Undefined error in getKey - ' + err.stack);
                return commonUtil.sendResponseWoBody(response, httpStatus.INTERNAL_SERVER_ERROR);
            }
        }, function (err) {
            logger.msg('ERROR', 'objectService', '', '', 'getKey', 'Undefined error in getKey - ' + err.stack);
            return commonUtil.sendResponseWoBody(response, httpStatus.INTERNAL_SERVER_ERROR);
        });
};

/*
 Used to differentiate whether the response code is 404 or 200
 */
objectService.isPageNotFound = function(request,response) {
    logger.msg('INFO', 'objectService', '', '', 'isPageNotFound', 'start of isPageNotFound');
    var  key= request.params.key;
    return objectModel.getEntity(key,'')
        .then(function(data){
            //console.log("data in the isPageNotFound response is "+JSON.stringify(data));
            if(data){
                if(data[0]){
                    // Data is there only with key as search criteria. so we can't say as 404. It has to be 200
                    return commonUtil.sendResponse(response, httpStatus.OK, {});
                }else{
                    // 'data' is not there, put as 404.
                    logger.msg('INFO', 'objectService', '', '', 'isPageNotFound', 'Data is not present from deciding method ');
                    return commonUtil.sendResponseWoBody(response, httpStatus.NOT_FOUND);
                }
            } else {
                logger.msg('ERROR', 'objectService', '', '', 'isPageNotFound', 'Undefined error in isPageNotFound - ' + err.stack);
                console.log("Undefined error in isPageNotFound");
                return commonUtil.sendResponseWoBody(response, httpStatus.INTERNAL_SERVER_ERROR);
            }
        }, function (err) {
            logger.msg('ERROR', 'objectService', '', '', 'isPageNotFound', 'Undefined error in isPageNotFound - ' + err.stack);
            return commonUtil.sendResponseWoBody(response, httpStatus.INTERNAL_SERVER_ERROR);
        });
};
