import { BinaryOperatorInstruction } from '../../../execution/instructions/BinaryOperatorInstruction.js';
import { binaryOperatorInstructionToJavaScriptInstruction } from './binaryOperatorInstructionToJavaScriptInstruction.js';
import { CallCommandInstruction } from '../../../execution/instructions/CallCommandInstruction.js';
import { callCommandInstructionToJavaScriptInstruction } from './callCommandInstructionToJavaScriptInstruction.js';
import { IncrementRepcountInstruction } from '../../../execution/instructions/IncrementRepcountInstruction.js';
import { incrementRepcountInstructionToJavaScriptInstruction } from './incrementRepcountInstructionToJavaScriptInstruction.js';
import { PopInstruction } from '../../../execution/instructions/PopInstruction.js';
import { popInstructionToJavaScriptInstruction } from './popInstructionToJavaScriptInstruction.js';
import { PopRepcountInstruction } from '../../../execution/instructions/PopRepcountInstruction.js';
import { popRepcountInstructionToJavaScriptInstruction } from './popRepcountInstructionToJavaScriptInstruction.js';
import { PushFromStackInstruction } from '../../../execution/instructions/PushFromStackInstruction.js';
import { pushFromStackInstructionToJavaScriptInstruction } from './pushFromStackInstructionToJavaScriptInstruction.js';
import { PushInstruction } from '../../../execution/instructions/PushInstruction.js';
import { pushInstructionToJavaScriptInstruction } from './pushInstructionToJavaScriptInstruction.js';
import { shouldValueBeTranslatedToJavaScriptCode } from './shouldValueBeTranslatedToJavaScriptCode.js';
import { UnaryOperatorInstruction } from '../../../execution/instructions/UnaryOperatorInstruction.js';
import { unaryOperatorInstructionToJavaScriptInstruction } from './unaryOperatorInstructionToJavaScriptInstruction.js';
import { VariableReadInstruction } from '../../../execution/instructions/VariableReadInstruction.js';
import { variableReadInstructionToJavaScriptInstruction } from './variableReadInstructionToJavaScriptInstruction.js';

/*
This is to convert more LogoInstructions to JavaScriptInstruction to help mergeJavaScriptInstruction merge more instructions.
*/
export function convertExtraInstructionsToJavaScript(instructions, isForProcedure, compileOptions) {
	if (typeof compileOptions !== 'object')
		throw new Error('compileOptions must be an object but got ' + compileOptions);
	for (let i = 0; i < instructions.length; i++) {
		let instruction = instructions[i];
		if (instruction instanceof PopInstruction)
			instruction = popInstructionToJavaScriptInstruction(instruction);
		else if (instruction instanceof PushInstruction) {
			if (shouldValueBeTranslatedToJavaScriptCode(instruction.value))
				instruction = pushInstructionToJavaScriptInstruction(instruction);
		}
		else if (instruction instanceof VariableReadInstruction) {
			let isLocal = undefined;
			if (isForProcedure === false)
				isLocal = false;
			instruction = variableReadInstructionToJavaScriptInstruction(instruction, isLocal);
		}
		else if (instruction instanceof UnaryOperatorInstruction)
			instruction = unaryOperatorInstructionToJavaScriptInstruction(instruction);
		else if (instruction instanceof BinaryOperatorInstruction)
			instruction = binaryOperatorInstructionToJavaScriptInstruction(instruction);
		else if (instruction instanceof PopRepcountInstruction)
			instruction = popRepcountInstructionToJavaScriptInstruction(instruction);
		else if (instruction instanceof PushFromStackInstruction)
			instruction = pushFromStackInstructionToJavaScriptInstruction(instruction);
		else if (instruction instanceof IncrementRepcountInstruction)
			instruction = incrementRepcountInstructionToJavaScriptInstruction(instruction);
		else if (instruction instanceof CallCommandInstruction) {
			let pushResult = true;
			if (instruction.command.returnTypes === null) {
				pushResult = false;
			}
			instruction = callCommandInstructionToJavaScriptInstruction(instruction, pushResult, compileOptions);
		}
		instructions[i] = instruction;
	}
};