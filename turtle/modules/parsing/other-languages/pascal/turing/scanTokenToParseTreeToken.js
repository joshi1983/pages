import { isIdentifier } from './scanning/isIdentifier.js';
import { isMultilineCommentStart } from './scanning/isMultilineCommentStart.js';
import { isNumberLiteralStart } from './scanning/isNumberLiteralStart.js';
import { isStringLiteralStart } from './scanning/isStringLiteralStart.js';
import { Operators } from './Operators.js';
import { ParseTreeToken } from '../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from './ParseTreeTokenType.js';

const sTypeMap = new Map([
	['array', ParseTreeTokenType.ARRAY],
	['by', ParseTreeTokenType.BY],
	['case', ParseTreeTokenType.CASE],
	['class', ParseTreeTokenType.CLASS],
	['const', ParseTreeTokenType.CONST],
	['else', ParseTreeTokenType.ELSE],
	['elsif', ParseTreeTokenType.ELSIF],
	['end', ParseTreeTokenType.END],
	['exit', ParseTreeTokenType.EXIT],
	['export', ParseTreeTokenType.EXPORT],
	['false', ParseTreeTokenType.BOOLEAN_LITERAL],
	['for', ParseTreeTokenType.FOR],
	['function', ParseTreeTokenType.FUNCTION],
	['if', ParseTreeTokenType.IF],
	['loop', ParseTreeTokenType.LOOP],
	['of', ParseTreeTokenType.OF],
	['procedure', ParseTreeTokenType.PROCEDURE],
	['result', ParseTreeTokenType.RESULT],
	['then', ParseTreeTokenType.THEN],
	['true', ParseTreeTokenType.BOOLEAN_LITERAL],
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

for (const info of Operators.getAll()) {
	if (info.isAssignment) {
		sTypeMap.set(info.symbol, ParseTreeTokenType.ASSIGNMENT_OPERATOR);
	}
}

const specialValues = Array.from(sTypeMap.keys());
export { specialValues };

const unaryPreviousTypes = new Set([
	ParseTreeTokenType.ARRAY,
	ParseTreeTokenType.ASSIGNMENT_OPERATOR,
	ParseTreeTokenType.BY,
	ParseTreeTokenType.COLON,
	ParseTreeTokenType.COMMA,
	ParseTreeTokenType.CURLY_LEFT_BRACKET,
	ParseTreeTokenType.CURVED_LEFT_BRACKET,
	ParseTreeTokenType.DOT,
	ParseTreeTokenType.SEMICOLON,
	ParseTreeTokenType.SQUARE_LEFT_BRACKET,
	ParseTreeTokenType.TREE_ROOT,
	ParseTreeTokenType.WHEN
]);

export function scanTokenToParseTreeToken(token, previousType) {
	if (token === undefined)
		return undefined;
	let type = sTypeMap.get(token.s.toLowerCase());
	if (token.s === '*' &&
	unaryPreviousTypes.has(previousType))
		type = ParseTreeTokenType.END_MATCH_SYMBOL;
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