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
            var _gut = {};
            _gut.scheduleReminders = function(event){
                return new Promise(function(resolve,reject){
                    log.debug({src:logSrc,diagId:"reminders::scheduleReminders",msg:"Fetching review tied to event"});
                    reviews.get(event.evt.rv).then(function(review){
                        log.trace("Working with Review : " + review.name);
                        
                    })
                });
            };
            return _gut;
    }])
;