import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';

const declaringTypes = new Set([
	ParseTreeTokenType.CONST,
	ParseTreeTokenType.LET,
	ParseTreeTokenType.VAR
]);

export { declaringTypes };