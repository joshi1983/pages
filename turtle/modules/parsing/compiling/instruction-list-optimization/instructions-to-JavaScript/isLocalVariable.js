import { CallCommandInstruction } from '../../../execution/instructions/CallCommandInstruction.js';
import { getArgPushIndex } from '../getArgPushIndex.js';
import { getJumpToIndexes } from './getJumpToIndexes.js';
import { JavaScriptInstruction } from '../../../execution/instructions/JavaScriptInstruction.js';
import { JumpIfTrueInstruction } from '../../../execution/instructions/JumpIfTrueInstruction.js';
import { JumpInstruction } from '../../../execution/instructions/JumpInstruction.js';
import { MaybeDecided } from '../../../../MaybeDecided.js';
import { PushForCountInstruction } from '../../../execution/instructions/PushForCountInstruction.js';

export function isLocalmakeInstruction(instructions, i, varName) {
	const instruction = instructions[i];
	if (instruction instanceof JavaScriptInstruction) {
		return instruction.code.indexOf(`context.localmake("${varName}",`) !== -1 ? MaybeDecided.Yes : MaybeDecided.No;
	}
	else if (!(instruction instanceof CallCommandInstruction))
		return MaybeDecided.No;
	if (instruction.command.primaryName !== 'localmake')
		return MaybeDecided.No;
	const varNameIndex = getArgPushIndex(instructions, i - 1, 1);
	const varNameInstruction = instructions[varNameIndex];
	if (varNameInstruction !== undefined) {
		if (typeof varNameInstruction.value === 'string')
			return varName === varNameInstruction.value ? MaybeDecided.Yes : MaybeDecided.No;
		else
			return MaybeDecided.Maybe;
	}
	return MaybeDecided.Maybe;
};

function isLocalmakeAlwaysCalledBefore(varName, index, instructions) {
	const jumpIndexes = getJumpToIndexes(instructions).filter(jumpIndex => jumpIndex <= index);
	const lastJumpIndex = jumpIndexes[jumpIndexes.length - 1];
	let minI = 0;
	if (lastJumpIndex !== undefined)
		minI = lastJumpIndex;
	for (let i = index - 1; i >= minI; i--) {
		if (isLocalmakeInstruction(instructions, i, varName) === MaybeDecided.Yes)
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
		return MaybeDecided.No; // if we're not in a procedure, the variable can't be local.
	if (parameters.indexOf(varName) !== -1)
		return MaybeDecided.Yes; // all parameters are local.
	if (isLocalmakeAlwaysCalledBefore(varName, index, instructions))
		return MaybeDecided.Yes;
	let jumpFound = false;
	// look for any localmake or for instruction that might make the variable local.
	for (let i = 0; i < instructions.length; i++) {
		const instruction = instructions[i];

		// if we're passed the variable read instruction and haven't found a jump yet, it must be global.
		if (i >= index && jumpFound === false)
			return MaybeDecided.No;
		if (instruction instanceof JumpInstruction || instruction instanceof JumpIfTrueInstruction)
			jumpFound = true;
		if (isLocalmakeInstruction(instructions, i, varName) !== MaybeDecided.No) {
			if (i < index && jumpFound === false)
				return MaybeDecided.Yes;
			else
				return MaybeDecided.Maybe;
		}
		else if (instruction instanceof PushForCountInstruction) {
			// get the corresponding variable name. x, 0, 5, 1
			const varNameIndex = getArgPushIndex(instructions, i - 1, 3);
			if (varNameIndex === undefined)
				return MaybeDecided.Maybe; // we don't know.
			if (instructions[varNameIndex].value === varName) {
				if (i < index && jumpFound === false)
					return MaybeDecided.Yes;
				else
					return MaybeDecided.Maybe;
			}
		}
	}
	return MaybeDecided.No;
};