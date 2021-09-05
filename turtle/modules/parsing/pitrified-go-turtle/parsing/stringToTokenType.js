import { isCommentStart } from '../scanning/isCommentStart.js';
import { isCompleteNumberLiteral } from '../scanning/isCompleteNumberLiteral.js';
import { isIdentifier } from '../scanning/isIdentifier.js';
import { isStringLiteralStart } from '../scanning/isStringLiteralStart.js';
import { Operators } from '../Operators.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const unaryPreviousTypes = new Set([
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.COLON,
	ParseTreeTokenType.COMMA,
	ParseTreeTokenType.CURLY_LEFT_BRACKET,
	ParseTreeTokenType.CURVED_LEFT_BRACKET,
	ParseTreeTokenType.FOR,
	ParseTreeTokenType.GO,
	ParseTreeTokenType.IF,
	ParseTreeTokenType.SEMICOLON,
	ParseTreeTokenType.SQUARE_LEFT_BRACKET,
	ParseTreeTokenType.UNARY_OPERATOR,
	ParseTreeTokenType.WHILE
]);

const sToTypeMap = new Map([
	[':', ParseTreeTokenType.COLON],
	[',', ParseTreeTokenType.COMMA],
	['{', ParseTreeTokenType.CURLY_LEFT_BRACKET],
	['}', ParseTreeTokenType.CURLY_RIGHT_BRACKET],
	['(', ParseTreeTokenType.CURVED_LEFT_BRACKET],
	[')', ParseTreeTokenType.CURVED_RIGHT_BRACKET],
	['.', ParseTreeTokenType.DOT],
	[';', ParseTreeTokenType.SEMICOLON],
	['[', ParseTreeTokenType.SQUARE_LEFT_BRACKET],
	[']', ParseTreeTokenType.SQUARE_RIGHT_BRACKET],
	['case', ParseTreeTokenType.CASE],
	['else', ParseTreeTokenType.ELSE],
	['false', ParseTreeTokenType.BOOLEAN_LITERAL],
	['for', ParseTreeTokenType.FOR],
	['func', ParseTreeTokenType.FUNC],
	['go', ParseTreeTokenType.GO],
	['if', ParseTreeTokenType.IF],
	['import', ParseTreeTokenType.IMPORT],
	['nil', ParseTreeTokenType.NIL],
	['package', ParseTreeTokenType.PACKAGE],
	['range', ParseTreeTokenType.RANGE],
	['switch', ParseTreeTokenType.SWITCH],
	['true', ParseTreeTokenType.BOOLEAN_LITERAL],
	['var', ParseTreeTokenType.VAR],
	['while', ParseTreeTokenType.WHILE],
]);

const typeChecks = [
	[isCommentStart, ParseTreeTokenType.MULTI_LINE_COMMENT],
	[isCompleteNumberLiteral, ParseTreeTokenType.NUMBER_LITERAL],
	[isIdentifier, ParseTreeTokenType.IDENTIFIER],
	[isStringLiteralStart, ParseTreeTokenType.STRING_LITERAL],
];

export function stringToTokenType(s, previousTokenType) {
	let type = sToTypeMap.get(s);
	if (type !== undefined)
		return type;

	const opInfo = Operators.getOperatorInfo(s);
	if (opInfo !== undefined) {
		if (opInfo.isAssignment)
			return ParseTreeTokenType.ASSIGNMENT_OPERATOR;
		if (opInfo.isNotBinary === true ||
		(opInfo.unary !== undefined && unaryPreviousTypes.has(previousTokenType)))
			return ParseTreeTokenType.UNARY_OPERATOR;
		else
			return ParseTreeTokenType.BINARY_OPERATOR
	}
	if (s.startsWith('//'))
		return ParseTreeTokenType.SINGLE_LINE_COMMENT;
	
	for (const [check, type] of typeChecks) {
		if (check(s))
			return type;
	}
	
	return ParseTreeTokenType.UNRECOGNIZED;
};