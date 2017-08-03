/**
 * Created by wl on 2017/7/17.
 */
var dingDanModel=require("../model/dingDanModel");
var dingDanAction=function () {
    //添加订单
    this.addDingDan=function (req, res, next) {
        var dingDanCanShu=req.body;
        if (req.session.userId!=undefined){
            var userId=req.session.userId;
            dingDanModel.addDingDan(dingDanCanShu,userId,function (result) {
                if (result==1){
                    res.json({resultCode:1,resultMsg:"添加成功"})
                }else{
                    res.json({resultCode:0,resultMsg:"添加失败"})
                }
            })
        }
        // else{
        //     res.json({resultCode:0,resultMsg:"请先登录"})
        // }
    };
    //跳到购物车页面
    this.gouWuChePage=function (req, res, next) {
        res.render("shangPin/gwcPage")
    };
    //查询未支付订单
    this.selectWeiZhiFuDingDan=function (req, res, next) {
        var userName=req.session.userName;
        if (userName!=undefined){
            var userId=req.session.userId;
            var isLogined=!!userName;//两次叹号处理 强转成boolean的值 underfinded和null会变成false
            dingDanModel.selectWeiZhiFuDingDan(userId,function (result) {
                res.json({resultCode:1,resultMsg:result,isLogined: isLogined,userName:userName || " "})
            })
        }else{
            res.json({resultCode:0})
        }
    };
    //删除订单(单删)
    this.deleteDingDan=function (req, res, next) {
        var dingDanId=req.query.id;
        dingDanModel.deleteDingDan(dingDanId,function (result) {
            if (result==1){
                res.redirect("/dingDanAction/gouWuChePage")
            }else{
                res.render("error")
            }
        })
    };
    //删除订单(多删)
    this.deleteMany=function (req, res, next) {
        var dingDanIdSStr=req.body.dingDanIdSStr;
        var dingDanIdS=dingDanIdSStr.split(",");
        dingDanModel.deleteMany(dingDanIdS,function (result) {
            if (result==dingDanIdS.length){
                res.json({resultCode:1})
            }else{
                res.json({resultCode:0})
            }
        })
    };
    //多删async写法
    this.deleteManyByStr=function (req, res, next) {
        var dingDanIdSStr=req.body.dingDanIdSStr;
        var dingDanIdS=dingDanIdSStr.split(",");
        dingDanModel.deleteManyByStr(dingDanIdS,function (result) {
            if (result==dingDanIdS.length){
                res.json({resultCode:1})
            }else{
                res.json({resultCode:0})
            }
        })
    };
    //支付完成后修改订单状态
    this.editDingDanState=function (req, res, next) {
        var dingDanId=req.body.id;
        dingDanModel.editDingDanState(dingDanId,function (result) {

        })
    };
    this.selectDingDanState=function (req, res, next) {
        var dingDanIdStr=req.body.dingDanIdSStr;
        var dingDanIdS=dingDanIdStr.split(",");
        dingDanModel.selectDingDanState(dingDanIdS,function (result) {
            if (result==dingDanIdS.length){
                res.json({resultCode:1})
            }else{
                res.json({resultCode:0})
            }
        })
    }
};
module.exports=new dingDanAction();