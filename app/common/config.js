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
    base: 'http://rapapi.org/mockjs/18970/',
    creations: 'api/creations',
    up: 'api/up',
    comments: 'api/comments'
  }
}