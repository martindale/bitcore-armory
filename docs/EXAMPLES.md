Examples
=======

You can execute those examples in order. They all depend on the *Create a Root Public Key* sample.

## Install

```
npm install bitcore
npm install bitcore-armory
```

## Create a Root Public Key

```javascript
var bitcore = require('bitcore');
var bitcoreArmory = require('bitcore-armory');

//From Armory's export keys feature
var watchOnlyRootId   = 'wsfg akeu uufk aasw te';
var watchOnlyRootData = 'dnjs wkjw tdkh iihn ujtn dukw jtwu dfnk akht htwt ktut nuej uhuf jant ftka feir deji dafj sekd wtni ugnu kidf sths swht etsa jhnj hdit wfff sgan noaj foui gdsa wrks sjgu kkjh nfja';

var rootPublicKey = bitcoreArmory.ArmoryRootPublicKey(watchOnlyRootId, watchOnlyRootData);

console.log(rootPublicKey.toString()); //SujrD3qh (the Wallet ID)
```

## Get the next address

```javascript
var key = rootPublicKey.derive();
var address = key.toAddress();
console.log(address.toString()); //1663H4t7h7uFyqH3nbBHRXbrz9ksfAukFf
```

## Get a specific address

```javascript
var key100 = rootPublicKey.derive(100); //will take a little while
var address100 = key100.toAddress();
console.log(address100.toString()); //1G6BUxnguieZSFpyy917eSeSnbLm3VL6Yb
```

## Get an address range

```javascript
var twentyKeys = rootPublicKey.deriveRange(0, 20);
console.log(twentyKeys.length); //20

var twentyAddresses = twentyKeys.map(function(k) { return k.toAddress().toString(); });
console.log(twentyAddresses[19]); //12pRa3gfpsoFVirirk8BQoYiUWrQMFzPew
```

## Manual public key derivation

```javascript
var chainCode = rootPublicKey.chainCode;
var key0 = rootPublicKey.derive(0);
var key1 = rootPublicKey.derive(1);
var manualKey1 = bitcoreArmory.util.derive(key0, chainCode);

console.log(key0.toAddress().toString()); //1663H4t7h7uFyqH3nbBHRXbrz9ksfAukFf
console.log(key1.toAddress().toString()); //1Lx9eG2vBgLC52FkMinJdbCea2hX4Ezu9y
console.log(manualKey1.toAddress().toString()); //1Lx9eG2vBgLC52FkMinJdbCea2hX4Ezu9y
console.log(key1.toString() === manualKey1.toString()); // true
```

## Manual private key derivation

```javascript
var chainCode = rootPublicKey.chainCode;
var rootPrivateKey = new bitcore.PrivateKey({bn: '842a15f2611ee9c7132137e3086015acfe13c6357c54794131392b3994a6423c', compressed: false, network: 'livenet'});

var privateKey0 = bitcoreArmory.util.derivePrivateKey(rootPrivateKey, chainCode);
console.log(privateKey0.toString()); //12fskvtYCqk44VC4RmutKzeXGdKmzGS2WBC6fuYf9ToL2hRHF1s
console.log(privateKey0.toAddress().toString()); //1663H4t7h7uFyqH3nbBHRXbrz9ksfAukFf
console.log(rootPublicKey.derive(0).toAddress().toString()); //1663H4t7h7uFyqH3nbBHRXbrz9ksfAukFf
console.log(privateKey0.toAddress().toString() === rootPublicKey.derive(0).toAddress().toString()); //true
```

---

[Documentation home](README.md).
