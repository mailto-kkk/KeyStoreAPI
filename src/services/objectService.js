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
                return commonUtil.sendResponse(response, httpStatus.OK, insertedData);
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
            if(data){
                if(data[0]){
                    return commonUtil.sendResponse(response, httpStatus.OK, data[0]);
                }else{
                    return commonUtil.sendResponse(response, httpStatus.OK, {});
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
