'use strict';
var logger = require('../lib/logUtil');
var commonUtil = require('../lib/commonUtil');
var httpStatus = require('http-status');
var objectService= require('../services/objectService');

module.exports = function (router) {

    router.options('/*', function (req, res) {
        logger.msg('INFO', 'v1', '', '', 'OPTIONS ', 'sets the Cross-origin resource sharing (CORS) headers');
        /*sets the Cross-origin resource sharing (CORS) headers*/
        commonUtil.setCorsResponseHeaders(res)
            .then(function (res) {
                res.sendStatus(httpStatus.OK);
            });
    });



    //POST Create Object
    router.post("/", function (req, res) {
        logger.msg('INFO', 'v1', '', '', 'POST ', 'Create Object - ' + JSON.stringify(req.body));
        if(req.body.constructor === Object && (Object.keys(req.body).length === 0 || Object.keys(req.body).length > 1)) {
            // If it is a empty body or If it contains more than 1 key, then it is a bad request.
            logger.msg('INFO', 'v1', '', '', 'POST ', 'Contains empty body or contains more than one key ');
            commonUtil.sendResponseWoBody(res, httpStatus.BAD_REQUEST);
        } else {
            objectService.createKey(req, res);
        }
    });

    //Get Object
    router.get("/:key", function (req, res) {
        var  timestamp= req.query.timestamp;
        if(timestamp && timestamp.length!==10  ){
            // If timestamp is there, it has to be exactly 10 digits.
            logger.msg('INFO', 'v1', '', '', 'GET ', 'Timestamp is not having 10 digits ');
            commonUtil.sendResponseWoBody(res, httpStatus.BAD_REQUEST);
        }else{
            objectService.getKey(req, res);
        }

    });


};
