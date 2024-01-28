import { CallCommandInstruction } from '../../../execution/instructions/CallCommandInstruction.js';
import { getArgPushIndex } from '../getArgPushIndex.js';
import { getJumpToIndexes } from './getJumpToIndexes.js';
import { JavaScriptInstruction } from '../../../execution/instructions/JavaScriptInstruction.js';
import { JumpIfTrueInstruction } from '../../../execution/instructions/JumpIfTrueInstruction.js';
import { JumpInstruction } from '../../../execution/instructions/JumpInstruction.js';
import { PushForCountInstruction } from '../../../execution/instructions/PushForCountInstruction.js';

function isLocalmakeInstruction(instructions, i, varName) {
	const instruction = instructions[i];
	if (instruction instanceof JavaScriptInstruction)
		return instruction.code.indexOf(`context.localmake("${varName}",`) !== -1;
	else if (!(instruction instanceof CallCommandInstruction))
		return false;
	if (instruction.command.primaryName !== 'localmake')
		return false;
	const varNameIndex = getArgPushIndex(instructions, i - 1, 1);
	return varName === instructions[varNameIndex].value;
}

function isLocalmakeAlwaysCalledBefore(varName, index, instructions) {
	const jumpIndexes = getJumpToIndexes(instructions).filter(jumpIndex => jumpIndex <= index);
	const lastJumpIndex = jumpIndexes[jumpIndexes.length - 1];
	let minI = 0;
	if (lastJumpIndex !== undefined)
		minI = lastJumpIndex;
	for (let i = index - 1; i >= minI; i--) {
		if (isLocalmakeInstruction(instructions, i, varName))
			return true;
	}
	return false;
}

/*

varName should be in lower case.
index should be the index of the instruction at which we are reading from the variable.

Returns true, if we know for sure that varName is a local variable where it is read.
Returns false, if we know for sure that varName is a global variable where it is read.
Returns undefined, if we don't know.

With more effort, we could reduce the cases where we return undefined but until then, 
we can determine that at runtime with a tiny performance hit.
*/
export function isLocalVariable(varName, index, instructions, isForProcedure, parameters) {
	if (isForProcedure === false)
		return false; // if we're not in a procedure, the variable can't be local.
	if (parameters.indexOf(varName) !== -1)
		return true; // all parameters are local.
	if (isLocalmakeAlwaysCalledBefore(varName, index, instructions))
		return true;
	let jumpFound = false;
	// look for any localmake or for instruction that might make the variable local.
	for (let i = 0; i < instructions.length; i++) {
		const instruction = instructions[i];

		// if we're passed the variable read instruction and haven't found a jump yet, it must be global.
		if (i >= index && jumpFound === false)
			return false;
		if (instruction instanceof JumpInstruction || instruction instanceof JumpIfTrueInstruction)
			jumpFound = true;
		if (isLocalmakeInstruction(instructions, i, varName)) {
			if (i < index && jumpFound === false)
				return true;
			else
				return undefined;
		}
		else if (instruction instanceof PushForCountInstruction) {
			// get the corresponding variable name. x, 0, 5, 1
			const varNameIndex = getArgPushIndex(instructions, i - 1, 3);
			if (varNameIndex === undefined)
				return undefined; // we don't know.
			if (instructions[varNameIndex].value === varName) {
				if (i < index && jumpFound === false)
					return true;
				else
					return undefined;
			}
		}
	}
	return false;
};