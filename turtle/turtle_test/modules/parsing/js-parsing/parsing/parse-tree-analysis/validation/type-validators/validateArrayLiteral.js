import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const badChildTypes = new Set([
	ParseTreeTokenType.COLON,
	ParseTreeTokenType.CURLY_LEFT_BRACKET,
	ParseTreeTokenType.CURLY_RIGHT_BRACKET,
	ParseTreeTokenType.CURVED_LEFT_BRACKET,
	ParseTreeTokenType.CURVED_RIGHT_BRACKET,
	ParseTreeTokenType.SEMICOLON,
	ParseTreeTokenType.SQUARE_LEFT_BRACKET,
	ParseTreeTokenType.SQUARE_RIGHT_BRACKET,
]);

export function validateArrayLiteral(token, parseLogger) {
	const children = token.children;
	if (children.length < 2)
		parseLogger.error(`Expected at least 2 children in array literal but found only ${children.length}`, token);
	else {
		const firstChild = children[0];
		const lastChild = children[children.length - 1];
		if (firstChild.type !== ParseTreeTokenType.SQUARE_LEFT_BRACKET)
			parseLogger.error(`With ARRAY_LITERAL parent, expected first child to be of type SQUARE_LEFT_BRACKET but found ${ParseTreeTokenType.getNameFor(firstChild.type)}`, token);
		if (lastChild.type !== ParseTreeTokenType.SQUARE_RIGHT_BRACKET)
			parseLogger.error(`With ARRAY_LITERAL parent, expected last child to be of type SQUARE_RIGHT_BRACKET but found ${ParseTreeTokenType.getNameFor(lastChild.type)}`, token);
		for (let i = children.length - 2; i >= 1; i--) {
			const child = children[i];
			if (badChildTypes.has(child.type))
				parseLogger.error(`With ARRAY_LITERAL parent, expected child at index ${i} to not be of type ${ParseTreeTokenType.getNameFor(child.type)}`, child);
		}
	}
};