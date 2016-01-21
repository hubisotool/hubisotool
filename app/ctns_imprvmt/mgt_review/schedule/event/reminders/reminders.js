/**
 * Created by Bishaka on 07/12/2015.
 */

var
    Promise = require('bluebird'),
    reminders = angular.module('ctns_imprvmt.mgt_review.schedule.event.reminders',[])
    .config([function(){
        log.debug(">>> Booting Reminders");
        log.debug("<<< Reminders Booted");
    }])
    .factory('reminders',['_backend_','_reviews_','logger',function(b,reviews,log){
            var _gut = {};
            _gut.scheduleReminders = function(event){
                return new Promise(function(resolve,reject){
                    log.debug(">>> Scheduling reminders");
                    reviews.get(event.evt.rv).then(function(review){
                        log.trace("Working with Review : " + review.name);
                        
                    })
                });
            };
            return _gut;
    }])
;