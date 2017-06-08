'use strict';

var sha1 = require('sha1');
var qiniu = require('qiniu');
var config = require('../../config/config');


qiniu.conf.ACCESS_KEY = config.qiniu.AK;
qiniu.conf.SECRET_KEY = config.qiniu.SK;


//要上传的空间
let bucket = 'gougouavatar';

//构建上传策略函数
function uptoken(bucket, key) {
  var putPolicy = new qiniu.rs.PutPolicy(bucket + ":" + key);

  // putPolicy.callbackUrl = 'http://your.domain.com/callback';
  // putPolicy.callbackBody = 'filename=$(fname)&filesize=$(fsize)';

  return putPolicy.token();
}

exports.getQiniuToken = function(key) {
  var token = uptoken(bucket, key);

  return token;
}


exports.getCloudinaryToken = function(body) {

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

  var signature = 'folder=' + folder + '&tags=' + tags + '&timestamp=' + timestamp + config.CLOUDINARY.api_secret;
  signature = sha1(signature);
}
