import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateIndexExpression(token, parseLogger) {
	const children = token.children;
	if (children.length < 3)
		parseLogger.error(`Expected at least 3 children but found ${children.length}`, token);
	else {
		const firstChild = children[0];
		const lastChild = children[children.length - 1];
		if (firstChild.type !== ParseTreeTokenType.SQUARE_LEFT_BRACKET)
			parseLogger.error(`Expected first child to be of type SQUARE_LEFT_BRACKET but found ${ParseTreeTokenType.getNameFor(firstChild.type)}`, token);
		if (lastChild.type !== ParseTreeTokenType.SQUARE_RIGHT_BRACKET)
			parseLogger.error(`Expected last child to be of type SQUARE_RIGHT_BRACKET but found ${ParseTreeTokenType.getNameFor(firstChild.type)}`, token);
	}
};