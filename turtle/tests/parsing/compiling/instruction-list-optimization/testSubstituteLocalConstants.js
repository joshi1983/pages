import { instructionsDTOToInstructions } from '../../../helpers/instructionsDTOToInstructions.js';
import { JumpIfTrueInstruction } from '../../../../modules/parsing/execution/instructions/JumpIfTrueInstruction.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { PushInstruction } from '../../../../modules/parsing/execution/instructions/PushInstruction.js';
import { PushMaxRepcountInstruction } from '../../../../modules/parsing/execution/instructions/PushMaxRepcountInstruction.js';
import { substituteLocalConstants } from '../../../../modules/parsing/compiling/instruction-list-optimization/substituteLocalConstants.js';

function testSimpleCase(logger) {
	const instructionsDTO = [
		{'name': 'push', 'value': 'x', 'isCloningValue': false},
		{'name': 'push', 'value': 3, 'isCloningValue': false},
		{'name': 'call-cmd', 'commandName': 'localmake', 'numArgs': 2},
		{'name': 'pop'},
		{'name': 'read-variable', 'variableName': 'x'}
	];
	const instructions = instructionsDTOToInstructions(instructionsDTO);
	substituteLocalConstants(instructions, []);
	if (instructions.length === 1) {
		if (instructions[0] instanceof PushInstruction) {
			if (instructions[0].value !== 3)
				logger('Expected 3 but got ' + instructions[0].value);
		}
		else
			logger('Expected a push instruction but got one with name: ' + JSON.stringify(instructions[0].toDTO()));
	}
	else {
		logger('Expected 1 instruction but got ' + instructions.length);
	}
}

function testStartOfRepeatLoop(logger) {
	const instructionsDTO = [
		{'name': 'push', 'value': 5, 'isCloningValue': false},
		{'name': 'call-cmd', 'commandName': 'print', 'numArgs': 1},
		{'name': 'pop'},
		{'name': 'push', 'value': 2, 'isCloningValue': false},
		{'name': 'push-max-repcount'},
		{'name': 'push', 'value': 'x', 'isCloningValue': false},
		{'name': 'push', 'value': 3, 'isCloningValue': false},
		{'name': 'call-cmd', 'commandName': 'localmake', 'numArgs': 2},
		{'name': 'pop'},
		{'name': 'increment-repcount'},
		{'name': 'jump-if-true', 'newIndex': 5},
		{'name': 'pop-repcount'},
	];
	const instructions = instructionsDTOToInstructions(instructionsDTO);
	substituteLocalConstants(instructions, []);
	if (instructions.length === 8) {
		const pushMaxRepcountInstruction = instructions[4];
		if (!(pushMaxRepcountInstruction instanceof PushMaxRepcountInstruction))
			logger(`Expected instruction 4 to continue being a PushMaxRepcountInstruction but got ${pushMaxRepcountInstruction}`);
		const jumpInstruction = instructions[6];
		if (jumpInstruction instanceof JumpIfTrueInstruction) {
			if (jumpInstruction.jumpToIndex !== 5)
				logger(`Expected jumpToIndex to be 5 but got ${jumpInstruction.jumpToIndex}`);
		}
		else
			logger(`Expected a JumpIfTrueInstruction but got ${jumpInstruction}`);
	}
	else {
		logger('Expected 8 instruction but got ' + instructions.length);
	}
}

export function testSubstituteLocalConstants(logger) {
	testSimpleCase(prefixWrapper('testSimpleCase', logger));
	testStartOfRepeatLoop(prefixWrapper('testStartOfRepeatLoop', logger));
};