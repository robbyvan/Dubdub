'use strict';

//连接数据库
var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');

var db = 'mongodb://localhost/imooc-app';
mongoose.Promise = require('bluebird');
mongoose.connect(db);

//加载用户模型
var models_path = path.join(__dirname, '/app/models');
var walk = function(modelPath) {
  fs
    .readdirSync(modelPath)
    .forEach((file) => {
      let filePath = path.join(modelPath, '/' + file);
      let stat = fs.statSync(filePath);
      if (stat.isFile()) {
        if (/(.*)\.(js|coffee)/.test(file)) {
          require(filePath);
        }
      }else if(stat.isDirectory()) {
        walk(filePath);
      }
    });
}
//或者直接 require('./app/models/user');

const koa = require('koa');
const logger = require('koa-logger');
const session = require('koa-session');
const bodyParser = require('koa-bodyparser');


const app = koa();

app.keys = ['imooc'];

app.use(logger());
app.use(session(app));
app.use(bodyParser());

const router = require('./config/routes')();

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(1234);

console.log('Listening: 1234');
