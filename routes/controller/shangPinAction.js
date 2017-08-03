/**
 * Created by wl on 2017/7/16.
 */
var shangPinModel=require("../model/shangPinModel");
var shangPinAction=function () {
    //跳到商品列表页面
    this.shangPinList=function (req, res, next) {
        res.render("shangPin/shangPinList")
    };
    //查询商品
    this.selectShangPins=function (req, res, next) {
        shangPinModel.selectShangPins(function (result) {
            res.json({phone:result})
        })
    };
    //跳到商品添加页面
    this.shangPinInsertPage=function (req, res, next) {
        res.render("shangPin/shangPinInsertPage")
    };
    //商品添加
    this.shangPinInsert=function (req, res, next) {
        shangPinModel.shangPinInsert(req,res,function (result) {
            if (result==1){
                res.redirect("/shangPinAction/shangPinList")
            }else{
                res.render("error")
            }
        })
    };
    //验证要添加的商品名是否重复
    this.yanZhengShangPinName=function (req, res, next) {
        var spName=req.body.spName;
        shangPinModel.yanZhengShangPinName(spName,function (result) {
            res.json({resultCode:result})
        })
    };
    //通过ID查询数据库中有没有这个商品，如果有就跳到修改页面
    this.shangPinEditPage=function (req, res, next) {
        var shangPinId=req.query.id;
        shangPinModel.shangPinEditPage(shangPinId,function (result) {
            res.render("shangPin/shangPinEditPage",{phone:result[0]})
        })
    };
    //修改商品
    this.editSp=function (req, res, next) {
        shangPinModel.editSp(req,res,function (result) {
            if (result==1){
                res.redirect("/shangPinAction/shangPinList")
            }else{
                res.render("error")
            }
        })
    };
    //删除商品(单删)
    this.deleteSp=function (req, res, next) {
        var shangPinId=req.query.id;
        shangPinModel.deleteSp(shangPinId,function (result) {
            if (result==1){
                res.redirect("/shangPinAction/shangPinList")
            }else{
                res.render("error")
            }
        })
    };
    //商品删除(多删)
    this.deleteMany=function (req, res, next) {
        var shangPinIdSStr=req.body.shangPinIdSStr;
        var shangPinIdS=shangPinIdSStr.split(",");
        shangPinModel.deleteShangPinByShangPinIdS(shangPinIdS,function (result) {
            if(result==shangPinIdS.length){
                res.json({resultCode:1})
            }else{
                res.json({resultCode:0})
            }
        })
    };
    //商品详情
    this.shangPinXiangQing=function (req, res, next) {
        var phoneId=req.query.id;
        var userName=req.session.userName;//从session中获取用户名
        var isLogined=!!userName;//两次叹号处理 强转成boolean的值 underfinded和null会变成false
        shangPinModel.shangPinXiangQing(phoneId,function (result) {
            res.render("shangPin/shangPinXiangQing",{phone:result,isLogined: isLogined,userName:userName || " "})
        })
    };
    //跳到更多商品页面
    this.moreShangPinPage=function (req, res, next) {
        var userName=req.session.userName;
        var isLogined=!!userName;
        res.render("shangPin/moreShangPinPage",{ isLogined: isLogined,userName:userName || " " })
    };
    //查询更多商品
    this.moreShangPinList=function (req, res, next) {
        shangPinModel.moreShangPinList(function (result) {
            res.json({phone:result})
        })
    };
    //跳到已购买商品列表页面
    this.yiGouMaiList=function (req, res, next) {
        res.render("shangPin/yiGouMaiList")
    };
    //查询已购买商品列表
    this.selectYiGouMaiShangPinS=function (req, res, next) {
        var userId=req.session.userId;
        shangPinModel.selectYiGouMaiShangPinS(userId,function (result) {
            res.json({phone:result})
        })
    };
    //订单支付完成后减库存
    this.jianKuCun=function (req, res, next) {
        // var phoneId=req.body.phoneId;
        // var gouMaiCount=req.body.gouMaiCount;
        var phoneId=1;
        var gouMaiCount=3;
        shangPinModel.jianKuCun(phoneId,gouMaiCount,function (result) {
            if (result==1){
                console.log("成功")
            }else{
                console.log("失败")
            }
        })
    };
};
module.exports=new shangPinAction();