import { CallCommandInstruction } from '../execution/instructions/CallCommandInstruction.js';
import { Command } from '../Command.js';
import { getInstructionsFromToken } from './compileParameters.js';
import { PushInstruction } from '../execution/instructions/PushInstruction.js';
import { VariableReadInstruction } from '../execution/instructions/VariableReadInstruction.js';
await Command.asyncInit();

const lputInfo = Command.getCommandInfo('lput');
const makeInfo = Command.getCommandInfo('make');

export function compilePush(parseTreeTokens, procedures, result, logger) {
	// push variable name as a string.
	result.push(new PushInstruction(parseTreeTokens[0].val.toLowerCase(), parseTreeTokens[0], false));

	// push thing.
	getInstructionsFromToken(parseTreeTokens[1], procedures, result, logger);

	// read variable.
	result.push(new VariableReadInstruction(parseTreeTokens[0].val, parseTreeTokens[0]));

	// call lput thing list.
	result.push(new CallCommandInstruction(lputInfo, 2, parseTreeTokens[0].parentNode));

	// call make.
	result.push(new CallCommandInstruction(makeInfo, 2, parseTreeTokens[0].parentNode));
};