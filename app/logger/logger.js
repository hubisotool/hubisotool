/**
 * Created by Bishaka on 02/12/2015.
 */
var
    log = require('loglevel'),
    winston = require('winston'),
    log2Console = [],
    logger = angular.module('logger',[])
    .config([function(){
            winston.loggers.add('reminders::scheduleReminders',{
                file:{
                    level:"silly",
                    filename:require('nw.gui').App.dataPath+"/reminder-scheduler.log"
                }
            });
            winston.loggers.add('reminderDaemon::link::reminderDaemonHook',{
                file:{
                    filename:require('nw.gui').App.dataPath+"/cim.log"
                }
            });
            winston.loggers.add('calendar::link',{
                file:{
                    level:"silly",
                    filename:require('nw.gui').App.dataPath+"/cim.log"
                }
            });
            winston.loggers.add('events::addEvent',{
                file:{
                    level:"silly",
                    filename:require('nw.gui').App.dataPath+"/cim.log"
                }
            });

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
                    if(log2Console.indexOf(opts.diagId) > -1) {
                        log[sev_low](buildMsg({    msg:opts.msg,
                            severity:sev_up,
                            diagId:opts.diagId,
                            src:opts.src    }));
                    }
                    winston.loggers.get(opts.diagId)[sev_low](buildMsg({msg:opts.msg,
                        severity:sev_up,
                        diagId:opts.diagId,
                        uuid:opts.uuid,
                        src:opts.src    }));
                }

            },

            buildMsg = function(opts){
                var result = "",
                    keys = ["severity","src","diagId","uuid","msg"],
                    timestamp = moment().toISOString();

                keys.map(function(key){
                    opts[key] = opts[key] || "-";
                });

                result =    timestamp
                            + delim + opts.severity
                            + delim + opts.src
                            + delim + opts.diagId
                            + delim + opts.uuid
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