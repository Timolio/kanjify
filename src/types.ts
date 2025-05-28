export type NumeralForm = 'standard' | 'financial';
export type RenderStyle = 'traditional' | 'plain';
export type ZeroStyle = 'kanji' | 'circle';
export type ReturnType = 'number' | 'bigint' | 'mixed';

export interface NumberToKanjiOptions {
    register?: NumeralForm;
    style?: RenderStyle;
    zero_style?: ZeroStyle;
    ignoreUnsafeNumber?: boolean;
}

export interface KanjiToNumberOptions {
    returnType?: ReturnType;
}
