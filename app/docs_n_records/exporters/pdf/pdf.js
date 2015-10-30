/**
 * Created by Bishaka on 30/10/2015.
 */


var
    Promise = require('bluebird'),
    pdf = angular.module('docs_n_records.exporters.pdf',[])

    .factory('docs_n_records.exporters.pdf.factory',[function(){
            var _gut = {};

            _gut["htmlToPdfMakeLayout"] = function(html){
                return new Promise(function(resolve,reject){
                    var data = $(html)
                    var layout = [];
                    $.each(data,function(idx){
                        //console.log("Idx["+idx+"] : " + Object.keys(data[idx]));
                        console.log("Idx["+idx+"] Type: " + data[idx]["nodeName"]);
                        if($(data[idx]).find("img").length > 0){
                            //Handle Images
                            var img = $(data[idx]).find("img").attr("src");
                            console.log("Found image : " + img);
                            layout.push({image:img,width:515});
                        }else if(data[idx]["nodeName"]==="TABLE"){
                            console.log("found table");
                        }
                        else{
                            var txt = $(data[idx]).text()
                            if($.isEmptyObject(txt)){
                                console.log("found empty string")
                                layout[layout.length-1]["margin"] = [0, 20];
                            }else{
                                var align = $(data[idx]).prop('style').textAlign;
                                console.log("Text alignment : " + $(data[idx]).prop('style').textAlign)
                                layout.push({text:txt, alignment:align});
                            }
                        }
                    })
                    var docDefinition = { pageSize:'A4', content: layout };
                    console.log(JSON.stringify(docDefinition));
                    pdfMake.createPdf(docDefinition).download('optionalName.pdf');
                    resolve(layout);
                })
            };

            return _gut;
    }])
;