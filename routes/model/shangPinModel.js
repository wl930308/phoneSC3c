/**
 * Created by wl on 2017/7/16.
 */
var mysql=require("../database/dbConnect");
var multiparty=require('multiparty');
var path=require("path");
var fs=require("fs");
var shangPinModel=function () {
    //查询商品
    this.selectShangPins=function (callback) {
        var client=mysql.createServer();
        mysql.selectShangPins(client,function (result) {
            callback(result)
        })
    };
    //商品添加
    this.shangPinInsert=function (req,res,callback) {
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
                    mysql.shangPinInsert(client,fields,cclj,function (result) {
                        callback(result)
                    })
                }
            })
        })
    };
    //验证要添加的商品名是否重复
    this.yanZhengShangPinName=function (spName,callback) {
        var client=mysql.createServer();
        mysql.yanZhengShangPinName(client,spName,function (result) {
            callback(result)
        })
    };
    //通过ID查询数据库中有没有这个商品，如果有就跳到修改页面
    this.shangPinEditPage=function (shangPinId,callback) {
        var client=mysql.createServer();
        mysql.shangPinEditPage(client,shangPinId,function (result) {
            callback(result)
        })
    };
    //修改商品
    this.editSp=function (req,res,callback) {
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
                mysql.editSp(client,fields,cclj,function (result) {
                    callback(result)
                })
            }
        })
    };
    //删除商品(单删)
    this.deleteSp=function (shangPinId,callback) {
        var client=mysql.createServer();
        mysql.deleteSp(client,shangPinId,function (result) {
            callback(result)
        })
    };
    //商品删除(多删)
    this.deleteShangPinByShangPinIdS=function (shangPinIdS,callback) {
        var client=mysql.createServer();
        mysql.deleteShangPinByShangPinIdS(client,shangPinIdS,function (result) {
            callback(result)
        })
    };
    //商品详情
    this.shangPinXiangQing=function (phoneId,callback) {
        var client=mysql.createServer();
        mysql.shangPinXiangQing(client,phoneId,function (result) {
            callback(result)
        })
    };
    //查询更多商品
    this.moreShangPinList=function (callback) {
        var client=mysql.createServer();
        mysql.moreShangPinList(client,function (result) {
            callback(result)
        })
    };
    //查询已购买商品列表
    this.selectYiGouMaiShangPinS=function (userId,callback) {
        var client=mysql.createServer();
        mysql.selectYiGouMaiShangPinS(client,userId,function (result) {
            callback(result)
        })
    };
    //订单支付完成后减库存
    this.jianKuCun=function (phoneId,gouMaiCount,callback) {
        var client=mysql.createServer();
        mysql.jianKuCun(client,phoneId,gouMaiCount,function (result) {
            callback(result)
        })
    };
};
module.exports=new shangPinModel();