import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateNext(token, parseLogger) {
	const children = token.children;
	if (children.length > 1) {
		parseLogger.error(`Expected a NEXT to have 0 or 1 children but found ${children.length}`, token);
	}
	else if (children.length === 1) {
		const child = children[0];
		if (child.type !== ParseTreeTokenType.IDENTIFIER)
			parseLogger.error(`Expected a NEXT to have a child of type IDENTIFIER but found ${ParseTreeTokenType.getNameFor(child.type)}`, child);
	}
};