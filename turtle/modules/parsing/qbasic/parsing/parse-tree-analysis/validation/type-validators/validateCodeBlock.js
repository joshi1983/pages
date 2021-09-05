import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const badChildTypes = new Set([
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.COMMA,
	ParseTreeTokenType.CURVED_LEFT_BRACKET,
	ParseTreeTokenType.CURVED_RIGHT_BRACKET,
	ParseTreeTokenType.END,
	ParseTreeTokenType.END_FUNCTION,
	ParseTreeTokenType.END_IF,
	ParseTreeTokenType.END_TYPE,
	ParseTreeTokenType.NEXT,
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.ON,
	ParseTreeTokenType.SEMICOLON,
	ParseTreeTokenType.SQUARE_LEFT_BRACKET,
	ParseTreeTokenType.SQUARE_RIGHT_BRACKET,
	ParseTreeTokenType.STRING_LITERAL,
	ParseTreeTokenType.UNTIL,
	ParseTreeTokenType.WEND,
]);

export function validateCodeBlock(token, parseLogger) {
	token.children.forEach(function(child) {
		if (badChildTypes.has(child.type)) {
			parseLogger.error(`Expected a CODE_BLOCK to not have a child of type ${ParseTreeTokenType.getNameFor(child.type)}`, token);
		}
	});
};