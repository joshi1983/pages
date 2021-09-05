import { getAboveCompletedTokens } from './getAboveCompletedTokens.js';
import { addCodeBlockIfNeeded } from './addCodeBlockIfNeeded.js';
import { processAs } from './processAs.js';
import { processBinaryOperator } from './processBinaryOperator.js';
import { processCase } from './processCase.js';
import { processComma } from './processComma.js';
import { processCurvedLeftBracket } from './processCurvedLeftBracket.js';
import { processCurvedRightBracket } from './processCurvedRightBracket.js';
import { processDef } from './processDef.js';
import { processDim } from './processDim.js';
import { processDo } from './processDo.js';
import { processDot } from './processDot.js';
import { processEach } from './processEach.js';
import { processElse } from './processElse.js';
import { processElseif } from './processElseif.js';
import { processEnd } from './processEnd.js';
import { processExit } from './processExit.js';
import { processFor } from './processFor.js';
import { processFunction } from './processFunction.js';
import { processGosub } from './processGosub.js';
import { processIdentifier } from './processIdentifier.js';
import { processIf } from './processIf.js';
import { processIn } from './processIn.js';
import { processLoop } from './processLoop.js';
import { processNext } from './processNext.js';
import { processNumberLiteral } from './processNumberLiteral.js';
import { processSelect } from './processSelect.js';
import { processSemicolon } from './processSemicolon.js';
import { processShared } from './processShared.js';
import { processSub } from './processSub.js';
import { processThen } from './processThen.js';
import { processType } from './processType.js';
import { processUntil } from './processUntil.js';
import { processWend } from './processWend.js';
import { processWhile } from './processWhile.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const processors = new Map([
	[ParseTreeTokenType.AS, processAs],
	[ParseTreeTokenType.BINARY_OPERATOR, processBinaryOperator],
	[ParseTreeTokenType.CASE, processCase],
	[ParseTreeTokenType.COMMA, processComma],
	[ParseTreeTokenType.CURVED_LEFT_BRACKET, processCurvedLeftBracket],
	[ParseTreeTokenType.CURVED_RIGHT_BRACKET, processCurvedRightBracket],
	[ParseTreeTokenType.DEF, processDef],
	[ParseTreeTokenType.DEF_PRIMITIVE, processDim],
	[ParseTreeTokenType.DIM, processDim],
	[ParseTreeTokenType.DO, processDo],
	[ParseTreeTokenType.DOT, processDot],
	[ParseTreeTokenType.EACH, processEach],
	[ParseTreeTokenType.ELSE, processElse],
	[ParseTreeTokenType.ELSEIF, processElseif],
	[ParseTreeTokenType.END, processEnd],
	[ParseTreeTokenType.EXIT, processExit],
	[ParseTreeTokenType.FOR, processFor],
	[ParseTreeTokenType.FUNCTION, processFunction],
	[ParseTreeTokenType.GOSUB, processGosub],
	[ParseTreeTokenType.IDENTIFIER, processIdentifier],
	[ParseTreeTokenType.IF, processIf],
	[ParseTreeTokenType.IN, processIn],
	[ParseTreeTokenType.LET, processDim],
	[ParseTreeTokenType.LOOP, processLoop],
	[ParseTreeTokenType.NEXT, processNext],
	[ParseTreeTokenType.NUMBER_LITERAL, processNumberLiteral],
	[ParseTreeTokenType.REDIM, processDim],
	[ParseTreeTokenType.SELECT, processSelect],
	[ParseTreeTokenType.SEMICOLON, processSemicolon],
	[ParseTreeTokenType.SHARED, processShared],
	[ParseTreeTokenType.SUB, processSub],
	[ParseTreeTokenType.THEN, processThen],
	[ParseTreeTokenType.TYPE, processType],
	[ParseTreeTokenType.UNTIL, processUntil],
	[ParseTreeTokenType.WEND, processWend],
	[ParseTreeTokenType.WHILE, processWhile]
]);

export function addToken(previousToken, nextToken, functionsMap) {
	if (!(functionsMap instanceof Map))
		throw new Error(`functionsMap expected to be a Map but got ${functionsMap}`);
	const codeBlock = addCodeBlockIfNeeded(previousToken, nextToken);
	if (codeBlock !== undefined)
		previousToken = codeBlock;
	const processor = processors.get(nextToken.type);
	if (processor !== undefined) {
		return getAboveCompletedTokens(processor(previousToken, nextToken, functionsMap), functionsMap);
	}
	previousToken.appendChild(nextToken);
	return getAboveCompletedTokens(nextToken, functionsMap);
};