/**
 * Created by Bishaka on 23/10/2015.
 */

var
    settings = angular.module('docs_n_records.settings',['backend'])

    .controller('rootDnrSettingsCtrl',['$scope','_backend_',function($scope,_backend_){
            $scope.scrollbarSetup = false;
            $scope.logo_preview = false;

            _backend_.dnr.settings.docCtrl.load()
            .then(function(settings){
                    if(settings["logo"]){
                        $("[id='root.docs_n_records.settings.form.preview.logo']").attr("src",settings["logo"]);
                        $scope.logo_preview = true;
                    }

                    $scope["name"] = settings["name"];
                    $scope["address"] = settings["address"];
                    $scope["reviewedby_name"] =  settings["reviewedby"]["name"];
                    $scope["reviewedby_position"] = settings["reviewedby"]["position"];
                    $scope["approvedby_name"] =  settings["approvedby"]["name"];
                    $scope["approvedby_position"] = settings["approvedby"]["position"];
                    $scope["authorisedby_name"] =  settings["authorisedby"]["name"];
                    $scope["authorisedby_position"] = settings["authorisedby"]["position"];
            });

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
                settings["logo"] = $("[id='root.docs_n_records.settings.form.preview.logo']").attr("src");
                settings["reviewedby"] = {};
                settings["reviewedby"]["name"] = $scope["reviewedby_name"];
                settings["reviewedby"]["position"] = $scope["reviewedby_position"];
                settings["approvedby"] = {};
                settings["approvedby"]["name"] = $scope["approvedby_name"];
                settings["approvedby"]["position"] = $scope["approvedby_position"];
                settings["authorisedby"] = {};
                settings["authorisedby"]["name"] = $scope["authorisedby_name"];
                settings["authorisedby"]["position"] = $scope["authorisedby_position"];
                _backend_.dnr.settings.docCtrl.save(settings);
                _backend_.alert({src:"dnr.settings", title:"Document Control Settings", msg : "You're new document control settings have been saved!"})
            }

    }])

    .directive('rootDnrSettingsWinRsz',[function(){
        return{
            restrict:'A',
            link:function(scope,elem){
                scope.resizeDnrSettings();
                $(window).on('resize',function(){
                    scope.resizeDnrSettings();
                    scope.$apply();
                })
            }
        }
    }])

    .directive('logo',[function(){
        return{
            restrict:'A',
            link:function(scope,elem){

                var reader  = new FileReader();

                reader.onloadend = function () {
                    $("[id='root.docs_n_records.settings.form.preview.logo']").attr("src",reader.result);
                    scope.logo_preview = true;
                    scope.$apply();
                };

                $(document).on("click","[id='root.docs_n_records.settings.form.prompt.logo']",function(){
                    $("[id='root.docs_n_records.settings.form.input.logo']").click();
                });

                $(document).on("click","[id='root.docs_n_records.settings.form.preview.logo']",function(){
                    $("[id='root.docs_n_records.settings.form.input.logo']").click();
                });

                $(document).on('change',"[id='root.docs_n_records.settings.form.input.logo']",function(){
                    var file = $("[id='root.docs_n_records.settings.form.input.logo']")[0].files[0];
                    if(file){
                        reader.readAsDataURL(file);
                    }
                })
            }
        }
    }])

;