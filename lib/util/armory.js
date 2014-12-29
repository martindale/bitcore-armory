'use strict';

var bitcore = require('bitcore');
var Buffer = require('buffer').Buffer;
var BufferUtil = bitcore.util.buffer;
var Hash = bitcore.crypto.Hash;
var PublicKey = bitcore.PublicKey;
var PrivateKey = bitcore.PrivateKey;
var Point = bitcore.crypto.Point;
var BN = bitcore.crypto.BN;

/**
 * Double sha256 hashes the public key and XOR with the chain code.
 *
 * @param {PublicKey} *publicKey* - The current public key.
 * @param {Buffer} *chainCode* - The chain code from the root key/data.
 * @return {Buffer} The `sha256(sha256(public key)) XOR chain code` result.
 */
function _getMultiplier(publicKey, chainCode) {
  var hashedKey = Hash.sha256sha256(publicKey.toBuffer());

  var multiplierParts = [];
  for (var i = 0; i < 32; i++) {
    multiplierParts.push(hashedKey[i] ^ chainCode[i]);
  }
  return new Buffer(multiplierParts);
}

/**
 * Derives the next public key.
 *
 * Armory doesn't have a concept of *index* as BIP32, so it can only derive the
 * very next key. To get 10 keys ahead, you have to go through the first 9, one
 * at a time.
 *
 * The public key derivation formula is:
 *   p = the EC point from the current public key
 *   k = SHA256(SHA256(public key)) XOR chain code
 *   The new public key will be the EC multiplication between p and k
 *
 * **Attention:** Armory public keys are always *UNCOMPRESSED* (04). Using a
 * compressed key would result in different bitcoind addresses.
 *
 * @param {PublicKey} *publicKey* - The current public key to derive from.
 * @param {Buffer|string} *chainCode* - The chain code from the root key/data.
 * @return {PublicKey} The next public key available.
 */
function derivePublicKey(publicKey, chainCode) {
  if (typeof chainCode === 'string') {
    chainCode = BufferUtil.hexToBuffer(chainCode);
  }
  else if (!(chainCode instanceof Buffer)) {
    throw new TypeError('Chain Code must be a string or Buffer');
  }

  var derivedKeyMultiplier = _getMultiplier(publicKey, chainCode);

  var newPoint = publicKey.point.mul(derivedKeyMultiplier);
  return PublicKey.fromPoint(newPoint, false);
}

/**
 * Derives the next private key.
 *
 * Armory doesn't have a concept of *index* as BIP32, so it can only derive the
 * very next key. To get 10 keys ahead, you have to go through the first 9, one
 * at a time.
 *
 * The private key derivation formula is:
 *   A = SHA256(SHA256(corresponding public key)) XOR chain code
 *   B = the private key
 *   C = The finite field modulo ("N")
 *   The new private key will be A * B over finite field C (mod C)
 *
 * **Attention:** Armory public keys are always *UNCOMPRESSED* (04). Using a
 * compressed key would result in different bitcoind addresses.
 *
 * @param {PrivateKey} *privateKey* - The current private key to derive from.
 * @param {Buffer|string} *chainCode* - The chain code from the root key/data.
 * @return {PrivateKey} The next private key available.
 */
function derivePrivateKey(privateKey, chainCode) {
  if (typeof chainCode === 'string') {
    chainCode = BufferUtil.hexToBuffer(chainCode);
  }
  else if (!(chainCode instanceof Buffer)) {
    throw new TypeError('Chain Code must be a string or Buffer');
  }

  var publicKey;

  // privateKey.publicKey would erroneusly yield a compressed key if it was
  // instantiated through a simple hex string (bitcore incorrectly assumes any
  // hex strings would be from compressed keys), so we must derive and
  // instantiate manually
  if (privateKey.compressed) {
    publicKey = PublicKey.fromPoint(Point.getG().mul(privateKey.bn), false);
  }
  else {
    publicKey = privateKey.publicKey;
  }

  var derivedKeyMultiplier = _getMultiplier(publicKey, chainCode);

  var newKey = BN.fromBuffer(derivedKeyMultiplier)
    .mul(privateKey.bn)
    .mod(Point.getN());

  return new PrivateKey({
    bn: newKey.toString('hex'),
    compressed: false,
    network: 'livenet'
  });
}

/**
 * Derives the next public or private key.
 *
 * Armory doesn't have a concept of *index* as BIP32, so it can only derive the
 * very next key. To get 10 keys ahead, you have to go through the first 9, one
 * at a time.
 *
 * **Attention:** Armory public keys are always *UNCOMPRESSED* (04). Using a
 * compressed key would result in different bitcoind addresses.
 *
 * @param {PublicKey|PrivateKey} *key* - The current key to derive from.
 * @param {Buffer|string} *chainCode* - The chain code from the root key/data.
 * @return {PublicKey|PrivateKey} The next public/private key available.
 */
function derive(key, chainCode) {
  if (key instanceof PrivateKey) {
    return derivePrivateKey(key, chainCode);
  }
  else if (key instanceof PublicKey) {
    return derivePublicKey(key, chainCode);
  }
  else {
    console.log('***');
    console.log((key instanceof PrivateKey));
    console.log((key instanceof PublicKey));
    console.log(key);
    throw new TypeError('The key parameter must be a PrivateKey or PublicKey');
  }
}


module.exports = {
  derive: derive,
  derivePublicKey: derivePublicKey,
  derivePrivateKey: derivePrivateKey
};
