import { instructionToJavaScript } from './instructionToJavaScript.js';
import { wrapWithBracketsIfNeeded } from './wrapWithBracketsIfNeeded.js';

export function unaryOperatorToJavaScript(instructions, index, info, compileOptions) {
	const instruction = instructions[index];
	if (instruction.operatorSymbol !== '-')
		throw new Error('Only the - operator can be translated to JavaScript but got (' + instruction.operatorSymbol + ')');
	const result = instructionToJavaScript(instructions, index - 1, info, compileOptions);
	let code = '-' + wrapWithBracketsIfNeeded(result.code);
	return {
		'code': code,
		'namedFunctionsMap': result.namedFunctionsMap
	};
};