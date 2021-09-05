import { Command } from '../../../parsing/Command.js';
await Command.asyncInit();

export function processCommandLink(elements, context) {
	elements = elements.filter(e => e.tagName === 'SPAN' &&
		e.classList.contains('parameterized-group') &&
		Command.getCommandInfo(e.innerText) !== undefined);
	if (elements.length === 1 && typeof context === 'object' && context.CommandDetails !== undefined) {
		context.CommandDetails.showDetails(elements[0].innerText);
		return false;
	}
};