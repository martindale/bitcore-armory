'use strict';

var _cache = {};

function resetAll() {
  _cache = {};
}

function reset(chainCode) {
  _cache[chainCode] = [];
}

function get(chainCode, index) {
  return _cache[chainCode] && _cache[chainCode][index];
}

function length(chainCode) {
  return _cache[chainCode] && _cache[chainCode].length || 0;
}

function slice(chainCode, begin, end) {
  return _cache[chainCode] && _cache[chainCode].slice(begin, end) || [];
}

function push(chainCode, value) {
  if (! _cache[chainCode]) {
    _cache[chainCode] = [];
  }
  _cache[chainCode].push(value);
}

module.exports = {
  resetAll: resetAll,
  reset: reset,
  get: get,
  length: length,
  slice: slice,
  push: push
};
