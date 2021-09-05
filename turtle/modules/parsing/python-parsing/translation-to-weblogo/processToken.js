import { CachedParseTree } from '../parse-tree-analysis/CachedParseTree.js';
import { CommentDumpingStringBuffer } from '../../generic-parsing-utilities/CommentDumpingStringBuffer.js';
import { findTopTranslatableFunctionCall } from './findTopTranslatableFunctionCall.js';
import { isDiscardedFunctionCall } from './isDiscardedFunctionCall.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { processArgumentListToken } from './type-processors/processArgumentListToken.js';
import { processArgumentStarToken } from './type-processors/processArgumentStarToken.js';
import { processAssignmentOperatorToken } from './type-processors/processAssignmentOperatorToken.js';
import { processBinaryOperatorToken } from './type-processors/processBinaryOperatorToken.js';
import { processBooleanLiteralToken } from './type-processors/processBooleanLiteralToken.js';
import { processCurvedBracketExpressionToken } from './type-processors/processCurvedBracketExpressionToken.js';
import { processDictionaryLiteral } from './type-processors/processDictionaryLiteral.js';
import { processDocstringToken } from './type-processors/processDocstringToken.js';
import { processForLoopToken } from './type-processors/processForLoopToken.js';
import { processFunctionCallToken } from './type-processors/processFunctionCallToken.js';
import { processFunctionDefinitionToken } from './type-processors/processFunctionDefinitionToken.js';
import { processIdentifierToken } from './type-processors/processIdentifierToken.js';
import { processIfStatementToken } from './type-processors/processIfStatementToken.js';
import { processListLiteralToken } from './type-processors/processListLiteralToken.js';
import { processNoneToken } from './type-processors/processNoneToken.js';
import { processNotToken } from './type-processors/processNotToken.js';
import { processNumberLiteralToken } from './type-processors/processNumberLiteralToken.js';
import { processReturnStatement } from './type-processors/processReturnStatement.js';
import { processStringLiteralToken } from './type-processors/processStringLiteralToken.js';
import { processSubscriptExpressionToken } from './type-processors/processSubscriptExpressionToken.js';
import { processSubscriptToken } from './type-processors/processSubscriptToken.js';
import { processTryToken } from './type-processors/processTryToken.js';
import { processTupleLiteralToken } from './type-processors/processTupleLiteralToken.js';
import { processUnaryOperatorToken } from './type-processors/processUnaryOperatorToken.js';
import { processUnrecognizedToken } from './type-processors/processUnrecognizedToken.js';
import { processWhileToken } from './type-processors/processWhileToken.js';
import { printVal } from './type-processors/helpers/printVal.js';
import { printValWithSpaces } from './type-processors/helpers/printValWithSpaces.js';

const typeProcessors = [];
typeProcessors[ParseTreeTokenType.ARGUMENT] = processUnrecognizedToken;
typeProcessors[ParseTreeTokenType.ARGUMENT_LIST] = processArgumentListToken;
typeProcessors[ParseTreeTokenType.ARGUMENT_STAR] = processArgumentStarToken;
typeProcessors[ParseTreeTokenType.ASSIGNMENT_OPERATOR] = processAssignmentOperatorToken;
typeProcessors[ParseTreeTokenType.BINARY_OPERATOR] = processBinaryOperatorToken;
typeProcessors[ParseTreeTokenType.BOOLEAN_LITERAL] = processBooleanLiteralToken;
typeProcessors[ParseTreeTokenType.BREAK] = printValWithSpaces;
typeProcessors[ParseTreeTokenType.CONTINUE] = printValWithSpaces;
//typeProcessors[ParseTreeTokenType.CURVED_LEFT_BRACKET] = printVal;
//typeProcessors[ParseTreeTokenType.CURVED_RIGHT_BRACKET] = printVal;
typeProcessors[ParseTreeTokenType.CURVED_BRACKET_EXPRESSION] = processCurvedBracketExpressionToken;
typeProcessors[ParseTreeTokenType.DICTIONARY_LITERAL] = processDictionaryLiteral;
typeProcessors[ParseTreeTokenType.DOCSTRING] = processDocstringToken;
typeProcessors[ParseTreeTokenType.DOT] = printVal;
typeProcessors[ParseTreeTokenType.FOR_LOOP] = processForLoopToken;
typeProcessors[ParseTreeTokenType.FUNCTION_CALL] = processFunctionCallToken;
typeProcessors[ParseTreeTokenType.FUNCTION_DEFINITION] = processFunctionDefinitionToken;
typeProcessors[ParseTreeTokenType.IDENTIFIER] = processIdentifierToken;
typeProcessors[ParseTreeTokenType.IF_STATEMENT] = processIfStatementToken;
typeProcessors[ParseTreeTokenType.LIST_LITERAL] = processListLiteralToken;
typeProcessors[ParseTreeTokenType.LONG_STRING_LITERAL] = processStringLiteralToken;
typeProcessors[ParseTreeTokenType.NONE] = processNoneToken;
typeProcessors[ParseTreeTokenType.NOT] = processNotToken;
typeProcessors[ParseTreeTokenType.NUMBER_LITERAL] = processNumberLiteralToken;
typeProcessors[ParseTreeTokenType.RETURN] = processReturnStatement;
typeProcessors[ParseTreeTokenType.SQUARE_LEFT_BRACKET] = printVal;
typeProcessors[ParseTreeTokenType.SQUARE_RIGHT_BRACKET] = printVal;
typeProcessors[ParseTreeTokenType.STRING_LITERAL] = processStringLiteralToken;
typeProcessors[ParseTreeTokenType.SUBSCRIPT] = processSubscriptToken;
typeProcessors[ParseTreeTokenType.SUBSCRIPT_EXPRESSION] = processSubscriptExpressionToken;
typeProcessors[ParseTreeTokenType.TREE_ROOT] = processUnrecognizedToken;
typeProcessors[ParseTreeTokenType.TRY] = processTryToken;
typeProcessors[ParseTreeTokenType.TUPLE_LITERAL] = processTupleLiteralToken;
typeProcessors[ParseTreeTokenType.UNARY_OPERATOR] = processUnaryOperatorToken;
typeProcessors[ParseTreeTokenType.UNRECOGNIZED] = processUnrecognizedToken;
typeProcessors[ParseTreeTokenType.WHILE_LOOP] = processWhileToken;

export function processToken(token, buffer, cachedParseTree) {
	if (!(buffer instanceof CommentDumpingStringBuffer))
		throw new Error(`buffer must be a CommentDumpingStringBuffer.  Not: ${buffer}`);
	if (!(cachedParseTree instanceof CachedParseTree))
		throw new Error(`cachedParseTree must be a CachedParseTree.  Not: ${cachedParseTree}`);
	if (typeof token !== 'object')
		throw new Error(`token must be an object and more specifically a ParseTreeToken.  Not ${token}`);
	if (isDiscardedFunctionCall(token, cachedParseTree))
		return;
	const topFuncToken = findTopTranslatableFunctionCall(token);
	if (topFuncToken !== undefined) {
		token = topFuncToken;
	}
	const processor = typeProcessors[token.type];
	if (processor !== undefined)
		processor(token, buffer, cachedParseTree);
};