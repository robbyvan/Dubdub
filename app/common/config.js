'use strict';

module.exports = {
  header:{
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
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