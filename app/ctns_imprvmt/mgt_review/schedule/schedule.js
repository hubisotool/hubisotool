/**
 * Created by Bishaka on 19/11/2015.
 */
var
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
    .directive('calendar',['$state',function($state){
        return{
            restrict:"A",
            link:function(scope,elem){
                $('[id="root.ctns_imprvmt.mgt_review.schedule.calendar"]').fullCalendar({
                    dayClick: function(date, jsEvent, view) {
                        $state.transitionTo("ctns_imprvmt.mgt_review.schedule.event", {dt:date.format()});
                    }
                });
            }
        }
    }])
;