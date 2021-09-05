import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateEndSelect(token, parseLogger) {
	const parent = token.parentNode;
	if (parent.type !== ParseTreeTokenType.SELECT)
		parseLogger.error(`Expected parent of END_SELECT to be SELECT but found ${ParseTreeTokenType.getNameFor(parent.type)}`, token);
	const children = token.children;
	if (children.length > 2)
		parseLogger.error(`Expected at most 2 children of an END_SELECT but found ${children.length}`, token);
};