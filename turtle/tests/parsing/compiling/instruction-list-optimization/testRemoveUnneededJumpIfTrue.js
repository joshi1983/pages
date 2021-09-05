import { CallCommandInstruction } from '../../../../modules/parsing/execution/instructions/CallCommandInstruction.js';
import { instructionsDTOToInstructions } from '../../../helpers/instructionsDTOToInstructions.js';
import { PopInstruction } from '../../../../modules/parsing/execution/instructions/PopInstruction.js';
import { PushInstruction } from '../../../../modules/parsing/execution/instructions/PushInstruction.js';
import { removeUnneededJumpIfTrue } from '../../../../modules/parsing/compiling/instruction-list-optimization/removeUnneededJumpIfTrue.js';

export function testRemoveUnneededJumpIfTrue(logger) {
	const instructionsDTO = [
		{'name': 'push', 'value': false, 'isCloningValue': false},
		{'name': 'jump-if-true', 'newIndex': 2},
		{'name': 'push', 'value': 5, 'isCloningValue': false},
		{'name': 'call-cmd', 'commandName': 'forward', 'numArgs': 1},
		{'name': 'pop'}
	];
	const instructions = instructionsDTOToInstructions(instructionsDTO);
	removeUnneededJumpIfTrue(instructions);
	if (instructions.length === 3) {
		if (instructions[0] instanceof PushInstruction) {
			if (instructions[0].value !== 5)
				logger('value expected to be 5 but got ' + instructions[0].value);
		}
		else
			logger('instructions[0] expected to be a PushInstruction but got something else.  DTO = ' + JSON.stringify(instructions[0].toDTO()));
		if (!(instructions[1] instanceof CallCommandInstruction))
			logger(`Expected instructions[1] to be a CallCommandInstruction but got ${instructions[1]}`);
		if (!(instructions[2] instanceof PopInstruction))
			logger(`Expected instructions[2] to be a PopInstruction but got ${instructions[2]}`);
	}
	else {
		logger('Expected 3 instructions but got ' + instructions.length);
	}
};