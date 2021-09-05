import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateWhile(token, parseLogger) {
	const children = token.children;
	const parent = token.parentNode;
	if (children.length === 0 &&
	parent.type !== ParseTreeTokenType.EXIT)
		parseLogger.error(`WHILE should have at least 1 child but found none`, token);
};