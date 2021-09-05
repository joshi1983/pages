import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const goodParentTypes = new Set([
	ParseTreeTokenType.ARGUMENT_LIST,
	ParseTreeTokenType.COMMA_EXPRESSION,
	ParseTreeTokenType.GLOBAL,
	ParseTreeTokenType.LIST_LITERAL,
	ParseTreeTokenType.TUPLE_LITERAL,
]);

export function validateComma(token, parseLogger) {
	const parent = token.parentNode;
	if (!goodParentTypes.has(parent.type))
		parseLogger.error(`A COMMA should not have a parent of type ${ParseTreeTokenType.getNameFor(parent.type)}`, token);
};