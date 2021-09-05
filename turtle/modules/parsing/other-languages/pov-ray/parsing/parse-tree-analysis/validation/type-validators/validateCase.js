import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';

const caseParentTypes = new Set([
	ParseTreeTokenType.SWITCH,
]);

export function validateCase(token, parseLogger) {
	const children = token.children;
	if (token.val !== '#case')
		parseLogger.error(`Expected val to be #case but found ${token.val}`, token);
	if (!caseParentTypes.has(token.parentNode.type))
		parseLogger.error(`Expected parent of CASE to be ${Array.from(caseParentTypes).map(t => ParseTreeTokenType.getNameFor(t)).join(',')} but got ${ParseTreeTokenType.getNameFor(token.parentNode.type)}`, token);
};