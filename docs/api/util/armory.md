#Index

**Functions**

* [_getMultiplier(*publicKey*, *chainCode*)](#_getMultiplier)
* [derivePublicKey(*publicKey*, *chainCode*)](#derivePublicKey)
* [derivePrivateKey(*privateKey*, *chainCode*)](#derivePrivateKey)
* [derive(*key*, *chainCode*)](#derive)
 
<a name="_getMultiplier"></a>
#_getMultiplier(*publicKey*, *chainCode*)
Double sha256 hashes the public key and XOR with the chain code.

**Params**

- *publicKey* `PublicKey` - The current public key.  
- *chainCode* `Buffer` - The chain code from the root key/data.  

**Returns**: `Buffer` - The `sha256(sha256(public key)) XOR chain code` result.  
<a name="derivePublicKey"></a>
#derivePublicKey(*publicKey*, *chainCode*)
Derives the next public key.

Armory doesn't have a concept of *index* as BIP32, so it can only derive the
very next key. To get 10 keys ahead, you have to go through the first 9, one
at a time.

The public key derivation formula is:
  p = the EC point from the current public key
  k = SHA256(SHA256(public key)) XOR chain code
  The new public key will be the EC multiplication between p and k

**Attention:** Armory public keys are always *UNCOMPRESSED* (04). Using a
compressed key would result in different bitcoind addresses.

**Params**

- *publicKey* `PublicKey` - The current public key to derive from.  
- *chainCode* `Buffer` | `string` - The chain code from the root key/data.  

**Returns**: `PublicKey` - The next public key available.  
<a name="derivePrivateKey"></a>
#derivePrivateKey(*privateKey*, *chainCode*)
Derives the next private key.

Armory doesn't have a concept of *index* as BIP32, so it can only derive the
very next key. To get 10 keys ahead, you have to go through the first 9, one
at a time.

The private key derivation formula is:
  A = SHA256(SHA256(corresponding public key)) XOR chain code
  B = the private key
  C = The finite field modulo ("N")
  The new private key will be A * B over finite field C (mod C)

**Attention:** Armory public keys are always *UNCOMPRESSED* (04). Using a
compressed key would result in different bitcoind addresses.

**Params**

- *privateKey* `PrivateKey` - The current private key to derive from.  
- *chainCode* `Buffer` | `string` - The chain code from the root key/data.  

**Returns**: `PrivateKey` - The next private key available.  
<a name="derive"></a>
#derive(*key*, *chainCode*)
Derives the next public or private key.

Armory doesn't have a concept of *index* as BIP32, so it can only derive the
very next key. To get 10 keys ahead, you have to go through the first 9, one
at a time.

**Attention:** Armory public keys are always *UNCOMPRESSED* (04). Using a
compressed key would result in different bitcoind addresses.

**Params**

- *key* `PublicKey` | `PrivateKey` - The current key to derive from.  
- *chainCode* `Buffer` | `string` - The chain code from the root key/data.  

**Returns**: `PublicKey` | `PrivateKey` - The next public/private key available.  
