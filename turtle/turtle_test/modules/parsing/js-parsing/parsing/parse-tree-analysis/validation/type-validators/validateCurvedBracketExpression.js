import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const badChildTypes = new Set([
	ParseTreeTokenType.COMMA,
	ParseTreeTokenType.COLON,
	ParseTreeTokenType.CURLY_LEFT_BRACKET,
	ParseTreeTokenType.CURLY_RIGHT_BRACKET,
	ParseTreeTokenType.SEMICOLON,
	ParseTreeTokenType.SQUARE_LEFT_BRACKET,
	ParseTreeTokenType.SQUARE_RIGHT_BRACKET
]);

export function validateCurvedBracketExpression(token, parseLogger) {
	const children = token.children;
	if (children.length !== 3)
		parseLogger.error(`Expected 3 children in curved bracket expression but found only ${children.length}`, token);
	else {
		const firstChild = children[0];
		const middleChild = children[1];
		const lastChild = children[children.length - 1];
		if (firstChild.type !== ParseTreeTokenType.CURVED_LEFT_BRACKET)
			parseLogger.error(`Expected first child to be of type CURVED_LEFT_BRACKET but found ${ParseTreeTokenType.getNameFor(firstChild.type)}`, token);
		if (lastChild.type !== ParseTreeTokenType.CURVED_RIGHT_BRACKET)
			parseLogger.error(`Expected last child to be of type CURVED_RIGHT_BRACKET but found ${ParseTreeTokenType.getNameFor(lastChild.type)}`, token);
		if (badChildTypes.has(middleChild.type))
			parseLogger.error(`Expected middle child of CURVED_BRACKET_EXPRESSION to not be of type ${ParseTreeTokenType.getNameFor(middleChild.type)}`, token);
	}
};