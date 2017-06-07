'use strict';

var xss = require('xss');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var uuid = require('uuid');
var sms = require('../service/sms');

exports.signup = function *(next) {
  let phoneNumber = this.request.body.phoneNumber;

  let user = yield User.findOne({
    phoneNumber: phoneNumber
  }).exec();

  var verifyCode = sms.getCode();

  if (!user) {

    var accessToken = uuid.v4();

    user =  new User({
      nickname: '游客',
      avatar: 'http://www.riji88.com/qqtouxiang/images/20120108/20120108093239184.jpg',
      phoneNumber: xss(phoneNumber),
      verifyCode: verifyCode,
      accessToken: accessToken
    });
    user.meta.createAt = user.meta.updateAt = Date.now();
  }else {
    user.verifyCode = verifyCode;
    user.meta.updateAt = Date.now();
  }

  try{
    user = yield user.save();  
  }catch(e) {
    this.body = {
      success: false
    };
    return next;
  }

  var msg = '您的注册验证码是:' + verifyCode;
  console.log(msg);

  //暂时不用真正通过短信发送
  // try {
  //   sms.send(user.phoneNumber, msg);
  // }catch(e) {
  //   console.log(e);
  //   this.body = {
  //     success: false,
  //     err: '短信服务异常'
  //   };
  // return next;
  // }

  this.body = {
    success: true
  };

}



exports.verify = function *(next) {
  console.log(this.request.body);
  let verifyCode = this.request.body.verifyCode;
  let phoneNumber = this.request.body.phoneNumber;

  if (!verifyCode || !phoneNumber) {
    this.body = {
      success: false,
      err: '验证失败, 空了'
    };
    return next;
  }

  var user = yield User.findOne({
    phoneNumber: phoneNumber,
    verifyCode: verifyCode
  }).exec();

  console.log('user是', user);

  if (user) {
    user.verified = true;
    user = yield user.save();
    this.body = {
      success: true,
      data: {
        nickname: user.nickname,
        accessToken: user.accessToken,
        avatar: user.avatar,
        _id: user._id
      }
    };
  }else {
    this.body = {
      success: false,
      err: '验证失败'
    };
  }
}


exports.update = function *(next) {
  var body = this.request.body;
  var user = this.session.user;

  var fields = 'avatar,gender,age,nickname'.split(',');

  fields.forEach((field) => {
    if (body[field]) {
      user[field] = body[field];
    }
  });

  user = yield user.save();

  this.body = {
    success: true,
    data: {
      nickname: user.nickname,
      accessToken: user.accessToken,
      avatar: user.avatar,
      gender: user.gender,
      age: user.age,
      _id: user._id
    }
  };
}