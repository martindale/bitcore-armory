'use strict';

var easy16ToBase16Map = {
  'a': '0',    's': '1',    'd': '2',    'f': '3',
  'g': '4',    'h': '5',    'j': '6',    'k': '7',
  'w': '8',    'e': '9',    'r': 'A',    't': 'B',
  'u': 'C',    'i': 'D',    'o': 'E',    'n': 'F'
};

var base16ToEasy16Map = {
  '0': 'a',    '1': 's',    '2': 'd',    '3': 'f',
  '4': 'g',    '5': 'h',    '6': 'j',    '7': 'k',
  '8': 'w',    '9': 'e',    'A': 'r',    'B': 't',
  'C': 'u',    'D': 'i',    'E': 'o',    'F': 'n',

  //lower-case variants
  'a': 'r',    'b': 't',    'c': 'u',
  'd': 'i',    'e': 'o',    'f': 'n'
};


function decode(easy16) {
  return Array.prototype.map.call(easy16, function(c) {
    return easy16ToBase16Map[c] || '';
  }).join('');
}

function encode(base16) {
  return Array.prototype.map.call(base16, function(c) {
    return base16ToEasy16Map[c] || '';
  }).join('');
}

module.exports = {
  decode: decode,
  encode: encode
};
