'use strict';

function objectModel() {
    return {};
}

module.exports = objectModel;

var moment=require('moment');
var Q = require('q');
var logger = require('../lib/logUtil');
var commonUtil = require('../lib/commonUtil');
var DBUtil = require('../lib/dbUtil');

objectModel.insertEntity = function (key,value) {
    logger.msg('INFO', 'objectModel', '', '', 'insertEntity', 'insertEntity');
    var d              = Q.defer();
    //var currentTimestamp=moment().unix();
    var currentTimestamp=moment.utc().unix();
    var sqlData        = [key,value,currentTimestamp];
    var tableMainQuery   = "INSERT INTO ENTITY(KEY1,VALUE,CREATED_TIME_UTC) VALUES(?,?,?)";
    DBUtil.getConnection(function (err, dbConn) {
        if (err) {
            logger.msg('ERROR', 'objectModel', '', '', 'insertEntity', 'Error during getConnection :: err - ' + err.stack);
            d.reject(err);
        } else {
            dbConn.query(tableMainQuery, sqlData, function (err, results) {
                DBUtil.releaseConnection(dbConn);
                if (err) {
                    logger.msg('ERROR', 'objectModel', '', '', 'insertEntity', 'Error during executing SQL :: err - ' + err.stack);
                    d.reject(err);
                } else {
                    var responseToSend={
                        "key":key.toString(),
                        "value":value,
                        "timestamp":currentTimestamp
                    };
                    d.resolve(responseToSend);
                }
            });
        }
    });
    return d.promise;
};

objectModel.getEntity = function (key,timestamp) {
    logger.msg('INFO', 'objectModel', '', '', 'getEntity', 'getEntity');
    var d              = Q.defer();

    var sqlData        = [key];
    var tableMainQuery   = "SELECT VALUE FROM ENTITY WHERE KEY1=? ORDER BY CREATED_TIME_UTC DESC LIMIT 1 ";
    if(timestamp){
        sqlData.push(timestamp);
        tableMainQuery   = "SELECT VALUE FROM ENTITY WHERE KEY1=? AND CREATED_TIME_UTC <= ? ORDER BY CREATED_TIME_UTC DESC LIMIT 1 ";
    }
    DBUtil.getConnection(function (err, dbConn) {
        if (err) {
            logger.msg('ERROR', 'objectModel', '', '', 'getEntity', 'Error during getConnection :: err - ' + err.stack);
            d.reject(err);
        } else {
            dbConn.query(tableMainQuery, sqlData, function (err, results) {
                DBUtil.releaseConnection(dbConn);
                if (err) {
                    logger.msg('ERROR', 'objectModel', '', '', 'getEntity', 'Error during executing SQL :: err - ' + err.stack);
                    d.reject(err);
                } else {
                    d.resolve(results);
                }
            });
        }
    });
    return d.promise;
};
