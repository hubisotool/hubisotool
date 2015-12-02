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
    .directive('calendar',['$state','_reviews_','_events_','logger',function($state,_reviews_,_events_,log){
        return{
            restrict:"A",
            link:function(scope,elem){
                //Get reviews and events and make the eventList
                async.parallel([
                    function(done){
                        log.debug(">>> Loading reviewMap");
                        var reviewMap = {};
                        _reviews_.load().then(function(reviews){
                            reviews.forEach(function(review,idx,arr){
                                reviewMap[review._id]=review;
                            })
                            log.debug("<<< ReviewMap loaded")
                            done(null,reviewMap);
                        })
                    },
                    function(done){
                        log.debug(">>> Loading events")
                        var events = [];
                        _events_.load().then(function(_events){
                            events = _events;
                            log.debug("<<< Events loaded")
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
                                $state.transitionTo("ctns_imprvmt.mgt_review.schedule.event", {dt:date.format()});
                            }
                        });

                    })
                })


            }
        }
    }])
;