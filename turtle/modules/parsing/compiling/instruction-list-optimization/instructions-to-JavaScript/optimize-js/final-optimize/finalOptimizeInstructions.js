import { JavaScriptInstruction } from '../../../../../execution/instructions/JavaScriptInstruction.js';
import { optimizeTrailingJavaScriptInstruction } from './optimizeTrailingJavaScriptInstruction.js';
import { optimizeWithConstantColours } from './optimizeWithConstantColours.js';
import { removeUnneededInitialVariableReads } from './removeUnneededInitialVariableReads.js';

/*
finalOptimizeInstructions performs some optimizations that undo some changes made by other optimizations.
Do not call finalOptimizeInstructions before any other optimizations because other optimizations may 
reverse some of these changes or make things less efficient.
finalOptimizeInstructions performs some changes that make the JavaScript run faster but also removes 
information that is important for other optimizations to work properly.
For example, local vs global scope of variables may become unknown.
*/
export function finalOptimizeInstructions(instructions, isForProcedure) {
	if (isForProcedure) {
		optimizeTrailingJavaScriptInstruction(instructions);
	}
	for (let i = 0; i < instructions.length; i++) {
		const instruction = instructions[i];
		if (instruction instanceof JavaScriptInstruction) {
			instruction.setCode(removeUnneededInitialVariableReads(instruction.code));
			optimizeWithConstantColours(instruction);
		}
	}
}