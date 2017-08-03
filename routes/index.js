var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
router.get('/', function(req, res, next) {
    var userName=req.session.userName;//从session中获取用户名
    var isLogined=!!userName;//两次叹号处理 强转成boolean的值 underfinded和null会变成false
    res.render('index', { isLogined: isLogined,userName:userName || " " });
    //跳页 传值  第一个是boolean 用于判断 第二个是用户名 有则传  无则传空字符串
});

router.get("/:action/:fn",function (req, res, next) {
    // console.log(req.params);
    var action=req.params.action;
    var fn=req.params.fn;
    var ac=require("./controller/"+action+".js");//动态调用路由文件
    //拦截器
    var userName=req.session.userName;
    var isLogined=!!userName;
    //如果没登录
    if (!isLogined){
        var lanJieUrlS=["dingDanAction","weiXinZhiFuAction"];
        //如果在拦截路径里
        if (lanJieUrlS.indexOf(action)!=-1){
            res.redirect("/")
        }else{
            ac[fn](req,res);//动态调用路由文件里相应的方法
        }
    }else{
        ac[fn](req,res);//动态调用路由文件里相应的方法
    }
});

router.post("/:action/:fn",function (req, res, next) {
    // console.log(req.params);
    var action=req.params.action;
    var fn=req.params.fn;
    var ac=require("./controller/"+action+".js");
    //拦截器
    var userName=req.session.userName;
    var isLogined=!!userName;
    //如果没登录
    if (!isLogined){
        var lanJieUrlS=["dingDanAction","weiXinZhiFuAction"];
        //如果在拦截路径里
        if (lanJieUrlS.indexOf(action)!=-1){
            if(action=="weiXinZhiFuAction" && fn=="notify"){
                ac[fn](req,res);
            }else{
                res.redirect("/")
            }
        }else{
            ac[fn](req,res);//动态调用路由文件里相应的方法
        }
    }else{
        ac[fn](req,res);//动态调用路由文件里相应的方法
    }
});
module.exports = router;