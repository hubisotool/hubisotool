/**
 * Created by Bishaka on 15/11/2015.
 */
var
    mgt_review = angular.module('ctns_imprvmt.mgt_review',['ctns_imprvmt.mgt_review.reviews','ctns_imprvmt.mgt_review.checklists','ctns_imprvmt.mgt_review.schedule','ctns_imprvmt.mgt_review.occurences','ctns_imprvmt.mgt_review.qims'])
    .config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
        $stateProvider
            .state('ctns_imprvmt.mgt_review',{
                url:'/mgt_review',
                views:{
                    'root.ctns_imprvmt.workbench@ctns_imprvmt':{
                        templateUrl:'ctns_imprvmt/mgt_review/mgt_review.html'
                    },
                    'root.ctns_imprvmt.mgt_review.sidebar@ctns_imprvmt.mgt_review':{
                        templateUrl:'ctns_imprvmt/mgt_review/sidebar/sidebar.html'
                    }
                }
            })

    }])
;