import { Command } from '../../../parsing/Command.js';
await Command.asyncInit();

function getElement(elements, context) {
	elements = elements.filter(e => e.tagName === 'SPAN' &&
		e.classList.contains('parameterized-group') &&
		Command.getCommandInfo(e.innerText) !== undefined);
	if (elements.length === 1 && typeof context === 'object' && context.CommandDetails !== undefined)
		return elements[0];
}

export class CommandLinkProcessor {
	static process(elements, context) {
		const e = getElement(elements, context);
		if (e !== undefined) {
			context.CommandDetails.showDetails(e.innerText);
			return false;
		}
	};

	static isApplicable(elements, context) {
		return getElement(elements, context) !== undefined;
	}

	static getPopupName(elements, context) {
		const e = getElement(elements, context);
		return `Help on ${e.innerText} command`;
	}
};