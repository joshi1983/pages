import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateArgList(token, parseLogger) {
	const children = token.children;
	if (children.length < 2)
		parseLogger.error(`Expected at least 2 children in argument list but found only ${children.length}`, token);
	else {
		const firstChild = children[0];
		const lastChild = children[children.length - 1];
		if (firstChild.type !== ParseTreeTokenType.CURVED_LEFT_BRACKET)
			parseLogger.error(`With ARG_LIST parent, expected first child to be of type CURVED_LEFT_BRACKET but found ${ParseTreeTokenType.getNameFor(firstChild.type)}`, token);
		if (lastChild.type !== ParseTreeTokenType.CURVED_RIGHT_BRACKET)
			parseLogger.error(`With ARG_LIST parent, expected last child to be of type CURVED_RIGHT_BRACKET but found ${ParseTreeTokenType.getNameFor(lastChild.type)}`, token);
	}
};