export type Die = `${number | ''}d${number}`;

export type DieAndModifier = `${Die}${'+' | '-'}${number}`;
