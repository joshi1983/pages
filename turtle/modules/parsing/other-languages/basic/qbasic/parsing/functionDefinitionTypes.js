import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const functionDefinitionTypes = new Set([
	ParseTreeTokenType.DEF,
	ParseTreeTokenType.FUNCTION,
	ParseTreeTokenType.SUB,
]);

export { functionDefinitionTypes };