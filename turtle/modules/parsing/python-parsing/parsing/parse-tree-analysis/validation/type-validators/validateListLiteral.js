import { checkFirstAndLastVal } from './checkFirstAndLastVal.js';
import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const goodParentTypes = new Set([
	ParseTreeTokenType.ARGUMENT_LIST,
	ParseTreeTokenType.ASSIGNMENT_OPERATOR,
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.FOR_LOOP,
	ParseTreeTokenType.LIST_LITERAL,
	ParseTreeTokenType.SUBSCRIPT_EXPRESSION,
	ParseTreeTokenType.TUPLE_LITERAL
]);

export function validateListLiteral(token, parseLogger) {
	const parent = token.parentNode;
	if (!goodParentTypes.has(parent.type))
		parseLogger.error(`A LIST_LITERAL should not have a parent of type ${ParseTreeTokenType.getNameFor(parent.type)}`, token);
	checkFirstAndLastVal(token, '[', ']', parseLogger);
};