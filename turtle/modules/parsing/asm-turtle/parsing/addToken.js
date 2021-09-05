import { processColon } from './processColon.js';
import { processComma } from './processComma.js';
import { processInstruction } from './processInstruction.js';
import { processInstructionList } from './processInstructionList.js';
import { processLabel } from './processLabel.js';
import { processNumberLiteral } from './processNumberLiteral.js';
import { processProcStart } from './processProcStart.js';
import { processVariableReference } from './processVariableReference.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const processors = new Map([
	[ParseTreeTokenType.COLON, processColon],
	[ParseTreeTokenType.COMMA, processComma],
	[ParseTreeTokenType.INSTRUCTION, processInstruction],
	[ParseTreeTokenType.INSTRUCTION_LIST, processInstructionList],
	[ParseTreeTokenType.LABEL, processLabel],
	[ParseTreeTokenType.NUMBER_LITERAL, processNumberLiteral],
	[ParseTreeTokenType.PROC_START, processProcStart],
	[ParseTreeTokenType.VARIABLE_REFERENCE, processVariableReference],
]);

export function addToken(previousToken, nextToken) {
	const processor = processors.get(nextToken.type);
	if (processor !== undefined) {
		return processor(previousToken, nextToken);
	}
	previousToken.appendChild(nextToken);
	return nextToken;
};