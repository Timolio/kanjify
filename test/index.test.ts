import { describe, it, expect, test } from 'vitest';
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
        expect(() => kanjiToNumber('')).toThrow();
        expect(() => kanjiToNumber('LOL')).toThrow();
        expect(() => kanjiToNumber('あ')).toThrow();
        expect(() => kanjiToNumber('42')).toThrow();
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

    test('works with financial register', () => {
        const testNums = [1, 23, 456, 1234, 9999];
        testNums.forEach(num => {
            const kanji = numberToKanji(num, { register: 'financial' });
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
