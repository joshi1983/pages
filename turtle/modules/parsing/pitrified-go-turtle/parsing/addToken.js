import { isCompleteWithNext } from './isCompleteWithNext.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { processAssignmentOperator } from './processAssignmentOperator.js';
import { processBinaryOperator} from './processBinaryOperator.js';
import { processComma } from './processComma.js';
import { processCurlyLeftBracket } from './processCurlyLeftBracket.js';
import { processCurvedLeftBracket } from './processCurvedLeftBracket.js';
import { processCurvedRightBracket } from './processCurvedRightBracket.js';
import { processDot } from './processDot.js';
import { processFor } from './processFor.js';
import { processFunc } from './processFunc.js';
import { processIdentifier } from './processIdentifier.js';
import { processIf } from './processIf.js';
import { processImport } from './processImport.js';
import { processSemicolon } from './processSemicolon.js';
import { processSquareLeftBracket } from './processSquareLeftBracket.js';
import { processSquareRightBracket } from './processSquareRightBracket.js';
import { processStringLiteral }from './processStringLiteral.js';

const processors = new Map([
	[ParseTreeTokenType.ASSIGNMENT_OPERATOR, processAssignmentOperator],
	[ParseTreeTokenType.BINARY_OPERATOR, processBinaryOperator],
	[ParseTreeTokenType.COMMA, processComma],
	[ParseTreeTokenType.CURLY_LEFT_BRACKET, processCurlyLeftBracket],
	[ParseTreeTokenType.CURVED_LEFT_BRACKET, processCurvedLeftBracket],
	[ParseTreeTokenType.CURVED_RIGHT_BRACKET, processCurvedRightBracket],
	[ParseTreeTokenType.DOT, processDot],
	[ParseTreeTokenType.FOR, processFor],
	[ParseTreeTokenType.FUNC, processFunc],
	[ParseTreeTokenType.IDENTIFIER, processIdentifier],
	[ParseTreeTokenType.IF, processIf],
	[ParseTreeTokenType.IMPORT, processImport],
	[ParseTreeTokenType.SEMICOLON, processSemicolon],
	[ParseTreeTokenType.SQUARE_LEFT_BRACKET, processSquareLeftBracket],
	[ParseTreeTokenType.SQUARE_RIGHT_BRACKET, processSquareRightBracket],
	[ParseTreeTokenType.STRING_LITERAL, processStringLiteral]
]);
export function addToken(prev, next) {
	while (isCompleteWithNext(prev, next))
		prev = prev.parentNode;

	const processor = processors.get(next.type);
	if (processor !== undefined) {
		return processor(prev, next);
	}
	prev.appendChild(next);
	return next;
};