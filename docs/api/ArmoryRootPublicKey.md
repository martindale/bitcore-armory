<a name="ArmoryRootPublicKey"></a>
#class: ArmoryRootPublicKey
**Members**

* [class: ArmoryRootPublicKey](#ArmoryRootPublicKey)
  * [new ArmoryRootPublicKey(*watchOnlyRootId*, *watchOnlyRootData*)](#new_ArmoryRootPublicKey)
  * [armoryRootPublicKey.derive(*index*)](#ArmoryRootPublicKey#derive)
  * [armoryRootPublicKey.deriveNext()](#ArmoryRootPublicKey#deriveNext)
  * [armoryRootPublicKey.deriveRange(*start*, *end*)](#ArmoryRootPublicKey#deriveRange)
  * [armoryRootPublicKey.toString()](#ArmoryRootPublicKey#toString)
  * [armoryRootPublicKey.inspect()](#ArmoryRootPublicKey#inspect)

<a name="new_ArmoryRootPublicKey"></a>
##new ArmoryRootPublicKey(*watchOnlyRootId*, *watchOnlyRootData*)
The representation of an Armory-based root public key.

Armory uses its own key derivation strategy, not compliant with BIP32.

**Params**

- *watchOnlyRootId* `string` - The `Watch-Only Root ID` as supplied by
Armory.  
- *watchOnlyRootData* `string` - The `Watch-Only Root Data` as supplied
by Armory.  

<a name="ArmoryRootPublicKey#derive"></a>
##armoryRootPublicKey.derive(*index*)
Get a derived key with the specified index, or the next one
if not specified.

**Attention:** it will calculate every key in order until the specified
index, caching results. It can be very computational-heavy to retrieve a key
that has many of its predecessors uncalculated.

**Params**

- *index* `number` - How many keys to skip to get the intended key.  

**Returns**: `PublicKey` - The uncompressed derived public key. Use it as an
argument to 'new Address()` to generate the corresponding bitcoin address.  
<a name="ArmoryRootPublicKey#deriveNext"></a>
##armoryRootPublicKey.deriveNext()
Get the next available derived key that wasn't previously calculated.

**Returns**: `PublicKey` - The uncompressed derived public key. Use it as an
argument to `new Address()` to generate the corresponding bitcoin address.  
<a name="ArmoryRootPublicKey#deriveRange"></a>
##armoryRootPublicKey.deriveRange(*start*, *end*)
Get a range of derived keys within the specified indexes.

**Attention:** it will calculate every key in order until the specified
index, caching results. It can be very computational-heavy to retrieve keys
that have many of their predecessors uncalculated.

**Params**

- *start* `number` - A non-negative integer representing the lower-bound
of the range.  
- *end* `number` - A non-negative integer representing the upper-bound
of the range. Must be greater than `start`.  

**Returns**: `PublicKey` - The uncompressed derived public key. Use it as an
argument to `new Address()` to generate the corresponding bitcoin address.  
<a name="ArmoryRootPublicKey#toString"></a>
##armoryRootPublicKey.toString()
Get the wallet id representation of the root key.

**Returns**: `string` - The walled id  
<a name="ArmoryRootPublicKey#inspect"></a>
##armoryRootPublicKey.inspect()
Get the console representation of the root key.

**Returns**: `string` - A string in the format
`<ArmoryRootPublicKey: wallet id>`.  
