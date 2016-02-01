/**
 * Created by Bishaka on 01/02/2016.
 */


var
    calendar =  angular.module('ctns_imprvmt.calendar',[])
    .config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
            $stateProvider
                .state('ctns_imprvmt.calendar',{
                    url:'/calendar',
                    views:{
                        'root.ctns_imprvmt.workbench@ctns_imprvmt':{
                            templateUrl:'ctns_imprvmt/calendar/calendar.html'
                        }
                    }
                })

        }])
;