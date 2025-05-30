import { describe, expect, test } from 'vitest';
import { numberToKanji, kanjiToNumber } from '../src/index';

describe('error handling', () => {
    test('detects invalid number format', () => {
        expect(() => kanjiToNumber('一万一億')).toThrow();
        expect(() => kanjiToNumber('一一')).toThrow();
        expect(() => kanjiToNumber('一百')).toThrow();
        expect(() => kanjiToNumber('一十')).toThrow();
        expect(() => kanjiToNumber('三十百')).toThrow();
        expect(() => kanjiToNumber('万五千六')).toThrow();
        expect(() => kanjiToNumber('億')).toThrow();
        expect(() => kanjiToNumber('一万一万')).toThrow();
        expect(() => kanjiToNumber('無量大数')).toThrow();
        expect(() => kanjiToNumber('一無量大')).toThrow();
        expect(() => kanjiToNumber('')).toThrow();
        expect(() => kanjiToNumber('LOL')).toThrow();
        expect(() => kanjiToNumber('あ')).toThrow();
        expect(() => kanjiToNumber('42')).toThrow();
    });

    test('warns of an unsafe number', () => {
        expect(() => numberToKanji(Number.MAX_SAFE_INTEGER + 1)).toThrow();
    });
});

describe('basic functionality', () => {
    test('numberToKanji', () => {
        expect(numberToKanji(123456789, { form: 'daiji' })).toBe(
            '壱億弐阡参佰肆拾伍萬陸阡漆佰捌拾玖'
        );
        expect(numberToKanji(123456789, { form: 'common-daiji' })).toBe(
            '壱億弐千参百四拾五万六千七百八拾九'
        );
        expect(numberToKanji(0)).toBe('零');
        expect(numberToKanji(0, { zeroStyle: 'sign' })).toBe('〇');
        expect(numberToKanji(9223372036854775807n)).toBe(
            '九百二十二京三千三百七十二兆三百六十八億五千四百七十七万五千八百七'
        );
        expect(
            numberToKanji(Number.MAX_SAFE_INTEGER + 1, {
                ignoreUnsafeNumber: true,
            })
        ).toBe('九千七兆千九百九十二億五千四百七十四万九百九十二');
        expect(numberToKanji(-100)).toBe('百');
        expect(numberToKanji(450.51)).toBe('四百五十');
    });

    test('kanjiToNumber', () => {
        expect(kanjiToNumber('一億二千三百四十五万六千七百八十九')).toBe(
            123456789
        );
        expect(kanjiToNumber('壱億弐千参百四拾五万六千七百八拾九')).toBe(
            123456789
        );
        expect(kanjiToNumber('一万')).toBeTypeOf('number');
        expect(kanjiToNumber('一万', { returnType: 'bigint' })).toBeTypeOf(
            'bigint'
        );
        expect(
            kanjiToNumber('九百二十二京三千三百七十二兆', {
                returnType: 'number',
            })
        ).toBeTypeOf('number');
        expect(kanjiToNumber('一万', { returnType: 'mixed' })).toBeTypeOf(
            'number'
        );
        expect(
            kanjiToNumber('九百二十二京', { returnType: 'mixed' })
        ).toBeTypeOf('bigint');
        expect(kanjiToNumber('〇')).toBe(0);
        expect(kanjiToNumber('零')).toBe(0);
        expect(kanjiToNumber('一那由他', { returnType: 'bigint' })).toBe(
            1000000000000000000000000000000000000000000000000000000000000n
        );
    });
});

describe('round-trip conversion', () => {
    const testNumbers = [
        0, 1, 9, 10, 11, 99, 100, 101, 999, 1000, 1001, 9999, 10000, 12345,
        99999, 100000, 123456, 999999, 1000000, 12345678, 100000000, 123456789,
        999999999,
    ];

    test.each(testNumbers)('numberToKanji -> kanjiToNumber: %i', num => {
        const kanji = numberToKanji(num);
        const result = kanjiToNumber(kanji);
        expect(result).toBe(num);
    });

    test('works with bigint', () => {
        const bigNum = 123456789012345n;
        const kanji = numberToKanji(bigNum);
        const result = kanjiToNumber(kanji, { returnType: 'bigint' });
        expect(result).toBe(bigNum);
    });

    test('works with formal register', () => {
        const testNums = [1, 23, 456, 1234, 9999, 99999];
        testNums.forEach(num => {
            const kanji = numberToKanji(num, { form: 'daiji' });
            const result = kanjiToNumber(kanji);
            expect(result).toBe(num);
        });
    });

    test('works with common formal register', () => {
        const testNums = [1, 23, 456, 1234, 9999, 99999];
        testNums.forEach(num => {
            const kanji = numberToKanji(num, { form: 'common-daiji' });
            const result = kanjiToNumber(kanji);
            expect(result).toBe(num);
        });
    });
});

describe('performance tests', () => {
    test('handles large numbers efficiently', () => {
        const start = performance.now();

        for (let i = 0; i < 1000; i++) {
            numberToKanji(Math.floor(Math.random() * 1000000));
        }

        const end = performance.now();
        expect(end - start).toBeLessThan(100);
    });

    test('handles kanji parsing efficiently', () => {
        const testKanji = '九千九百九十九万九千九百九十九';
        const start = performance.now();

        for (let i = 0; i < 1000; i++) {
            kanjiToNumber(testKanji);
        }

        const end = performance.now();
        expect(end - start).toBeLessThan(100);
    });
});
