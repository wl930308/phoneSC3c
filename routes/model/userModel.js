/**
 * Created by wl on 2017/7/1.
 */
var mysql = require("../database/dbConnect");
var multiparty=require('multiparty');
var path=require("path");
var fs=require("fs");
var userModel=function () {
    //用户注册
    this.userZhuCe=function (user,callback) {
        var client=mysql.createServer();
        mysql.userZhuCe(client,user,function (result) {
            callback(result);
        })
    };
    //验证要注册的用户名是否重复
    this.yanZhengUserName=function (userName,callback) {
        var client=mysql.createServer();
        mysql.yanZhengUserName(client,userName,function (result) {
            callback(result);
        })
    };
    //登录并验证数据库里有没有要登录的帐号和密码
    this.dengLu=function (userName,password,callback) {
        var client=mysql.createServer();
        mysql.yanZhengUserNameAndPassword(client,userName,password,function (result) {
            callback(result);
        })
    };
    //查询用户
    this.selectUsers=function (callback) {
        var client=mysql.createServer();
        mysql.selectUsers(client,function (result) {
            callback(result);
        })
    };
    //添加用户
    this.userInsert=function (req,res,callback) {
        //编辑图片上传路径
        var uplujing=path.join(__dirname,"../../public/files/");
        //设置图片上传路径  实例化multiparty
        var form=new multiparty.Form({uploadDir:uplujing});
        //开始上传
        form.parse(req,function (err,fields,files) {
            console.log(JSON.stringify(files,null,2));
            if (err){
                console.log('parse error:'+err);
            }else{
                var inputFile=files.inputFile[0];
                var oldpath=inputFile.path;
                var newpath=uplujing+inputFile.originalFilename;
                console.log("这是要修改的旧路径"+oldpath);
                console.log("这是修改之后的新路径"+newpath);
                fs.rename(oldpath,newpath,function (err) {
                    if (err){
                        console.log('rename error:'+err);
                    }else{
                        console.log('rename ok')
                    }
                });
                //调用dbConnect.js中的方法
                var client=mysql.createServer();
                var cclj="/files/"+inputFile.originalFilename;
                mysql.userInsert(client,fields,cclj,function (result) {
                    callback(result)
                })
            }
        })
    };
    //通过ID查询用户
    this.userEditPage=function (userId,callback) {
        var client=mysql.createServer();
        mysql.userEditPage(client,userId,function (result) {
            callback(result);
        })
    };
    //修改用户
    this.userEdit=function (req,res,callback) {
        //编辑图片上传路径
        var uplujing=path.join(__dirname,"../../public/files/");
        //设置图片上传路径  实例化multiparty
        var form=new multiparty.Form({uploadDir:uplujing});
        //开始上传
        form.parse(req,function (err,fields,files) {
            console.log(JSON.stringify(files,null,2));
            if (err){
                console.log('parse error:'+err);
            }else{
                var inputFile=files.inputFile[0];
                var cclj="";
                if(inputFile.originalFilename==""){
                    cclj=fields.photoBeiYong[0];
                }else{
                    var oldpath=inputFile.path;
                    var newpath=uplujing+inputFile.originalFilename;
                    console.log("这是要修改的旧路径"+oldpath);
                    console.log("这是修改之后的新路径"+newpath);
                    fs.rename(oldpath,newpath,function (err) {
                        if (err){
                            console.log('rename error:'+err);
                        }else{
                            console.log('rename ok')
                        }
                    });
                    cclj="/files/"+inputFile.originalFilename;
                }
                //调用dbConnect.js中的方法
                var client=mysql.createServer();
                mysql.userEdit(client,fields,cclj,function (result) {
                    callback(result);
                })
            }
        })
    };
    //删除用户(单删)
    this.deleteUser=function (userId,callback) {
        var client=mysql.createServer();
        mysql.deleteUser(client,userId,function (result) {
            callback(result)
        })
    };
    //删除用户(多删)
    this.deleteUserByUserIdS=function (userIdS,callback) {
        var client=mysql.createServer();
        mysql.deleteUserByUserIdS(client,userIdS,function (result) {
            callback(result)
        })
    };
    //查询广告
    this.selectGuangGaos=function (callback) {
        var client=mysql.createServer();
        mysql.selectGuangGaos(client,function (result) {
            callback(result)
        })
    };
    //添加广告
    this.guangGaoInsert=function (req,res,callback) {
        //编辑图片上传路径
        var FileDir=path.join(__dirname,"../../public/files");
        //实例化multiparty
        var form=new multiparty.Form({uploadDir:FileDir});
        form.parse(req,function (error,fields,files) {
            var oldPath=files.inputFile[0].path;
            var newPath=path.join(__dirname,"../../public/files/",files.inputFile[0].originalFilename);
            fs.rename(oldPath,newPath,function (error) {
                if (error){
                    console.log(error)
                }else{
                    //将数据传入数据库
                    var client=mysql.createServer();
                    var cclj="/files/"+files.inputFile[0].originalFilename;
                    mysql.guangGaoInsert(client,fields,cclj,function (result) {
                        callback(result)
                    })
                }
            })
        })
    };
    //验证要添加的广告名是否重复
    this.yanZhengGuangGaoName=function (ggName,callback) {
        var client=mysql.createServer();
        mysql.yanZhengGuangGaoName(client,ggName,function (result) {
            callback(result)
        })
    };
    //通过ID查询数据库中有没有这个广告，如果有就跳到修改页面
    this.guangGaoEditPage=function (ggId,callback) {
        var client=mysql.createServer();
        mysql.guangGaoEditPage(client,ggId,function (result) {
            callback(result)
        })
    };
    //广告修改
    this.guangGaoEdit=function (req,callback) {
        //编辑图片上传路径
        var FileDir=path.join(__dirname,"../../public/files");
        //实例化multiparty
        var form=new multiparty.Form({uploadDir:FileDir});
        form.parse(req,function (error,fields,files) {
            console.log(fields);
            if (error){
                console.log(error)
            }else{
                var cclj="";
                if (files.inputFile[0].originalFilename==""){
                    cclj=fields.photoBeiYong[0];
                }else{
                    var oldPath=files.inputFile[0].path;
                    var newPath=path.join(__dirname,"../../public/files/",files.inputFile[0].originalFilename);
                    fs.rename(oldPath,newPath,function (error) {
                        if (error){
                            console.log(error)
                        }
                    });
                    cclj="/files/"+files.inputFile[0].originalFilename;
                }
                //将数据传入数据库
                var client=mysql.createServer();
                mysql.guangGaoEdit(client,fields,cclj,function (result) {
                    callback(result)
                })
            }
        })
    };
    //广告删除(单删)
    this.deleteGuangGaoByGuangGaoId=function(guangGaoId,callback){
        var client=mysql.createServer();
        mysql.deleteGuangGaoByGuangGaoId(client,guangGaoId,function (result) {
            callback(result)
        })
    };
    //广告删除(多删)
    this.deleteGuangGaoByGuangGaoIdS=function (guangGaoIdS,callback) {
        var client=mysql.createServer();
        mysql.deleteGuangGaoByGuangGaoIdS(client,guangGaoIdS,function (result) {
            callback(result)
        })
    }
};
module.exports=new userModel();