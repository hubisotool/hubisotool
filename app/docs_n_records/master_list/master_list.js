/**
 * Created by Bishaka on 23/10/2015.
 */
var

    master_list = angular.module('docs_n_records.master_list',['docs_n_records.master_list.edit'])

    .controller('rootDnrMlCtrl',['$scope',function($scope){
        $scope.setupScrollbar = function(newH){
            $("[data-hubiso-module='root.docs_n_records.master_list']").css('height',newH+"px");
            $("[data-hubiso-module='root.docs_n_records.master_list']").niceScroll({cursorwidth:7});
        };

        $scope.resizeDnrMl = function(){
            var winH = $(window).height();
            var newH = winH-($("[ui-view='root.nav_bar']").height()+$("[ui-view='root.docs_n_records.nav_bar']").height())-20;
            $scope.style = {
                "height":newH+"px"
            };

            if(!$scope.scrollbarSetup){
                $scope.scrollbarSetup=true;
                $scope.setupScrollbar(newH);
            }
        };

    }])

    .directive('rootDnrMlWinRsz',[function(){
        return{
            restrict:'A',
            link:function(scope,elem){
                scope.resizeDnrMl();
                $(window).on('resize',function(){
                    scope.resizeDnrMl();
                    scope.$apply();
                })
            }
        }
    }])

    ;