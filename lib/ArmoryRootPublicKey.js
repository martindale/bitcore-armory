'use strict';

var easy16 = require('./util/easy16');
var cache = require('./util/cache');
var armory = require('./util/armory');
var bitcore = require('bitcore');
var Base58 = bitcore.encoding.Base58;
var BufferUtil = bitcore.util.buffer;
var Hash = bitcore.crypto.Hash;
var Point = bitcore.crypto.Point;
var PublicKey = bitcore.PublicKey;

function _buildKeyCacheUpTo(index, rootPublicKey, chainCode) {
  var publicKey = rootPublicKey;
  var start = 0;

  if (cache.length(chainCode) > 0) {
    publicKey = cache.get(chainCode, cache.length(chainCode) - 1);
    start = cache.length(chainCode);
  }

  for (var i = start; i <= index; i++) {
    publicKey = armory.derive(publicKey, chainCode);
    cache.push(chainCode, publicKey);
  }
}

function _parse(value, length, name) {
  if (!value || !value.length || value.length < length) {
    throw new TypeError('Invalid ' + name + ' value');
  }
  var base16 = easy16.decode(value);
  if (base16.length !== length) {
    throw new TypeError('Invalid ' + name + ' value');
  }
  return BufferUtil.hexToBuffer(base16);
}

function _parseRootId(value) {
  value = _parse(value, 18, 'Watch-Only Root Id');

  var expectedChecksum = Hash.sha256sha256(
    value.slice(0,-2)).slice(0,2).toString('hex');
  var checksum = value.slice(-2).toString('hex');

  if (expectedChecksum !== checksum) {
    throw new TypeError('Watch-Only Root Id is invalid');
  }

  return value;
}

function _parseRootData(value) {
  value = _parse(value, 144, 'Watch-Only Root Data');

  for (var i = 1; i <= 4; i++) {
    var expectedChecksum = Hash.sha256sha256(
      value.slice(18*(i-1),18*i-2)).slice(0,2).toString('hex');
    var checksum = value.slice(18*i-2, 18*i).toString('hex');

    if (expectedChecksum !== checksum) {
      throw new TypeError('Watch-Only Root Id is invalid (line ' + i + ')');
    }
  }

  return value;
}

function _fromWatchOnlyRoot(rootId, rootData) {
  rootId = _parseRootId(rootId);
  rootData = _parseRootData(rootData);

  var publicKeyOddSignal = !!(rootId[0] & 0x80);

  var publicKeyXCoord = BufferUtil.concat([
    rootData.slice(0,16),
    rootData.slice(18,34)
  ]);

  var rootPoint = Point.fromX(publicKeyOddSignal, publicKeyXCoord);

  return {
    rootPublicKey: PublicKey.fromPoint(rootPoint, false),
    chainCode: BufferUtil.concat([
      rootData.slice(36,52),
      rootData.slice(54,70)
    ]),
    walletId: Base58.encode(rootId.slice(1,7)),
    walletVersion: rootId[0] & 0x7F
  };
}



/**
 * The representation of an Armory-based root public key.
 *
 * Armory uses its own key derivation strategy, not compliant with BIP32.
 *
 * @constructor
 * @param {string} *watchOnlyRootId* - The `Watch-Only Root ID` as supplied by
 * Armory.
 * @param {string} *watchOnlyRootData* - The `Watch-Only Root Data` as supplied
 * by Armory.
 */
function ArmoryRootPublicKey(watchOnlyRootId, watchOnlyRootData) {
  if (!(this instanceof ArmoryRootPublicKey)) {
    return new ArmoryRootPublicKey(watchOnlyRootId, watchOnlyRootData);
  }

  var values = _fromWatchOnlyRoot(watchOnlyRootId, watchOnlyRootData);

  this.rootPublicKey = values.rootPublicKey;
  this.chainCode = values.chainCode;
  this.walletId = values.walletId;
  this.walletVersion = values.walletVersion;

  return this;
}

/**
 * Get a derived key with the specified index, or the next one
 * if not specified.
 *
 * **Attention:** it will calculate every key in order until the specified
 * index, caching results. It can be very computational-heavy to retrieve a key
 * that has many of its predecessors uncalculated.
 *
 * @param {number?} *index* - How many keys to skip to get the intended key.
 * @return {PublicKey} The uncompressed derived public key. Use it as an
 * argument to 'new Address()` to generate the corresponding bitcoin address.
 */
ArmoryRootPublicKey.prototype.derive = function(index) {
  if (index === undefined) {
    index = cache.length(this.chainCode);
  }
  else if ((index !== 0 && !index) ||
    index !== parseInt(index, 10) ||
    index < 0) {
      throw new TypeError('Index should be positive');
  }

  _buildKeyCacheUpTo(index, this.rootPublicKey, this.chainCode);

  return cache.get(this.chainCode, index);
};

/**
 * Get the next available derived key that wasn't previously calculated.
 *
 * @return {PublicKey} The uncompressed derived public key. Use it as an
 * argument to `new Address()` to generate the corresponding bitcoin address.
 */
ArmoryRootPublicKey.prototype.deriveNext = function() {
  return this.derive();
};

/**
 * Get a range of derived keys within the specified indexes.
 *
 * **Attention:** it will calculate every key in order until the specified
 * index, caching results. It can be very computational-heavy to retrieve keys
 * that have many of their predecessors uncalculated.
 *
 * @param {number} *start* - A non-negative integer representing the lower-bound
 * of the range.
 * @param {number} *end* - A non-negative integer representing the upper-bound
 * of the range. Must be greater than `start`.
 * @return {PublicKey} The uncompressed derived public key. Use it as an
 * argument to `new Address()` to generate the corresponding bitcoin address.
 */
ArmoryRootPublicKey.prototype.deriveRange = function(start, end) {
  if (start !== parseInt(start, 10) || start < 0) {
    throw new TypeError(
      'The range start position should be a non-negative number');
  }
  else if (end !== parseInt(end, 10) || end < 0) {
    throw new TypeError(
      'The range end position should be a non-negative number');
  }
  else if (+end <= +start) {
    throw new TypeError('The range end position should be ' +
      'bigger than the start position');
  }

  _buildKeyCacheUpTo(+end, this.rootPublicKey, this.chainCode);

  return cache.slice(this.chainCode, +start, +end);
};

/**
 * Get the wallet id representation of the root key.
 *
 * @return {string} The walled id
 */
ArmoryRootPublicKey.prototype.toString = function () {
  return this.walletId;
};

/**
 * Get the console representation of the root key.
 *
 * @return {string} A string in the format
 * `<ArmoryRootPublicKey: wallet id>`.
 */
ArmoryRootPublicKey.prototype.inspect = function() {
  return '<ArmoryRootPublicKey: ' + this.walletId + '>';
};

module.exports = ArmoryRootPublicKey;
