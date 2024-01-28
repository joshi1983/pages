import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateAsync(token, parseLogger) {
	const children = token.children;
	if (children.length !== 1)
		parseLogger.error(`Expected ASYNC token to have 1 child but found ${children.length}`, token);
};