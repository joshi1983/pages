import { processBinaryOperator } from './processBinaryOperator.js';
import { processCommand } from './processCommand.js';
import { processElse } from './processElse.js';
import { processEndIf } from './processEndIf.js';
import { processNext } from './processNext.js';
import { processProcStart } from './processProcStart.js';
import { processValueToken } from './processValueToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const processors = new Map([
	[ParseTreeTokenType.BINARY_OPERATOR, processBinaryOperator],
	[ParseTreeTokenType.COMMAND, processCommand],
	[ParseTreeTokenType.ELSE, processElse],
	[ParseTreeTokenType.END, processCommand],
	[ParseTreeTokenType.ENDIF, processEndIf],
	[ParseTreeTokenType.GO, processCommand],
	[ParseTreeTokenType.IF, processCommand],
	[ParseTreeTokenType.INPUT_REFERENCE, processValueToken],
	[ParseTreeTokenType.LET, processCommand],
	[ParseTreeTokenType.NEXT, processNext],
	[ParseTreeTokenType.NUMBER_LITERAL, processValueToken],
	[ParseTreeTokenType.PROC_START, processProcStart],
	[ParseTreeTokenType.REPEAT, processCommand],
	[ParseTreeTokenType.RETURN, processCommand],
	[ParseTreeTokenType.STRING_LITERAL, processValueToken],
	[ParseTreeTokenType.VARIABLE_REFERENCE, processValueToken],
]);

export function addToken(previousToken, nextToken) {
	const processor = processors.get(nextToken.type);
	if (processor !== undefined) {
		return processor(previousToken, nextToken);
	}
	previousToken.appendChild(nextToken);
	return nextToken;
};