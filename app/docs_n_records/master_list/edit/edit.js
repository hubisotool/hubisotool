/**
 * Created by Bishaka on 26/10/2015.
 */

var
    ml_edit = angular.module('docs_n_records.master_list.edit',['backend'])

    .controller('rootDnrMlEditCtrl',['$scope','$stateParams','_backend_','hotkeys','docs_n_records.exporters.pdf.factory',function($scope,$stateParams,_backend_,hotkeys,pdfExporter){
        $scope.cat = $stateParams.cat;
        $scope.docId = $stateParams.docId;

         //shortcuts
        hotkeys.bindTo($scope)
        .add({
            combo: 'ctrl+s',
            allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
            description: 'Save doc content as pdf',
            callback: function() {
                //Save pdf of content
                var content = $('[id="root.docs_n_records.master_list.edit.editor"]').code();
                pdfExporter.htmlToPdfMakeLayout(content);
                //console.log("Content : " + $(".note-editable.panel-body")[0]);
                //var doc = new jsPDF("l", "pt", "letter");
                //doc.fromHTML($(".note-editable.panel-body")[0], 15, 15, {
                //    'width': 250,
                //    'margin': 1,
                //    'pagesplit': true //This will work for multiple pages
                //},function(info){
                //    console.log(info);
                //});
                //doc.save($scope.doc.name+".pdf")
                //console.log("Save doc as pdf called");
            }
        })

        //$scope.doc = JSON.parse($stateParams.doc);
        var loadDoc = function(id) {
            _backend_["dnr"]["ml"]["doc"].load(id)
                .then(function (doc) {
                    $scope.doc = doc;
                    $('[id="root.docs_n_records.master_list.edit.editor"]').code(doc.content);
                    $scope.$apply();
                });
        };

        loadDoc($scope.docId);

        console.log("New doc recieved: " + $stateParams.doc);

        $scope.updateDocName = function(id,name){
            //Execute db update
            _backend_.execInDb("dnr","update",[{"_id":id},{$set:{name:name}},{multi:true}])
            .then(function(numReplaced){
              console.log("Number of Docs Updated : " + numReplaced)
            })
        };

        $scope.updateDocContent = function(id,content){
            //Execute db update
            _backend_.execInDb("dnr","update",[{"_id":id},{$set:{content:content}},{multi:true}])
                .then(function(numReplaced){
                    console.log("Number of Docs Updated : " + numReplaced)
                })
        };


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
                focus: true,
                onChange: function(contents, $editable) {
                    $scope.updateDocContent($scope.docId,contents);
                },
                toolbar:[
                    [
                        'style',['style']
                    ],
                    [
                        'font_style',['bold','italic','underline','strikethrough','clear']
                    ],
                    [
                        'font_size',['fontsize']
                    ],
                    [
                        'font_color',['color']
                    ],
                    [
                        'layout_p',['ul','ol','paragraph']
                    ],
                    [
                        'height_p',['height']
                    ],
                    [
                        'table',['table']
                    ],
                    [
                        'insert',['link','picture','hr']
                    ],
                    [
                        'misc',['codeview','undo','redo']
                    ],
                    [
                        'help',['help']
                    ]
                ]
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

    .directive('mlDocName',[function(){
        return{
            restrict:'A',
            link:function(scope,elem){
                $(document).on("change","[class~='root.docs_n_records.master_list.edit.doc.name']",function(){
                    scope.updateDocName(scope.doc["_id"],scope.doc.name)
                })
            }
        }
    }])

;