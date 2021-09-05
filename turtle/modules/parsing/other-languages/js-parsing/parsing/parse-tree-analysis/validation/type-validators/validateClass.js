import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateClass(token, parseLogger) {
	const children = token.children;
	if (children.length !== 2) {
		parseLogger.error(`Expected class token to have 2 children but found ${children.length}`, token);
	}
	else {
		const firstChild = children[0];
		const lastChild = children[1];
		if (firstChild.type !== ParseTreeTokenType.IDENTIFIER)
			parseLogger.error(`Expected first child of CLASS token to be an IDENTIFIER but found type ${ParseTreeTokenType.getNameFor(firstChild.type)}`, token);
		if (lastChild.type !== ParseTreeTokenType.CLASS_BODY)
			parseLogger.error(`Expected second child of CLASS to be a CLASS_BODY but got type ${ParseTreeTokenType.getNameFor(lastChild.type)}`, token);
	}
};