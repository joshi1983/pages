import { CommentDumpingStringBuffer } from
'../../../generic-parsing-utilities/CommentDumpingStringBuffer.js';
import { noop } from
'../../../../noop.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { processArgList } from './processArgList.js';
import { processAssignmentOperator } from './processAssignmentOperator.js';
import { processBinaryOperator} from './processBinaryOperator.js';
import { processBooleanLiteral } from './processBooleanLiteral.js';
import { processBreak } from './processBreak.js';
import { processCharacterLiteral } from './processCharacterLiteral.js';
import { processExpressionDotProperty } from './processExpressionDotProperty.js';
import { processFor } from './processFor.js';
import { processFunc } from './processFunc.js';
import { processFunctionCall } from './processFunctionCall.js';
import { processIdentifier } from './processIdentifier.js';
import { processIf } from './processIf.js';
import { processNumberLiteral } from './processNumberLiteral.js';
import { processReturn } from './processReturn.js';
import { processStringLiteral } from './processStringLiteral.js';
import { processTokens } from './helpers/processTokens.js';
import { processUnaryOperator } from './processUnaryOperator.js';

const typeProcessors = new Map([
	[ParseTreeTokenType.ARG_LIST, processArgList],
	[ParseTreeTokenType.ASSIGNMENT_OPERATOR, processAssignmentOperator],
	[ParseTreeTokenType.BINARY_OPERATOR, processBinaryOperator],
	[ParseTreeTokenType.BOOLEAN_LITERAL, processBooleanLiteral],
	[ParseTreeTokenType.BREAK, processBreak],
	[ParseTreeTokenType.CHARACTER_LITERAL, processCharacterLiteral],
	[ParseTreeTokenType.DATA_TYPE_EXPRESSION, noop],
	[ParseTreeTokenType.EXPRESSION_DOT_PROPERTY, processExpressionDotProperty],
	[ParseTreeTokenType.FOR, processFor],
	[ParseTreeTokenType.FUNC, processFunc],
	[ParseTreeTokenType.FUNC_CALL, processFunctionCall],
	[ParseTreeTokenType.GOTO, noop],
	[ParseTreeTokenType.IDENTIFIER, processIdentifier],
	[ParseTreeTokenType.IF, processIf],
	[ParseTreeTokenType.IMPORT, noop],
	[ParseTreeTokenType.LABEL, noop],
	[ParseTreeTokenType.NUMBER_LITERAL, processNumberLiteral],
	[ParseTreeTokenType.PACKAGE, noop],
	[ParseTreeTokenType.RETURN, processReturn],
	[ParseTreeTokenType.STRING_LITERAL, processStringLiteral],
	[ParseTreeTokenType.TYPE, noop],
	[ParseTreeTokenType.UNARY_OPERATOR, processUnaryOperator]
]);

export function processToken(token, result, settings) {
	if (typeof settings !== 'object')
		throw new Error(`settings must be an object but found ${settings}`);
	if (!(result instanceof CommentDumpingStringBuffer))
		throw new Error(`result must be a CommentDumpingStringBuffer.  Not: ${result}`);
	if (typeof token !== 'object')
		throw new Error(`token must be an object and more specifically a ParseTreeToken.  Not ${token}`);

	const tokenProcessor = settings.tokenProcessors.get(token);
	if (tokenProcessor !== undefined) {
		tokenProcessor(token, result, settings);
		return;
	}
	
	const processor = typeProcessors.get(token.type);
	if (processor !== undefined)
		processor(token, result, settings);
	else
		processTokens(token.children, result, settings);
};