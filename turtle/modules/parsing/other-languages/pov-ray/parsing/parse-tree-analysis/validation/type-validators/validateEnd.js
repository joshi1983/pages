import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';

const endParentTypes = new Set([
	ParseTreeTokenType.IF,
	ParseTreeTokenType.IFDEF,
	ParseTreeTokenType.IFNDEF,
	ParseTreeTokenType.MACRO,
	ParseTreeTokenType.SWITCH,
	ParseTreeTokenType.WHILE,
]);

export function validateEnd(token, parseLogger) {
	const children = token.children;
	if (token.val !== '#end')
		parseLogger.error(`Expected val to be #end but found ${token.val}`, token);
	if (!endParentTypes.has(token.parentNode.type))
		parseLogger.error(`Expected parent of END to be ${Array.from(endParentTypes).map(t => ParseTreeTokenType.getNameFor(t)).join(',')} but got ${ParseTreeTokenType.getNameFor(token.parentNode.type)}`, token);
};