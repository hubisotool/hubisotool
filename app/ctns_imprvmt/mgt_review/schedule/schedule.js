/**
 * Created by Bishaka on 19/11/2015.
 */
var
    async = require("async"),
    schedule = angular.module('ctns_imprvmt.mgt_review.schedule',['ctns_imprvmt.mgt_review.schedule.event'])
    .config(['$stateProvider',function($stateProvider){
        $stateProvider
            .state('ctns_imprvmt.mgt_review.schedule',{
                url:'/schedule',
                views:{
                    'root.ctns_imprvmt.mgt_review.workbench@ctns_imprvmt.mgt_review':{
                        templateUrl:'ctns_imprvmt/mgt_review/schedule/schedule.html'
                    }
                }
            })

    }])
    .factory('scheduleLogSrc',[function(){
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
    .directive('calendar',['$state','_reviews_','_events_','logger','scheduleLogSrc',function($state,_reviews_,_events_,log,logSrc){
        return{
            restrict:"A",
            link:function(scope,elem){
                //Get reviews and events and make the eventList
                async.parallel([
                    function(done){
                        log.debug({src:logSrc,msg:">>> Loading reviewMap"});
                        var reviewMap = {};
                        _reviews_.load().then(function(reviews){
                            reviews.forEach(function(review,idx,arr){
                                reviewMap[review._id]=review;
                            })
                            log.debug({src:logSrc,msg:"<<< ReviewMap loaded"});
                            done(null,reviewMap);
                        })
                    },
                    function(done){
                        log.debug({src:logSrc,msg:">>> Loading events"});
                        var events = [];
                        _events_.load().then(function(_events){
                            events = _events;
                            log.debug({src:logSrc,msg:"<<< Events loaded"});
                            done(null,events);
                        })
                    }
                ],function(err,results){

                    var reviewMap = results[0], events = results[1];
                    _events_.createEventList(reviewMap,events).then(function(_eventList){
                        log.trace("Event list recieved : " + JSON.stringify(_eventList));

                        $('[id="root.ctns_imprvmt.mgt_review.schedule.calendar"]').fullCalendar({
                            timezone:'local',
                            events:_eventList,
                            dayClick: function(date, jsEvent, view) {
                                log.debug({src:logSrc,diagId:"LINE-57",msg:"Calendar date< "+moment(date).format("dddd, MMMM Do YYYY")+" > clicked"});
                                log.debug({src:logSrc,diagId:"LINE-58",msg:"Transitioning to ctns_imprvmt.mgt_review.schedule.event"});
                                $state.transitionTo("ctns_imprvmt.mgt_review.schedule.event", {dt:date.format()});
                            }
                        });

                    })
                })


            }
        }
    }])
;

process.argv.forEach(function(val, index, array) {
    console.log(index + ': ' + val);
});