/*** Created by wl on 2017/7/1.*/
var userModel = require("../model/userModel");
var path=require("path");
    console.log(process.cwd());
    console.log(__filename);
    console.info(path.join(__filename,"../../model/userModel"));
var userAction=function () {
    this.dlzcPage=function (req, res, next) {
        //跳到两个大球子页面
        res.render("user/dlzcPage")
    };
    //跳到注册页面
    this.zhuCePage=function (req, res, next) {
        res.render("user/zhuCePage")
    };
    //用户注册
    this.userZhuCe=function (req, res, next) {
        var user=req.body;
        userModel.userZhuCe(user,function (result) {
            if (result==1){
                res.render("user/success",{title:"恭喜您注册成功"})
            }else{
                res.render("error",{title:"很遗憾注册失败,请重新注册"})
            }
        })
    };
    //验证要注册的用户名是否重复
    this.yanZhengUserName=function (req, res, next) {
        var userName=req.body.userName;
        userModel.yanZhengUserName(userName,function (result) {
            res.json({resultCode:result})
        })
    };
    //跳到登录页面
    this.dengLuPage=function (req, res, next) {
        res.render("user/dengLuPage")
    };
    //登录
    this.dengLu=function (req, res, next) {
        var userName=req.body.userName;
        var password=req.body.password;
        userModel.dengLu(userName,password,function (result) {
            if (result.shu==1){
                req.session.regenerate(function(error) {//初始化session
                    req.session.userId=result.user_id;
                    req.session.userName=result.user_name;
                    res.json({resultCode:result.shu,resultMsg:"恭喜您登录成功"})
                })
            }else{
                res.json({resultCode:result.shu,resultMsg:"登录失败，请重新登录"})
            }
        })
    };
    //退出并销毁session
    this.tuiChu=function (req, res, next) {
        req.session.destroy();
        res.redirect("/")
    };
    //跳到用户列表
    this.userList=function (req, res, next) {
        res.render("user/userList")
    };
    //查询用户
    this.selectUsers=function (req, res, next) {
        userModel.selectUsers(function (result) {
            res.json({users:result})
        })
    };
    //跳到添加用户页面
    this.insertPage=function (req, res, next) {
        res.render("user/userInsert")
    };
    //添加用户
    this.userInsert=function (req, res, next) {
        userModel.userInsert(req,res,function (result) {
            if (result==1){
                res.redirect("/userAction/userList")
            }else{
                res.render("error")
            }
        })
    };
    //通过ID查询用户,跳到用户修改页面
    this.userEditPage=function (req, res, next) {
        var userId=req.query.id;
        userModel.userEditPage(userId,function (result) {
            res.render("user/userEditPage",{user:result[0]})
        })
    };
    //修改用户
    this.userEdit=function (req, res, next) {
        userModel.userEdit(req,res,function (result) {
            if(result==1){
                //修改用户完成后重定向userList页面
                res.redirect("/userAction/userList")
            }else{
                res.render("error")
            }
        })
    };
    //删除用户(单删)
    this.deleteUser=function (req, res, next) {
        var userId=req.query.id;
        userModel.deleteUser(userId,function (result) {
            if (result==1){
                res.redirect("/userAction/userList")
            }else{
                res.render("error")
            }
        })
    };
    //删除用户(多删)
    this.deleteManyUserS=function (req, res, next) {
        var userIdSStr=req.body.userIdSStr;
        var userIdS=userIdSStr.split(",");
        userModel.deleteUserByUserIdS(userIdS,function (result) {
            if(result==userIdS.length){
                res.json({resultCode:1})
            }else{
                res.json({resultCode:0})
            }
        })
    };
    //跳到广告列表页面
    this.guangGaoList=function (req, res, next) {
        res.render("ad/guangGaoList")
    };
    //查询广告
    this.selectGuangGaos=function (req, res, next) {
        userModel.selectGuangGaos(function (result) {
            res.json({guangGao:result})
        })
    };
    //跳到添加广告页面
    this.guangGaoInsertPage=function (req, res, next) {
        res.render("ad/guangGaoInsertPage")
    };
    //添加广告
    this.guangGaoInsert=function (req, res, next) {
        userModel.guangGaoInsert(req,res,function (result) {
            if (result==1){
                res.redirect("/userAction/guangGaoList")
            }else{
                res.render("error")
            }
        })
    };
    //验证添加的广告名是否重复
    this.yanZhengGuangGaoName=function (req, res, next) {
        var ggName=req.body.ggName;
        userModel.yanZhengGuangGaoName(ggName,function (result) {
            res.json({resultCode:result})
        })
    };
    //通过ID查询数据库中有没有这个广告，如果有就跳到修改页面
    this.guangGaoEditPage=function (req, res, next) {
        var ggId=req.query.id;
        userModel.guangGaoEditPage(ggId,function (result) {
            res.render("ad/guangGaoEditPage",{ad:result[0]})
        })
    };
    //广告修改
    this.guangGaoEdit=function (req, res, next) {
        userModel.guangGaoEdit(req,function (result) {
            if (result==1){
                res.redirect("/userAction/guangGaoList")
            }else{
                res.render("error")
            }
        })
    };
    //广告删除(单删)
    this.deleteGuangGao=function(req, res, next) {
        var guangGaoId=req.query.id;
        userModel.deleteGuangGaoByGuangGaoId(guangGaoId,function (result) {
            if (result==1){
                res.redirect("/userAction/guangGaoList")
            }else{
                res.render("error")
            }
        })
    };
    //广告删除(多删)
    this.deleteMany=function (req, res, next) {
        var guangGaoIdSStr=req.body.guangGaoIdSStr;
        var guangGaoIdS=guangGaoIdSStr.split(",");
        userModel.deleteGuangGaoByGuangGaoIdS(guangGaoIdS,function (result) {
            if(result==guangGaoIdS.length){
                res.json({resultCode:1})
            }else{
                res.json({resultCode:0})
            }
        })
    }
};
module.exports=new userAction();//公开并实例化对象