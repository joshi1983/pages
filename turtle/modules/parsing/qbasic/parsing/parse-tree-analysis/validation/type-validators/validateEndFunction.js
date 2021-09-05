import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateEndFunction(token, parseLogger) {
	const parent = token.parentNode;
	if (parent.type !== ParseTreeTokenType.FUNCTION)
		parseLogger.error(`Expected parent of END_FUNCTION to be FUNCTION but found ${ParseTreeTokenType.getNameFor(parent.type)}`, token);
	const children = token.children;
	if (children.length > 2)
		parseLogger.error(`Expected at most 2 children of an END_FUNCTION but found ${children.length}`, token);
};