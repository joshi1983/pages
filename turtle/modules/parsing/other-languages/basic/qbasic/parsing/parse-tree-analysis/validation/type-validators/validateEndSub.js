import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateEndSub(token, parseLogger) {
	const parent = token.parentNode;
	if (parent.type !== ParseTreeTokenType.SUB)
		parseLogger.error(`Expected parent of END_SUB to be SUB but found ${ParseTreeTokenType.getNameFor(parent.type)}`, token);
	const children = token.children;
	if (children.length > 2)
		parseLogger.error(`Expected at most 2 children of an END_SUB but found ${children.length}`, token);
};