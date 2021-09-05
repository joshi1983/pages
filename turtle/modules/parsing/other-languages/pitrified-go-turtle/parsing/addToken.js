import { isCompleteWithNext } from './isCompleteWithNext.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { processAssignmentOperator } from './processAssignmentOperator.js';
import { processBinaryOperator} from './processBinaryOperator.js';
import { processCase } from './processCase.js';
import { processColon } from './processColon.js';
import { processComma } from './processComma.js';
import { processConst } from './processConst.js';
import { processCurlyLeftBracket } from './processCurlyLeftBracket.js';
import { processCurlyRightBracket } from './processCurlyRightBracket.js';
import { processCurvedLeftBracket } from './processCurvedLeftBracket.js';
import { processCurvedRightBracket } from './processCurvedRightBracket.js';
import { processDefault } from './processDefault.js';
import { processDot } from './processDot.js';
import { processFor } from './processFor.js';
import { processFunc } from './processFunc.js';
import { processIdentifier } from './processIdentifier.js';
import { processIf } from './processIf.js';
import { processImport } from './processImport.js';
import { processInterface } from './processInterface.js';
import { processSemicolon } from './processSemicolon.js';
import { processSquareLeftBracket } from './processSquareLeftBracket.js';
import { processSquareRightBracket } from './processSquareRightBracket.js';
import { processStringLiteral }from './processStringLiteral.js';
import { processStruct } from './processStruct.js';
import { processTripleDot } from './processTripleDot.js';
import { processUnderlyingType } from './processUnderlyingType.js';

const processors = new Map([
	[ParseTreeTokenType.ASSIGNMENT_OPERATOR, processAssignmentOperator],
	[ParseTreeTokenType.BINARY_OPERATOR, processBinaryOperator],
	[ParseTreeTokenType.CASE, processCase],
	[ParseTreeTokenType.COLON, processColon],
	[ParseTreeTokenType.COMMA, processComma],
	[ParseTreeTokenType.CONST, processConst],
	[ParseTreeTokenType.CURLY_LEFT_BRACKET, processCurlyLeftBracket],
	[ParseTreeTokenType.CURLY_RIGHT_BRACKET, processCurlyRightBracket],
	[ParseTreeTokenType.CURVED_LEFT_BRACKET, processCurvedLeftBracket],
	[ParseTreeTokenType.CURVED_RIGHT_BRACKET, processCurvedRightBracket],
	[ParseTreeTokenType.DEFAULT, processDefault],
	[ParseTreeTokenType.DOT, processDot],
	[ParseTreeTokenType.FOR, processFor],
	[ParseTreeTokenType.FUNC, processFunc],
	[ParseTreeTokenType.IDENTIFIER, processIdentifier],
	[ParseTreeTokenType.IF, processIf],
	[ParseTreeTokenType.IMPORT, processImport],
	[ParseTreeTokenType.INTERFACE, processInterface],
	[ParseTreeTokenType.SEMICOLON, processSemicolon],
	[ParseTreeTokenType.SQUARE_LEFT_BRACKET, processSquareLeftBracket],
	[ParseTreeTokenType.SQUARE_RIGHT_BRACKET, processSquareRightBracket],
	[ParseTreeTokenType.STRING_LITERAL, processStringLiteral],
	[ParseTreeTokenType.STRUCT, processStruct],
	[ParseTreeTokenType.TRIPLE_DOT, processTripleDot],
	[ParseTreeTokenType.UNDERLYING_TYPE, processUnderlyingType]
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