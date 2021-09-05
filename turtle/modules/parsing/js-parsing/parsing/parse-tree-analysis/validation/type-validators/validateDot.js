import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const parentTypes = new Set([
	ParseTreeTokenType.EXPRESSION_DOT,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.REGULAR_EXPRESSION_LITERAL,
	ParseTreeTokenType.STRING_LITERAL,
	ParseTreeTokenType.TEMPLATE_LITERAL,
	ParseTreeTokenType.THIS,
]);

export function validateDot(token, parseLogger) {
	if (!parentTypes.has(token.parentNode.type))
		parseLogger.error(`Expected the parent of a DOT to be from ${Array.from(parentTypes).map(t => ParseTreeTokenType.getNameFor(t)).join(',')} but found parent type ${ParseTreeTokenType.getNameFor(token.parentNode.type)}`, token);
};