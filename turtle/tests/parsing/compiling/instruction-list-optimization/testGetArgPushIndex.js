import { instructionsDTOToInstructions } from '../../../helpers/instructionsDTOToInstructions.js';
import { getArgPushIndex } from '../../../../modules/parsing/compiling/instruction-list-optimization/getArgPushIndex.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

function processCases(instructionsDTO, cases, logger) {
	const instructions = instructionsDTOToInstructions(instructionsDTO);
	cases.forEach(function(caseInfo, index) {
		const result = getArgPushIndex(instructions, caseInfo.in[0], caseInfo.in[1]);
		if (result !== caseInfo.result)
			logger(`Case ${index}, Expected result ${caseInfo.result} but got ${result}`);
	});
}

function generalCases(logger) {
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
	const cases = [
		{'in': [2, 0], 'result': 2},
		{'in': [2, 1], 'result': 1},
		{'in': [3, 1], 'result': 0},
		{'in': [4, 1], 'result': 3},
		{'in': [5, 1], 'result': 3}
	];
	processCases(instructionsDTO, cases, logger);
}

function ifElseCases(logger) {
	const instructionsDTO = [
		{'name': 'push', 'value': '2', 'isCloningValue': false}, // index 0
		{'name': 'push-max-repcount'}, // index 1
		{'name': 'push', 'value': 'x', 'isCloningValue': false}, // index 2
		{'name': 'call-cmd', 'commandName': 'repcount', 'numArgs': 0, 'skipValidationAndSanitization': false},
		// index 3
		{'name': 'call-cmd', 'commandName': 'evenp', 'numArgs': 1, 'isCloningValue': false}, // index 4
		{'name': 'jump-if-true', 'newIndex': 8}, // index 5
		{'name': 'push', 'value': '0', 'isCloningValue': false}, // index 6
		{'name': 'jump', 'newIndex': 9}, // index 7
		{'name': 'push', 'value': 1, 'isCloningValue': false}, // index 8
		{'name': 'call-cmd', 'commandName': 'localmake', 'numArgs': 2}, // index 9
		{'name': 'pop'}, // index 10
		{'name': 'read-variable', 'variableName': 'x'}, // index 11
		{'name': 'call-cmd', 'commandName': 'print', 'numArgs': 1}, // index 12
		{'name': 'pop'}, // index 13
		{'name': 'increment-repcount'}, // index 14
		{'name': 'jump-if-true', 'newIndex': 2}, // index 15
		{'name': 'pop-repcount'}, // index 16
		{'name': 'output-null'}, // index 17
	];
	const cases = [
		{'in': [0, 0], 'result': 0},
		{'in': [2, 0], 'result': 2},
		{'in': [3, 0], 'result': 3},
		{'in': [3, 1], 'result': 2},
		{'in': [4, 0], 'result': 4},
		{'in': [4, 1], 'result': 2},
		{'in': [6, 0], 'result': 6},
		{'in': [8, 0], 'result': 8},
		{'in': [11, 0], 'result': 11},
	];
	processCases(instructionsDTO, cases, logger);
}

export function testGetArgPushIndex(logger) {
	wrapAndCall([
		generalCases,
		ifElseCases
	], logger);
};