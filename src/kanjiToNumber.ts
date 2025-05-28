import { KANJI_TO_VALUE, ZERO_CHARS } from './constants';
import { KanjiToNumberOptions } from './types';

export function kanjiToNumber(
    kanji: string,
    options: KanjiToNumberOptions = {}
): number | bigint {
    const { returnType = 'number' } = options;

    if (!kanji || kanji.length === 0) {
        throw new Error('Input string cannot be empty');
    }

    if (ZERO_CHARS.has(kanji)) {
        return 0n;
    }

    const result = _kanjiToNumber(kanji);

    switch (returnType) {
        case 'bigint':
            return result;
        case 'number':
            return Number(result);
        case 'mixed':
            const numberResult = Number(result);
            if (Number.isSafeInteger(Number(result))) {
                return numberResult;
            }
            return result;
    }
}

function _kanjiToNumber(kanji: string): bigint {
    let result = 0n;
    let groupValue = 0n;
    let lastBigUnitValue: bigint | null = null;
    let lastDigit: bigint | null = null;
    let lastSmallUnitValue: bigint | null = null;

    for (let i = 0; i < kanji.length; i++) {
        const char = kanji[i];
        const info = KANJI_TO_VALUE.get(char);

        if (!info) {
            throw new Error(`Unknown kanji: ${char}`);
        }

        switch (info.type) {
            case 'digit':
                if (lastDigit) {
                    throw new Error(
                        `Invalid kanji number: consecutive digits found`
                    );
                }

                if (i === kanji.length - 1) {
                    groupValue += info.value;
                }

                lastDigit = info.value;
                break;

            case 'small':
                if (lastDigit === 1n && info.value !== 1000n) {
                    throw new Error(
                        'Invalid kanji number: 十 and 百 cannot be preceded by 一'
                    );
                }

                if (lastSmallUnitValue && info.value >= lastSmallUnitValue) {
                    throw new Error(
                        `Invalid kanji number: incorrect small unit order`
                    );
                }

                lastSmallUnitValue = info.value;
                groupValue += info.value * (lastDigit || 1n);
                lastDigit = null;
                break;

            case 'big':
                if (lastDigit) {
                    groupValue += lastDigit;
                    lastDigit = null;
                }

                if (groupValue === 0n) {
                    throw new Error(
                        `Invalid kanji number: big units must be preceded by a digit`
                    );
                }

                if (lastBigUnitValue && info.value >= lastBigUnitValue) {
                    throw new Error(
                        `Invalid kanji number: incorrect big unit order"`
                    );
                }

                lastBigUnitValue = info.value;
                result += (groupValue || 1n) * info.value;

                groupValue = 0n;
                lastDigit = null;
                lastSmallUnitValue = null;
                break;
        }
    }

    if (groupValue) {
        result += groupValue;
    }

    return result;
}
