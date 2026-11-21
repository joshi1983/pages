import { CallCommandInstruction } from '../execution/instructions/CallCommandInstruction.js';
import { Command } from '../Command.js';
import { getInstructionsFromToken,
	asyncInit as getInstructionsFromTokenAsyncInit } from './compileParameters.js';
import { PushInstruction } from '../execution/instructions/PushInstruction.js';
import { VariableReadInstruction } from '../execution/instructions/VariableReadInstruction.js';

let fputInfo;
let makeInfo;

export async function asyncInit() {
	await Command.asyncInit();
	fputInfo = Command.getCommandInfo('fput');
	makeInfo = Command.getCommandInfo('make');
	await getInstructionsFromTokenAsyncInit();
};

export function compilePush(parseTreeTokens, procedures, result, logger) {
	// push variable name as a string.
	result.push(new PushInstruction(parseTreeTokens[0].val.toLowerCase(), parseTreeTokens[0], false));

	// push thing.
	getInstructionsFromToken(parseTreeTokens[1], procedures, result, logger);

	// read variable.
	result.push(new VariableReadInstruction(parseTreeTokens[0].val, parseTreeTokens[0]));

	// call fput thing list.
	result.push(new CallCommandInstruction(fputInfo, 2, parseTreeTokens[0].parentNode));

	// call make.
	result.push(new CallCommandInstruction(makeInfo, 2, parseTreeTokens[0].parentNode));
};