import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const parentTypes = new Set([
	ParseTreeTokenType.CLASS_BODY,
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.CURLY_BRACKET_EXPRESSION
]);

export function validateCurlyBracket(token, parseLogger) {
	if (!parentTypes.has(token.parentNode.type))
		parseLogger.error(`Expected ${ParseTreeTokenType.getNameFor(token.type)} to have a parent in the types ${Array.from(parentTypes).map(t => ParseTreeTokenType.getNameFor(t))} but got a parent with type ${ParseTreeTokenType.getNameFor(token.parentNode.type)}`, token);
};