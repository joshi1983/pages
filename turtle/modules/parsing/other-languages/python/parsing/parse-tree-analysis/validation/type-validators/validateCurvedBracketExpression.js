import { checkFirstAndLastVal } from './checkFirstAndLastVal.js';
import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const goodParentTypes = new Set([
	ParseTreeTokenType.ARGUMENT_LIST,
	ParseTreeTokenType.ASSIGNMENT_OPERATOR,
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.IF_STATEMENT, // someone could have a curved bracket expression in the if-statement's condition.
	ParseTreeTokenType.LIST_LITERAL,
	ParseTreeTokenType.TUPLE_LITERAL,
	ParseTreeTokenType.UNARY_OPERATOR,
	ParseTreeTokenType.WHILE_LOOP, // someone could have a curved bracket expression in the while-loop's condition.
]);

export function validateCurvedBracketExpression(token, parseLogger) {
	const parent = token.parentNode;
	if (!goodParentTypes.has(parent.type))
		parseLogger.error(`A CURVED_BRACKET_EXPRESSION should not have a parent of type ${ParseTreeTokenType.getNameFor(parent.type)}`, token);
	if (parent.type === ParseTreeTokenType.WHILE_LOOP ||
	parent.type === ParseTreeTokenType.IF_STATEMENT) {
		const index = parent.children.indexOf(token);
		if (index !== 0) {
			parseLogger.error(`When a CURVED_BRACKET_EXPRESSION is a direct child of ${ParseTreeTokenType.getNameFor(parent.type)}, the expression should be the first child(index 0) but found it at index ${index}`, token);
		}
	}
	checkFirstAndLastVal(token, '(', ')', parseLogger);
};