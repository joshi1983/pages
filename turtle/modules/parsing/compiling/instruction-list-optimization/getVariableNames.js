import { getArgPushIndex } from './getArgPushIndex.js';
import { PushInstruction } from '../../execution/instructions/PushInstruction.js';

function addNameForIndex(instructions, commandIndex, result, index) {
	const varNameIndex = getArgPushIndex(instructions, commandIndex - 1, index);
	const varNamePushInstruction = instructions[varNameIndex];
	if (varNamePushInstruction instanceof PushInstruction &&
	typeof varNamePushInstruction.value === 'string') {
		result.push(varNamePushInstruction.value);
	}
}

/*
Tries to get the variable name from the first argument/input passed to the indicated CallCommandInstruction.
*/
export function getVariableNames(instructions, commandIndex) {
	if (!(instructions instanceof Array))
		throw new Error('instructions must be an Array');
	if (typeof commandIndex !== 'number')
		throw new Error('commandIndex must be a number');

	const instruction = instructions[commandIndex];
	if (typeof instruction.numArgs !== 'number')
		throw new Error('commandIndex must be the index of a CallCommandInstruction with a numArgs property');

	const commandName = instruction.command.primaryName;
	let index = instruction.numArgs - 1;
	const result = [];
	addNameForIndex(instructions, commandIndex, result, index);
	if (commandName === 'swap') {
		addNameForIndex(instructions, commandIndex, result, index - 1);
	}
	return result;
};