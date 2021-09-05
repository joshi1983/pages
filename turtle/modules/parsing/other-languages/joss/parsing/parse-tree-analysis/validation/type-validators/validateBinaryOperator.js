import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const badChildTypes = new Set([
	ParseTreeTokenType.COLON,
	ParseTreeTokenType.COMMA,
	ParseTreeTokenType.CURVED_LEFT_BRACKET,
	ParseTreeTokenType.CURVED_RIGHT_BRACKET,
	ParseTreeTokenType.LET,
	ParseTreeTokenType.PERIOD,
	ParseTreeTokenType.PIPE,
	ParseTreeTokenType.SEMICOLON,
	ParseTreeTokenType.SET,
	ParseTreeTokenType.SQUARE_LEFT_BRACKET,
	ParseTreeTokenType.SQUARE_RIGHT_BRACKET,
]);

export function validateBinaryOperator(token, parseLogger) {
	if (token.children.length !== 2) {
		parseLogger.error(`Expected a BINARY_OPERATOR to have 2 children but found ${token.children.length}`, token);
	}
	token.children.forEach(function(child) {
		if (badChildTypes.has(child.type))
			parseLogger.error(`Expected a BINARY_OPERATOR to not have a child of type ${ParseTreeTokenType.getNameFor(child.type)}`, token);
	});
};