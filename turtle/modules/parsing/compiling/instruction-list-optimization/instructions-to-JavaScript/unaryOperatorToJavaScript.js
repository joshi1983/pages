import { instructionToJavaScript } from './instructionToJavaScript.js';

export function unaryOperatorToJavaScript(instructions, index, info, compileOptions) {
	const instruction = instructions[index];
	if (instruction.operatorSymbol !== '-')
		throw new Error('Only the - operator can be translated to JavaScript but got (' + instruction.operatorSymbol + ')');

	return '-(' + instructionToJavaScript(instructions, index - 1, info, compileOptions) + ')';
};