import { checkFirstAndLastVal } from './checkFirstAndLastVal.js';
import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const goodParentTypes = new Set([
	ParseTreeTokenType.ARGUMENT_LIST,
	ParseTreeTokenType.ASSIGNMENT_OPERATOR,
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.EXCEPT,
	ParseTreeTokenType.LIST_LITERAL,
	ParseTreeTokenType.TUPLE_LITERAL,
	ParseTreeTokenType.UNARY_OPERATOR
]);

export function validateTupleLiteral(token, parseLogger) {
	const parent = token.parentNode;
	if (!goodParentTypes.has(parent.type))
		parseLogger.error(`A TUPLE_LITERAL should not have a parent of type ${ParseTreeTokenType.getNameFor(parent.type)}`, token);
	checkFirstAndLastVal(token, '(', ')', parseLogger);
};