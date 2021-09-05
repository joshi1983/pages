import { CachedParseTree } from '../../parse-tree-analysis/CachedParseTree.js';
import { CommentDumpingStringBuffer } from '../../../generic-parsing-utilities/CommentDumpingStringBuffer.js';
import { findTopTranslatableFunctionCall } from '../findTopTranslatableFunctionCall.js';
import { isDiscardedFunctionCall } from '../isDiscardedFunctionCall.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processArgumentListToken } from './processArgumentListToken.js';
import { processArgumentStarToken } from './processArgumentStarToken.js';
import { processAssignmentOperatorToken } from './processAssignmentOperatorToken.js';
import { processBinaryOperatorToken } from './processBinaryOperatorToken.js';
import { processBooleanLiteralToken } from './processBooleanLiteralToken.js';
import { processCodeBlockToken } from './processCodeBlockToken.js';
import { processCurvedBracketExpressionToken } from './processCurvedBracketExpressionToken.js';
import { processDictionaryLiteral } from './processDictionaryLiteral.js';
import { processDocstringToken } from './processDocstringToken.js';
import { processExpressionDot } from './processExpressionDot.js';
import { processForLoopToken } from './processForLoopToken.js';
import { processFunctionCallToken } from './processFunctionCallToken.js';
import { processFunctionDefinitionToken } from './processFunctionDefinitionToken.js';
import { processIdentifierToken } from './processIdentifierToken.js';
import { processIfStatementToken } from './processIfStatementToken.js';
import { processListLiteralToken } from './processListLiteralToken.js';
import { processNoneToken } from './processNoneToken.js';
import { processNumberLiteralToken } from './processNumberLiteralToken.js';
import { processReturnStatement } from './processReturnStatement.js';
import { processStringLiteralToken } from './processStringLiteralToken.js';
import { processSubscriptExpressionToken } from './processSubscriptExpressionToken.js';
import { processTryToken } from './processTryToken.js';
import { processTupleLiteralToken } from './processTupleLiteralToken.js';
import { processUnaryOperatorToken } from './processUnaryOperatorToken.js';
import { processUnrecognizedToken } from './processUnrecognizedToken.js';
import { processWhileToken } from './processWhileToken.js';
import { printVal } from './helpers/printVal.js';
import { printValWithSpaces } from './helpers/printValWithSpaces.js';

const typeProcessors = [];
typeProcessors[ParseTreeTokenType.ARGUMENT_LIST] = processArgumentListToken;
typeProcessors[ParseTreeTokenType.ARGUMENT_STAR] = processArgumentStarToken;
typeProcessors[ParseTreeTokenType.ASSIGNMENT_OPERATOR] = processAssignmentOperatorToken;
typeProcessors[ParseTreeTokenType.BINARY_OPERATOR] = processBinaryOperatorToken;
typeProcessors[ParseTreeTokenType.BOOLEAN_LITERAL] = processBooleanLiteralToken;
typeProcessors[ParseTreeTokenType.BREAK] = printValWithSpaces;
typeProcessors[ParseTreeTokenType.CODE_BLOCK] = processCodeBlockToken;
typeProcessors[ParseTreeTokenType.CONTINUE] = printValWithSpaces;
typeProcessors[ParseTreeTokenType.CURVED_BRACKET_EXPRESSION] = processCurvedBracketExpressionToken;
typeProcessors[ParseTreeTokenType.DICTIONARY_LITERAL] = processDictionaryLiteral;
typeProcessors[ParseTreeTokenType.DOCSTRING] = processDocstringToken;
typeProcessors[ParseTreeTokenType.DOT] = printVal;
typeProcessors[ParseTreeTokenType.EXPRESSION_DOT] = processExpressionDot;
typeProcessors[ParseTreeTokenType.FOR_LOOP] = processForLoopToken;
typeProcessors[ParseTreeTokenType.FUNCTION_CALL] = processFunctionCallToken;
typeProcessors[ParseTreeTokenType.FUNCTION_DEFINITION] = processFunctionDefinitionToken;
typeProcessors[ParseTreeTokenType.IDENTIFIER] = processIdentifierToken;
typeProcessors[ParseTreeTokenType.IF_STATEMENT] = processIfStatementToken;
typeProcessors[ParseTreeTokenType.LIST_LITERAL] = processListLiteralToken;
typeProcessors[ParseTreeTokenType.LONG_STRING_LITERAL] = processStringLiteralToken;
typeProcessors[ParseTreeTokenType.NONE] = processNoneToken;
typeProcessors[ParseTreeTokenType.NUMBER_LITERAL] = processNumberLiteralToken;
typeProcessors[ParseTreeTokenType.RETURN] = processReturnStatement;
typeProcessors[ParseTreeTokenType.SQUARE_LEFT_BRACKET] = printVal;
typeProcessors[ParseTreeTokenType.SQUARE_RIGHT_BRACKET] = printVal;
typeProcessors[ParseTreeTokenType.STRING_LITERAL] = processStringLiteralToken;
typeProcessors[ParseTreeTokenType.SUBSCRIPT_EXPRESSION] = processSubscriptExpressionToken;
typeProcessors[ParseTreeTokenType.TREE_ROOT] = processUnrecognizedToken;
typeProcessors[ParseTreeTokenType.TRY] = processTryToken;
typeProcessors[ParseTreeTokenType.TUPLE_LITERAL] = processTupleLiteralToken;
typeProcessors[ParseTreeTokenType.UNARY_OPERATOR] = processUnaryOperatorToken;
typeProcessors[ParseTreeTokenType.UNRECOGNIZED] = processUnrecognizedToken;
typeProcessors[ParseTreeTokenType.WHILE_LOOP] = processWhileToken;

export function processToken(token, buffer, cachedParseTree, settings) {
	if (!(buffer instanceof CommentDumpingStringBuffer))
		throw new Error(`buffer must be a CommentDumpingStringBuffer.  Not: ${buffer}`);
	if (!(cachedParseTree instanceof CachedParseTree))
		throw new Error(`cachedParseTree must be a CachedParseTree.  Not: ${cachedParseTree}`);
	if (typeof token !== 'object')
		throw new Error(`token must be an object and more specifically a ParseTreeToken.  Not ${token}`);
	if (typeof settings !== 'object')
		throw new Error(`settings must be an object but found ${settings}`);
	if (isDiscardedFunctionCall(token, cachedParseTree))
		return;
	const topFuncToken = findTopTranslatableFunctionCall(token);
	if (topFuncToken !== undefined) {
		token = topFuncToken;
	}
	const processor = typeProcessors[token.type];
	if (processor !== undefined)
		processor(token, buffer, cachedParseTree, settings);
};