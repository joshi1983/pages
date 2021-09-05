import { BinaryOperatorInstruction } from '../../../execution/instructions/BinaryOperatorInstruction.js';
import { binaryOperatorToJavaScript } from './binaryOperatorToJavaScript.js';
import { CallCommandInstruction } from '../../../execution/instructions/CallCommandInstruction.js';
import { callCommandInstructionToJavaScript } from './callCommandInstructionToJavaScript.js';
import { isLocalVariable } from './isLocalVariable.js';
import { PushInstruction } from '../../../execution/instructions/PushInstruction.js';
import { pushInstructionToJavaScript } from './pushInstructionToJavaScript.js';
import { unaryOperatorToJavaScript } from './unaryOperatorToJavaScript.js';
import { UnaryOperatorInstruction } from '../../../execution/instructions/UnaryOperatorInstruction.js';
import { variableReadToJavaScript } from './variableReadToJavaScript.js';
import { VariableReadInstruction } from '../../../execution/instructions/VariableReadInstruction.js';

// should include all the supported classes from instructionToJavaScript.
const classes = [
	BinaryOperatorInstruction,
	CallCommandInstruction,
	PushInstruction,
	UnaryOperatorInstruction,
	VariableReadInstruction
];

export function canBeConverted(instruction) {
	for (let i = 0; i < classes.length; i++) {
		if (instruction instanceof classes[i])
			return true;
	}
	return false;
};

export function instructionToJavaScript(instructions, index, info, compileOptions) {
	if (typeof compileOptions !== 'object')
		throw new Error(`compileOptions must be an object.  Not: ${compileOptions}`);
	const instruction = instructions[index];
	if (instruction instanceof BinaryOperatorInstruction)
		return binaryOperatorToJavaScript(instructions, index, info, compileOptions);
	else if (instruction instanceof CallCommandInstruction) {
		return callCommandInstructionToJavaScript(instructions, index, info, false, compileOptions);
	}
	else if (instruction instanceof PushInstruction)
		return pushInstructionToJavaScript(instruction);
	else if (instruction instanceof UnaryOperatorInstruction)
		return unaryOperatorToJavaScript(instructions, index, info, compileOptions);
	else if (instruction instanceof VariableReadInstruction) {
		const isLocal = isLocalVariable(instruction.variableName, index, instructions, info.isForProcedure, info.parameters);
		return variableReadToJavaScript(instruction, isLocal);
	}
};