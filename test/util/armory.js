'use strict';

require('chai').should();
var bitcore = require('bitcore');
var PublicKey = bitcore.PublicKey;
var PrivateKey = bitcore.PrivateKey;
var BufferUtil = bitcore.util.buffer;
var armory = require('../../lib/util/armory');

/* jshint maxlen: 200 */
var chainCode = '19728bfdc4fc7d231b51185b9b1065f68333140ffe063ecd42108a71164c7765';

var publicKeys = [
  new PublicKey('042f618768b275dd5fc6bf2c786b8c23f75b8b7bcbfc96c5c360fb3b7039da296d7498e07ce76df9e7856c0ac42205faf1a388bd10f3323424209760a32b6060cf'),
  new PublicKey('04ae734527cd2e5a4662718026d4bb24bf958a06c5f597ae31ed314afc8edbda9b16d6d516e780c396ab7af0b9e1d13884242b180ea32953bc557ac0b4bad77af6'),
  new PublicKey('04ddceda8a4a29052a3ad8f3a715b7d820406e2a07051141ddd7841e1076a781c414339509e75784e2e9849f990a6c7dace565745ff506492f2d6b18ef431e81a5'),
  new PublicKey('0412b40d78680d50e8b72b1c15d11b6038bad916a5fd73c2c295f6b8f6d33236310823a44590047d34e0a4cf6ceb24b31fae56d163e5e5ec34db5c8aa94d3084fe'),
  new PublicKey('044125d220b2f6f8e97942f273da485eb5f996a9cf0e5a64abd7bfcc9d9670ea85dd6cc279aaea56cfc1ba20bf3e0169d6fffe61fdadf78301572d7d4ee3ff0f7e')
];

var privateKeys = [
  new PrivateKey('842a15f2611ee9c7132137e3086015acfe13c6357c54794131392b3994a6423c'),
  new PrivateKey({ bn: 'dbf7820cca39ccbda7d61db49ea4bf4f16ed25a4b1dd6e0286056254ebc67560', compressed: false, network: 'livenet' }),
  new PrivateKey('d99bf16d62e5a7abb8612147304111c2394e90ac377c5b52452c09ffc26f7d4a'),
  new PrivateKey({ bn: '6114f283c5db496bf633c418cea068967f446205fa0d72ab0d8bd21ad0813030', compressed: false, network: 'livenet' }),
  new PrivateKey('1466b009cbafc00385a177c57fa4b7cf514d6123e38e2704d74ed93ff268a87a')
];
/* jshint maxlen: 80 */

describe('Key Derivation', function() {
  it('should derive public keys', function() {
    for (var i = 0; i < publicKeys.length - 1; i++) {
      armory.derive(publicKeys[i], chainCode).toString()
        .should.equal(publicKeys[i+1].toString());
    }
    armory.derivePublicKey(publicKeys[0], chainCode).toString()
      .should.equal(publicKeys[1].toString());
  });

  it('should derive private keys', function() {
    for (var i = 0; i < privateKeys.length - 1; i++) {
      armory.derive(privateKeys[i], chainCode).bn.toString()
        .should.equal(privateKeys[i+1].bn.toString());
    }
    armory.derivePrivateKey(privateKeys[0], chainCode).bn.toString()
      .should.equal(privateKeys[1].bn.toString());
    armory.derivePrivateKey(privateKeys[0], BufferUtil.hexToBuffer(chainCode))
      .bn.toString().should.equal(privateKeys[1].bn.toString());
  });

  it('should throw on invalid parameters', function() {
    (function() { armory.derive(publicKeys[0]); }).should.throw();
    (function() { armory.derive(privateKeys[0]); }).should.throw();
    (function() { armory.derivePublicKey(publicKeys[0]); }).should.throw();
    (function() { armory.derivePrivateKey(privateKeys[0]); }).should.throw();
    (function() { armory.derive(publicKeys[0].toString()); }).should.throw();
  });
});
