bitcore-armory
=======

[Bitcore](http://bitcore.io/) extension to manage [Armory's](https://bitcoinarmory.com/) Deterministic key derivation.


## Get Started

```
npm install bitcore
npm install bitcore-armory
```

```javascript
var bitcore = require('bitcore');
var bitcoreArmory = require('bitcore-armory');

//From Armory's export keys feature
var watchOnlyRootId   = 'wsfg akeu uufk aasw te';
var watchOnlyRootData = 'dnjs wkjw tdkh iihn ujtn dukw jtwu dfnk akht htwt ktut nuej uhuf jant ftka feir deji dafj sekd wtni ugnu kidf sths swht etsa jhnj hdit wfff sgan noaj foui gdsa wrks sjgu kkjh nfja';

var rootPublicKey = bitcoreArmory.ArmoryRootPublicKey(watchOnlyRootId, watchOnlyRootData);

var firstKey = rootPublicKey.derive();
var address = firstKey.toAddress();
console.log(address.toString()); //1663H4t7h7uFyqH3nbBHRXbrz9ksfAukFf
```

You can get the Watch-Only Root ID and Data by following these [instructions](docs/ARMORY.md). For more information please check the [documentation](docs/README.md) and [examples](docs/EXAMPLES.md).

## Features

* Support public key derivation according to Armory's rules (not [BIP32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki)).
* Caches all calculated keys.
* Root public key initialization from watch-only root id and watch-only root data.


## Roadmap

* Initialize public key from any current public key and chain code.
* Private key support with initialization from root key or an existing private key + chain data.
* Proper toString/inspect/toObject/toJSON implementation and re-instantiation.


## License

Code released under [the MIT license](LICENSE).

Copyright © 2014-2015 Leopoldo Godines.
