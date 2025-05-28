export const DIGIT_TABLES = {
    standard: ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'],
    financial: ['', '壱', '弐', '参', '肆', '伍', '陸', '漆', '捌', '玖'],
} as const;

export const SMALL_UNIT_TABLES = {
    standard: ['', '十', '百', '千'],
    financial: ['', '拾', '佰', '仟'],
} as const;

export const BIG_UNIT_TABLE = [
    '',
    '万',
    '億',
    '兆',
    '京',
    '垓',
    '𥝱',
    '穣',
    '溝',
    '澗',
    '正',
    '載',
    '極',
    '恒河沙',
    '阿僧祇',
    '那由多',
    '不可思議',
    '無量大数',
] as const;

export const KANJI_TO_VALUE = new Map<
    string,
    { type: 'digit' | 'small' | 'big'; value: bigint }
>([
    ['一', { type: 'digit', value: 1n }],
    ['二', { type: 'digit', value: 2n }],
    ['三', { type: 'digit', value: 3n }],
    ['四', { type: 'digit', value: 4n }],
    ['五', { type: 'digit', value: 5n }],
    ['六', { type: 'digit', value: 6n }],
    ['七', { type: 'digit', value: 7n }],
    ['八', { type: 'digit', value: 8n }],
    ['九', { type: 'digit', value: 9n }],

    ['壱', { type: 'digit', value: 1n }],
    ['弐', { type: 'digit', value: 2n }],
    ['参', { type: 'digit', value: 3n }],
    ['肆', { type: 'digit', value: 4n }],
    ['伍', { type: 'digit', value: 5n }],
    ['陸', { type: 'digit', value: 6n }],
    ['漆', { type: 'digit', value: 7n }],
    ['捌', { type: 'digit', value: 8n }],
    ['玖', { type: 'digit', value: 9n }],

    ['十', { type: 'small', value: 10n }],
    ['百', { type: 'small', value: 100n }],
    ['千', { type: 'small', value: 1000n }],

    ['拾', { type: 'small', value: 10n }],
    ['佰', { type: 'small', value: 100n }],
    ['仟', { type: 'small', value: 1000n }],

    ['万', { type: 'big', value: 10000n }],
    ['萬', { type: 'big', value: 10000n }],
    ['億', { type: 'big', value: 100000000n }],
    ['兆', { type: 'big', value: 1000000000000n }],
    ['京', { type: 'big', value: 10000000000000000n }],
    ['垓', { type: 'big', value: 100000000000000000000n }],
    ['𥝱', { type: 'big', value: 1000000000000000000000000n }],
    ['穣', { type: 'big', value: 10000000000000000000000000000n }],
    ['溝', { type: 'big', value: 100000000000000000000000000000000n }],
    ['澗', { type: 'big', value: 1000000000000000000000000000000000000n }],
    ['正', { type: 'big', value: 10000000000000000000000000000000000000000n }],
    [
        '載',
        { type: 'big', value: 100000000000000000000000000000000000000000000n },
    ],
    [
        '極',
        {
            type: 'big',
            value: 1000000000000000000000000000000000000000000000000n,
        },
    ],
]);

export const ZERO_CHARS = new Set(['零', '〇']);
