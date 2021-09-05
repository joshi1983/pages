import { callCommandInstructionToJavaScript } from '../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/callCommandInstructionToJavaScript.js';
import { instructionsDTOToInstructions } from '../../../../helpers/instructionsDTOToInstructions.js';

export function testCallCommandInstructionToJavaScript(logger) {
	const instructionsDTO = [
		{'name': 'push', 'value': 5, 'isCloningValue': false},
		{'name': 'push', 'value': 19, 'isCloningValue': false},
		{'name': 'binary-operator', 'symbol': '+'},
		{'name': 'call-cmd', 'commandName': 'print', 'numArgs': 1},
		{'name': 'pop'}
	];
	const compileOptions = {};
	const instructions = instructionsDTOToInstructions(instructionsDTO);
	const result = callCommandInstructionToJavaScript(instructions, 3, {'isForProcedure': false, 'parameters': []}, false, compileOptions);
	const expected = 'context.turtle.print((5) + (19))';
	if (result !== expected)
		logger(`Expected "${expected}" but got "${result}"`);
	const result2 = callCommandInstructionToJavaScript(instructions, 3, {'isForProcedure': false, 'parameters': []}, true, compileOptions);
	const expected2 = 'context.valueStack.push(context.turtle.print((5) + (19)))';
	if (result2 !== expected2)
		logger(`Expected "${expected2}" but got "${result2}"`);
};