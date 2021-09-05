import { canBeBinaryOperator } from '../generic-parsing-utilities/canBeBinaryOperator.js';
import { canBeUnaryOperator } from '../generic-parsing-utilities/canBeUnaryOperator.js';
import { isAssignmentOperator } from '../generic-parsing-utilities/isAssignmentOperator.js';
import { isBooleanLiteral } from './scanning/isBooleanLiteral.js';
import { isCommentPrefix } from './scanning/isCommentPrefix.js';
import { isCompleteNumberLiteral } from './scanning/isCompleteNumberLiteral.js';
import { isStartingRegularExpression } from './scanning/isStartingRegularExpression.js';
import { isStartingStringLiteral } from './scanning/isStartingStringLiteral.js';
import { isStartingTemplateLiteral } from './scanning/isStartingTemplateLiteral.js';
import { isValidIdentifier } from './scanning/isValidIdentifier.js';
import { Operators } from './Operators.js';
import { ParseTreeToken } from '../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from './ParseTreeTokenType.js';

const sTypeMap = new Map([
	['async', ParseTreeTokenType.ASYNC],
	['await', ParseTreeTokenType.AWAIT],
	['break', ParseTreeTokenType.BREAK],
	['case', ParseTreeTokenType.CASE],
	['catch', ParseTreeTokenType.CATCH],
	['class', ParseTreeTokenType.CLASS],
	['const', ParseTreeTokenType.CONST],
	['continue', ParseTreeTokenType.CONTINUE],
	['debugger', ParseTreeTokenType.DEBUGGER],
	['default', ParseTreeTokenType.DEFAULT],
	['delete', ParseTreeTokenType.DELETE],
	['do', ParseTreeTokenType.DO],
	['else', ParseTreeTokenType.ELSE],
	['export', ParseTreeTokenType.EXPORT],
	['finally', ParseTreeTokenType.FINALLY],
	['for', ParseTreeTokenType.FOR],
	['function', ParseTreeTokenType.FUNCTION],
	['if', ParseTreeTokenType.IF],
	['in', ParseTreeTokenType.IN],
	['interface', ParseTreeTokenType.INTERFACE],
	['let', ParseTreeTokenType.LET],
	['new', ParseTreeTokenType.NEW],
	['null', ParseTreeTokenType.NULL],
	['return', ParseTreeTokenType.RETURN],
	['static', ParseTreeTokenType.STATIC],
	['switch', ParseTreeTokenType.SWITCH],
	['this', ParseTreeTokenType.THIS],
	['throw', ParseTreeTokenType.THROW],
	['try', ParseTreeTokenType.TRY],
	['undefined', ParseTreeTokenType.UNDEFINED],
	['var', ParseTreeTokenType.VAR],
	['while', ParseTreeTokenType.WHILE],
	['with', ParseTreeTokenType.WITH],
	['?', ParseTreeTokenType.QUESTION_MARK],
	[',', ParseTreeTokenType.COMMA],
	[':', ParseTreeTokenType.COLON],
	[';', ParseTreeTokenType.SEMICOLON],
	['{', ParseTreeTokenType.CURLY_LEFT_BRACKET],
	['}', ParseTreeTokenType.CURLY_RIGHT_BRACKET],
	['(', ParseTreeTokenType.CURVED_LEFT_BRACKET],
	[')', ParseTreeTokenType.CURVED_RIGHT_BRACKET],
	['[', ParseTreeTokenType.SQUARE_LEFT_BRACKET],
	[']', ParseTreeTokenType.SQUARE_RIGHT_BRACKET],
	['.', ParseTreeTokenType.DOT],
]);

const specialValues = Array.from(sTypeMap.keys());
export { specialValues };

export function scanTokenToParseTreeToken(token) {
	if (token === undefined)
		return undefined;
	let type = sTypeMap.get(token.s);
	if (type === undefined) {
		if (isBooleanLiteral(token.s))
			type = ParseTreeTokenType.BOOLEAN_LITERAL;
		else if (isStartingStringLiteral(token.s))
			type = ParseTreeTokenType.STRING_LITERAL;
		else if (isStartingTemplateLiteral(token.s))
			type = ParseTreeTokenType.TEMPLATE_LITERAL;
		else if (token.s.length >= 2 && isCommentPrefix(token.s)) {
			if (token.s.startsWith('//'))
				type = ParseTreeTokenType.SINGLE_LINE_COMMENT;
			else
				type = ParseTreeTokenType.MULTI_LINE_COMMENT;
		}
		else if (isCompleteNumberLiteral(token.s))
			type = ParseTreeTokenType.NUMBER_LITERAL;
		else if (isValidIdentifier(token.s) && token.s !== 'as')
			type = ParseTreeTokenType.IDENTIFIER;
		else if (isAssignmentOperator(Operators, token.s))
			type = ParseTreeTokenType.ASSIGNMENT_OPERATOR;
		else if (canBeBinaryOperator(Operators, token.s))
			type = ParseTreeTokenType.BINARY_OPERATOR;
		else if (canBeUnaryOperator(Operators, token.s))
			type = ParseTreeTokenType.UNARY_OPERATOR;
		else if (isStartingRegularExpression(token.s))
			type = ParseTreeTokenType.REGULAR_EXPRESSION_LITERAL;
		else {
			type = ParseTreeTokenType.UNRECOGNIZED;
		}
	}
	return new ParseTreeToken(token.s, token.lineIndex, token.colIndex, type, token.s);
};