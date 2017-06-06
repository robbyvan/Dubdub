'use strict';

exports.signature = function *(next) {
  this.body = {
    success: true
  };
}