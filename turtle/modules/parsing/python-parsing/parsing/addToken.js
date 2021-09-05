import { addArgumentListIfNeeded } from './addArgumentListIfNeeded.js';
import { addDictionaryKeyValuePairIfNeeded } from './addDictionaryKeyValuePairIfNeeded.js';
import { isCompleteTokenWithNext } from './isCompleteTokenWithNext.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { processAs } from './processAs.js';
import { processColon } from './processColon.js';
import { processComma } from './processComma.js';
import { processBinaryOperator } from './processBinaryOperator.js';
import { processCurlyLeftBracket } from './processCurlyLeftBracket.js';
import { processCurvedLeftBracket } from './processCurvedLeftBracket.js';
import { processCurvedRightBracket } from './processCurvedRightBracket.js';
import { processDef } from './processDef.js';
import { processDot } from './processDot.js';
import { processEscapedLineBreak } from './processEscapedLineBreak.js';
import { processExcept } from './processExcept.js';
import { processFinally } from './processFinally.js';
import { processForLoop } from './processForLoop.js';
import { processIf } from './processIf.js';
import { processImport } from './processImport.js';
import { processIn } from './processIn.js';
import { processIndent } from './processIndent.js';
import { processLongStringLiteral } from './processLongStringLiteral.js';
import { processSquareLeftBracket } from './processSquareLeftBracket.js';
import { processSquareRightBracket } from './processSquareRightBracket.js';
import { processUnaryOperator } from './processUnaryOperator.js';
import { processWhileLoop } from './processWhileLoop.js';
import { shouldBecomeUnaryOperator } from './shouldBecomeUnaryOperator.js';

const processors = new Map([
	[ParseTreeTokenType.AS, processAs],
	[ParseTreeTokenType.ASSIGNMENT_OPERATOR, processBinaryOperator],
	[ParseTreeTokenType.BINARY_OPERATOR, processBinaryOperator],
	[ParseTreeTokenType.COLON, processColon],
	[ParseTreeTokenType.COMMA, processComma],
	[ParseTreeTokenType.CURLY_LEFT_BRACKET, processCurlyLeftBracket],
	[ParseTreeTokenType.CURVED_LEFT_BRACKET, processCurvedLeftBracket],
	[ParseTreeTokenType.CURVED_RIGHT_BRACKET, processCurvedRightBracket],
	[ParseTreeTokenType.DEF, processDef],
	[ParseTreeTokenType.DOT, processDot],
	[ParseTreeTokenType.ESCAPED_LINEBREAK, processEscapedLineBreak],
	[ParseTreeTokenType.EXCEPT, processExcept],
	[ParseTreeTokenType.FINALLY, processFinally],
	[ParseTreeTokenType.FOR_LOOP, processForLoop],
	[ParseTreeTokenType.IF_STATEMENT, processIf],
	[ParseTreeTokenType.IMPORT, processImport],
	[ParseTreeTokenType.INDENT, processIndent],
	[ParseTreeTokenType.IN, processIn],
	[ParseTreeTokenType.LONG_STRING_LITERAL, processLongStringLiteral],
	[ParseTreeTokenType.SQUARE_LEFT_BRACKET, processSquareLeftBracket],
	[ParseTreeTokenType.SQUARE_RIGHT_BRACKET, processSquareRightBracket],
	[ParseTreeTokenType.UNARY_OPERATOR, processUnaryOperator],
	[ParseTreeTokenType.WHILE_LOOP, processWhileLoop]
]);

export function addToken(prev, next) {
	while (prev.parentNode !== null && isCompleteTokenWithNext(prev, next))
		prev = prev.parentNode;

	if (shouldBecomeUnaryOperator(prev, next))
		next.type = ParseTreeTokenType.UNARY_OPERATOR;

	prev = addArgumentListIfNeeded(prev, next);
	prev = addDictionaryKeyValuePairIfNeeded(prev, next);

	const processor = processors.get(next.type);
	if (processor !== undefined)
		return processor(prev, next);

	prev.appendChild(next);
	return next;
};