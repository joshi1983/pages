import { formatBinaryOperator } from './formatBinaryOperator.js';
import { formatCurvedBracketExpression } from './formatCurvedBracketExpression.js';
import { formatLeaf } from './formatLeaf.js';
import { formatList } from './formatList.js';
import { formatPrefixed } from './formatPrefixed.js';
import { formatProcedure } from './formatProcedure.js';
import { formatUnaryOperator } from './formatUnaryOperator.js';
import { formatUsingToString } from './formatUsingToString.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';

const formatters = new Map([
	[ParseTreeTokenType.BINARY_OPERATOR, formatBinaryOperator],
	[ParseTreeTokenType.BOOLEAN_LITERAL, formatUsingToString],
	[ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, formatCurvedBracketExpression],
	[ParseTreeTokenType.LEAF, formatLeaf],
	[ParseTreeTokenType.LIST, formatList],
	[ParseTreeTokenType.LONG_STRING_LITERAL, formatUsingToString],
	[ParseTreeTokenType.NUMBER_LITERAL, formatUsingToString],
	[ParseTreeTokenType.PARAMETERIZED_GROUP, formatPrefixed],
	[ParseTreeTokenType.PROCEDURE_START_KEYWORD, formatProcedure],
	[ParseTreeTokenType.STRING_LITERAL, formatUsingToString],
	[ParseTreeTokenType.UNARY_OPERATOR, formatUnaryOperator],
	[ParseTreeTokenType.VARIABLE_READ, formatUsingToString],
]);

export function formatToken(token, logger) {
	const formatter = formatters.get(token.type);
	if (formatter !== undefined)
		formatter(token, logger);
	else if ([ParseTreeTokenType.PROCEDURE_END_KEYWORD].indexOf(token.type) !== -1)
		logger.log(token.val.toLowerCase(), token);
	else if (ParseTreeTokenType.NEW_LINE === token.type) {
		// ignore new lines.
		// new lines are part of the formatting we're controlling so we don't want to add them just because they were in the input.
	}
	else {
		console.error('Unrecognized type: ' + ParseTreeTokenType.getNameFor(token.type));
	}
};