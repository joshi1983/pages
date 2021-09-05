import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const goodChildTypes = new Set([
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.COLOR_LITERAL,
	ParseTreeTokenType.COMMA,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.FUNCTION_CALL,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.NUMBER_UNIT_LITERAL,
	ParseTreeTokenType.STRING_LITERAL
]);

export function validateValueToken(token, parseLogger) {
	if (token.children.length === 0)
		parseLogger.error(`VALUE token should have at least 1 child but found 0`, token);
	for (const child of token.children) {
		if (!goodChildTypes.has(child.type)) {
			parseLogger.error(`VALUE token should have children of types ${Array.from(goodChildTypes).map(t => ParseTreeTokenType.getNameFor(t)).join(',')} but found ${ParseTreeTokenType.getNameFor(child.type)}`, child);
		}
	}
};