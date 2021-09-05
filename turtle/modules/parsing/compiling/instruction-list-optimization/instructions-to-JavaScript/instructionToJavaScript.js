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

export function instructionToJavaScript(instructions, index, info, compileOptions) {
	if (typeof compileOptions !== 'object')
		throw new Error(`compileOptions must be an object.  Not: ${compileOptions}`);
	const instruction = instructions[index];
	let code;
	let namedFunctionsMap = new Map();
	if (instruction instanceof BinaryOperatorInstruction) {
		const result = binaryOperatorToJavaScript(instructions, index, info, compileOptions);
		code = result.code;
		namedFunctionsMap = result.namedFunctionsMap;
	}
	else if (instruction instanceof CallCommandInstruction) {
		const wrapResult = callCommandInstructionToJavaScript(instructions, index, info, false, compileOptions);
		code = wrapResult.code;
		namedFunctionsMap = wrapResult.namedFunctionsMap;
	}
	else if (instruction instanceof PushInstruction)
		code = pushInstructionToJavaScript(instruction);
	else if (instruction instanceof UnaryOperatorInstruction) {
		const result = unaryOperatorToJavaScript(instructions, index, info, compileOptions);
		code = result.code;
		namedFunctionsMap = result.namedFunctionsMap;
	}
	else if (instruction instanceof VariableReadInstruction) {
		const isLocal = isLocalVariable(instruction.variableName, index, instructions, info.isForProcedure, info.parameters);
		code = variableReadToJavaScript(instruction, isLocal);
	}
	return {
		'code': code,
		'namedFunctionsMap': namedFunctionsMap
	};
};