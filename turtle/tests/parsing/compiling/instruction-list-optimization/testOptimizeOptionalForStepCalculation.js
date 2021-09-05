import { instructionsDTOToInstructions } from '../../../helpers/instructionsDTOToInstructions.js';
import { optimizeOptionalForStepCalculation } from '../../../../modules/parsing/compiling/instruction-list-optimization/optimizeOptionalForStepCalculation.js';
import { PushForCountInstruction } from '../../../../modules/parsing/execution/instructions/PushForCountInstruction.js'
import { PushInstruction } from '../../../../modules/parsing/execution/instructions/PushInstruction.js';

export function testOptimizeOptionalForStepCalculation(logger) {
	/*
	The following instructions are to this Logo code:
	for ["x 0 5] [
		print :x
	]
	*/
	const instructionsDTO = [
		{'name': 'push', 'value': 'x', 'isCloningValue': false}, // index 0
		{'name': 'push', 'value': 0, 'isCloningValue': false}, // index 1
		{'name': 'push', 'value': 5, 'isCloningValue': false}, // index 2
		{'name': 'push-from-stack', 'numToPush': 2}, // index 3
		{'name': 'binary-operator', 'symbol': '-'},
		{'name': 'call-cmd', 'commandName': 'sign', 'numArgs': 1},
		{'name': 'push-for-count'},
		{'name': 'read-variable', 'variableName': 'x'},
		{'name': 'call-cmd', 'commandName': 'print', 'numArgs': 1},
		{'name': 'pop'},
		{'name': 'increment-for-counter'},
		{'name': 'jump-if-true', 'newIndex': 7},
		{'name': 'pop-for-count'}
	];
	const instructions = instructionsDTOToInstructions(instructionsDTO);
	optimizeOptionalForStepCalculation(instructions);
	if (instructions.length !== 11)
		logger('Expected instructions length to be 11 but got ' + instructions.length + '. instructions are: ' + JSON.stringify(instructions.map(i => i.toDTO())));
	if (instructions[3] instanceof PushInstruction) {
		if (!(instructions[4] instanceof PushForCountInstruction))
			logger('index 4 expected to have a PushForCountInstruction but got ' + JSON.stringify(instructions[4].toDTO()));
	}
	else
		logger('index 3 expected to have a PushInstruction but got ' + JSON.stringify(instructions[3].toDTO()));
};