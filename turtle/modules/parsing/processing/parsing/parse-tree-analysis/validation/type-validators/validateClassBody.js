import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateClassBody(token, parseLogger) {
	const children = token.children;
	if (token.parentNode.type !== ParseTreeTokenType.CLASS)
		parseLogger.error(`Expected parent to be a CLASS but found ${ParseTreeTokenType.getNameFor(token.parentNode.type)}`, token);
	if (children.length < 2)
		parseLogger.error(`Expected at least 2 children but found ${children.length}`, token);
	else {
		const firstChild = children[0];
		const lastChild = children[children.length - 1];
		if (firstChild.type !== ParseTreeTokenType.CURLY_LEFT_BRACKET)
			parseLogger.error(`Expected first child to be of type CURLY_LEFT_BRACKET but found ${ParseTreeTokenType.getNameFor(firstChild.type)}`, token);
		if (lastChild.type !== ParseTreeTokenType.CURLY_RIGHT_BRACKET)
			parseLogger.error(`Expected last child to be of type CURLY_RIGHT_BRACKET but found ${ParseTreeTokenType.getNameFor(firstChild.type)}`, token);
	}
};