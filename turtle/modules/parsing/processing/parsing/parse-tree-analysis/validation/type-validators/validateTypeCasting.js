import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const secondTypes = new Set([
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.IDENTIFIER
]);

export function validateTypeCasting(token, parseLogger) {
	const children = token.children;
	if (children.length !== 2) {
		parseLogger.error(`Expected 2 children of TYPE_CASTING but got ${children.length}`, token);
		return;
	}
	const first = children[0];
	const last = children[1];
	if (first.type !== ParseTreeTokenType.CURVED_BRACKET_EXPRESSION)
		parseLogger.error(`Expected first child of TYPE_CASTING to be a CURVED_BRACKET_EXPRESSION but got ${ParseTreeTokenType.getNameFor(first.type)}`, token);
	if (!secondTypes.has(last.type))
		parseLogger.error(`Expected last child of TYPE_CASTING to be a ${Array.from(secondTypes).map(t => ParseTreeTokenType.getNameFor(t)).join(',')} but got ${ParseTreeTokenType.getNameFor(last.type)}`, token);
};