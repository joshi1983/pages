import { genericProcessToken } from '../../../generic-parsing-utilities/genericProcessToken.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processDoWhile } from './processDoWhile.js';
import { processForever } from './processForever.js';
import { processIf } from './processIf.js';
import { processIfElse } from './processIfElse.js';
import { processInstruction } from './processInstruction.js';
import { processInstructionList } from './processInstructionList.js';
import { processLabelAnchor } from './processLabelAnchor.js';
import { processNumberLiteral } from './processNumberLiteral.js';
import { processProcStart } from './processProcStart.js';
import { processVariableDeclarations } from './processVariableDeclarations.js';
import { processVariableReference } from './processVariableReference.js';
import { processWhile } from './processWhile.js';

const typeProcessors = new Map([
	[ParseTreeTokenType.DO_WHILE, processDoWhile],
	[ParseTreeTokenType.FOREVER, processForever],
	[ParseTreeTokenType.IF, processIf],
	[ParseTreeTokenType.IF_ELSE, processIfElse],
	[ParseTreeTokenType.INSTRUCTION, processInstruction],
	[ParseTreeTokenType.INSTRUCTION_LIST, processInstructionList],
	[ParseTreeTokenType.LABEL_ANCHOR, processLabelAnchor],
	[ParseTreeTokenType.NUMBER_LITERAL, processNumberLiteral],
	[ParseTreeTokenType.PROC_START, processProcStart],
	[ParseTreeTokenType.VAR_DECLARATIONS, processVariableDeclarations],
	[ParseTreeTokenType.VARIABLE_REFERENCE, processVariableReference],
	[ParseTreeTokenType.WHILE, processWhile]
]);

const processToken = genericProcessToken(typeProcessors);
export { processToken };