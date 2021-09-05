import { isAnnotationStart } from '../scanning/isAnnotationStart.js';
import { isCharacterLiteralStart } from '../scanning/isCharacterLiteralStart.js';
import { isCommentStart } from '../scanning/isCommentStart.js';
import { isCompleteNumberLiteral } from '../scanning/isCompleteNumberLiteral.js';
import { isIdentifier } from '../scanning/isIdentifier.js';
import { isStringLiteralStart } from '../scanning/isStringLiteralStart.js';
import { Operators } from '../Operators.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const unaryPreviousTypes = new Set([
	ParseTreeTokenType.ANNOTATION,
	ParseTreeTokenType.ASSIGNMENT_OPERATOR,
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.BREAK,
	ParseTreeTokenType.CASE,
	ParseTreeTokenType.COLON,
	ParseTreeTokenType.COMMA,
	ParseTreeTokenType.CURLY_LEFT_BRACKET,
	ParseTreeTokenType.CURVED_LEFT_BRACKET,
	ParseTreeTokenType.IF,
	ParseTreeTokenType.RETURN,
	ParseTreeTokenType.SEMICOLON,
	ParseTreeTokenType.SQUARE_LEFT_BRACKET,
	ParseTreeTokenType.TREE_ROOT,
	ParseTreeTokenType.UNARY_OPERATOR,
	ParseTreeTokenType.WHILE
]);

export const sToTypeMap = new Map([
	[':', ParseTreeTokenType.COLON],
	[',', ParseTreeTokenType.COMMA],
	['{', ParseTreeTokenType.CURLY_LEFT_BRACKET],
	['}', ParseTreeTokenType.CURLY_RIGHT_BRACKET],
	['(', ParseTreeTokenType.CURVED_LEFT_BRACKET],
	[')', ParseTreeTokenType.CURVED_RIGHT_BRACKET],
	['.', ParseTreeTokenType.DOT],
	[':', ParseTreeTokenType.COLON],
	[';', ParseTreeTokenType.SEMICOLON],
	['[', ParseTreeTokenType.SQUARE_LEFT_BRACKET],
	[']', ParseTreeTokenType.SQUARE_RIGHT_BRACKET],
	['=>', ParseTreeTokenType.FAT_ARROW],
	['abstract', ParseTreeTokenType.ABSTRACT],
	['break', ParseTreeTokenType.BREAK],
	['case', ParseTreeTokenType.CASE],
	['class', ParseTreeTokenType.CLASS],
	['def', ParseTreeTokenType.DEF],
	['else', ParseTreeTokenType.ELSE],
	['extends', ParseTreeTokenType.EXTENDS],
	['false', ParseTreeTokenType.BOOLEAN_LITERAL],
	['for', ParseTreeTokenType.FOR],
	['if', ParseTreeTokenType.IF],
	['import', ParseTreeTokenType.IMPORT],
	['lazy', ParseTreeTokenType.LAZY],
	['match', ParseTreeTokenType.MATCH],
	['new', ParseTreeTokenType.NEW],
	['object', ParseTreeTokenType.OBJECT],
	['override', ParseTreeTokenType.OVERRIDE],
	['return', ParseTreeTokenType.RETURN],
	['true', ParseTreeTokenType.BOOLEAN_LITERAL],
	['using', ParseTreeTokenType.USING],
	['val', ParseTreeTokenType.VAL],
	['var', ParseTreeTokenType.VAR],
	['while', ParseTreeTokenType.WHILE],
	['yield', ParseTreeTokenType.YIELD],
]);

const typeChecks = [
	[isAnnotationStart,	ParseTreeTokenType.ANNOTATION],
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
		if (previousTokenType === ParseTreeTokenType.DEF)
			return ParseTreeTokenType.IDENTIFIER;
			// could be operator overloading like def +(that: Complex) in a class definition
			// The following are also possible:
			// def && (x: => Boolean): Boolean 
			// def || (x: => Boolean): Boolean

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