import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateExcept(token, parseLogger) {
	const parent = token.parentNode;
	if (parent.type !== ParseTreeTokenType.TRY)
		parseLogger.error(`An EXCEPT should not have a parent of type ${ParseTreeTokenType.getNameFor(parent.type)}`, token);
	const children = token.children;
	if (children.length < 2) {
		parseLogger.error(`EXCEPT should have at least 2 children but found ${children.length}.`, token);
	}
};