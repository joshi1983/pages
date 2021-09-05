import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

const invalidOperandTokenTypes = new Set([
	ParseTreeTokenType.COMMA,
	ParseTreeTokenType.COLON,
	ParseTreeTokenType.CURVED_LEFT_BRACKET,
	ParseTreeTokenType.CURVED_RIGHT_BRACKET,
	ParseTreeTokenType.SQUARE_LEFT_BRACKET,
	ParseTreeTokenType.SQUARE_RIGHT_BRACKET,
	ParseTreeTokenType.RETURN,
	ParseTreeTokenType.YIELD
]);

export { invalidOperandTokenTypes };