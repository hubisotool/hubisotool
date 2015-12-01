/**
 * Created by Bishaka on 20/11/2015.
 */
var
    event = angular.module('ctns_imprvmt.mgt_review.schedule.event',[])
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
    .controller('ctns_imprvmt.mgt_review.schedule.eventCtrl',['$scope','_reviews_','_backend_','$stateParams','$state',function($scope,_reviews_,_backend_,$stateParams,$state){

        $scope.d4lts = {
            time:moment().format('LT').replace(" ","").toLowerCase(),
            min_date:$stateParams.dt
        }

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

        $scope.addEvent = function(){
            var obj = {type:"cim.mgt_review.schedule.event",evt:jQuery.extend(true, {}, $scope.evt)};
            obj.evt.from.date = obj.evt.from.date.toISOString();
            obj.evt.to.date = obj.evt.to.date.toISOString();
            _backend_.saveToDb("cim",obj).then(function(){
                _backend_.alert({ src :"cim.mgt_review.schedule.event",title : "Event added", text :"Review has been scheduled"});
                $state.transitionTo("ctns_imprvmt.mgt_review.schedule");
            });
        };

        $scope.discard = function(){
            $state.transitionTo("ctns_imprvmt.mgt_review.schedule");
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
    .factory('_events_',[function(){
            var _gut = {};

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