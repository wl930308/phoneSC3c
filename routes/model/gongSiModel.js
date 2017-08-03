/**
 * Created by wl on 2017/7/19.
 */
var mysql=require("../database/dbConnect");
var multiparty=require('multiparty');
var path=require("path");
var fs=require("fs");
var gongSiModel=function () {
    this.selectGongSis=function (callback) {
        var client=mysql.createServer();
        mysql.selectGongSis(client,function (result) {
            callback(result)
        })
    };
    this.insertGongSi=function (req,callback) {
        var fileDir=path.join(__dirname,"../../public/files");
        console.log(fileDir);
        var form=new multiparty.Form({uploadDir:fileDir});
        form.parse(req,function(err,fileds,files){
            console.log(files);
            var oldPath=files.inputFile[0].path;
            var newPath=path.join(__dirname,"../../public/files",files.inputFile[0].originalFilename);
            fs.rename(oldPath,newPath,function(err){
                if(err){
                    console.log(err);
                }else{
                    var client=mysql.createServer();
                    var cclj="/files/"+files.inputFile[0].originalFilename;
                    mysql.insertGongSi_photo(client,fileds,cclj,function(result){
                        callback(result);
                    })
                }
            })
        })
    };
    this.gongSiEditPage=function (user,callback) {
        var client=mysql.createServer();
        mysql.selectGongSiByGongSiId(client,user,function(result){
            callback(result)
        })
    };
    this.gongSiedit=function (req,callback) {
        var fileDir=path.join(__dirname,"../../public/files");
        console.log(fileDir);
        var form=new multiparty.Form({uploadDir:fileDir});
        form.parse(req,function(err,fileds,files){
            console.log(fileds);
            var cclj="";
            if(files.inputFile[0].originalFilename==""){
                cclj=fileds.photoBeiYong[0]
            }else{
                var oldPath=files.inputFile[0].path;
                var newPath=path.join(__dirname,"../../public/files",files.inputFile[0].originalFilename);
                fs.rename(oldPath,newPath,function(err){
                    if(err){
                        console.log(err);
                    }
                });
                cclj="/files/"+files.inputFile[0].originalFilename;
            }
            var client=mysql.createServer();
            mysql.gongSiedit(client,fileds,cclj,function(result){
                callback(result);
            })
        })
    };
    this.deleteGsByGsId=function (userId,callback) {
        var client=mysql.createServer();
        mysql.deleteGsByGsId(client,userId,function (result) {
            callback(result)
        })
    };
    //多删async写法
    this.deleteGongSiByGongSiIdS=function (gongSiIdS,callback) {
        var client=mysql.createServer();
        mysql.deleteGongSiByGongSiIdS(client,gongSiIdS,function (result) {
            callback(result)
        })
    }
};
module.exports=new gongSiModel();