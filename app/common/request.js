'use strict';

var queryString = require('query-string');
var _ = require('lodash');
var Mock = require('mockjs');


var request = {};
var config = require('./config');

request.get = function(url, params) {
  if (params) {
    url += '?' + queryString.stringify(params);
  }

  console.log(url);

  return fetch(url)
    .then((res) => res.json())
    .then((responseJson) => Mock.mock(responseJson))
}

request.post = function(url, body) {
  let options = _.extend(config.header, {
    body: JSON.stringify(body)
  });

  return fetch(url, options)
    .then((res) => res.json())
    .then((responseJson) => Mock.mock(responseJson))
    .catch((error) => {
        console.error(error);
    });
}

module.exports = request;
