'use strict';

module.exports = {
  header:{
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  },
  qiniu: {
    upload: 'http://upload.qiniu.com/'
  },
  cloudinary: {
    cloud_name: 'dnsavc5be',  
    api_key: '925995529743554',  
    api_secret: 'r_pa57uynf1Q0T92L6thDpaIznA',  
    base:  'http://res.cloudinary.com/dnsavc5be',
    image: 'https://api.cloudinary.com/v1_1/dnsavc5be/image/upload',
    video: 'https://api.cloudinary.com/v1_1/dnsavc5be/video/upload',
    audio: 'https://api.cloudinary.com/v1_1/dnsavc5be/raw/upload'
  },
  api: {
    base2: 'http://rapapi.org/mockjs/18970/',
    base: 'http://localhost:1234/',
    creations: 'api/creations',
    up: 'api/up',
    comments: 'api/comments',
    signup: 'api/u/signup',
    verify: 'api/u/verify',
    signature: 'api/signature',
    update: 'api/u/update'
  }
}