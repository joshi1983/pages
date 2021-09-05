import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';

const mixedParentTypes = new Set([
	ParseTreeTokenType.ARRAY,
]);

export function validateMixed(token, parseLogger) {
	const children = token.children;
	if (token.val !== 'mixed')
		parseLogger.error(`Expected val to be mixed but found ${token.val}`, token);
	if (!mixedParentTypes.has(token.parentNode.type))
		parseLogger.error(`Expected parent of MIXED to be ${Array.from(mixedParentTypes).map(t => ParseTreeTokenType.getNameFor(t)).join(',')} but got ${ParseTreeTokenType.getNameFor(token.parentNode.type)}`, token);
};