/**
 * Created by Bishaka on 20/11/2015.
 */
var
    Promise = require('bluebird'),
    logSrc = document.currentScript.src,
    event = angular.module('ctns_imprvmt.mgt_review.schedule.event',['ctns_imprvmt.mgt_review.schedule.event.reminders'])
    .config(['$stateProvider',function($stateProvider){
            $stateProvider
            .state('ctns_imprvmt.mgt_review.schedule.event',{
                url:'/event?dt',
                views:{
                    'root.ctns_imprvmt.mgt_review.workbench@ctns_imprvmt.mgt_review':{
                        templateUrl:'ctns_imprvmt/mgt_review/schedule/event/event.html'
                    }
                }
            })

    }])
    .controller('ctns_imprvmt.mgt_review.schedule.eventCtrl',['$scope','_reviews_','_backend_','$stateParams','$state','_events_','reminders',function($scope,_reviews_,_backend_,$stateParams,$state,_events_,reminders){

        $scope.d4lts = {
            time:moment().format('LT').replace(" ","").toLowerCase(),
            min_date:$stateParams.dt || new Date(),
            reminder:{type:"popup",time_v:10,time_t:"m"}
        };

        $scope.evt = {
            rv:"",
            from:{
                date:new Date($scope.d4lts.min_date),
                time:$scope.d4lts.time
            },
            to:{
                date:new Date($scope.d4lts.min_date),
                time:$scope.d4lts.time
            }
        };

        $scope.reminders = [];

        $scope.addEvent = function(){
            var obj = {type:"cim.mgt_review.schedule.event",evt:jQuery.extend(true, {}, $scope.evt)};
            obj.evt.from =  _events_.getIsoTime(obj.evt.from.date,obj.evt.from.time);
            obj.evt.to = _events_.getIsoTime(obj.evt.to.date,obj.evt.to.time);
            obj.reminders = jQuery.extend(true, {}, $scope.reminders);
            reminders.scheduleReminders(obj);
            _backend_.saveToDb("cim",obj).then(function(){
                _backend_.alert({ src :"cim.mgt_review.schedule.event",title : "Event added", text :"Review has been scheduled"});
                $state.transitionTo("ctns_imprvmt.mgt_review.schedule");
            });
        };

        $scope.discard = function(){
            $state.transitionTo("ctns_imprvmt.mgt_review.schedule");
        }

        $scope.addReminder = function(){
            $scope.reminders.push(jQuery.extend(true, {}, $scope.d4lts.reminder));
        };

        $scope.removeReminder = function(idx){
            $scope.reminders.splice(idx,1);
        }

        var
            loadReviews = function(){
                _reviews_.load().then(function(reviews){
                    $scope.$apply(function(){
                        $scope.reviews = reviews;
                    })
                });
            }
        ;
        loadReviews();
    }])
    .factory('_events_',['_backend_','logger',function(_backend_,log){
            var _gut = {};

            _gut.load = function(){
                return new Promise(function(resolve, reject){
                    var
                        dbname = "cim",
                        func = "find",
                        args = [{type:"cim.mgt_review.schedule.event"}]
                    ;

                    _backend_.execInDb(dbname,func,args).then(function(events){
                        events = _backend_.sortByTimestamp({"array":events,sort:"des"});
                        resolve(events);
                    })
                });
            };

            _gut.createEventList = function(reviewMap,events){
                    return new Promise(function(resolve,reject){
                        log.debug(">>> Creating event list");
                        var result = [];
                        events.forEach(function(_event,idx,arr){
                            var event = _event.evt,
                                title = reviewMap[event.rv].name,
                                start = event.from,
                                end = event.to;
                            result.push({title:title,start:start,end:end});
                        });
                        log.debug("<<< Event list created");
                        resolve(result);
                    })
            };

            _gut.getIsoTime = function(date,time){
                var t =  moment(time, ["h:mm A"]);
                var d =  moment(date);
                d.hour(t.hour());
                d.minute(t.minute());
                d.second(t.second());
                return d.toISOString();
            };

            return _gut;
    }])
    .directive('timepicker',[function(){
        return{
            restrict:"A",
            link:function(scope,elem){
                $(elem).timepicker({ 'scrollDefault': 'now' });
            }
        }
    }])
;