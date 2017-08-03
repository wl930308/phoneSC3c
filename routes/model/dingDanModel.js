/**
 * Created by wl on 2017/7/17.
 */
var mysql=require("../database/dbConnect");
var dingDanModel=function () {
    //添加订单
    this.addDingDan=function (dingDanCanShu,userId,callback) {
        var client=mysql.createServer();
        mysql.addDingDan(client,dingDanCanShu,userId,function (result) {
            callback(result)
        })
    };
    //查询未支付订单
    this.selectWeiZhiFuDingDan=function (userId,callback) {
        var client=mysql.createServer();
        mysql.selectWeiZhiFuDingDan(client,userId,function (result) {
            callback(result)
        })
    };
    //删除订单(单删)
    this.deleteDingDan=function (dingDanId,callback) {
        var client=mysql.createServer();
        mysql.deleteDingDan(client,dingDanId,function (result) {
            callback(result)
        })
    };
    //删除订单(多删)
    this.deleteMany=function (dingDanIdS,callback) {
        var client=mysql.createServer();
        mysql.deleteMany(client,dingDanIdS,function (result) {
            callback(result)
        })
    };
    //多删async写法
    this.deleteManyByStr=function (dingDanIdS,callback) {
        var client=mysql.createServer();
        mysql.deleteManyByStr(client,dingDanIdS,function (result) {
            callback(result)
        })
    };
    //支付完成后修改订单状态
    this.editDingDanState=function (dingDanId,callback) {
        var client=mysql.createServer();
        mysql.editDingDanState(client,dingDanId,function (result) {
            callback(result)
        })
    };
    this.selectDingDanState=function (dingDanIdS,callback) {
        var client=mysql.createServer();
        mysql.selectDingDanState(client,dingDanIdS,function (error,result) {
            callback(result)
        })
    }
};
module.exports=new dingDanModel();