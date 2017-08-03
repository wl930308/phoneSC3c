var url = require('url');//npm i url
var queryString = require('querystring'); //npm i querystring
var crypto = require('crypto'); //npm i crypto
var request = require('request'); //npm i request
var xml2jsparseString = require('xml2js').parseString; //npm i xml2js
var qs=require("qs");
function  weiXinZhiFuModelJsapi() {
    var config={
        wxappid:"wx54e588f229939c3c",
        wxappsecret:"64650e4c3ebf52a6cbce357e0a30307c",
        mch_id :"1415721202",
        wxpaykey:"comturingweixin20161227comturing"
    }
    /**
     * 获取微信统一下单参数
     */
    this.getUnifiedorderXmlParams=function (obj) {
        var body = '<xml> ' +
            '<appid>'+config.wxappid+'</appid> ' +
            '<attach>'+obj.attach+'</attach> ' +
            '<body>'+obj.body+'</body> ' +
            '<mch_id>'+config.mch_id+'</mch_id> ' +
            '<nonce_str>'+obj.nonce_str+'</nonce_str> ' +
            '<notify_url>'+obj.notify_url+'</notify_url>' +
            '<openid>'+obj.openid+'</openid> ' +
            '<out_trade_no>'+obj.out_trade_no+'</out_trade_no>'+
            '<spbill_create_ip>'+obj.spbill_create_ip+'</spbill_create_ip> ' +
            '<total_fee>'+obj.total_fee+'</total_fee> ' +
            '<trade_type>'+obj.trade_type+'</trade_type> ' +
            '<sign>'+obj.sign+'</sign> ' +
            '</xml>';
        return body;
    }
    /**
     * 获取微信统一下单的接口数据
     */
    this.getPrepayId=function (obj,userInfo) {
        var that = this;
        // 生成统一下单接口参数
        var UnifiedorderParams = {
            appid : config.wxappid,
            attach : obj.attach,
            body : obj.body,
            mch_id : config.mch_id,
            nonce_str: this.createNonceStr(),
            notify_url : obj.notify_url,// 微信付款后的回调地址
            openid : userInfo.openid,
            out_trade_no : obj.out_trade_no,//new Date().getTime(), //订单号
            spbill_create_ip : obj.spbill_create_ip,
            total_fee : obj.total_fee,
            trade_type : 'JSAPI',
            // sign : getSign(),
        };
        // 返回 promise 对象
        return  new Promise(function (resolve, reject) {
            // 获取 sign 参数
            UnifiedorderParams.sign = that.getSign(UnifiedorderParams);
            console.info("这是要传给微信的参数");
            console.info(UnifiedorderParams)
            var url = 'https://api.mch.weixin.qq.com/pay/unifiedorder';
            request.post({url : url, body:JSON.stringify(that.getUnifiedorderXmlParams(UnifiedorderParams))}, function (error, response, body) {
                var prepay_id = '';
                if (!error && response.statusCode == 200) {
                        // 微信返回的数据为 xml 格式， 需要装换为 json 数据， 便于使用
                        xml2jsparseString(body, {async:true}, function (error, result) {
                        prepay_id = result.xml.prepay_id[0];
			            console.info("这个是prepay_id"+prepay_id);
                        // 放回数组的第一个元素
                        resolve(prepay_id);
                    });
                } else {
                    reject(body);
                }
            });
        })
    }
    /**
     * 获取微信支付的签名
     * @param payParams
     */
    this.getSign=function (signParams) {
        // 按 key 值的ascll 排序
        var keys = Object.keys(signParams);
        keys = keys.sort();
        var newArgs = {};
        keys.forEach(function (val, key) {
            if (signParams[val]){
                newArgs[val] = signParams[val];
            }
        })
        var string = queryString.stringify(newArgs)+'&key='+config.wxpaykey;
        // 生成签名
        return crypto.createHash('md5').update(queryString.unescape(string), 'utf8').digest("hex").toUpperCase();
    }
    /**
     * 微信支付的所有参数
     * @param req 请求的资源, 获取必要的数据
     * @returns {{appId: string, timeStamp: Number, nonceStr: *, package: string, signType: string, paySign: *}}
     */
    this.getBrandWCPayParams=function ( obj,userInfo, callback) {
        var that = this;
        var prepay_id_promise = that.getPrepayId(obj,userInfo);
        console.info("这是要测试先停止的地方");
        console.info(prepay_id_promise);
        prepay_id_promise.then(function (prepay_id) {
             var prepay_id = prepay_id;
             var wcPayParams = {
                 "appId" : config.wxappid,     //公众号名称，由商户传入
                 "timeStamp" : parseInt(new Date().getTime() / 1000).toString(),         //时间戳，自1970年以来的秒数
                 "nonceStr" : that.createNonceStr(), //随机串
                 // 通过统一下单接口获取
                 "package" : "prepay_id="+prepay_id,
                 "signType" : "MD5",         //微信签名方式：
             };
             wcPayParams.paySign = that.getSign(wcPayParams); //微信支付签名
 		console.info("这是微信支付签名");
                console.info(wcPayParams);
             callback(null, wcPayParams);
         },function (error) {
             callback(error);
        });
    }
    /**
     * 获取随机的NonceStr
     */
    this.createNonceStr=function() {
        return Math.random().toString(36).substr(2, 15);
    };
    /**
     * 获取微信的 AccessToken
     */
    this.getAccessToken=function (obj,cb,code) {
        var that = this;
        var getAccessTokenUrl = "https://api.weixin.qq.com/sns/oauth2/access_token?appid="+config.wxappid+"&secret="+config.wxappsecret+"&code="+code+"&grant_type=authorization_code";
        request.get({url : getAccessTokenUrl}, function (error, response, body) {
            if (!error && response.statusCode == 200){
                if (40029 == body.errcode) {
                    cb(error, body);
                } else {
                    body = JSON.parse(body);
                    console.info(body);
                    //在这已经获取了openid和token
                    //这里把获得的信息存入json数据里
                    var　userInfo={};
                    userInfo.access_token = body.access_token;
                    userInfo.expires_in = body.expires_in;
                    userInfo.refresh_token = body.refresh_token;
                    userInfo.openid = body.openid;
                    userInfo.scope = body.scope;
                    // var userXinXi_promise=that.getUserInfo(userInfo.access_token,userInfo.openid);
                    // userXinXi_promise.then(function (userXinXi) {
                    //     console.info(userXinXi);
                    // })
                    // 拼接微信的支付的参数
                    that.getBrandWCPayParams(obj,userInfo, function (error, responseData) {
                       if (error) {
                           cb(error);
                       } else {
			                console.info("2222222222222222");
			                console.info(responseData);
                            cb(null, responseData);
                       }
                   });
                }
            } else {
                cb(error);
            }
        });
    }
this.getUserInfo=function (AccessToken, openId) {
        var reqUrl = 'https://api.weixin.qq.com/sns/userinfo?';
        var params = {
            access_token: AccessToken,
            openid: openId,
            lang: 'zh_CN'
        };
        var options = {
            method: 'get',
            url: reqUrl+qs.stringify(params)
        };
        return new Promise(function(resolve, reject){
            request(options, function (err, res, body) {
                if (res) {
			
                    resolve(body);
                } else {
                    reject(err);
                }
            });
        })
    }

}

module.exports=new weiXinZhiFuModelJsapi();