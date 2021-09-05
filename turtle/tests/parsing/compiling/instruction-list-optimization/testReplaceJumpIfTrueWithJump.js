import { instructionsDTOToInstructions } from '../../../helpers/instructionsDTOToInstructions.js';
import { JumpInstruction } from '../../../../modules/parsing/execution/instructions/JumpInstruction.js';
import { replaceJumpIfTrueWithJump } from '../../../../modules/parsing/compiling/instruction-list-optimization/replaceJumpIfTrueWithJump.js';

export function testReplaceJumpIfTrueWithJump(logger) {
	const instructionsDTO = [
		{'name': 'push', 'value': true, 'isCloningValue': false},
		{'name': 'jump-if-true', 'newIndex': 2},
		{'name': 'push', 'value': 5, 'isCloningValue': false},
		{'name': 'call-cmd', 'commandName': 'forward', 'numArgs': 1},
		{'name': 'pop'}
	];
	const instructions = instructionsDTOToInstructions(instructionsDTO);
	replaceJumpIfTrueWithJump(instructions);
	if (instructions.length === 4) {
		if (instructions[0] instanceof JumpInstruction) {
			if (instructions[0].jumpToIndex !== 1)
				logger('jumpToIndex expected to be 1 but got ' + instructions[0].jumpToIndex);
		}
		else
			logger('instructions[0] expected to be a JumpInstruction but got something else.  DTO = ' + JSON.stringify(instructions[0].toDTO()));
	}
	else {
		logger('Expected 4 instructions but got ' + instructions.length);
	}
};