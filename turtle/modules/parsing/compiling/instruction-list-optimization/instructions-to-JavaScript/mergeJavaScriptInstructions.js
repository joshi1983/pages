import { getJumpToIndexes } from './getJumpToIndexes.js';
import { JavaScriptInstruction } from '../../../execution/instructions/JavaScriptInstruction.js';
import { LogoInstruction } from '../../../execution/instructions/LogoInstruction.js';
import { removeInstructions } from '../removeInstructions.js';
import { StringBuffer } from '../../../../StringBuffer.js';

function mergeJavaScriptInstructionsCluster(instructions, index) {
	if (!(instructions[index] instanceof JavaScriptInstruction))
		return;
	const rigidIndexes = getJumpToIndexes(instructions).filter(i => i <= index);
	let minI = 0;
	if (rigidIndexes.length > 0)
		minI = rigidIndexes[rigidIndexes.length - 1];
	if (minI === index)
		return;
	let code = '';
	let i;
	for (i = index; i >= minI; i--) {
		const instruction = instructions[i];
		if (instruction instanceof JavaScriptInstruction) {
			if (code === '') {
				if (!instruction.code.trim().endsWith(';'))
					code = instruction.code + ';';
				else
					code = instruction.code;
			}
			else if (!instruction.code.trim().endsWith(';'))
				code = instruction.code + ';\n' + code;
			else
				code = instruction.code + '\n' + code;
		}
		else {
			break;
		}
	}
	if (i < index - 1) {
		const newInstruction = new JavaScriptInstruction(code, instructions[i + 1].parseTreeToken);
		instructions[i + 1] = newInstruction;
		removeInstructions(instructions, i + 2, index - i - 1);
	}
}

export function mergeJavaScriptInstructions(instructions) {
	for (let i = instructions.length - 1; i > 0; i--) {
		mergeJavaScriptInstructionsCluster(instructions, i);
	}
};