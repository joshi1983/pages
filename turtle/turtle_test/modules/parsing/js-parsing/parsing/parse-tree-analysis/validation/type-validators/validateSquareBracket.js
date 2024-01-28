import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const parentTypes = new Set([
	ParseTreeTokenType.ARRAY_LITERAL,
	ParseTreeTokenType.INDEX_EXPRESSION
]);

export function validateSquareBracket(token, parseLogger) {
	if (!parentTypes.has(token.parentNode.type))
		parseLogger.error(`Expected ${ParseTreeTokenType.getNameFor(token.type)} to have a parent in the types ${Array.from(parentTypes).map(t => ParseTreeTokenType.getNameFor(t))} but got a parent with type ${ParseTreeTokenType.getNameFor(token.parentNode.type)}`, token);
};