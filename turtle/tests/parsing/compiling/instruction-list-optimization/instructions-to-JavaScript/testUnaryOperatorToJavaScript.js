import { instructionsDTOToInstructions } from '../../../../helpers/instructionsDTOToInstructions.js';
import { unaryOperatorToJavaScript } from '../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/unaryOperatorToJavaScript.js';

export function testUnaryOperatorToJavaScript(logger) {
	const instructionsDTO = [
		{'name': 'push', 'value': 5, 'isCloningValue': false},
		{'name': 'unary-operator', 'symbol': '-'},
		{'name': 'call-cmd', 'commandName': 'print', 'numArgs': 1},
		{'name': 'pop'},
	];
	const compileOptions = {};
	const instructions = instructionsDTOToInstructions(instructionsDTO);
	const result = unaryOperatorToJavaScript(instructions, 1, {'isForProcedure': false, 'parameters': []}, compileOptions);
	const expected = '-(5)';
	if (result !== expected)
		logger(`Expected "${expected}" but got "${result}"`);
};