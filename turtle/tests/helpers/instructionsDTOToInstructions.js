import { createLogoInstructionFromDTO } from '../../modules/parsing/execution/instructions/createLogoInstructionFromDTO.js';
import { createRootToken } from './createRootToken.js';

const rootToken = createRootToken();

export function instructionsDTOToInstructions(instructionsDTO, proceduresMap) {
	if (proceduresMap === undefined)
		proceduresMap = new Map();
	return instructionsDTO.map(dto => createLogoInstructionFromDTO(dto, rootToken, proceduresMap));
};