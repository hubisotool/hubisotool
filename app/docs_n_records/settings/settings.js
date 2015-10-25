/**
 * Created by Bishaka on 23/10/2015.
 */

var
    settings = angular.module('docs_n_records.settings',[])

    .controller('rootDnrSettingsCtrl',['$scope',function($scope){
            $scope.scrollbarSetup = false;

            $scope.setupScrollbar = function(newH){
                $("[data-hubiso-module='root.docs_n_records.settings']").css('height',newH+"px");
                $("[data-hubiso-module='root.docs_n_records.settings']").niceScroll({cursorwidth:7});
            };

            $scope.resizeDnrSettings = function(){
                var winH = $(window).height();
                var newH = winH-($("[ui-view='root.nav_bar']").height()+$("[ui-view='root.docs_n_records.nav_bar']").height())-20;
                $scope.style = {
                    "height":newH+"px"
                };

                if(!$scope.scrollbarSetup){
                    $scope.scrollbarSetup=true;
                    $scope.setupScrollbar(newH);
                }

                console.log("Resizing, H : " + newH);
            };



    }])

    .directive('rootDnrSettingsWinRsz',['$window',function($window){
        return{
            restrict:'A',
            link:function(scope,elem){
                scope.resizeDnrSettings();
                $(window).on('resize',function(){
                    console.log('window resized!');
                    scope.resizeDnrSettings();
                    scope.$apply();
                })
            }
        }
    }])

;