import { isCharacterLiteralStart } from '../scanning/isCharacterLiteralStart.js';
import { isCommentStart } from '../scanning/isCommentStart.js';
import { isCompleteNumberLiteral } from '../scanning/isCompleteNumberLiteral.js';
import { isIdentifier } from '../scanning/isIdentifier.js';
import { isStringLiteralStart } from '../scanning/isStringLiteralStart.js';
import { Operators } from '../Operators.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const unaryPreviousTypes = new Set([
	ParseTreeTokenType.ASSIGNMENT_OPERATOR,
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.BREAK,
	ParseTreeTokenType.CASE,
	ParseTreeTokenType.COLON,
	ParseTreeTokenType.COMMA,
	ParseTreeTokenType.CURLY_LEFT_BRACKET,
	ParseTreeTokenType.CURVED_LEFT_BRACKET,
	ParseTreeTokenType.DEFAULT,
	ParseTreeTokenType.FOR,
	ParseTreeTokenType.GO,
	ParseTreeTokenType.IF,
	ParseTreeTokenType.RETURN,
	ParseTreeTokenType.SEMICOLON,
	ParseTreeTokenType.SQUARE_LEFT_BRACKET,
	ParseTreeTokenType.SWITCH,
	ParseTreeTokenType.TREE_ROOT,
	ParseTreeTokenType.UNARY_OPERATOR
]);

export const sToTypeMap = new Map([
	[':', ParseTreeTokenType.COLON],
	[',', ParseTreeTokenType.COMMA],
	['{', ParseTreeTokenType.CURLY_LEFT_BRACKET],
	['}', ParseTreeTokenType.CURLY_RIGHT_BRACKET],
	['(', ParseTreeTokenType.CURVED_LEFT_BRACKET],
	[')', ParseTreeTokenType.CURVED_RIGHT_BRACKET],
	['.', ParseTreeTokenType.DOT],
	['...', ParseTreeTokenType.TRIPLE_DOT],
	[';', ParseTreeTokenType.SEMICOLON],
	['[', ParseTreeTokenType.SQUARE_LEFT_BRACKET],
	['~', ParseTreeTokenType.UNDERLYING_TYPE],
	[']', ParseTreeTokenType.SQUARE_RIGHT_BRACKET],
	['break', ParseTreeTokenType.BREAK],
	['case', ParseTreeTokenType.CASE],
	['chan', ParseTreeTokenType.CHAN],
	['const', ParseTreeTokenType.CONST],
	['continue', ParseTreeTokenType.CONTINUE],
	['default', ParseTreeTokenType.DEFAULT],
	['defer', ParseTreeTokenType.DEFER],
	['else', ParseTreeTokenType.ELSE],
	['false', ParseTreeTokenType.BOOLEAN_LITERAL],
	['for', ParseTreeTokenType.FOR],
	['func', ParseTreeTokenType.FUNC],
	['go', ParseTreeTokenType.GO],
	['goto', ParseTreeTokenType.GOTO],
	['if', ParseTreeTokenType.IF],
	['import', ParseTreeTokenType.IMPORT],
	['interface', ParseTreeTokenType.INTERFACE],
	['nil', ParseTreeTokenType.NIL],
	['package', ParseTreeTokenType.PACKAGE],
	['range', ParseTreeTokenType.RANGE],
	['return', ParseTreeTokenType.RETURN],
	['select', ParseTreeTokenType.SELECT],
	['struct', ParseTreeTokenType.STRUCT],
	['switch', ParseTreeTokenType.SWITCH],
	['true', ParseTreeTokenType.BOOLEAN_LITERAL],
	['type', ParseTreeTokenType.TYPE],
	['var', ParseTreeTokenType.VAR]
]);

const typeChecks = [
	[isCharacterLiteralStart, ParseTreeTokenType.CHARACTER_LITERAL],
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
		if (opInfo.isAssignment &&
		(opInfo.unary === undefined || opInfo.unary.isAssignment === true))
			return ParseTreeTokenType.ASSIGNMENT_OPERATOR;
		if (opInfo.isNotBinary === true ||
		(opInfo.unary !== undefined && unaryPreviousTypes.has(previousTokenType) &&
		opInfo.unary.isAssignment !== true))
			return ParseTreeTokenType.UNARY_OPERATOR;
		else {
			if (opInfo.isAssignment)
				return ParseTreeTokenType.ASSIGNMENT_OPERATOR;
				
			return ParseTreeTokenType.BINARY_OPERATOR;
		}
	}
	if (s.startsWith('//'))
		return ParseTreeTokenType.SINGLE_LINE_COMMENT;
	
	for (const [check, type] of typeChecks) {
		if (check(s))
			return type;
	}
	
	return ParseTreeTokenType.UNRECOGNIZED;
};