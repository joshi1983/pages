import { cssColorNameToHex } from './cssColorNameToHex.js';
import { isCommentStart } from './scanning/isCommentStart.js';
import { isIdentifierStart } from './scanning/isIdentifierStart.js';
import { isNumberUnitLiteral } from './scanning/isNumberUnitLiteral.js';
import { isStartingNumberLiteral } from './scanning/isStartingNumberLiteral.js';
import { isStringLiteralStart } from './scanning/isStringLiteralStart.js';
import { Operators } from './Operators.js';
import { ParseTreeTokenType } from './ParseTreeTokenType.js';

const sToTypeMap = new Map([
	['.', ParseTreeTokenType.DOT],
	['+', ParseTreeTokenType.COMBINATOR],
	['-', ParseTreeTokenType.COMBINATOR],
	['>', ParseTreeTokenType.COMBINATOR],
	['<', ParseTreeTokenType.COMBINATOR],
	['~', ParseTreeTokenType.COMBINATOR],
	['|', ParseTreeTokenType.COMBINATOR],
	['||', ParseTreeTokenType.COMBINATOR],
	[':', ParseTreeTokenType.COLON],
	[',', ParseTreeTokenType.COMMA],
	['{', ParseTreeTokenType.CURLY_LEFT_BRACKET],
	['}', ParseTreeTokenType.CURLY_RIGHT_BRACKET],
	['(', ParseTreeTokenType.CURVED_LEFT_BRACKET],
	[')', ParseTreeTokenType.CURVED_RIGHT_BRACKET],
	['[', ParseTreeTokenType.SQUARE_LEFT_BRACKET],
	[']', ParseTreeTokenType.SQUARE_RIGHT_BRACKET],
	[';', ParseTreeTokenType.SEMICOLON],
]);

Operators.getAll().forEach(function(op) {
	if (!sToTypeMap.has(op.symbol)) {
		if (op.unary === undefined) {
			sToTypeMap.set(op.symbol, ParseTreeTokenType.BINARY_OPERATOR);
		}
		else {
			sToTypeMap.set(op.symbol, ParseTreeTokenType.UNARY_OPERATOR);
		}
	}
});

export function stringToTokenType(s) {
	let type = sToTypeMap.get(s);
	if (type !== undefined)
		return type;
	if (isCommentStart(s))
		return ParseTreeTokenType.COMMENT;
	if (isIdentifierStart(s))
		return ParseTreeTokenType.IDENTIFIER;
	if (isStringLiteralStart(s))
		return ParseTreeTokenType.STRING_LITERAL;
	if (isNumberUnitLiteral(s))
		return ParseTreeTokenType.NUMBER_UNIT_LITERAL;
	if (isStartingNumberLiteral(s))
		return ParseTreeTokenType.NUMBER_LITERAL;
	if (s[0] === '@')
		return ParseTreeTokenType.AT_RULE;
	if (s[0] === ':' && s.length > 1)
		return ParseTreeTokenType.PSEUDO_CLASS;
	if (s[0] === '.' && s.length > 1)
		return ParseTreeTokenType.CLASS_NAME_SELECTOR;
	if (cssColorNameToHex(s) !== undefined)
		return ParseTreeTokenType.COLOR_LITERAL;
	if (s[0] === '#' && s.length > 1)
		return ParseTreeTokenType.ID_SELECTOR;
	return ParseTreeTokenType.UNMATCHED;
};