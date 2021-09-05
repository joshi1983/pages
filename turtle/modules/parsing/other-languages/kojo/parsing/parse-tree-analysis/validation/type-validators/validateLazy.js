import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';

export function validateLazy(token, parseLogger) {
	const children = token.children;
	if (children.length !== 1) {
		parseLogger.error(`LAZY should have 1 child but found ${children.length}`, token);
		return;
	}
	const firstChild = children[0];
	if (firstChild.type !== ParseTreeTokenType.VAL)
		parseLogger.error(`LAZY should have a child of type VAL but found ${ParseTreeTokenType.getNameFor(firstChild.type)}`, token);
};