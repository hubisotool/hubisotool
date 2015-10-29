/**
 * Created by Bishaka on 23/10/2015.
 */
var

    master_list = angular.module('docs_n_records.master_list',['docs_n_records.master_list.edit','backend'])

    .controller('rootDnrMlCtrl',['$scope','_backend_','$state',function($scope,_backend_,$state){

        //Load docs
        var loadDocs = function(cat) {
            _backend_["dnr"]["ml"]["docs"].load(cat)
                .then(function (docs) {
                    $scope[cat] = docs;
                    $scope.$apply();
                });
        }

        loadDocs("Manuals");
        loadDocs("Managerial");
        loadDocs("Technical");

        $scope.viewDoc =function(doc){
            $state.transitionTo("docs_n_records.master_list_edit", {cat:doc.cat,docId:doc["_id"]});
        }

        $scope.newDoc = function(category){
            var doc = {};
            doc["type"] = "dnr.ml.doc";
            doc["name"] = "Untitled Document";
            doc["content"] = "Test Content" ;
            doc["cat"] = category;
            console.log(JSON.stringify(doc));
            _backend_.saveToDb("dnr",doc)
            .then(function(newDoc){
                  console.log(JSON.stringify(newDoc));
                  $state.transitionTo("docs_n_records.master_list_edit", {cat:category,docId:newDoc["_id"],doc:JSON.stringify(newDoc)});
            })
        }

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