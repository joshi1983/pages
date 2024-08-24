import { instructionsDTOToInstructions } from
'../../../../helpers/instructionsDTOToInstructions.js';
import { isBinaryOperatorCluster, processBinaryOperatorCluster } from
'../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/processBinaryOperatorCluster.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

function testSimulateIfElse(logger) {
	const instructionsDTO = [
	/*0*/{'name': 'jump-if-true', 'newIndex': 3},
	/*1*/{'name': 'push', 'value': 0.4, 'isCloningValue': false},
	/*2*/{'name': 'jump', 'newIndex': 4},
	/*3*/{'name': 'push', 'value': 0.5, 'isCloningValue': false},
	/*4*/{'name': 'binary-operator', 'symbol': '*'},
	];
	const instructions = instructionsDTOToInstructions(instructionsDTO, new Map());
	const result = isBinaryOperatorCluster(instructions, 4);
	if (result !== false)
		logger(`Expected false but got ${result}`);
}

export function testProcessBinaryOperatorCluster(logger) {
	wrapAndCall([
		testSimulateIfElse
	], logger);
};