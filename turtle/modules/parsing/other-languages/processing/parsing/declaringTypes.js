import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const declaringTypes = new Set([
	ParseTreeTokenType.ARRAY_DATATYPE_EXPRESSION,
	ParseTreeTokenType.DATA_TYPE,
	ParseTreeTokenType.VOID
]);

export { declaringTypes };