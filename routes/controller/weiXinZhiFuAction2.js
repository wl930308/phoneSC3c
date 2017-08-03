/**
 * Created by Administrator on 2017/7/21.
 */
var weiXinZhiFuModel=require("../model/weiXinZhiFuModel");
var weiXinZhiFuModelJsapi=require("../model/weiXinZhiFuModelJsapi");

function weiXinZhiFuAction(){
    this.xiaDingDan=function (req,res) {
        var canShu=req.body;
        console.info(canShu)
        var appid = "wx54e588f229939c3c";   //微信支付分配的公众账号ID
        var mch_id = "1415721202";          //商户ID
        var body = "gqweb微信支付测试20170721";       //商品描述
        var total_fee = 1;                //单位是分
        var yonghuIP="192.168.0.66";
        var notify_url = "http://16y3719f27.iok.la/weiXinZhiFuAction/notify"; //支付成功回调通知地址
        var zhifuType="NATIVE";             //支付方式扫码支付
        var phoneIdSStr=req.body.phoneIdSStr;             //商品id
        var gouMaiCountSStr=req.body.gouMaiCountSStr;//将购买数量通过微信送回,一会减库存用
        var attach = gouMaiCountSStr+"@"+phoneIdSStr;      //自定义参数我们记住一会要切割的方式就可以了
        var dingDanIdsStr=req.body.dingDanIdsStr;//订单的id
        weiXinZhiFuModel.order(appid,attach,body,mch_id,phoneIdSStr,dingDanIdsStr,total_fee,notify_url,yonghuIP,zhifuType).then(function (data) {
            console.info("+++++++++++++++++++++++++++++++++++++");
            console.info(data);
            return  res.json({"resultCode":1,"obj":data});
        })


    }
    this.notify=function (req,res) {
	console.info("3333333333333333333333")
        console.info(res.body)
    }
    this.weiXinZhiFuActionJsapi=function (req,res) {
        console.info("进来了")
        var shus=req.connection.remoteAddress.split(":");
        var ip=shus[shus.length-1];//获得ip
        // console.info(req)
        //var ipPort=req.headers.host;
        var url=req.url;
        var code=url.split("&")[0].split("=")[1];
        console.info(code);
        var obj={};
        obj.attach="ziDingYiCanShu";
        obj.body="webGqJsapiNode";
        obj.notify_url="http://games.yunmengwangluo.com/weiXinZhiFuAction/notify/";
        obj.out_trade_no="20170732";
        obj.spbill_create_ip=ip;
        obj.total_fee='1';
        weiXinZhiFuModelJsapi.getAccessToken(obj,function (error,result) {
	        console.info("这是目前有的代码最终的结果")
            console.info(result);
	        res.render("weiXinZhiFuJsapi",{result:result})
        },code)
    }

}

module.exports=new weiXinZhiFuAction()