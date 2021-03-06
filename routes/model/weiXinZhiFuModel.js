//var config = require('../config');//配置文件 appid 等信息
var Q = require("q");//npm install q
var request = require("request");//npm install request
var crypto = require('crypto');//这个不需要引入
var ejs = require('ejs');//这个创建项目时已经引入了
var fs = require('fs');//这个不需要引入
var mysql = require("../database/dbConnect");
var async = require("async");
var key = "comturingweixin20161227comturing";//这个要的是partnerkey,不是appsecret.
//=======定义微信支付所需要的公共参数=======

//var appsecret="46f81811595da15b51811dc276f734cf";
//var mch_id = "1415721202";
//var attach ="zidingyicanshu";
//=======定义微信支付所需要的公共参数=======
var WxPay = {
    getXMLNodeValue: function(node_name, xml) {
        var tmp = xml.split("<" + node_name + ">");
        var _tmp = tmp[1].split("</" + node_name + ">");
        return _tmp[0];
    },

    raw: function(args) {
        var keys = Object.keys(args);
        keys = keys.sort();
        var newArgs = {};
        keys.forEach(function(key) {
            newArgs[key.toLowerCase()] = args[key];
        });
        var string = '';
        for (var k in newArgs) {
            string += '&' + k + '=' + newArgs[k];
        }
        string = string.substr(1);//排序变成新的字符串用逻辑语连接
        console.info(string+"%%%%");
        return string;
    },

    paysignjs: function(appid, nonceStr, package, signType, timeStamp) {
        var ret = {
            appId: appid,
            nonceStr: nonceStr,
            package: package,
            signType: signType,
            timeStamp: timeStamp
        };
        var string = this.raw(ret);
        string = string + '&key=' + key;
        var sign = crypto.createHash('md5').update(string, 'utf8').digest('hex');
        return sign.toUpperCase();
    },

    paysignjsapi: function(appid, attach, body, mch_id, nonce_str, notify_url,out_trade_no,shangpinid,spbill_create_ip, total_fee, trade_type, openid) {
        var ret = {
            appid: appid,
            attach: attach,
            body: body,
            mch_id: mch_id,
            nonce_str: nonce_str,
            notify_url: notify_url,
            //openid:openid,
            out_trade_no: out_trade_no,
            product_id: shangpinid,
            spbill_create_ip: spbill_create_ip,
            total_fee: total_fee,
            trade_type: trade_type
        };
        var string = this.raw(ret);
        string = string + '&key=' + key; //key为在微信商户平台(pay.weixin.qq.com)-->账户设置-->API安全-->密钥设置
        var crypto = require('crypto');
        var sign = crypto.createHash('md5').update(string, 'utf8').digest('hex');
        return sign.toUpperCase();
    },

    // 随机字符串产生函数
    createNonceStr: function() {
        return Math.random().toString(36).substr(2, 15);
        /*
         1.Number.prototype.toString([radix])中的 radix 指定要用于数字到字符串的转换的基数(从2到36)。
         如果未指定 radix 参数，则默认值为 10。所有不在范围内的基数会报错：
         2.stringObject.substr(start,length)
         */
    },

    // 时间戳产生函数
    createTimeStamp: function() {
        return parseInt(new Date().getTime() / 1000) + '';
    },
    // 此处的attach不能为空值 否则微信提示签名错误
    order: function(appid,attach, body, mch_id, shangpinid, dingdanhao, total_fee, notify_url,yonghuIP,zhifuType) {
        var deferred = Q.defer();//调用q模块,一会写promise
        var appid =appid;//商户开通微信支付给的id
        var nonce_str = this.createNonceStr();//获得随机数
        console.info("这个是随机数=["+nonce_str);
        /*var timeStamp = this.createTimeStamp();//需要个时间戳  一会生成签名需要
         console.info("这个是时间戳=["+timeStamp);*/
        var url = "https://api.mch.weixin.qq.com/pay/unifiedorder";//微信提供的支付接口
        var sign=this.paysignjsapi(appid, attach, body, mch_id, nonce_str, notify_url, dingdanhao,shangpinid, yonghuIP, total_fee,zhifuType,"");
        console.info("sign是=["+sign+"]");
        var formData = "<xml>";
        formData += "<appid>" + appid + "</appid>"; //appid
        formData += "<attach>" + attach + "</attach>"; //附加数据
        formData += "<body>" + body + "</body>";
        formData += "<mch_id>" + mch_id + "</mch_id>"; //商户号
        formData += "<nonce_str>" + nonce_str + "</nonce_str>"; //随机字符串，不长于32位。
        formData += "<notify_url>" + notify_url + "</notify_url>";
        //formData += "<openid></openid>";//扫码支付这个参数不是必须的
        formData += "<out_trade_no>" + dingdanhao + "</out_trade_no>";
        formData += "<product_id>" + shangpinid + "</product_id>" ;
        formData += "<spbill_create_ip>" + yonghuIP + "</spbill_create_ip>";
        formData += "<total_fee>" + total_fee + "</total_fee>";//这里外面传进来1  是分为单位的整数
        formData += "<trade_type>" +zhifuType+ "</trade_type>";//这个是扫码支付
        formData += "<sign>" + sign+ "</sign>";
        formData += "</xml>";
        var self = this;
        request({
            url: url,
            method: 'POST',
            body: formData
        }, function(err, response, body) {
            if (!err && response.statusCode == 200) {
                console.log("这个是body=["+body+"]");
                var prepay_id = self.getXMLNodeValue('code_url', body.toString("utf-8"));
                var tmp = prepay_id.split('[');
                var tmp1 = tmp[2].split(']');
                console.info("tmp1[0]是="+tmp1[0]);
                //签名
                /*var _paySignjs = self.paysignjs(appid, nonce_str, 'prepay_id=' + tmp1[0], 'MD5', timeStamp);
                 var args = {
                 appId: appid,
                 timeStamp: timeStamp,
                 nonceStr: nonce_str,
                 signType: "MD5",
                 package: tmp1[0],
                 paySign: _paySignjs
                 };*/
                deferred.resolve(tmp1[0]);
            } else {
                console.log(body);
            }
        });
        return deferred.promise;
    },
    houXuCaoZuo:function (dingDanHaoS,gouMaiCountS,phoneIdS,callback) {
        var client=mysql.createServer();
        var flag1=true;
        var flag2=false;
        async.series({
            one:function (callback) {
                console.log("进入一方法");
                var dingDanHaoSStr=dingDanHaoS.join(",");
                mysql.selectDingDanState(client,dingDanHaoSStr,function (errors,result) {
                    if (result==dingDanHaoS.length){
                        flag1=false;
                    }
                    callback(errors,flag1)
                })
            },
            two:function (callback) {
                if (flag1==true){
                    console.log("进入二方法");
                    mysql.editDingDanState(client,dingDanHaoS,function (errors,result) {
                        if (result==dingDanHaoS.length){
                            flag2=true;
                        }
                        callback(errors,flag2)
                    })
                }
            },
            three:function (callback) {
                var biaoZhi=false;
                if (flag2==true){
                    console.log("进入三方法");
                    mysql.jianKuCun(client,gouMaiCountS,phoneIdS,function (errors,result) {
                        if (result==phoneIdS.length){
                            biaoZhi=true;
                        }
                        callback(errors,biaoZhi)
                    })
                }else{
                    callback(null,biaoZhi)
                }
            }
        },function (err,values) {
            console.log(values);
            console.log("恭喜你都执行完成了");
            if(values.three==true){
                callback(1);
            }else{
                callback(2);
            }
        })
    }
};
module.exports = WxPay;