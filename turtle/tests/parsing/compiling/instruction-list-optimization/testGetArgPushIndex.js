import { instructionsDTOToInstructions } from '../../../helpers/instructionsDTOToInstructions.js';
import { getArgPushIndex } from '../../../../modules/parsing/compiling/instruction-list-optimization/getArgPushIndex.js';

export function testGetArgPushIndex(logger) {
	const instructionsDTO = [
		{'name': 'pop'}, // index 0
		{'name': 'push', 'value': 5, 'isCloningValue': false}, // index 1
		{'name': 'push', 'value': 2, 'isCloningValue': false}, // index 2
		{'name': 'binary-operator', 'symbol': '+'}, // index 3
		{'name': 'push', 'value': 3, 'isCloningValue': false}, // index 4
		{'name': 'unary-operator', 'symbol': '-'}, // index 5
		{'name': 'binary-operator', 'symbol': '*'}, // index 6
		{'name': 'call-cmd', 'commandName': 'sin', 'numArgs': 1}, // index 7
		{'name': 'call-cmd', 'commandName': 'forward', 'numArgs': 1}, // index 8
		{'name': 'pop'} // index 9
	];
	const instructions = instructionsDTOToInstructions(instructionsDTO);
	const cases = [
		{'in': [2, 0], 'result': 2},
		{'in': [2, 1], 'result': 1},
		{'in': [3, 1], 'result': 0},
		{'in': [4, 1], 'result': 3},
		{'in': [5, 1], 'result': 3}
	];
	cases.forEach(function(caseInfo, index) {
		const result = getArgPushIndex(instructions, caseInfo.in[0], caseInfo.in[1]);
		if (result !== caseInfo.result)
			logger(`Case ${index}, Expected result ${caseInfo.result} but got ${result}`);
	});
};