import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const declaringTypes = new Set([
	ParseTreeTokenType.DATA_TYPE,
	ParseTreeTokenType.VOID
]);

export { declaringTypes };