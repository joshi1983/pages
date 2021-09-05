import { isBytesLiteralStart } from '../scanning/isBytesLiteralStart.js';
import { isCompleteIndent } from '../scanning/isCompleteIndent.js';
import { isDecoratorStart } from '../scanning/isDecoratorStart.js';
import { isEscapedLineBreak } from '../scanning/isEscapedLineBreak.js';
import { isIdentifier } from '../scanning/isIdentifier.js';
import { isNumberLiteral } from '../scanning/isNumberLiteral.js';
import { isStartOfDocString } from '../scanning/isStartOfDocString.js';
import { isStringLiteralStart } from '../scanning/isStringLiteralStart.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { PythonOperators } from '../PythonOperators.js';

const nameToType = new Map([
	[',', ParseTreeTokenType.COMMA],
	['.', ParseTreeTokenType.DOT],
	['(', ParseTreeTokenType.CURVED_LEFT_BRACKET],
	[')', ParseTreeTokenType.CURVED_RIGHT_BRACKET],
	[':', ParseTreeTokenType.COLON],
	[';', ParseTreeTokenType.SEMICOLON],
	['[', ParseTreeTokenType.SQUARE_LEFT_BRACKET],
	[']', ParseTreeTokenType.SQUARE_RIGHT_BRACKET],
	['{', ParseTreeTokenType.CURLY_LEFT_BRACKET],
	['}', ParseTreeTokenType.CURLY_RIGHT_BRACKET],
	['as', ParseTreeTokenType.AS],
	['assert', ParseTreeTokenType.ASSERT],
	['async', ParseTreeTokenType.ASYNC],
	['await', ParseTreeTokenType.AWAIT],
	['break', ParseTreeTokenType.BREAK],
	['class', ParseTreeTokenType.CLASS],
	['continue', ParseTreeTokenType.CONTINUE],
	['def', ParseTreeTokenType.DEF],
	['elif', ParseTreeTokenType.ELIF],
	['else', ParseTreeTokenType.ELSE],
	['except', ParseTreeTokenType.EXCEPT],
	['for', ParseTreeTokenType.FOR_LOOP],
	['False', ParseTreeTokenType.BOOLEAN_LITERAL],
	['finally', ParseTreeTokenType.FINALLY],
	['global', ParseTreeTokenType.GLOBAL],
	['if', ParseTreeTokenType.IF_STATEMENT],
	['import', ParseTreeTokenType.IMPORT],
	['in', ParseTreeTokenType.IN],
	['None', ParseTreeTokenType.NONE],
	['pass', ParseTreeTokenType.PASS],
	['return', ParseTreeTokenType.RETURN],
	['True', ParseTreeTokenType.BOOLEAN_LITERAL],
	['try', ParseTreeTokenType.TRY],
	['while', ParseTreeTokenType.WHILE_LOOP],
	['with', ParseTreeTokenType.WITH],
	['yield', ParseTreeTokenType.YIELD]
]);

export function stringToParseTreeTokenType(s) {
	const type = nameToType.get(s);
	if (type !== undefined)
		return type;
	if (isNumberLiteral(s))
		return ParseTreeTokenType.NUMBER_LITERAL;
	if (isEscapedLineBreak(s))
		return ParseTreeTokenType.ESCAPED_LINEBREAK;

	const operatorInfo = PythonOperators.getOperatorInfo(s);
	if (operatorInfo !== undefined) {
		if (operatorInfo.isNotBinary === true)
			return ParseTreeTokenType.UNARY_OPERATOR;
		if (operatorInfo.isAssignment === true)
			return ParseTreeTokenType.ASSIGNMENT_OPERATOR;

		return ParseTreeTokenType.BINARY_OPERATOR;
	}

	if (isStartOfDocString(s, 0))
		return ParseTreeTokenType.LONG_STRING_LITERAL;
	if (isStringLiteralStart(s))
		return ParseTreeTokenType.STRING_LITERAL;
	if (isIdentifier(s))
		return ParseTreeTokenType.IDENTIFIER;
	if (isBytesLiteralStart(s))
		return ParseTreeTokenType.BYTES_LITERAL;
	if (isDecoratorStart(s))
		return ParseTreeTokenType.DECORATOR;
	if (isCompleteIndent(s))
		return ParseTreeTokenType.INDENT;



	return ParseTreeTokenType.UNRECOGNIZED;
};