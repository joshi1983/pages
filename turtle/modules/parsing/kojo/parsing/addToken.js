import { addCodeBlockIfNeeded } from './addCodeBlockIfNeeded.js';
import { isCompleteWithNext } from './isCompleteWithNext.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { processAssignmentOperator } from './processAssignmentOperator.js';
import { processBinaryOperator } from './processBinaryOperator.js';
import { processColon } from './processColon.js';
import { processComma } from './processComma.js';
import { processCurlyLeftBracket } from './processCurlyLeftBracket.js';
import { processCurvedLeftBracket } from './processCurvedLeftBracket.js';
import { processDot } from './processDot.js';
import { processFatArrow } from './processFatArrow.js';
import { processIf } from './processIf.js';
import { processSquareLeftBracket } from './processSquareLeftBracket.js';

const processors = new Map([
	[ParseTreeTokenType.ASSIGNMENT_OPERATOR, processAssignmentOperator],
	[ParseTreeTokenType.BINARY_OPERATOR, processBinaryOperator],
	[ParseTreeTokenType.COLON, processColon],
	[ParseTreeTokenType.COMMA, processComma],
	[ParseTreeTokenType.CURLY_LEFT_BRACKET, processCurlyLeftBracket],
	[ParseTreeTokenType.CURVED_LEFT_BRACKET, processCurvedLeftBracket],
	[ParseTreeTokenType.DOT, processDot],
	[ParseTreeTokenType.FAT_ARROW, processFatArrow],
	[ParseTreeTokenType.IF, processIf],
	[ParseTreeTokenType.SQUARE_LEFT_BRACKET, processSquareLeftBracket]
]);
export function addToken(prev, next) {
	while (isCompleteWithNext(prev, next))
		prev = prev.parentNode;

	prev = addCodeBlockIfNeeded(prev, next);
	const processor = processors.get(next.type);
	if (processor !== undefined) {
		return processor(prev, next);
	}
	prev.appendChild(next);
	return next;
};