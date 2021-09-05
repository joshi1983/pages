import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateEndIf(token, parseLogger) {
	const parent = token.parentNode;
	if (parent.type !== ParseTreeTokenType.IF)
		parseLogger.error(`Expected parent of END_IF to be IF but found ${ParseTreeTokenType.getNameFor(parent.type)}`, token);
	const children = token.children;
	if (children.length > 2)
		parseLogger.error(`Expected at most 2 children of an END_IF but found ${children.length}`, token);
};