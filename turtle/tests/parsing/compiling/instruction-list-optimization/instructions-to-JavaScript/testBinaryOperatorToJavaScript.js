import { binaryOperatorToJavaScript } from '../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/binaryOperatorToJavaScript.js';
import { instructionsDTOToInstructions } from '../../../../helpers/instructionsDTOToInstructions.js';

export function testBinaryOperatorToJavaScript(logger) {
	const instructionsDTO = [
		{'name': 'push', 'value': 5, 'isCloningValue': false},
		{'name': 'push', 'value': 19, 'isCloningValue': false},
		{'name': 'binary-operator', 'symbol': '+'},
		{'name': 'call-cmd', 'commandName': 'print', 'numArgs': 1},
		{'name': 'pop'}
	];
	const compileOptions = {};
	const instructions = instructionsDTOToInstructions(instructionsDTO);
	const result = binaryOperatorToJavaScript(instructions, 2, {'isForProcedure': false, 'parameters': []}, compileOptions);
	const expected = '(5) + (19)';
	if (result !== expected)
		logger(`Expected "${expected}" but got "${result}"`);
};