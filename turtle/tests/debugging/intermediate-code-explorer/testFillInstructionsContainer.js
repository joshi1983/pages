import { fillInstructionsContainer } from '../../../modules/debugging/intermediate-code-explorer/fillInstructionsContainer.js';

function testEmptyInstructionList(logger) {
	const container = document.createElement('div');
	fillInstructionsContainer([], container);
	if (container.textContent.toLowerCase().indexOf("no") === -1)
		logger('Expected to find "no" somewhere in the content but just got "' + container.textContent + '"');
}

export function testFillInstructionsContainer(logger) {
	testEmptyInstructionList(logger);
};