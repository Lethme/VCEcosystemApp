export const alphabetLowercase = Array
    .from(Array(26))
    .map((e, i) => i + 'a'.charCodeAt(0))
    .map((x) => String.fromCharCode(x));

export const alphabetUppercase = Array
    .from(Array(26))
    .map((e, i) => i + 'A'.charCodeAt(0))
    .map((x) => String.fromCharCode(x));

export const numbers = [...Array(10).keys()];

export const specialSymbols = "#$^+=!*@%&".split("");