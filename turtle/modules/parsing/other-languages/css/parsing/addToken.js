import { isCompleteValueToken } from './isCompleteValueToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { processAtRule } from './processAtRule.js';
import { processBinaryOperator } from './processBinaryOperator.js';
import { processColon } from './processColon.js';
import { processCombinator } from './processCombinator.js';
import { processComma } from './processComma.js';
import { processCurlyLeftBracket } from './processCurlyLeftBracket.js';
import { processCurlyRightBracket } from './processCurlyRightBracket.js';
import { processCurvedLeftBracket } from './processCurvedLeftBracket.js';
import { processCurvedRightBracket } from './processCurvedRightBracket.js';
import { processIdentifier } from './processIdentifier.js';
import { processSelectorChildToken } from './processSelectorChildToken.js';
import { processSemicolon } from './processSemicolon.js';
import { processSquareLeftBracket } from './processSquareLeftBracket.js';
import { processSquareRightBracket } from './processSquareRightBracket.js';
import { processValueLiteral } from './processValueLiteral.js';

const processors = new Map([
	[ParseTreeTokenType.AT_RULE, processAtRule],
	[ParseTreeTokenType.BINARY_OPERATOR, processBinaryOperator],
	[ParseTreeTokenType.CLASS_NAME_SELECTOR, processSelectorChildToken],
	[ParseTreeTokenType.COLON, processColon],
	[ParseTreeTokenType.COMBINATOR, processCombinator],
	[ParseTreeTokenType.COMMA, processComma],
	[ParseTreeTokenType.CURLY_LEFT_BRACKET, processCurlyLeftBracket],
	[ParseTreeTokenType.CURLY_RIGHT_BRACKET, processCurlyRightBracket],
	[ParseTreeTokenType.CURVED_LEFT_BRACKET, processCurvedLeftBracket],
	[ParseTreeTokenType.CURVED_RIGHT_BRACKET, processCurvedRightBracket],
	[ParseTreeTokenType.ID_SELECTOR, processSelectorChildToken],
	[ParseTreeTokenType.IDENTIFIER, processIdentifier],
	[ParseTreeTokenType.NUMBER_LITERAL, processValueLiteral],
	[ParseTreeTokenType.NUMBER_UNIT_LITERAL, processValueLiteral],
	[ParseTreeTokenType.PSEUDO_CLASS, processSelectorChildToken],
	[ParseTreeTokenType.SEMICOLON, processSemicolon],
	[ParseTreeTokenType.SQUARE_LEFT_BRACKET, processSquareLeftBracket],
	[ParseTreeTokenType.SQUARE_RIGHT_BRACKET, processSquareRightBracket],
	[ParseTreeTokenType.STRING_LITERAL, processValueLiteral],
]);
export function addToken(prev, next, settings) {
	const processor = processors.get(next.type);
	if (processor !== undefined) {
		return processor(prev, next, settings);
	}
	while (prev.parentNode !== null && isCompleteValueToken(prev))
		prev = prev.parentNode;
	prev.appendChild(next);
	return next;
};