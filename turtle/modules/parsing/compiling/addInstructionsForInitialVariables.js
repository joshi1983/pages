import { CallCommandInstruction } from '../execution/instructions/CallCommandInstruction.js';
import { Command } from '../Command.js';
import { PopInstruction } from '../execution/instructions/PopInstruction.js';
import { PushInstruction } from '../execution/instructions/PushInstruction.js';
import { shouldValueBeCloned } from './shouldValueBeCloned.js';
await Command.asyncInit();
const makeInfo = Command.getCommandInfo('make');

export function addInstructionsForInitialVariables(rootToken, instructions, initialVariableValueMap) {
	for (const [varName, value] of initialVariableValueMap) {
		instructions.push(new PushInstruction(varName, rootToken, false));
		instructions.push(new PushInstruction(value, rootToken, shouldValueBeCloned(value)));
		instructions.push(new CallCommandInstruction(makeInfo, 2, rootToken));
		instructions.push(new PopInstruction(rootToken));
	}
};