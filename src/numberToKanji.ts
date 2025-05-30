import {
    BIG_UNIT_TABLE,
    DIGIT_TABLES,
    SMALL_UNIT_TABLES,
} from './constants.js';
import { Form, NumberToKanjiOptions } from './types.js';

export function numberToKanji(
    number: number | bigint,
    options: NumberToKanjiOptions = {}
): string {
    const {
        form = 'common',
        zeroStyle = 'kanji',
        ignoreUnsafeNumber = false,
    } = options;

    const digitTable = DIGIT_TABLES[form];
    const smallUnitTable = SMALL_UNIT_TABLES[form];
    const zeroChar = zeroStyle === 'kanji' ? '零' : '〇';

    if (number === 0 || number === 0n) {
        return zeroChar;
    }

    let str: string;
    if (typeof number === 'bigint') {
        const absBigInt = number < 0n ? -number : number;
        str = absBigInt.toString();
    } else if (typeof number === 'number') {
        let int = Math.trunc(Math.abs(number));

        if (!Number.isSafeInteger(int)) {
            if (ignoreUnsafeNumber) {
                str = int.toLocaleString('fullwide', { useGrouping: false });
            } else {
                throw new Error(
                    'The number is not a safe integer. Use bigint instead. ' +
                        `Max safe integer is ${Number.MAX_SAFE_INTEGER}`
                );
            }
        } else {
            str = int.toString();
        }
    } else {
        throw new TypeError('Input must be a number or bigint');
    }

    return _numberToKanji(str, form, digitTable, smallUnitTable);
}

function _numberToKanji(
    str: string,
    form: Form,
    digitTable: readonly string[],
    smallUnitTable: readonly string[]
): string {
    const len = str.length;
    const parts: string[] = [];

    let groupIndex = 0;

    for (let i = len; i > 0; i -= 4) {
        const groupStart = Math.max(0, i - 4);
        const groupKanji = _processGroup(
            str,
            groupStart,
            i,
            digitTable,
            smallUnitTable
        );

        if (groupKanji) {
            if (groupIndex > 0) {
                const unit =
                    form === 'daiji' && groupIndex === 1
                        ? '萬'
                        : BIG_UNIT_TABLE[groupIndex];
                parts.push(unit);
            }
            parts.push(groupKanji);
        }
        groupIndex++;
    }

    return parts.reverse().join('');
}

function _processGroup(
    str: string,
    start: number,
    end: number,
    digitTable: readonly string[],
    smallUnitTable: readonly string[]
): string {
    const groupLen = end - start;
    const result: string[] = [];

    for (let i = start; i < end; i++) {
        const digit = +str[i];
        if (digit === 0) continue;

        const pos = groupLen - (i - start) - 1;

        if (digit === 1 && pos > 0) {
            result.push(smallUnitTable[pos]);
        } else {
            result.push(digitTable[digit]);
            if (pos > 0) {
                result.push(smallUnitTable[pos]);
            }
        }
    }

    return result.join('');
}
