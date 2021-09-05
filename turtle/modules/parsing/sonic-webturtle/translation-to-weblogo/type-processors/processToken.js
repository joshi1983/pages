import { genericProcessToken } from '../../../generic-parsing-utilities/genericProcessToken.js';
import { noop } from '../../../../noop.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processBinaryOperator } from './processBinaryOperator.js';
import { processCommand } from './processCommand.js';
import { processGo } from './processGo.js';
import { processIf } from './processIf.js';
import { processInputReference } from './processInputReference.js';
import { processLet } from './processLet.js';
import { processNumberLiteral } from './processNumberLiteral.js';
import { processProcStart } from './processProcStart.js';
import { processRepeat } from './processRepeat.js';
import { processStringLiteral } from './processStringLiteral.js';
import { processVariableReference } from './processVariableReference.js';

const typeProcessors = new Map([
	[ParseTreeTokenType.BINARY_OPERATOR, processBinaryOperator],
	[ParseTreeTokenType.COMMAND, processCommand],
	[ParseTreeTokenType.END, noop],
	[ParseTreeTokenType.GO, processGo],
	[ParseTreeTokenType.IF, processIf],
	[ParseTreeTokenType.INPUT_REFERENCE, processInputReference],
	[ParseTreeTokenType.LET, processLet],
	[ParseTreeTokenType.NUMBER_LITERAL, processNumberLiteral],
	[ParseTreeTokenType.PROC_START, processProcStart],
	[ParseTreeTokenType.REPEAT, processRepeat],
	[ParseTreeTokenType.RETURN, processCommand],
	[ParseTreeTokenType.STRING_LITERAL, processStringLiteral],
	[ParseTreeTokenType.VARIABLE_REFERENCE, processVariableReference],
]);

const processToken = genericProcessToken(typeProcessors);
export { processToken };