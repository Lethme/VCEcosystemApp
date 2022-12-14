export enum PasswordStateFieldType {
    Length,
    StartsUppercase,
    ContainsLatinLetters,
    ContainsNumbers,
    ContainsSpecialSymbols,
}

export interface PasswordStateField {
    type: PasswordStateFieldType;
    text: string;
    state: boolean;
}

export type PasswordState = Array<PasswordStateField>;