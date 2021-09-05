import { getAboveCompletedTokens } from './getAboveCompletedTokens.js';
import { processAssignmentOperator } from './processAssignmentOperator.js';
import { processBinaryOperator } from './processBinaryOperator.js';
import { processBooleanLiteral } from './processBooleanLiteral.js';
import { processComma } from './processComma.js';
import { processCurlyLeftBracket } from './processCurlyLeftBracket.js';
import { processCurlyRightBracket } from './processCurlyRightBracket.js';
import { processCurvedLeftBracket } from './processCurvedLeftBracket.js';
import { processCurvedRightBracket } from './processCurvedRightBracket.js';
import { processElse } from './processElse.js';
import { processIdentifier } from './processIdentifier.js';
import { processLearn } from './processLearn.js';
import { processNumberLiteral } from './processNumberLiteral.js';
import { processStringLiteral } from './processStringLiteral.js';
import { processTo } from './processTo.js';
import { processVariableReference } from './processVariableReference.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const processors = new Map([
	[ParseTreeTokenType.ASSIGNMENT_OPERATOR, processAssignmentOperator],
	[ParseTreeTokenType.BINARY_OPERATOR, processBinaryOperator],
	[ParseTreeTokenType.BOOLEARN_LITERAL, processBooleanLiteral],
	[ParseTreeTokenType.COMMA, processComma],
	[ParseTreeTokenType.CURLY_LEFT_BRACKET, processCurlyLeftBracket],
	[ParseTreeTokenType.CURLY_RIGHT_BRACKET, processCurlyRightBracket],
	[ParseTreeTokenType.CURVED_LEFT_BRACKET, processCurvedLeftBracket],
	[ParseTreeTokenType.CURVED_RIGHT_BRACKET, processCurvedRightBracket],
	[ParseTreeTokenType.ELSE, processElse],
	[ParseTreeTokenType.IDENTIFIER, processIdentifier],
	[ParseTreeTokenType.LEARN, processLearn],
	[ParseTreeTokenType.NUMBER_LITERAL, processNumberLiteral],
	[ParseTreeTokenType.STRING_LITERAL, processStringLiteral],
	[ParseTreeTokenType.TO, processTo],
	[ParseTreeTokenType.VARIABLE_REFERENCE, processVariableReference],
]);

export function addToken(previousToken, nextToken, proceduresMap) {
	if (!(proceduresMap instanceof Map))
		throw new Error(`proceduresMap expected to be a Map but got ${proceduresMap}`);
	const processor = processors.get(nextToken.type);
	if (processor !== undefined) {
		return getAboveCompletedTokens(processor(previousToken, nextToken, proceduresMap), proceduresMap);
	}
	previousToken.appendChild(nextToken);
	return nextToken;
};