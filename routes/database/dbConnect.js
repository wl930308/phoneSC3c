/**
 * Created by wl on 2017/7/1.
 */
var mysql = require("mysql");
var uuid = require("node-uuid");
var async = require("async");
var dao=function () {
    this.createServer=function () {
        var client=mysql.createConnection({
            host:"localhost",
            user:"root",
            password:"root",
            database:"phoneSC3c"
        });
        return client;
    };
    //用户注册
    this.userZhuCe=function (client,user,callback) {
        client.query("INSERT INTO USER (user_id, user_name, user_pass, user_tel, user_sex) VALUES (?,?,?,?,?)",[uuid.v4(),user.userName,user.password,user.phone,user.sex],function (error,result) {
            callback(result.affectedRows)
        })
    };
    //验证要注册的用户名是否重复
    this.yanZhengUserName=function (client,userName,callback) {
        client.query("SELECT COUNT(*) shuliang FROM USER u WHERE user_name=?",[userName],function (error,result) {
            callback(result[0].shuliang)
        })
    };
    //验证要登录的用户名和密码，数据库里有则登录成功，反之失败
    this.yanZhengUserNameAndPassword=function (client,userName,password,callback) {
        client.query("SELECT u.user_id, u.user_name, COUNT(*) shu FROM USER u WHERE u.user_name=? AND u.user_pass=?",[userName,password],function (error,result) {
            callback(result[0])
        })
    };
    //查询用户
    this.selectUsers=function (client,callback) {
        client.query("SELECT * FROM user",function (error,result) {
            callback(result)
        })
    };
    //添加用户
    this.userInsert=function(client,fields,newpath,callback) {  //添加数据
        client.query("INSERT INTO USER (user_id, user_name, user_pass, user_tel, user_sex, user_photo) VALUES (?,?,?,?,?,?)",
            [uuid.v4(),fields.userName[0],fields.password[0],fields.phone[0],fields.sex[0],newpath],function (error,result) {
                callback(result.affectedRows)
        })
    };
    //通过ID查询用户
    this.userEditPage=function (client, userId, callback) {
        client.query("SELECT user_id, user_name, user_pass, user_tel, user_sex, user_photo FROM USER WHERE user_id=?",[userId],function (error,result) {
            callback(result)
        })
    };
    //修改用户
    this.userEdit=function(client,fields,newpath,callback) {
        client.query("UPDATE USER SET user_name = ?, user_pass = ?, user_sex = ?, user_tel = ?, user_photo = ? WHERE user_id = ?",
            [fields.userName[0],fields.password[0],fields.sex[0],fields.phone[0],newpath,fields.userId[0]],function (error,result) {
                callback(result.affectedRows)
        })
    };
    //删除用户(单删)
    this.deleteUser=function (client,userId,callback) {
        client.query("DELETE FROM USER WHERE user_id = ?",[userId],function (error,result) {
            callback(result.affectedRows)
        })
    };
    //删除用户(多删)
    this.deleteUserByUserIdS=function (client,userIdS,callback) {
        client.query("DELETE FROM USER WHERE user_id in ("+userIdS+")",[],function (error,result) {
            callback(result.affectedRows)
        })
    };
    //查询广告
    this.selectGuangGaos=function (client,callback) {
        client.query("SELECT ad_id, ad_name, ad_content, ad_photo FROM AD",[],function (error,result) {
            callback(result)
        })
    };
    //添加广告
    this.guangGaoInsert=function (client,user,cclj,callback) {
        client.query("INSERT INTO AD (ad_id, ad_name, ad_content, ad_photo) VALUES (?,?,?,?)",
            [uuid.v4(),user.ggName[0],user.ggReiRong[0],cclj],function (error,result) {
                callback(result.affectedRows)
        })
    };
    //验证要添加的广告名是否重复
    this.yanZhengGuangGaoName=function (client,ggName,callback) {
        client.query("SELECT COUNT(*) shuliang FROM AD WHERE ad_name=?",[ggName],function (error,result) {
            callback(result[0].shuliang)
        })
    };
    //通过ID查询数据库中有没有这个广告，如果有就跳到修改页面
    this.guangGaoEditPage=function (client,ggId,callback) {
        client.query("SELECT * FROM AD WHERE ad_id=?",[ggId],function (error,result) {
            callback(result)
        })
    };
    //广告修改
    this.guangGaoEdit=function (client,guangGao,cclj,callback) {
        client.query("UPDATE AD SET ad_name = ?, ad_content = ?, ad_photo = ? WHERE ad_id = ?",
            [guangGao.guangGaoName[0],guangGao.guangGaoNeiRong[0],cclj,guangGao.guangGaoId[0]],function (error,result) {
                if (error){
                    console.log(error)
                }else{
                    callback(result.affectedRows)
                }
        })
    };
    //删除广告(单删)
    this.deleteGuangGaoByGuangGaoId=function (client,guangGaoId,callback) {
        client.query("DELETE FROM AD WHERE ad_id = ?",[guangGaoId],function (error,result) {
            callback(result.affectedRows)
        });
    };
    //删除广告(多删)
    this.deleteGuangGaoByGuangGaoIdS=function (client,guangGaoIdS,callback) {
        client.query("DELETE FROM AD WHERE ad_id in ("+guangGaoIdS+")",[],function (error,result) {
            callback(result.affectedRows)
        })
    };
    //查询商品
    this.selectShangPins=function (client,callback) {
        client.query("SELECT phone_id, phone_name, phone_xinghao, phone_price, phone_xiangqing, phone_kucun, phone_tupian1, phone_tupian2, phone_tupian3 FROM phone",function (error,result) {
            callback(result)
        })
    };
    //商品添加
    this.shangPinInsert=function (client,fields,cclj,callback) {
        client.query("INSERT INTO phone (phone_name, phone_xinghao, phone_price, phone_xiangqing, phone_kucun, phone_tupian1) VALUES (?,?,?,?,?,?)",
            [fields.spName[0],fields.spXingHao[0],fields.spJiaGe[0],fields.spXiangQing[0],fields.spKuCun[0],cclj],function (error,result) {
                callback(result.affectedRows)
        })
    };
    //验证要添加的商品名是否重复
    this.yanZhengShangPinName=function (client,spName,callback) {
        client.query("select count(*) shuliang from phone p where p.phone_Name=?",[spName],function (error,result) {
            callback(result[0].shuliang)
        })
    };
    //通过ID查询数据库中有没有这个商品，如果有就跳到修改页面
    this.shangPinEditPage=function (client,shangPinId,callback) {
        client.query("SELECT phone_id, phone_name, phone_xinghao, phone_price, phone_xiangqing, phone_kucun, phone_tupian1, phone_tupian2, phone_tupian3 FROM phone where phone_id=?",[shangPinId],function (error,result) {
            callback(result)
        })
    };
    //修改商品
    this.editSp=function (client,fields,cclj,callback) {
        client.query("UPDATE phone SET phone_name = ?, phone_xinghao = ?, phone_price = ?, phone_xiangqing = ?, phone_kucun = ?, phone_tupian1 = ? WHERE phone_id = ?",
            [fields.spName[0],fields.spXingHao[0],fields.spJiaGe[0],fields.spXiangQing[0],fields.spKuCun[0],cclj,fields.phoneId[0]],function (error,result) {
                callback(result.affectedRows)
        })
    };
    //删除商品(单删)
    this.deleteSp=function (client,shangPinId,callback) {
        client.query("DELETE FROM PHONE WHERE phone_id = ?",[shangPinId],function (error,result) {
            callback(result.affectedRows)
        })
    };
    //商品删除(多删)
    this.deleteShangPinByShangPinIdS=function (client,shangPinIdS,callback) {
        client.query("DELETE FROM PHONE WHERE phone_id in ("+shangPinIdS+")",[],function (error,result) {
            callback(result.affectedRows)
        })
    };
    //商品详情
    this.shangPinXiangQing=function (client,phoneId,callback) {
        client.query("SELECT * FROM PHONE WHERE phone_id=?",[phoneId],function (error,result) {
            callback(result[0])
        })
    };
    //添加订单
    this.addDingDan=function (client,dingDanCanShu,userId,callback) {
        client.query("INSERT INTO dingdan (dingDan_count, dingDan_time, dingDan_price, dingDan_state, phone_id, user_id) VALUES (?,?,?,?,?,?)",
            [dingDanCanShu.count,new Date(),dingDanCanShu.zongJia,"0",dingDanCanShu.phoneId,userId],function (error,result) {
                callback(result.affectedRows)
            })
    };
    //查询更多商品
    this.moreShangPinList=function (client,callback) {
        client.query("SELECT phone_id, phone_name, phone_xinghao, phone_price, phone_xiangqing, phone_kucun, phone_tupian1, phone_tupian2, phone_tupian3 FROM phone",function (error,result) {
            callback(result);
        })
    };
    //查询未支付订单
    this.selectWeiZhiFuDingDan=function (client,userId,callback) {
        client.query("SELECT dingDan_id, dingDan_count, dingDan_time, dingDan_price, p.phone_id, user_id, phone_name, phone_xinghao, phone_price, phone_xiangqing, phone_kucun, phone_tupian1 FROM dingdan d LEFT JOIN phone p ON d.phone_id=p.phone_id WHERE d.dingDan_state='0' AND d.user_id=? ",[userId],function (error, result) {
            callback(result)
        })
    };
    //删除订单(单删)
    this.deleteDingDan=function (client,dingDanId,callback){
        client.query("DELETE FROM dingdan WHERE dingDan_id = ?",[dingDanId],function (error, result) {
            callback(result.affectedRows)
        })
    };
    //删除订单(多删)
    this.deleteMany=function (client,dingDanIdS,callback) {
        client.query("DELETE FROM dingdan WHERE dingDan_id in ("+dingDanIdS+")",[],function (error,result) {
            callback(result.affectedRows)
        })
    };
    //多删async写法
    this.deleteManyByStr=function (client,dingDanIdS,callback) {
        var jieGuo=0;//存for循环执行完的结果数
        var funs=[];
        var y=0;//for循环执行时要用到的变量，从0开始，截止到订单IDS的数量
        for (var i=0;i<dingDanIdS.length;i++){
            console.log("这个是i的值=["+i);
            funs[i]=function (cb) {
                client.query("DELETE FROM dingdan WHERE dingDan_id=?",[dingDanIdS[y]],function (error,result) {
                    //方法执行时调用上面的y，从y中拿出每一个订单ID
                    console.log("我是dao里的语句");
                    console.log("这个是方法里i的值=["+i);
                    console.log("这个是方法里y的值=["+y);
                    y=y+1;//每执行一次y+1
                    // callback(result.affectedRows)
                    if (result.affectedRows==1){
                        jieGuo+=1;
                    }
                    cb(error,jieGuo)//这行代表for循环已执行完毕
                })
            }
        }
        async.series(funs,function (error,result) {
            console.log(jieGuo);
            console.log("这个是我要的result");
            console.log(result);
            callback(jieGuo)
        })
    };
    //查询公司列表
    this.selectGongSis=function (client,callback) {
        client.query("SELECT company_id, company_name, company_jieshao, company_logo, company_renshu FROM company",function (error,result) {
            callback(result)
        })
    };
    //添加公司
    this.insertGongSi_photo=function (client,user,cclj,callback) {
        client.query("INSERT INTO company (company_name, company_jieshao, company_logo, company_renshu) VALUES (?,?,?,?)", [user.userName[0],user.userPass[0],cclj,user.userTel[0]],function(error,result){
            // console.log(result)
            callback(result.affectedRows)
        })
    };
    //通过ID查询公司，跳到公司修改页面
    this.selectGongSiByGongSiId=function (client,phoneId,callback) {
        client.query("SELECT * FROM company where company_id=?",[phoneId],function (error,result) {
            callback(result);
        })
    };
    //公司修改动作
    this.gongSiedit=function (client,fields,newpath,callback) {
        client.query("UPDATE company SET company_name = ?,company_jieshao=?,company_logo=?,company_renshu=? WHERE company_id = ?",
            [fields.userName[0],fields.userPass[0],newpath,fields.userTel[0],fields.phoneId[0]],function (error,result) {
                callback(result.affectedRows)
        })
    };
    //删除公司(单删)
    this.deleteGsByGsId=function (client,userId,callback) {
        client.query("DELETE FROM company WHERE company_id = ?",[userId],function(error,result){
            callback(result.affectedRows)
        })
    };
    //删除公司(多删)
    this.deleteGongSiByGongSiIdS=function (client,gongSiIdS,callback) {
        var jieGuo=0;
        var funs=[];
        var y=0;
        for (var i=0;i<gongSiIdS.length;i++){
            funs[i]=function (cb) {
                client.query("DELETE FROM company WHERE company_id=?",[gongSiIdS[y]],function (error,result) {
                    // callback(result.affectedRows)
                    y=y+1;
                    if (result.affectedRows==1){
                        jieGuo+=1;
                    }
                    cb(error,jieGuo)
                })
            }
        }
        async.series(funs,function (error,result) {
            callback(jieGuo)
        })
    };
    //查询已购买商品列表
    this.selectYiGouMaiShangPinS=function (client,userId,callback) {
        client.query("SELECT dingDan_id, dingDan_count, dingDan_time, dingDan_price, user_id, p.phone_id, phone_name, phone_tupian1 FROM dingdan d LEFT JOIN phone p ON d.phone_id=p.phone_id WHERE d.dingDan_state='1' AND d.user_id=? ",[userId],function (error,result) {
            callback(result)
        })
    };
    //订单支付完成后减库存
    this.jianKuCun=function (client,gouMaiCountS,phoneIdS,callback) {
        var jieGuo=0;
        var funs=[];
        var y=0;
        for (var i=0;i<gouMaiCountS.length;i++){
            funs[i]=function (cb) {
                client.query("UPDATE phone p SET p.phone_kucun = (p.phone_kucun-?) WHERE phone_id = ?",[gouMaiCountS[y],phoneIdS[y]],function (error,result) {
                    // callback(result.affectedRows)
                    y=y+1;
                    if (result.affectedRows==1){
                        jieGuo+=1;
                    }
                    cb(error,jieGuo)
                })
            }
        }
        async.series(funs,function (error,result) {
            callback(error,jieGuo)
        })
    };
    //支付完成后修改订单状态
    this.editDingDanState=function (client,dingDanHaoS,callback) {
        var jieGuo=0;
        var funs=[];
        var y=0;
        for (var i=0;i<dingDanHaoS.length;i++){
            funs[i]=function (cb) {
                client.query("UPDATE  dingdan SET dingdan_state = '1' WHERE dingdan_id = ? AND dingdan_state = '0'",[dingDanHaoS[y]],function (error,result) {
                    // callback(result.affectedRows)
                    y=y+1;
                    if (result.affectedRows==1){
                        jieGuo+=1;
                    }
                    cb(error,jieGuo)
                })
            }
        }
        async.series(funs,function (error,result) {
            callback(error,jieGuo)
        })
    };
    //查询订单状态
    this.selectDingDanState=function (client,dingDanHaoSStr,callback) {
        client.query("SELECT SUM(d.dingDan_state) shu FROM dingdan d WHERE d.dingDan_id IN ("+dingDanHaoSStr+")",[],function (error,result) {
            callback(error,result[0].shu)
        })
    }
};
module.exports=new dao();//公开并实例化对象