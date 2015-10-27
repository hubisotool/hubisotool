/**
 * Created by Bishaka on 26/10/2015.
 */

var
    ml_edit = angular.module('docs_n_records.master_list.edit',[])

    .controller('rootDnrMlEditCtrl',['$scope','$stateParams',function($scope,$stateParams){
        $scope.cat = $stateParams.cat;
        $scope.docId = $stateParams.docId;

        $scope.setupScrollbar = function(newH){
            $(".note-editable").niceScroll({cursorwidth:7});
        };

        $scope.setupEditor = function(newH){
            var editorH = newH - parseInt($('[id="root.docs_n_records.master_list.edit.box.title"]').css("height"))-72;
            console.log("Title Height : " + newH)
            console.log("Editor Height : " + editorH)
            $('[id="root.docs_n_records.master_list.edit.editor"]').destroy();
            $('[id="root.docs_n_records.master_list.edit.editor"]').summernote({
                height: editorH,
                minHeight: editorH,
                maxHeight: editorH,
                focus: true
            });
            $scope.setupScrollbar(newH);
        };

        $scope.resizeDnrMlEdit = function(){
            var winH = $(window).height();
            var newH = winH-($("[ui-view='root.nav_bar']").height()+$("[ui-view='root.docs_n_records.nav_bar']").height())-20;
            $scope.style = {
                "height":newH+"px"
            };

            $scope.setupEditor(newH);
        };
    }])

    .directive('rootDnrMlEditWinRsz',[function(){
        return{
            restrict:'A',
            link:function(scope,elem){
                scope.resizeDnrMlEdit();
                $(window).on('resize',function(){
                    scope.resizeDnrMlEdit();
                    scope.$apply();
                })
            }
        }
    }])

    .directive('mlEditor',[function(){
        return{
            restrict:'A',
            link:function(scope,elem){

            }
        }
    }])

;