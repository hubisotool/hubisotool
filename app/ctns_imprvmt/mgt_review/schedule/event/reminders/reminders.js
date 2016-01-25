/**
 * Created by Bishaka on 07/12/2015.
 */

var
    Promise = require('bluebird'),
    logSrc = "",
    reminders = angular.module('ctns_imprvmt.mgt_review.schedule.event.reminders',[])
    .factory('remindersLogSrc',[function(){
        var logSrc="";
        try{
            throw new Error();
        }catch(err){
            var regex = /\(.*\)/,
                match = regex.exec(err.stack),
                filename = match[0].replace("(","").replace(")","");
            logSrc = filename;
        }
        return logSrc;
    }])
    .factory('reminders',['_backend_','_reviews_','logger','remindersLogSrc',function(b,reviews,log,logSrc){
            var _gut = {},
                reminderDaemon = function(){
                    console.log("We got a winner from reminder deamon");
                },
                setupDaemon = function(){
                    log.debug({src:logSrc,diagId:"reminders::scheduleReminders",msg:"Setting up Reminder Daemon"});
                    b.addHeartBeat(reminderDaemon);
                };

            _gut.scheduleReminders = function(opts){
                var event = opts.event,
                    start_t = event.evt.from,
                    result = [],
                    reminders = opts.reminders;
                return new Promise(function(resolve,reject){
                    log.debug({src:logSrc,diagId:"reminders::scheduleReminders",msg:"Fetching review tied to event"});
                    reviews.get(event.evt.rv).then(function(review){
                        log.debug({src:logSrc,diagId:"reminders::scheduleReminders",msg:"Review fetched "+JSON.stringify(review)+""});
                        log.debug({src:logSrc,diagId:"reminders::scheduleReminders",msg:"Compiling reminders"});
                        result = reminders.map(function(rem){
                            var tt = moment(start_t).subtract(rem.time_v,rem.time_t).toISOString();
                            return {name:review.name,at:tt,status:rem.status,type:rem.type};
                        });
                        log.debug({src:logSrc,diagId:"reminders::scheduleReminders",msg:"Returning " + JSON.stringify(result)});
                        resolve(result);
                    })
                });
            };
            return _gut;
    }])
    .directive('reminderDaemon',['_backend_','_reviews_','logger','remindersLogSrc',function(b,reviews,log,logSrc){
        return{
            restrict:"A",
            link:function(scope,elem){
                var reminderDaemonHook = function(){
                        var
                            dbname = "cim",
                            func = "find",
                            args = [{type:"cim.mgt_review.schedule.event"}];
                        b.execInDb(dbname,func,args).then(function(events){
                            events.forEach(function(event){
                                log.debug({src:logSrc,diagId:"reminderDaemon::link::reminderDaemonHook",msg:"Checking Event " + JSON.stringify(event)});
                                event.reminders.forEach(function(reminder){
                                    log.debug({src:logSrc,uuid:reminder.name,diagId:"reminderDaemon::link::reminderDaemonHook",msg:"Checking Reminder Time" + JSON.stringify(reminder)});
                                    if(moment().isAfter(reminder.at)){
                                        log.debug({src:logSrc,uuid:reminder.name,diagId:"reminderDaemon::link::reminderDaemonHook",msg:"Current time is ahead of reminder time"});
                                        log.debug({src:logSrc,uuid:reminder.name,diagId:"reminderDaemon::link::reminderDaemonHook",msg:"Checking Reminder Status"});
                                        if(reminder.status==="active"){
                                            log.debug({src:logSrc,uuid:reminder.name,diagId:"reminderDaemon::link::reminderDaemonHook",msg:"Reminder status is active"});
                                            log.debug({src:logSrc,uuid:reminder.name,diagId:"reminderDaemon::link::reminderDaemonHook",msg:"Checking Reminder Type"});
                                            switch(reminder.type){
                                                case "popup":
                                                log.debug({src:logSrc,uuid:reminder.name,diagId:"reminderDaemon::link::reminderDaemonHook",msg:"Reminder type is popup"});
                                                    var tt = moment(event.evt.from),
                                                                fromNow = tt.fromNow(),
                                                                name = reminder.name,
                                                                at = tt.format("ddd MMM Do YYYY, h:mm:ss a");

                                                            b.execInDb("cim","update",[{_id:event._id},{$pull:{"reminders":reminder}}]).then(function(){
                                                                reminder.status="raised";
                                                                b.execInDb("cim","update",[{_id:event._id},{$push:{"reminders":reminder}}]).then(function(){
                                                                    b.alert({   src :"cim.mgt_review.reviews",
                                                                        title : "Reminder : " + name,
                                                                        text :"Review : "+name+" @ "+at+" ( "+fromNow+" )"});
                                                                });
                                                            });
                                                break;
                                            }
                                        }else{
                                            log.debug({src:logSrc,uuid:reminder.name,diagId:"reminderDaemon::link::reminderDaemonHook",msg:"Reminder status is not active"});
                                        }
                                    }else{
                                        log.debug({src:logSrc,uuid:reminder.name,diagId:"reminderDaemon::link::reminderDaemonHook",msg:"Current time is not ahead of reminder time"});
                                    }
                                })
                            })
                        });
                    },
                    setupDaemon = function(){
                        log.debug({src:logSrc,diagId:"reminders::scheduleReminders",msg:"Setting up Reminder Daemon"});
                        b.addHeartBeat(reminderDaemonHook);
                    };

                setupDaemon();

            }
        }
    }])
;