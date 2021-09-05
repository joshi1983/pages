import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

const typesWithNoChildren = new Set([
	ParseTreeTokenType.ANGLE_LEFT_BRACKET,
	ParseTreeTokenType.ANGLE_RIGHT_BRACKET,
	ParseTreeTokenType.COMMA,
	ParseTreeTokenType.CURLY_LEFT_BRACKET,
	ParseTreeTokenType.CURLY_RIGHT_BRACKET,
	ParseTreeTokenType.CURVED_LEFT_BRACKET,
	ParseTreeTokenType.CURVED_RIGHT_BRACKET,
	ParseTreeTokenType.SQUARE_LEFT_BRACKET,
	ParseTreeTokenType.SQUARE_RIGHT_BRACKET,
]);

export function validateNoChildrenTokens(tokens, parseLogger) {
	for (const token of tokens) {
		if (typesWithNoChildren.has(token.type) && token.children.length !== 0) {
			parseLogger.error(`No children expected for token type ${ParseTreeTokenType.getNameFor(token.type)} but found ${token.children.length}`, token);
		}
	}
};