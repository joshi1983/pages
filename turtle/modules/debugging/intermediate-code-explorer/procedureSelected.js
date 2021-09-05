import { fillInstructionsContainer } from './fillInstructionsContainer.js';
import { Procedure } from '../../parsing/Procedure.js';

export function procedureSelected(proc, queryInput, searchResultsContainer, instructionsContainer, procedureSelector, logoProgram) {
	let instructions = [];
	if (proc instanceof Procedure) {
		instructions = proc.instructions;
	}
	else {
		instructions = logoProgram.instructions;
	}
	fillInstructionsContainer(instructions, instructionsContainer);
	queryInput.value = proc.name;
	searchResultsContainer.innerHTML = '';
	procedureSelector.classList.remove('active');
	instructionsContainer.classList.add('active');
};