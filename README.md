### Kanjify

[![NPM Version](https://img.shields.io/npm/v/kanjify)](https://www.npmjs.com/package/kanjify)
[![NPM Downloads](https://img.shields.io/npm/dm/kanjify)](https://www.npmjs.com/package/kanjify)

JS/TS utility to convert between number/bigint and Japanese kanji numerals.

_⚠️ Note: Negative and non-integer numbers are not supported at the moment — they are converted to their absolute integer part._

#### 📦 Installation

```bash
npm install kanjify
```

#### ✨ Usage

```typescript
import { numberToKanji, kanjiToNumber } from 'kanjify';

numberToKanji(123); // 一百二十三
numberToKanji(1234); // 一千二百三十四
numberToKanji(12345); // 一万二千三百四十五
numberToKanji(123456789); // 一億二千三百四十五万六千七百八十九

numberToKanji(9223372036854775807n);
// 九百二十二京三千三百七十二兆三百六十八億五千四百七十七万五千八百七

numberToKanji(123, { form: 'daiji' }); // 壱佰弐拾参
numberToKanji(12345, { form: 'daiji' }); // 壱萬弐仟参佰肆拾伍
numberToKanji(123456789, { form: 'daiji' }); // 壱億弐阡参佰肆拾伍萬陸阡漆佰捌拾玖

numberToKanji(123, { form: 'common-daiji' }); // 壱百弐拾参
numberToKanji(12345, { form: 'common-daiji' }); // 壱萬弐千参百四拾五
numberToKanji(123456789, { form: 'common-daiji' }); // 壱億弐千参百四拾五万六千七百八拾九

numberToKanji(0); // 零
numberToKanji(0, { zeroStyle: 'sign' }); // 〇

numberToKanji(Number.MAX_SAFE_INTEGER + 1);
// Error: The number is not a safe integer. Use bigint instead...

numberToKanji(Number.MAX_SAFE_INTEGER + 1, { ignoreUnsafeNumber: true });
// 九千七兆千九百九十二億五千四百七十四万九百九十二

kanjiToNumber('一百二十三'); // 123
kanjiToNumber('一万二千三百四十五'); // 12345
kanjiToNumber('一億二千三百四十五万六千七百八十九'); // 123456789

kanjiToNumber('壱佰弐拾参'); // 123
kanjiToNumber('壱萬弐仟参佰肆拾伍'); // 12345
kanjiToNumber('壱億弐仟参佰肆拾伍萬陸仟漆佰捌拾玖'); // 123456789

kanjiToNumber('壱万弐千参百四拾五'); // 12345
kanjiToNumber('壱億弐千参百四拾五万六千七百八拾九'); // 123456789

// Returns `number` by default
kanjiToNumber('九百二十二那由他'); // 9.22e+62

// `bigint` will be always returned
kanjiToNumber('九百二十二那由他', { returnType: 'bigint' });
// 922000000000000000000000000000000000000000000000000000000000000n

// `number` if safe integer, else `bigint`
kanjiToNumber('一万', { returnType: 'mixed' }); // 10000
kanjiToNumber('九百二十二那由他', { returnType: 'mixed' });
// 922000000000000000000000000000000000000000000000000000000000000n

kanjiToNumber('〇'); // 0
kanjiToNumber('零'); // 0
```
