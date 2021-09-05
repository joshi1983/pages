import { isCompleteKTurtleVersion } from './scanning/isCompleteKTurtleVersion.js';
import { isNumberLiteral } from './scanning/isNumberLiteral.js';
import { isValidIdentifier } from './scanning/isValidIdentifier.js';
import { ParseTreeTokenType } from './ParseTreeTokenType.js';

const map = new Map([
	['@(', ParseTreeTokenType.WRAP_START],
	['{', ParseTreeTokenType.CURLY_LEFT_BRACKET],
	['}', ParseTreeTokenType.CURLY_RIGHT_BRACKET],
	['(', ParseTreeTokenType.CURVED_LEFT_BRACKET],
	[')', ParseTreeTokenType.CURVED_RIGHT_BRACKET],
	[',', ParseTreeTokenType.COMMA],
	['-', ParseTreeTokenType.BINARY_OPERATOR],
	['+', ParseTreeTokenType.BINARY_OPERATOR],
	['*', ParseTreeTokenType.BINARY_OPERATOR],
	['/', ParseTreeTokenType.BINARY_OPERATOR],
	['^', ParseTreeTokenType.BINARY_OPERATOR],
	['>', ParseTreeTokenType.BINARY_OPERATOR],
	['<', ParseTreeTokenType.BINARY_OPERATOR],
	['<=', ParseTreeTokenType.BINARY_OPERATOR],
	['>=', ParseTreeTokenType.BINARY_OPERATOR],
	['==', ParseTreeTokenType.BINARY_OPERATOR],
	['!=', ParseTreeTokenType.BINARY_OPERATOR],
	['=', ParseTreeTokenType.ASSIGNMENT_OPERATOR],
	['and', ParseTreeTokenType.BINARY_OPERATOR],
	['else', ParseTreeTokenType.ELSE],
	['false', ParseTreeTokenType.BOOLEAN_LITERAL],
	['for', ParseTreeTokenType.FOR],
	['if', ParseTreeTokenType.IF],
	['learn', ParseTreeTokenType.LEARN],
	['not', ParseTreeTokenType.UNARY_OPERATOR],
	['or', ParseTreeTokenType.BINARY_OPERATOR],
	['repeat', ParseTreeTokenType.REPEAT],
	['to', ParseTreeTokenType.TO],
	['true', ParseTreeTokenType.BOOLEAN_LITERAL],
	['while', ParseTreeTokenType.WHILE]
]);

export function stringToParseTreeTokenType(s) {
	if (map.has(s))
		return map.get(s);
	if (s.startsWith('#'))
		return ParseTreeTokenType.COMMENT;
	if (s.startsWith('$'))
		return ParseTreeTokenType.VARIABLE_REFERENCE;
	if (s.startsWith('"'))
		return ParseTreeTokenType.STRING_LITERAL;
	if (isValidIdentifier(s))
		return ParseTreeTokenType.IDENTIFIER;
	if (isNumberLiteral(s))
		return ParseTreeTokenType.NUMBER_LITERAL;
	if (isCompleteKTurtleVersion(s))
		return ParseTreeTokenType.KTURTLE_VERSION_DECLARATION;
	throw new Error(`Unable to get type for ${s}`);
};