'use strict';

var mongoose = require('mongoose');
var User = mongoose.model('User');

var config = require('../../config/config');
var sha1 = require('sha1');


exports.signature = function *(next) {
  let body = this.request.body;
  let type = body.type;
  let timestamp = body.timestamp;
  let folder, tags;

  if (type === 'avatar') {
    folder = 'avatar';
    tags = 'app,avatar'
  }else if (type === 'video') {
    folder = 'video';
    tags = 'app,video';
  }else if (type === 'audio') {
    folder = 'audio';
    tags = 'app,audio';
  }

  let signature = 'folder=' + folder + '&tags=' + tags + '&timestamp=' + timestamp + config.CLOUDINARY.api_secret;
  signature = sha1(signature);

  this.body = {
    success: true,
    data: signature
  };
}

exports.hasBody = function *(next) {
  var body = this.request.body || {};

  if (!body || Object.keys(body).length === 0) {
    this.body = {
      success: false,
      err: '是不是漏掉了什么'
    };
    return next;
  }

  yield next;
  
}

exports.hasToken = function *(next) {
  var accessToken = this.query.accessToken;
  if (!accessToken) {
    var accessToken = this.request.body.accessToken;  
  }

  if (!accessToken) {
    this.body = {
      success: false,
      err: '标识不存在'
    };
    return next;
  }

  var user = yield User.findOne({
    accessToken: accessToken
  }).exec();

  if (!user) {
    this.body = {
      success: false,
      err: '用户未登录'
    };
    return next;
  }
  
  this.session = this.session || {};
  this.session.user = user;

  yield next;
  
}