import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateSub(token, parseLogger) {
	const parent = token.parentNode;
	const children = token.children;
	if (children.length === 0) {
		if (parent.type !== ParseTreeTokenType.END_SUB &&
		parent.type !== ParseTreeTokenType.EXIT) {
			parseLogger.error(`When a SUB has no children, the parent should be an END_SUB or EXIT but found parent with type ${ParseTreeTokenType.getNameFor(parent.type)}`, token);
		}
	}
	else {
		const firstChild = children[0];
		if (firstChild.type !== ParseTreeTokenType.IDENTIFIER)
			parseLogger.error(`Expected first child to be an IDENTIFIER but found ${ParseTreeTokenType.getNameFor(firstChild.type)}`, token);
	}
};