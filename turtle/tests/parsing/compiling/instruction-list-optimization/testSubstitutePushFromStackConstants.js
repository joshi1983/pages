import { instructionsDTOToInstructions } from '../../../helpers/instructionsDTOToInstructions.js';
import { LogoInstruction } from '../../../../modules/parsing/execution/instructions/LogoInstruction.js';
import { PushInstruction } from '../../../../modules/parsing/execution/instructions/PushInstruction.js';
import { substitutePushFromStackConstants } from '../../../../modules/parsing/compiling/instruction-list-optimization/substitutePushFromStackConstants.js';

export function testSubstitutePushFromStackConstants(logger) {
	const instructionsDTO = [
		{'name': 'push', 'value': 0, 'isCloningValue': false}, // index 0
		{'name': 'push', 'value': 5, 'isCloningValue': false}, // index 1
		{'name': 'push-from-stack', 'numToPush': 2}, // index 2
	];
	const instructions = instructionsDTOToInstructions(instructionsDTO);
	substitutePushFromStackConstants(instructions, 2);
	if (instructions.length !== 4)
		logger('instructions length expected to be 4 but got ' + instructions.length);
	if (!(instructions[2] instanceof PushInstruction))
		logger('Index 2 expected to be a PushInstruction but got something else. instructions are: ' + JSON.stringify(LogoInstruction.stringify(instructions)));
};