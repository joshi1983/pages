import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateWend(token, parseLogger) {
	const children = token.children;
	if (children.length !== 0)
		parseLogger.error(`Expected WEND to have no children but found ${children.length}`, token);
	const parent = token.parentNode;
	if (parent !== null && parent.type !== ParseTreeTokenType.WHILE)
		parseLogger.error(`Expected parent of a WEND to be a WHILE but found a parent of type ${ParseTreeTokenType.getNameFor(parent.type)}`, token);
};