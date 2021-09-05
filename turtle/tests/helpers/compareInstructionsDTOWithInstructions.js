import { DeepEquality } from '../../modules/DeepEquality.js';
import { LogoInstruction } from '../../modules/parsing/execution/instructions/LogoInstruction.js';

export function compareInstructionsDTOWithInstructions(instructionsDTO, instructions, logger) {
	if (!(instructionsDTO instanceof Array))
		throw new Error('instructionsDTO must be an Array');
	if (!(instructions instanceof Array))
		throw new Error('instructions must be an Array');
	if (typeof logger !== 'function')
		throw new Error('logger must be a function');
	if (instructions.length > 0 && !(instructions[0] instanceof LogoInstruction))
		throw new Error('instructions should contain instances of LogoInstruction');

	if (instructions.length !== instructionsDTO.length)
		logger('Number of instructions expected to be ' +
			instructionsDTO.length + ' but got ' + instructions.length +
			', actual instructions are: ' + JSON.stringify(instructions.map(function(instruction) {
			return instruction.toDTO();
		})));
	else {
		instructionsDTO.forEach(function(instructionDTO, index) {
			const actualDTO = instructions[index].toDTO();
			if (!DeepEquality.equals(actualDTO, instructionDTO))
				logger('Mismatched data transfer object for instruction at index ' +
					index + ', actualDTO = ' + JSON.stringify(actualDTO) +
					', expected DTO = ' + JSON.stringify(instructionDTO) +
					', full actual instructions for procedure are: ' + LogoInstruction.stringify(instructions));
		});
	}
};