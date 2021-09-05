import { CommentDumpingStringBuffer } from
'../../../generic-parsing-utilities/CommentDumpingStringBuffer.js';
import { noop } from
'../../../../noop.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { processArgList } from './processArgList.js';
import { processBinaryOperator} from './processBinaryOperator.js';
import { processBooleanLiteral } from './processBooleanLiteral.js';
import { processExpressionDotProperty } from './processExpressionDotProperty.js';
import { processFunc } from './processFunc.js';
import { processFunctionCall } from './processFunctionCall.js';
import { processIdentifier } from './processIdentifier.js';
import { processNumberLiteral } from './processNumberLiteral.js';
import { processStringLiteral } from './processStringLiteral.js';
import { processTokens } from './helpers/processTokens.js';

const typeProcessors = new Map([
	[ParseTreeTokenType.ARG_LIST, processArgList],
	[ParseTreeTokenType.BINARY_OPERATOR, processBinaryOperator],
	[ParseTreeTokenType.BOOLEAN_LITERAL, processBooleanLiteral],
	[ParseTreeTokenType.EXPRESSION_DOT_PROPERTY, processExpressionDotProperty],
	[ParseTreeTokenType.FUNC, processFunc],
	[ParseTreeTokenType.FUNC_CALL, processFunctionCall],
	[ParseTreeTokenType.IDENTIFIER, processIdentifier],
	[ParseTreeTokenType.IMPORT, noop],
	[ParseTreeTokenType.NUMBER_LITERAL, processNumberLiteral],
	[ParseTreeTokenType.PACKAGE, noop],
	[ParseTreeTokenType.STRING_LITERAL, processStringLiteral]
]);

export function processToken(token, result, settings) {
	if (typeof settings !== 'object')
		throw new Error(`settings must be an object but found ${settings}`);
	if (!(result instanceof CommentDumpingStringBuffer))
		throw new Error(`result must be a CommentDumpingStringBuffer.  Not: ${result}`);
	if (typeof token !== 'object')
		throw new Error(`token must be an object and more specifically a ParseTreeToken.  Not ${token}`);
	const processor = typeProcessors.get(token.type);
	if (processor !== undefined)
		processor(token, result, settings);
	else
		processTokens(token.children, result, settings);
};