import { instructionsDTOToInstructions } from '../../../helpers/instructionsDTOToInstructions.js';
import { JumpIfTrueInstruction } from '../../../../modules/parsing/execution/instructions/JumpIfTrueInstruction.js';
import { PushInstruction } from '../../../../modules/parsing/execution/instructions/PushInstruction.js';
import { PushMaxRepcountInstruction } from '../../../../modules/parsing/execution/instructions/PushMaxRepcountInstruction.js';
import { removeRepeatZeroIterationCheck } from '../../../../modules/parsing/compiling/instruction-list-optimization/removeRepeatZeroIterationCheck.js';

export function testRemoveRepeatZeroIterationCheck(logger) {
	const instructionsDTO = [
		{'name': 'push', 'value': 4, 'isCloningValue': false},
		{"name": "push-from-stack", "numToPush":1},
		{"name": "push", "value":1, 'isCloningValue': false},
		{"name": "binary-operator", "symbol":">="},
		{"name": "jump-if-true", "newIndex": 7},
		{"name": "pop"},
		{"name": "jump","newIndex":17},
		{'name': 'push-max-repcount'},
		{'name': 'push', 'value': 100, 'isCloningValue': false},
		{'name': 'call-cmd', 'commandName': 'forward', 'numArgs': 1},
		{'name': 'pop'},
		{'name': 'push', 'value': 90, 'isCloningValue': false},
		{'name': 'call-cmd', 'commandName': 'right', 'numArgs': 1},
		{'name': 'pop'},
		{'name': 'increment-repcount'},
		{'name': 'jump-if-true', 'newIndex': 8},
		{'name': 'pop-repcount'}
	];
	const instructions = instructionsDTOToInstructions(instructionsDTO);
	removeRepeatZeroIterationCheck(instructions);
	if (instructions.length === 11) {
		if (!(instructions[0] instanceof PushInstruction))
			logger('Expected first instruction to be a PushInstruction but it is: ' + instructions[0]);
		else if (instructions[0].value !== 4)
			logger('Expected first instruction value to remain as 4 but got ' + instructions[0].value);
		if (!(instructions[1] instanceof PushMaxRepcountInstruction))
			logger('Expected second instruction to be a PushMaxRepcountInstruction but got ' + instructions[1]);
		if (!(instructions[instructions.length - 2] instanceof JumpIfTrueInstruction))
			logger('Expected second last instruction to be a JumpIfTrueInstruction but got ' + instructions[instructions.length - 2]);
		else if (instructions[instructions.length - 2].jumpToIndex !== 2)
			logger('Expected jumpToIndex to be 2 but got ' + instructions[instructions.length - 2].jumpToIndex);
	}
	else {
		logger('Expected 11 instructions but got ' + instructions.length);
	}
};