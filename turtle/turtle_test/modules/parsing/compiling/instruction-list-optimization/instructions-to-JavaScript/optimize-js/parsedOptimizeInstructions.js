import { JavaScriptInstruction } from '../../../../execution/instructions/JavaScriptInstruction.js';
import { optimizeJS } from './optimizeJS.js';

export function parsedOptimizeInstructions(instructions, isForProcedure) {
	for (let i = instructions.length - 1; i >= 0; i--) {
		const instruction = instructions[i];
		if (instruction instanceof JavaScriptInstruction) {
			const code = instruction.code;
			const newCode = optimizeJS(code, isForProcedure);
			instruction.setCode(newCode);
		}
	}
};