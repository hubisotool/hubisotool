/**
 * Created by Bishaka on 23/10/2015.
 */

var mainNav = angular.module('mainNav',[])

.controller('mainNavCtrl',['$scope','logger',function($scope,log){
        log.debug("mainNavCtrl loaded");
}])
;

