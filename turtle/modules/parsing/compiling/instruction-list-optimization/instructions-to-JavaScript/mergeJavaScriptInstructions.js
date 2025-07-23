import { getJumpToIndexes } from './getJumpToIndexes.js';
import { JavaScriptInstruction } from '../../../execution/instructions/JavaScriptInstruction.js';
import { MapUtils } from '../../../../MapUtils.js';
import { removeInstructions } from '../removeInstructions.js';
import { sanitizeMergedJS } from './optimize-js/sanitizeMergedJS.js';

function mergeJavaScriptInstructionsCluster(instructions, index) {
	if (!(instructions[index] instanceof JavaScriptInstruction))
		return;
	const rigidIndexes = getJumpToIndexes(instructions).filter(i => i <= index);
	let minI = 0;
	if (rigidIndexes.length > 0)
		minI = rigidIndexes[rigidIndexes.length - 1];
	if (minI === index)
		return;
	const startTime = Date.now();
	let code = '';
	let i;
	const namedFunctionsMap = new Map();
	for (i = index; i >= minI; i--) {
		const instruction = instructions[i];
		if (instruction instanceof JavaScriptInstruction) {
			if (instruction.extraNamedFunctionsMap !== undefined)
				MapUtils.merge(namedFunctionsMap, instruction.extraNamedFunctionsMap);
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
	const afterForLoopDuration = Date.now() - startTime;
	if (afterForLoopDuration > 1000)
		console.log(`afterForLoopDuration took ${afterForLoopDuration}ms. index=${index}`);
	if (i < index - 1) {
		const preSanitizedCode = code;
		code = sanitizeMergedJS(code);
		const aftersanitizeMergedJSDuration = Date.now() - startTime;
		if (aftersanitizeMergedJSDuration > 1000)
			console.log(`aftersanitizeMergedJSDuration took ${aftersanitizeMergedJSDuration}ms. index=${index}, code=${code}, preSanitizedCode=${preSanitizedCode}`);
		const newInstruction = new JavaScriptInstruction(code, instructions[i + 1].parseTreeToken, namedFunctionsMap);
		instructions[i + 1] = newInstruction;
		removeInstructions(instructions, i + 2, index - i - 1);
	}
}

export function mergeJavaScriptInstructions(instructions) {
	for (let i = instructions.length - 1; i > 0; i--) {
		mergeJavaScriptInstructionsCluster(instructions, i);
	}
};