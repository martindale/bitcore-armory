'use strict';

require('chai').should();
var bitcore = require('bitcore');
var bitcoreArmory = require('..');
var cache = require('../lib/util/cache');
var ArmoryRootPublicKey = bitcoreArmory.ArmoryRootPublicKey;
var Address = bitcore.Address;


var watchOnlyRootId   = 'wsfg akeu uufk aasw te';
var watchOnlyRootData = 'dnjs wkjw tdkh iihn ujtn dukw jtwu dfnk akht' +
                        'htwt ktut nuej uhuf jant ftka feir deji dafj' +
                        'sekd wtni ugnu kidf sths swht etsa jhnj hdit' +
                        'wfff sgan noaj foui gdsa wrks sjgu kkjh nfja';
var addresses = [
  '1663H4t7h7uFyqH3nbBHRXbrz9ksfAukFf',
  '1Lx9eG2vBgLC52FkMinJdbCea2hX4Ezu9y',
  '19CXj6fsVuNU2rsr7WkoWbVHkDfLR8ATQt',
  '1xadFAtPrJ2eNPEZBKZrMr2rcsbYWqC8C',
  '1DqJVoubMNigYFSxLptAxzgqRwzgJ255xW',
  '1FAy4x2WCMuBZRvSPeSaQTAwYrbSDu84id',
  '1AxD3tAUcDEijxn6FaNtWLBTWnQEw3GFoS',
  '1PB1qhcXV41gd3g7zBdz3oLEysabFKYNM3',
  '13o2SzpWKQb2MzGicCn548j9bJ3GxL4mnv',
  '1MazoWnSqGRsNSmZeTyugNgd79Y1iE6pz9',
  '1K57LW6G6eEc3ozt5gkNX2tQqYjUHdGp2R',
  '1Jrq2TXXg2RZjwhef48Zmc7msafBhAmStZ',
  '19cVCTk4xSk2MhAD6XSyHFcz5jNduxx5n3'
];

