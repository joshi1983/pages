import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const parentTypes = new Set([
	ParseTreeTokenType.ARG_LIST,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.FOR_LOOP_SETTINGS
]);

export function validateCurvedBracket(token, parseLogger) {
	if (!parentTypes.has(token.parentNode.type))
		parseLogger.error(`Expected ${ParseTreeTokenType.getNameFor(token.type)} to have a parent in the types ${Array.from(parentTypes).map(t => ParseTreeTokenType.getNameFor(t))} but got a parent with type ${ParseTreeTokenType.getNameFor(token.parentNode.type)}`, token);
};