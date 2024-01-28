import { Command } from '../Command.js';
import { JumpInstruction } from '../execution/instructions/JumpInstruction.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

function isBreakToken(token) {
	if (token.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;
	const info = Command.getCommandInfo(token.val);
	if (info === undefined || info.primaryName !== 'break')
		return false;
	return true;
}

export function setBreakJumpIndexesTo(newIndex, startIndex, instructions) {
	if (!Number.isInteger(newIndex))
		throw new Error(`newIndex must be an integer.  Not: ${newIndex}`);
	if (!Number.isInteger(startIndex))
		throw new Error(`startIndex must be an integer.  Not: ${startIndex}`);
	if (!(instructions instanceof Array))
		throw new Error(`instructions must be an Array.  Not: ${instructions}`);
	if (newIndex < startIndex)
		throw new Error(`newIndex should not be less than startIndex.  newIndex=${newIndex}, startIndex=${startIndex}`);
	for (let i = startIndex; i >= 0; i--) {
		const instruction = instructions[i];
		if (instruction instanceof JumpInstruction &&
		instruction.jumpToIndex === 0 &&
		isBreakToken(instruction.parseTreeToken))
			instruction.jumpToIndex = newIndex;
	}
};