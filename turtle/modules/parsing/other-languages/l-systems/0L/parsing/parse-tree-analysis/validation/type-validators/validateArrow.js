import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateArrow(token, parseLogger) {
	const children = token.children;
	if (children.length !== 2)
		parseLogger.error(`Expected 2 children for an ARROW token but found ${children.length}`, token);
	else {
		const first = children[0];
		if (first.type !== ParseTreeTokenType.IDENTIFIER)
			parseLogger.error(`Expected first child of an ARROW to be an IDENTIFIER but found ${ParseTreeTokenType.getNameFor(first.type)}`, first);
	}
};