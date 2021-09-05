import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const goodParentTypes = new Set([
	ParseTreeTokenType.ARG_LIST,
	ParseTreeTokenType.CASE,
	ParseTreeTokenType.CONST,
	ParseTreeTokenType.DEF_PRIMITIVE,
	ParseTreeTokenType.DIM,
	ParseTreeTokenType.NEXT,
	ParseTreeTokenType.SHARED,
	ParseTreeTokenType.TUPLE_LITERAL,
	ParseTreeTokenType.TYPE
]);

export function validateComma(token, parseLogger) {
	const parent = token.parentNode;
	if (!goodParentTypes.has(parent.type)) {
		parseLogger.error(`Expected COMMA to not have a parent of type ${ParseTreeTokenType.getNameFor(parent.type)}`, token);
	}
};