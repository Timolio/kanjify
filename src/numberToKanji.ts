import { BIG_UNIT_TABLE, DIGIT_TABLES, SMALL_UNIT_TABLES } from './constants';
import { NumberToKanjiOptions } from './types';

export function numberToKanji(
    number: number | bigint,
    options: NumberToKanjiOptions = {}
): string {
    const register = options.register ?? 'standard';
    const style = options.style ?? 'traditional';
    const zeroStyle = options.zero_style ?? 'circle';
    const ignoreUnsafeNumber = options.ignoreUnsafeNumber ?? false;

    const digitTable = DIGIT_TABLES[register];
    const smallUnitTable = SMALL_UNIT_TABLES[register];
    const zeroChar = zeroStyle === 'kanji' ? '零' : '〇';

    if (number === 0 || number === 0n) {
        return zeroChar;
    }

    let str: string;
    if (typeof number === 'bigint') {
        str = number.toString();
    } else if (typeof number === 'number') {
        if (!Number.isSafeInteger(number)) {
            if (ignoreUnsafeNumber) {
                str = number.toLocaleString('fullwide', { useGrouping: false });
                console.log(str);
            } else {
                throw new TypeError(
                    'The number is not a safe integer. Use bigint instead. ' +
                        `Max safe integer is ${Number.MAX_SAFE_INTEGER}`
                );
            }
        } else {
            str = number.toString();
        }
    } else {
        throw new TypeError('Input must be a number or bigint');
    }

    if (style === 'plain') {
        let result = '';
        for (let i = 0; i < str.length; i++) {
            const ch = str[i];
            result += ch === '0' ? zeroChar : digitTable[+ch];
        }
        return result;
    }

    let result = '';
    let groupIndex = 0;

    for (let i = str.length; i > 0; i -= 4) {
        const group = str.slice(Math.max(0, i - 4), i);
        const groupKanji = _processGroup(group, digitTable, smallUnitTable);

        if (groupKanji !== '') {
            result = groupKanji + BIG_UNIT_TABLE[groupIndex] + result;
        }
        groupIndex++;
    }

    return result;
}

function _processGroup(
    group: string,
    digitTable: readonly string[],
    smallUnitTable: readonly string[]
): string {
    let result = '';
    const len = group.length;

    for (let i = 0; i < len; i++) {
        const digit = +group[i];
        if (digit === 0) continue;

        const pos = len - i - 1;
        if (digit === 1 && pos > 0) {
            result += smallUnitTable[pos];
        } else {
            result += digitTable[digit] + smallUnitTable[pos];
        }
    }

    return result;
}
