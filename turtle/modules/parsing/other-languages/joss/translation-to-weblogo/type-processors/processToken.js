import { CommentDumpingStringBuffer } from
'../../../../generic-parsing-utilities/CommentDumpingStringBuffer.js';
import { noop } from
'../../../../../noop.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { processAssignmentOperator } from './processAssignmentOperator.js';
import { processBinaryOperator} from './processBinaryOperator.js';
import { processFunctionCall } from './processFunctionCall.js';
import { processIdentifier } from './processIdentifier.js';
import { processLet } from './processLet.js';
import { processNumberLiteral } from './processNumberLiteral.js';
import { processSquareBracketExpression } from './processSquareBracketExpression.js';
import { processStringLiteral } from './processStringLiteral.js';
import { processTokens } from './helpers/processTokens.js';
import { processUnaryOperator } from './processUnaryOperator.js';

const typeProcessors = new Map([
	[ParseTreeTokenType.ASSIGNMENT_OPERATOR, processAssignmentOperator],
	[ParseTreeTokenType.BINARY_OPERATOR, processBinaryOperator],
	[ParseTreeTokenType.COLON, noop],
	[ParseTreeTokenType.FUNCTION_CALL, processFunctionCall],
	[ParseTreeTokenType.IDENTIFIER, processIdentifier],
	[ParseTreeTokenType.LET, processLet],
	[ParseTreeTokenType.NUMBER_LITERAL, processNumberLiteral],
	[ParseTreeTokenType.PERIOD, noop],
	[ParseTreeTokenType.SEMICOLON, noop],
	[ParseTreeTokenType.SQUARE_BRACKET_EXPRESSION, processSquareBracketExpression],
	[ParseTreeTokenType.STRING_LITERAL, processStringLiteral],
	[ParseTreeTokenType.UNARY_OPERATOR, processUnaryOperator],
]);

export function processToken(token, result) {
	if (!(result instanceof CommentDumpingStringBuffer))
		throw new Error(`result must be a CommentDumpingStringBuffer.  Not: ${result}`);
	if (typeof token !== 'object')
		throw new Error(`token must be an object and more specifically a ParseTreeToken.  Not ${token}`);
	
	const processor = typeProcessors.get(token.type);
	if (processor !== undefined)
		processor(token, result);
	else
		processTokens(token.children, result);
};