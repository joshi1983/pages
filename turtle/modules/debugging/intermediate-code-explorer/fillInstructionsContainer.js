import { instructionToElement } from './instructionToElement.js';

export function fillInstructionsContainer(instructions, container) {
	if (!(instructions instanceof Array))
		throw new Error('instructions must be an Array');
	if (!(container instanceof Element))
		throw new Error('container must be an Element');
	if (instructions.length === 0)
		container.innerHTML = 'No instructions to show';
	else
		container.innerHTML = '';
	instructions.forEach(function(instruction, index) {
		container.appendChild(instructionToElement(index, instruction));
	});
};