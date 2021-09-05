import { instructionsDTOToInstructions } from '../../../../helpers/instructionsDTOToInstructions.js';
import { isLocalVariable } from '../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/isLocalVariable.js';

export function testIsLocalVariable(logger) {
	/*
	Instructions are similar to the following Logo code:
	
	localmake "x 5
	for ["y 0 5 1] [
		fd 1
	]
	*/
	const instructionsDTO = [
		{'name': 'push', 'value': 'x', 'isCloningValue': false}, // index 0
		{'name': 'push', 'value': 5, 'isCloningValue': false}, // index 1
		{'name': 'call-cmd', 'commandName': 'localmake', 'numArgs': 2}, // index 2
		{'name': 'pop'}, // index 3
		{'name': 'push', 'value': 'y', 'isCloningValue': false}, // index 4
		{'name': 'push', 'value': 0, 'isCloningValue': false}, // index 5
		{'name': 'push', 'value': 5, 'isCloningValue': false}, // index 6
		{'name': 'push', 'value': 1, 'isCloningValue': false}, // index 7
		{'name': 'push-for-count'}, // index 8
		{'name': 'push', 'value': 1, 'isCloningValue': false}, // index 9
		{'name': 'call-cmd', 'commandName': 'forward', 'numArgs': 1}, // index 10
		{'name': 'pop'}, // index 11
		{'name': 'increment-for-counter'}, // index 12
		{'name': 'jump-if-true', 'newIndex': 9}, // index 13
		{'name': 'pop-for-count'} // index 14
	];
	const instructions = instructionsDTOToInstructions(instructionsDTO);
	const cases = [
		{'index': 0, 'parameters': [], 'var': 'x', 'result': false},
		{'index': 0, 'parameters': ['x'], 'var': 'x', 'result': true},
		{'index': 2, 'parameters': [], 'var': 'x', 'result': false},
		{'index': 3, 'parameters': [], 'var': 'x', 'result': true},
		{'index': 3, 'parameters': [], 'var': 'y', 'result': false},
		{'index': 6, 'parameters': [], 'var': 'y', 'result': false},
		{'index': 10, 'parameters': [], 'var': 'y', 'result': true},
		{'index': 11, 'parameters': [], 'var': 'x', 'result': true},
		{'index': 14, 'parameters': [], 'var': 'x', 'result': true},
		{'index': 0, 'parameters': [], 'var': 'x', 'result': false}
	];
	cases.forEach(function(caseInfo, index) {
		const result = isLocalVariable(caseInfo.var, caseInfo.index, instructions, true, caseInfo.parameters);
		if (result !== caseInfo.result)
			logger(`Case ${index} failed. index=${caseInfo.index}, parameters=${caseInfo.parameters}, var=${caseInfo.var}.  Expected ${caseInfo.result} but got ${result}`);
	});
};