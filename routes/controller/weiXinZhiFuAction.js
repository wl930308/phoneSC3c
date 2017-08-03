// var middleware=require("./middleware");
var weiXinZhiFuModel=require("../model/weiXinZhiFuModel");
var weiXinZhiFuAction=function () {
    this.xiaDingDan=function (req, res, next) {
        var appid = "wx54e588f229939c3c";   //微信支付分配的公众账号ID
        var mch_id = "1415721202";      //商户ID
        var body = "wlweb微信支付测试20170724";       //商品描述
        var total_fee = 1;      //单位是分
        var yonghuIP = "192.168.0.187";
        var notify_url = "http://17kp295938.51mypc.cn/weiXinZhiFuAction/notify"; //支付成功回调通知地址
        var zhifuType = "NATIVE";         //支付方式为扫码支付
        var phoneIdSStr = req.body.phoneIdSStr;     //商品ID
        var gouMaiCountSStr = req.body.gouMaiCountSStr;//将购买数量通过微信送回，一会减库存用
        var attach = gouMaiCountSStr+"@"+phoneIdSStr;//自定义参数我们记住一会要切割的方式就可以了
        var dingDanIdSStr = req.body.dingDanIdSStr;//订单的ID
        weiXinZhiFuModel.order(appid,attach,body,mch_id,phoneIdSStr,dingDanIdSStr,total_fee,notify_url,yonghuIP,zhifuType).then(function (data) {
            console.log("++++++++++++++++++++++++++++++");
            console.log(data);
            res.json({"resultCode":1,"obj":data})
        })
    };
    this.notify=function (req, res, next) {
        console.log("进入新的notify");
        console.log("============================");
        console.log(req.body.xml);
        console.log("=============================");
        var message=req.body.xml;
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
        console.log(message);
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
        if (message.return_code == "SUCCESS" && message.result_code=="SUCCESS"){//通信是否成功，支付是否成功
            var dingDanHaoS=message.out_trade_no.split("-");//将传过来的订单号进行切割变成订单号数组
            var attachS=message.attach.split("@");
            var gouMaiCountS=attachS[0].split("-");
            var phoneIdS=attachS[1].split("-");
            weiXinZhiFuModel.houXuCaoZuo(dingDanHaoS,gouMaiCountS,phoneIdS,function (result) {
                var resXml1 = "<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>";
                var resXml2 = "<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[FAIL]]></return_msg></xml>";
                if (result==1){
                    res.set('Content-Type','text/xml');
                    res.write(resXml1);
                    res.end();
                }else{
                    res.set('Content-Type','text/xml');
                    res.write(resXml2);
                    res.end();
                }
            })
        }
    }
};
module.exports=new weiXinZhiFuAction();