import { addArgumentListIfNeeded } from './addArgumentListIfNeeded.js';
import { isCompleteTokenWithNext } from './isCompleteTokenWithNext.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { processColon } from './processColon.js';
import { processBinaryOperator } from './processBinaryOperator.js';
import { processCurvedLeftBracket } from './processCurvedLeftBracket.js';
import { processCurvedRightBracket } from './processCurvedRightBracket.js';
import { processDef } from './processDef.js';
import { processExcept } from './processExcept.js';
import { processFinally } from './processFinally.js';
import { processIf } from './processIf.js';
import { processImport } from './processImport.js';
import { processIndent } from './processIndent.js';
import { processSquareLeftBracket } from './processSquareLeftBracket.js';
import { processSquareRightBracket } from './processSquareRightBracket.js';

const processors = new Map([
	[ParseTreeTokenType.BINARY_OPERATOR, processBinaryOperator],
	[ParseTreeTokenType.COLON, processColon],
	[ParseTreeTokenType.CURVED_LEFT_BRACKET, processCurvedLeftBracket],
	[ParseTreeTokenType.CURVED_RIGHT_BRACKET, processCurvedRightBracket],
	[ParseTreeTokenType.DEF, processDef],
	[ParseTreeTokenType.EXCEPT, processExcept],
	[ParseTreeTokenType.FINALLY, processFinally],
	[ParseTreeTokenType.IF_STATEMENT, processIf],
	[ParseTreeTokenType.IMPORT, processImport],
	[ParseTreeTokenType.INDENT, processIndent],
	[ParseTreeTokenType.SQUARE_LEFT_BRACKET, processSquareLeftBracket],
	[ParseTreeTokenType.SQUARE_RIGHT_BRACKET, processSquareRightBracket]
]);

export function addToken(prev, next) {
	while (prev.parentNode !== null && isCompleteTokenWithNext(prev, next))
		prev = prev.parentNode;

	prev = addArgumentListIfNeeded(prev, next);
	const processor = processors.get(next.type);
	if (processor !== undefined)
		return processor(prev, next);

	prev.appendChild(next);
	return next;
};