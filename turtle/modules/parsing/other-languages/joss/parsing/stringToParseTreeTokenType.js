import { isNumberLiteral } from '../scanning/isNumberLiteral.js';
import { isIdentifier } from '../scanning/isIdentifier.js';
import { Operators } from '../Operators.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export const valTypesMap = new Map([
	['(', ParseTreeTokenType.CURVED_LEFT_BRACKET],
	[')', ParseTreeTokenType.CURVED_RIGHT_BRACKET],
	['[', ParseTreeTokenType.SQUARE_LEFT_BRACKET],
	[']', ParseTreeTokenType.SQUARE_RIGHT_BRACKET],
	[',', ParseTreeTokenType.COMMA],
	['.', ParseTreeTokenType.PERIOD],
	['|', ParseTreeTokenType.PIPE],
	[':', ParseTreeTokenType.COLON],
	[';', ParseTreeTokenType.SEMICOLON],
	['for', ParseTreeTokenType.FOR],
	['if', ParseTreeTokenType.IF],
	['in', ParseTreeTokenType.IN],
	['let', ParseTreeTokenType.LET],
	['page', ParseTreeTokenType.PAGE],
	['part', ParseTreeTokenType.PAGE],
		// page and part mean the same thing in JOSS based on what I read at
		// .
	['set', ParseTreeTokenType.SET],
	['while', ParseTreeTokenType.WHILE]
]);

export function stringToParseTreeTokenType(s) {
	const sLower = s.toLowerCase();
	if (valTypesMap.has(sLower))
		return valTypesMap.get(sLower);

	if (s[0] === '"')
		return ParseTreeTokenType.STRING_LITERAL;

	const operatorInfo = Operators.getOperatorInfo(sLower);
	if (operatorInfo !== undefined) {
		if (operatorInfo.isNotBinary)
			return ParseTreeTokenType.UNARY_OPERATOR;

		return ParseTreeTokenType.BINARY_OPERATOR;
	}

	if (isIdentifier(s))
		return ParseTreeTokenType.IDENTIFIER;

	if (isNumberLiteral(s))
		return ParseTreeTokenType.NUMBER_LITERAL;
	throw new Error(`Unable to get type for ${s}`);
};