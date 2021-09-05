import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const elseParentTypes = new Set([
	ParseTreeTokenType.ELSE,
	ParseTreeTokenType.IF,
]);

export function validateElse(token, parseLogger) {
	const children = token.children;
	if (token.val !== 'else')
		parseLogger.error(`Expected val to be else but found ${token.val}`, token);
	if (children.length < 1)
		parseLogger.error(`Expected at least 1 child but found ${children.length}`, token);
	if (!elseParentTypes.has(token.parentNode.type))
		parseLogger.error(`Expected parent of ELSE to be ${Array.from(elseParentTypes).map(t => ParseTreeTokenType.getNameFor(t)).join(',')} but got ${ParseTreeTokenType.getNameFor(token.parentNode.type)}`, token);
};