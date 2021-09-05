import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const withParentTypes = new Set([
	ParseTreeTokenType.CLASS
]);

export function validateWith(token, parseLogger) {
	const parent = token.parentNode;
	const children = token.children;
	if (!withParentTypes.has(parent.type))
		parseLogger.error(`Did not expect WITH to have a parent of type ${ParseTreeTokenType.getNameFor(parent.type)}`, token);
	if (children.length !== 1)
		parseLogger.error(`Expected WITH token to have 1 child but found ${children.length}`, token);
};