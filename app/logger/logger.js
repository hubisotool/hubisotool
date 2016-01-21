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
        var _gut = {},
            delim = " | ",
            _log_ = function(opts,severity){

                var sev_up = severity.toUpperCase(),
                    sev_low = severity.toLowerCase();

                if(typeof opts === "string"){
                    log[sev_low](buildMsg({msg:opts,severity:sev_up}))
                }else{
                    log[sev_low](buildMsg({    msg:opts.msg,
                        severity:sev_up,
                        diagId:opts.diagId,
                        src:opts.src    }));
                }

            },

            buildMsg = function(opts){
                var result = "",
                    keys = ["severity","src","diagId","msg"],
                    timestamp = moment().toISOString();

                keys.map(function(key){
                    opts[key] = opts[key] || "-";
                });

                result =    timestamp
                            + delim + opts.severity
                            + delim + opts.src
                            + delim + opts.diagId
                            + delim + opts.msg;

                return result;
            };



        _gut.trace = function(opts){
            _log_(opts,"TRACE");
        };

        _gut.debug = function(opts){
            _log_(opts,"DEBUG");
        };

        return _gut;
    }])
;