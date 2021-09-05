import { CallCommandInstruction } from '../execution/instructions/CallCommandInstruction.js';
import { Command } from '../Command.js';
import { PushInstruction } from '../execution/instructions/PushInstruction.js';
await Command.asyncInit();

const dequeueInfo = Command.getCommandInfo('dequeue');

export function compileDequeue(parseTreeTokens, procedures, result, logger) {
	// push variable name as a string.
	result.push(new PushInstruction(parseTreeTokens[0].val.toLowerCase(), parseTreeTokens[0], false));

	// call dequeueInfo thing list.
	result.push(new CallCommandInstruction(dequeueInfo, 1, parseTreeTokens[0].parentNode, true));
};