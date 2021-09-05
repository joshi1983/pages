import { isIdentifier } from './scanning/isIdentifier.js';
import { isMultilineCommentStart } from './scanning/isMultilineCommentStart.js';
import { isNumberLiteralStart } from './scanning/isNumberLiteralStart.js';
import { isStringLiteralStart } from './scanning/isStringLiteralStart.js';
import { Operators } from './Operators.js';
import { ParseTreeToken } from '../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from './ParseTreeTokenType.js';

const sTypeMap = new Map([
	['array', ParseTreeTokenType.CONTAINER_TYPE],
	['assert', ParseTreeTokenType.ASSERT],
	['body', ParseTreeTokenType.BODY],
	['case', ParseTreeTokenType.CASE],
	['class', ParseTreeTokenType.CLASS],
	['const', ParseTreeTokenType.CONST],
	['deferred', ParseTreeTokenType.DEFERRED],
	['else', ParseTreeTokenType.ELSE],
	['elsif', ParseTreeTokenType.ELSIF],
	['end', ParseTreeTokenType.END],
	['exit', ParseTreeTokenType.EXIT],
	['export', ParseTreeTokenType.EXPORT],
	['external', ParseTreeTokenType.EXTERNAL],
	['false', ParseTreeTokenType.BOOLEAN_LITERAL],
	['for', ParseTreeTokenType.FOR],
	['fork', ParseTreeTokenType.FORK],
	['function', ParseTreeTokenType.FUNCTION],
	['if', ParseTreeTokenType.IF],
	['implement', ParseTreeTokenType.IMPLEMENT],
	['label', ParseTreeTokenType.LABEL],
	['loop', ParseTreeTokenType.LOOP],
	['module', ParseTreeTokenType.MODULE],
	['nil', ParseTreeTokenType.NIL],
	['of', ParseTreeTokenType.OF],
	['post', ParseTreeTokenType.ASSERT], // "pre" is basically "assert" but should only be at the start of functions, procedures, processes...
	['pre', ParseTreeTokenType.ASSERT], // "post" is like "pre" except at the end of functions, procedures...
	['procedure', ParseTreeTokenType.PROCEDURE],
	['process', ParseTreeTokenType.PROCESS],
	['record', ParseTreeTokenType.RECORD],
	['result', ParseTreeTokenType.RESULT],
	['return', ParseTreeTokenType.RETURN],
	['set', ParseTreeTokenType.CONTAINER_TYPE],
	['then', ParseTreeTokenType.THEN],
	['true', ParseTreeTokenType.BOOLEAN_LITERAL],
	['type', ParseTreeTokenType.TYPE],
	['unit', ParseTreeTokenType.UNIT],
	['union', ParseTreeTokenType.UNION],
	['var', ParseTreeTokenType.VAR],
	['when', ParseTreeTokenType.WHEN],
	['.', ParseTreeTokenType.DOT],
	[',', ParseTreeTokenType.COMMA],
	[':', ParseTreeTokenType.COLON],
	[':=', ParseTreeTokenType.ASSIGNMENT_OPERATOR],
	[';', ParseTreeTokenType.SEMICOLON],
	['{', ParseTreeTokenType.CURLY_LEFT_BRACKET],
	['}', ParseTreeTokenType.CURLY_RIGHT_BRACKET], 
		// not sure if Turing uses {} at all as I write this comment.
		// I'm treating them as potential token types anyway because many other programming languages 
		// give them clear meanings.
		
	['(', ParseTreeTokenType.CURVED_LEFT_BRACKET],
	[')', ParseTreeTokenType.CURVED_RIGHT_BRACKET],
	['[', ParseTreeTokenType.SQUARE_LEFT_BRACKET],
	[']', ParseTreeTokenType.SQUARE_RIGHT_BRACKET],
]);

export function toMapKey(s) {
	return s.toLowerCase().replace(/\s+/g, ' ').trim();
};

for (const info of Operators.getAll()) {
	if (info.isAssignment) {
		sTypeMap.set(toMapKey(info.symbol), ParseTreeTokenType.ASSIGNMENT_OPERATOR);
	}
	else if (info.unary !== undefined && info.isNotBinary)
		sTypeMap.set(toMapKey(info.symbol), ParseTreeTokenType.UNARY_OPERATOR);
}

const specialValues = Array.from(sTypeMap.keys());
export { specialValues };

const unaryPreviousTypes = new Set([
	ParseTreeTokenType.ASSIGNMENT_OPERATOR,
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.COLON,
	ParseTreeTokenType.COMMA,
	ParseTreeTokenType.CONTAINER_TYPE,
	ParseTreeTokenType.CURLY_LEFT_BRACKET,
	ParseTreeTokenType.CURVED_LEFT_BRACKET,
	ParseTreeTokenType.DOT,
	ParseTreeTokenType.SEMICOLON,
	ParseTreeTokenType.SQUARE_LEFT_BRACKET,
	ParseTreeTokenType.TREE_ROOT,
	ParseTreeTokenType.UNARY_OPERATOR,
	ParseTreeTokenType.WHEN
]);

export function scanTokenToParseTreeToken(token, previousType) {
	if (token === undefined)
		return undefined;
	let type = sTypeMap.get(toMapKey(token.s));
	if (token.s === '*' &&
	unaryPreviousTypes.has(previousType))
		type = ParseTreeTokenType.END_MATCH_SYMBOL;
	else if (previousType === ParseTreeTokenType.FOR &&
		token.s.toLowerCase() === 'decreasing')
		type = ParseTreeTokenType.DECREASING;
	if (type === undefined) {

		const info = Operators.getOperatorInfo(token.s);
		if (isStringLiteralStart(token.s))
			type = ParseTreeTokenType.STRING_LITERAL;
		else if (token.s[0] === '%')
			type = ParseTreeTokenType.SINGLE_LINE_COMMENT;
		else if (isMultilineCommentStart(token.s))
			type = ParseTreeTokenType.MULTI_LINE_COMMENT;
		else if (info !== undefined) {
			if (info.isNotBinary ||
			(info.unary !== undefined && unaryPreviousTypes.has(previousType)))
				type = ParseTreeTokenType.UNARY_OPERATOR;
			else
				type = ParseTreeTokenType.BINARY_OPERATOR;
		}
		else if (isNumberLiteralStart(token.s))
			type = ParseTreeTokenType.NUMBER_LITERAL;
		else if (isIdentifier(token.s))
			type = ParseTreeTokenType.IDENTIFIER;
		else {
			type = ParseTreeTokenType.UNRECOGNIZED;
		}
	}
	let originalString;
	
	return new ParseTreeToken(token.s, token.lineIndex, token.colIndex, type, originalString);
};