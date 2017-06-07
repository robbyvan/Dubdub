var https = require('https');
var queryString = require('query-string');
var Promise = require('bluebird');
var speakeasy = require('speakeasy');

exports.getCode = function() {
  var code = speakeasy.totp({
    secret: 'hiimrobby',
    digits: 4
  });
  return code;
}

exports.send = function(phoneNumber, msg) {
  return new Promise(function(resolve, reject) {
    if (!phoneNumber){
      return reject(new Error('手机号不能为空'));
    }

    var postData = {
      mobile: phoneNumber,
      message: msg + '[罗比的Dubdub]'
    }

    var content = queryString.stringify(postData);

    var options = {
      host: 'sms-api.luosimao.com',
      path: '/v1/send.json',
      method: 'POST',
      auth: 'api:key-12312389d10fe16c98896ced5a09945188',
      agent: false,
      rejectUnauthorized: false,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': content.length
      }
    };

    var str = '';
    var req = https.request(options, function(res) {
      if (res.statusCode === 404) {
        reject(new Error('短信服务器无响应'));
        return;
      }

      res.setEncoding('utf8');

      res.on('data', function(chunk) {
        str += chunk;
      });

      res.on('end', function() {
        var data;
        try {
          data = JSON.parse(str);
        }catch(e) {
          reject(e);
        }

        if (data.error === 0) {
          resolve(data);
        }else {
          reject(new Error('需要map'));
        }

      });
    });

    req.write(content);
    req.end();


  });
}



