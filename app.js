var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var session = require('express-session');
require('body-parser-xml')(bodyParser);
//这么操作的原因是我们的express框架天生对接收xml文件有缺陷  req.body上是无法接到xml
//那么以后如果再涉及要接收xml格式的数据时 就要完成以下3步
//第一步 npm i body-parser-xml --save 下载解析xml文件的模块
//第二步 写require('body-parser-xml')(bodyParser);
//第三步 进行路由设置 要放在设置路由的上面
// 解决微信支付通知回调数据
// app.use(bodyParser.xml({
//     limit: '2MB',   // Reject payload bigger than 2 MB
//     xmlParseOptions: {
//         normalize: true,     // Trim whitespace inside text nodes
//         normalizeTags: true, // Transform tags to lowercase
//         explicitArray: false // Only put nodes in array if >1
//     }
// }))


// var FileStore = require('session-file-store')(session);
var identityKey="gq";

var index = require('./routes/index');

var app = express();

// view engine setup
app.engine("html",ejs.__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    name: identityKey,//返回客户端的key的名称，默认为connect.sid,也可以自己设置。
    secret: 'xqq',  // 用来对session id相关的cookie进行签名
    //store: new FileStore(),  // 本地存储session（文本文件，也可以选择其他store，比如redis的）
    saveUninitialized: true,  // 是否自动保存未初始化的会话，建议false
    resave: false,  // 是否每次都重新保存会话，建议false
    //rolling: true,//设置session不过期
    /*cookie: {
     maxAge: 100 * 1000  // 有效期，单位是毫秒
     }*/
}));

// 解决微信支付通知回调数据
app.use(bodyParser.xml({
    limit: '2MB',   // Reject payload bigger than 2 MB
    xmlParseOptions: {
        normalize: true,     // Trim whitespace inside text nodes
        normalizeTags: true, // Transform tags to lowercase
        explicitArray: false // Only put nodes in array if >1
    }
}));

app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
