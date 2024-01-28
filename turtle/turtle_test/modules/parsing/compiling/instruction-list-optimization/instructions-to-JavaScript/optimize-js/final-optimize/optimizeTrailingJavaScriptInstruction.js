import { getJumpToIndexes } from '../../getJumpToIndexes.js';
import { JavaScriptInstruction } from '../../../../../execution/instructions/JavaScriptInstruction.js';
import { OutputInstruction } from '../../../../../execution/instructions/OutputInstruction.js';
import { OutputNullInstruction } from '../../../../../execution/instructions/OutputNullInstruction.js';
import { removeTrailingLocalSetCalls } from './removeTrailingLocalSetCalls.js';

function isOutputInstruction(instruction) {
	if (instruction instanceof OutputInstruction)
		return true;
	if (instruction instanceof OutputNullInstruction)
		return true;
	return false;
}

export function optimizeTrailingJavaScriptInstruction(instructions) {
	const jumpToIndexes = new Set(getJumpToIndexes(instructions));
	const outIndexes = new Set();
	for (let i = 0; i < instructions.length; i++) {
		if (isOutputInstruction(instructions[i]))
			outIndexes.add(i);
	}
	for (let outIndex of outIndexes) {
		for (let i = outIndex - 1; i >= 0; i--) {
			if (outIndexes.has(i))
				continue;
			const instruction = instructions[i];
			if (instruction instanceof JavaScriptInstruction) {
				instruction.setCode(removeTrailingLocalSetCalls(instruction.code));
				break;
			}
			if (jumpToIndexes.has(i))
				break;
		}
	}
};