describe('ArmoryRootPublicKey', function() {
  var rootPublicKey;

  before(function() {
    rootPublicKey = new ArmoryRootPublicKey(watchOnlyRootId, watchOnlyRootData);
  });

  describe('creation', function() {
    it('should have parsed the correct Root Public Key', function() {
      rootPublicKey.rootPublicKey.toString('hex').should.equal(
        '042f618768b275dd5fc6bf2c78' +
        '6b8c23f75b8b7bcbfc96c5c360' +
        'fb3b7039da296d7498e07ce76d' +
        'f9e7856c0ac42205faf1a388bd' +
        '10f3323424209760a32b6060cf');
    });

    it('should have parsed the correct Chain Code', function() {
      rootPublicKey.chainCode.toString('hex').should.equal(
        '19728bfdc4fc7d231b51185b9b1065f6' +
        '8333140ffe063ecd42108a71164c7765');
    });

    it('should have parsed the correct Wallet ID', function() {
      rootPublicKey.walletId.should.equal('SujrD3qh');
    });

    it('should have parsed the correct Wallet Version', function() {
      rootPublicKey.walletVersion.should.equal(1);
    });

    it('should create without new operator', function() {
      // jshint newcap: false
      var key = ArmoryRootPublicKey(watchOnlyRootId, watchOnlyRootData);
      // jshint newcap: true
      key.walletId.should.equal('SujrD3qh');
      key.chainCode.toString('hex').should.equal(
        '19728bfdc4fc7d231b51185b9b1065f6' +
        '8333140ffe063ecd42108a71164c7765');
    });
  });

  describe('key derivation', function() {
    describe('without cache', function() {
      beforeEach(function() {
        cache.resetAll();
      });

      it('should derive first key', function() {
        new Address(rootPublicKey.deriveNext()).toString()
          .should.equal(addresses[0]);
      });

      it('should derive first key again', function() {
        new Address(rootPublicKey.deriveNext()).toString()
          .should.equal(addresses[0]);
      });

      it('should derive second key', function() {
        new Address(rootPublicKey.derive(1)).toString()
          .should.equal(addresses[1]);
      });

      it('should derive keys 4-8', function() {
        var keys = rootPublicKey.deriveRange(4, 9);
        keys.should.have.length(5);
        keys.forEach(function(key, i) {
          new Address(key).toString().should.equal(addresses[i + 4]);
        });
      });
    });

    describe('with cache', function() {
      before(function() {
        cache.resetAll();
      });

      it('should cache 10 keys', function() {
        cache.length(rootPublicKey.chainCode).should.equal(0);
        rootPublicKey.derive(9);
        cache.length(rootPublicKey.chainCode).should.equal(10);
      });

      it('should hit the cache for the second key', function() {
        cache.length(rootPublicKey.chainCode).should.equal(10);
        new Address(rootPublicKey.derive(1)).toString()
          .should.equal(addresses[1]);
        cache.length(rootPublicKey.chainCode).should.equal(10);
      });

      it('should derive key 10 (first uncached)', function() {
        new Address(rootPublicKey.deriveNext()).toString()
          .should.equal(addresses[10]);
      });

      it('should take a while when not cached', function() {
        var hrstart = process.hrtime();
        rootPublicKey.derive(30);
        var hrend = process.hrtime(hrstart);
        (hrend[0] * 1000 + hrend[1] / 1000000).should.be.above(50);
      });

      it('should be very fast when cached', function() {
        var hrstart = process.hrtime();
        rootPublicKey.deriveRange(0, 30);
        var hrend = process.hrtime(hrstart);
        (hrend[0] * 1000 + hrend[1] / 1000000).should.be.below(10);
      });
    });

    describe('with invalid arguments', function() {
      before(function() {
        cache.resetAll();
      });

      it('should not allow erroneous indexes', function() {
        (function() { return rootPublicKey.derive(null); }).should.throw();
        (function() { return rootPublicKey.derive(true); }).should.throw();
        (function() { return rootPublicKey.derive(false); }).should.throw();
        (function() { return rootPublicKey.derive(-1); }).should.throw();
        (function() { return rootPublicKey.derive(''); }).should.throw();
        (function() { return rootPublicKey.derive(10.5); }).should.throw();
        (function() { return rootPublicKey.derive('1'); }).should.throw();
      });

      it('should not allow erroneous ranges', function() {
        (function() { return rootPublicKey.deriveRange(); }).should.throw();
        (function() { return rootPublicKey.deriveRange(0,0); }).should.throw();
        (function() { return rootPublicKey.deriveRange(1,1); }).should.throw();
        (function() { return rootPublicKey.deriveRange(3); }).should.throw();
        (function() { return rootPublicKey.deriveRange(3,2); }).should.throw();
        (function() { return rootPublicKey.deriveRange(2,-2); }).should.throw();
        (function() { return rootPublicKey.deriveRange(-2,2); }).should.throw();
      });
    });
  });
  describe('representation', function() {
    it('should have correct #toString()', function() {
      rootPublicKey.toString().should.equal(rootPublicKey.walletId);
    });
    it('should have correct #inspect()', function() {
      rootPublicKey.inspect().should.equal(
        '<ArmoryRootPublicKey: ' + rootPublicKey.walletId + '>');
    });
  });

  describe('with invalid data', function() {
    it('should throw on invalid root id', function() {
      (function() {
        return new ArmoryRootPublicKey('', watchOnlyRootData);
      }).should.throw();
      (function() {
        return new ArmoryRootPublicKey(
          watchOnlyRootId + 'a', watchOnlyRootData);
      }).should.throw();
      (function() {
        return new ArmoryRootPublicKey(
          watchOnlyRootId.replace(/\w/g, 'a'), watchOnlyRootData);
      }).should.throw();
    });

    it('should throw on invalid root data', function() {
      (function() {
        return new ArmoryRootPublicKey(watchOnlyRootId, '');
      }).should.throw();
      (function() {
        return new ArmoryRootPublicKey(
          watchOnlyRootId, watchOnlyRootData + 'a');
      }).should.throw();
      (function() {
        return new ArmoryRootPublicKey(
          watchOnlyRootId, watchOnlyRootData.replace(/\w/g, 'a'));
      }).should.throw();
    });
  });

});
