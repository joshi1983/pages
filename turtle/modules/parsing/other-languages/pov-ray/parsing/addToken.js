import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { processAngleLeftBracket } from './processAngleLeftBracket.js';
import { processAngleRightBracket } from './processAngleRightBracket.js';
import { processBinaryOperator } from './processBinaryOperator.js';
import { processBreak } from './processBreak.js';
import { processCaseOrRange } from './processCaseOrRange.js';
import { processColon } from './processColon.js';
import { processComma } from './processComma.js';
import { processCurlyLeftBracket } from './processCurlyLeftBracket.js';
import { processCurlyRightBracket } from './processCurlyRightBracket.js';
import { processCurvedLeftBracket } from './processCurvedLeftBracket.js';
import { processCurvedRightBracket } from './processCurvedRightBracket.js';
import { processDeclareOrLocal } from './processDeclareOrLocal.js';
import { processDot } from './processDot.js';
import { processElse } from './processElse.js';
import { processEnd } from './processEnd.js';
import { processIdentifier } from './processIdentifier.js';
import { processMixed } from './processMixed.js';
import { processParameterizedGroup } from './processParameterizedGroup.js';
import { processQuestionMark } from './processQuestionMark.js';
import { processSemicolon } from './processSemicolon.js';
import { processSquareLeftBracket } from './processSquareLeftBracket.js';
import { processSquareRightBracket } from './processSquareRightBracket.js';
import { processValueLiteral } from './processValueLiteral.js';

const processors = new Map([
	[ParseTreeTokenType.ANGLE_LEFT_BRACKET, processAngleLeftBracket],
	[ParseTreeTokenType.ANGLE_RIGHT_BRACKET, processAngleRightBracket],
	[ParseTreeTokenType.BINARY_OPERATOR, processBinaryOperator],
	[ParseTreeTokenType.BREAK, processBreak],
	[ParseTreeTokenType.CASE, processCaseOrRange],
	[ParseTreeTokenType.COLON, processColon],
	[ParseTreeTokenType.COMMA, processComma],
	[ParseTreeTokenType.CURLY_LEFT_BRACKET, processCurlyLeftBracket],
	[ParseTreeTokenType.CURLY_RIGHT_BRACKET, processCurlyRightBracket],
	[ParseTreeTokenType.CURVED_LEFT_BRACKET, processCurvedLeftBracket],
	[ParseTreeTokenType.CURVED_RIGHT_BRACKET, processCurvedRightBracket],
	[ParseTreeTokenType.DECLARE, processDeclareOrLocal],
	[ParseTreeTokenType.DOT, processDot],
	[ParseTreeTokenType.ELSE, processElse],
	[ParseTreeTokenType.END, processEnd],
	[ParseTreeTokenType.IDENTIFIER, processIdentifier],
	[ParseTreeTokenType.LOCAL, processDeclareOrLocal],
	[ParseTreeTokenType.MIXED, processMixed],
	[ParseTreeTokenType.NUMBER_LITERAL, processValueLiteral],
	[ParseTreeTokenType.PARAMETERIZED_GROUP, processParameterizedGroup],
	[ParseTreeTokenType.QUESTION_MARK, processQuestionMark],
	[ParseTreeTokenType.RANGE, processCaseOrRange],
	[ParseTreeTokenType.SEMICOLON, processSemicolon],
	[ParseTreeTokenType.SQUARE_LEFT_BRACKET, processSquareLeftBracket],
	[ParseTreeTokenType.SQUARE_RIGHT_BRACKET, processSquareRightBracket],
	[ParseTreeTokenType.STRING_LITERAL, processValueLiteral],
]);
export function addToken(prev, next) {
	const processor = processors.get(next.type);
	if (processor !== undefined) {
		return processor(prev, next);
	}
	prev.appendChild(next);
	return next;
};