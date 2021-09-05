import { BinaryOperatorInstruction } from '../../../execution/instructions/BinaryOperatorInstruction.js';
import { binaryOperatorInstructionToJavaScriptInstruction } from './binaryOperatorInstructionToJavaScriptInstruction.js';
import { CallCommandInstruction } from '../../../execution/instructions/CallCommandInstruction.js';
import { callCommandInstructionToJavaScriptInstruction } from './callCommandInstructionToJavaScriptInstruction.js';
import { isLocalVariable } from './isLocalVariable.js';
import { PushInstruction } from '../../../execution/instructions/PushInstruction.js';
import { pushInstructionToJavaScriptInstruction } from './pushInstructionToJavaScriptInstruction.js';
import { unaryOperatorInstructionToJavaScriptInstruction } from './unaryOperatorInstructionToJavaScriptInstruction.js';
import { UnaryOperatorInstruction } from '../../../execution/instructions/UnaryOperatorInstruction.js';
import { variableReadInstructionToJavaScriptInstruction } from './variableReadInstructionToJavaScriptInstruction.js';
import { VariableReadInstruction } from '../../../execution/instructions/VariableReadInstruction.js';

export function instructionToJavaScriptInstruction(instructions, index, info, compileOptions) {
	if (typeof compileOptions !== 'object')
		throw new Error(`compileOptions must be an object.  Not: ${compileOptions}`);
	const instruction = instructions[index];
	if (instruction instanceof BinaryOperatorInstruction)
		return binaryOperatorInstructionToJavaScriptInstruction(instruction);
	else if (instruction instanceof CallCommandInstruction) {
		return callCommandInstructionToJavaScriptInstruction(instruction, false, compileOptions);
	}
	else if (instruction instanceof PushInstruction)
		return pushInstructionToJavaScriptInstruction(instruction);
	else if (instruction instanceof UnaryOperatorInstruction)
		return unaryOperatorInstructionToJavaScriptInstruction(instruction);
	else if (instruction instanceof VariableReadInstruction) {
		const isLocal = isLocalVariable(instruction.variableName, index, instructions, info.isForProcedure, info.parameters);
		return variableReadInstructionToJavaScriptInstruction(instruction, isLocal);
	}
};