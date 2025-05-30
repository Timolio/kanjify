export type Form = 'common' | 'common-daiji' | 'daiji';
export type ZeroStyle = 'kanji' | 'sign';
export type ReturnType = 'number' | 'bigint' | 'mixed';

export interface NumberToKanjiOptions {
    form?: Form;
    zeroStyle?: ZeroStyle;
    ignoreUnsafeNumber?: boolean;
}

export interface KanjiToNumberOptions {
    returnType?: ReturnType;
}
