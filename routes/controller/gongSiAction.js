/**
 * Created by wl on 2017/7/19.
 */
var gongSiModel=require("../model/gongSiModel");
var gongSiAction=function () {
    this.gongSiListPage=function (req, res, next) {
        res.render("gongSi/gongSiListPage")
    };
    this.selectGongSis=function (req, res, next) {
        gongSiModel.selectGongSis(function (result) {
            res.json({gongsi:result})
        })
    };
    this.gongSiInsertPage=function (req, res, next) {
        res.render("gongSi/gongSiInsertPage")
    };
    this.insertGongSi=function (req, res, next) {
        gongSiModel.insertGongSi(req,function(result){
            if(result==1){
                res.redirect("/gongSiAction/gongSiListPage");
            }else{
                res.render("error");
            }
        })
    };
    this.gongSiEditPage=function (req, res, next) {
        var user=req.query.id;
        gongSiModel.gongSiEditPage(user,function(result){
            res.render("gongSi/gongSiEditPage",{phone:result[0]});
        })
    };
    this.gongSiedit=function (req, res, next) {
        gongSiModel.gongSiedit(req,function(result){
            if(result==1){
                res.redirect("/gongSiAction/gongSiListPage");
            }else{
                res.render("error");
            }
        })
    };
    this.deleteGs=function (req, res, next) {
        var userId=req.query.id;
        gongSiModel.deleteGsByGsId(userId,function (result) {
            if(result==1){
                res.redirect("/gongSiAction/gongSiListPage");
            }else{
                res.render("error");
            }
        })
    };
    //公司删除(多删)
    this.deleteMany=function (req, res, next) {
        var gongSiIdSStr=req.body.gongSiIdSStr;
        var gongSiIdS=gongSiIdSStr.split(",");
        gongSiModel.deleteGongSiByGongSiIdS(gongSiIdS,function (result) {
            if(result==gongSiIdS.length){
                res.json({resultCode:1})
            }else{
                res.json({resultCode:0})
            }
        })
    };
};
module.exports=new gongSiAction();