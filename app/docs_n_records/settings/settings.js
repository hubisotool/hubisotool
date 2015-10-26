/**
 * Created by Bishaka on 23/10/2015.
 */

var
    settings = angular.module('docs_n_records.settings',['backend'])

    .controller('rootDnrSettingsCtrl',['$scope','_backend_',function($scope,_backend_){
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

            $scope.save = function(){
                var settings = {};
                settings["name"] = $scope["name"];
                settings["address"] = $scope["address"];
                settings["reviewedby"] = {};
                settings["reviewedby"]["name"] = $scope["reviewedby_name"];
                settings["reviewedby"]["position"] = $scope["reviewedby_position"];
                settings["approvedby"] = {};
                settings["approvedby"]["name"] = $scope["approvedby_name"];
                settings["approvedby"]["position"] = $scope["approvedby_position"];
                settings["authorizedby"] = {};
                settings["authorizedby"]["name"] = $scope["authorizedby_name"];
                settings["authorizedby"]["position"] = $scope["authorizedby_position"];
                _backend_.dnr.settings.docCtrl.save(settings);
                _backend_.alert({src:"dnr.settings", title:"Document Control Settings", msg : "You're new document control settings have been saved!"})
            }

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