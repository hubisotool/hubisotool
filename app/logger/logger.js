/**
 * Created by Bishaka on 02/12/2015.
 */
var
    log = require('loglevel'),
    logger = angular.module('logger',[])
    .config([function(){
            log.enableAll();
    }])
    .factory('logger',[function(){
        var _gut = {};

        _gut.trace = function(opts){
                if(typeof opts === "string"){
                    log.trace(opts)
                }else{
                    log.trace(opts.msg);
                }
        };

        _gut.debug = function(opts){
            if(typeof opts === "string"){
                log.debug(opts)
            }else{
                log.debug(opts.msg);
            }
        };

        return _gut;
    }])
;