import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const declaringTypes = new Set([
	ParseTreeTokenType.CONST,
	ParseTreeTokenType.LET,
	ParseTreeTokenType.VAR
]);

export { declaringTypes };