/**
 * Created by Bishaka on 13/11/2015.
 */
var
    ctns_imprvmt = angular.module('ctns_imprvmt',['ctns_imprvmt.mgt_review','ctns_imprvmt.calendar'])
    .config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){

            $stateProvider
            .state('ctns_imprvmt',{
                url:'/ctns_imprvmt',
                views:{
                    'root.nav_bar':{
                        templateUrl:'nav_bar/nav_bar.html'
                    },
                    'root.workbench':{
                        templateUrl:'ctns_imprvmt/ctns_imprvmt.html'
                    },
                    'root.ctns_imprvmt.nav_bar@ctns_imprvmt':{
                        templateUrl:'ctns_imprvmt/nav_bar/nav_bar.html'
                    }
                }
            })

    }])
;