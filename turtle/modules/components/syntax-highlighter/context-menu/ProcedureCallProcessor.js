import { Command } from '../../../parsing/Command.js';
await Command.asyncInit();

function findProcedureNameElementMatching(element) {
	if (!(element instanceof Element))
		throw new Error('element must be an Element but got ' + element);
	const pre = element.closest('.syntax-highlighter.visualization-container');
	const span = Array.from(pre.querySelectorAll('span.procedure-name')).
		filter(e => e.innerText === element.innerText)[0];
	if (span) {
		return span;
	}
	return null;
}

function getElement(elements) {
	elements = elements.filter(e => e.tagName === 'SPAN' &&
		e.classList.contains('parameterized-group') &&
		Command.getCommandInfo(e.innerText) === undefined &&
		findProcedureNameElementMatching(e) !== null);
	if (elements.length === 1)
		return elements[0];
}

export class ProcedureCallProcessor {
	static process(elements) {
		const element = getElement(elements);
		if (element !== undefined) {
			const nameElement = findProcedureNameElementMatching(element);
			const scrollableContainer = nameElement.closest('.scrollable-logo-code');
			scrollableContainer.scrollTo(0, nameElement.offsetTop);
			return false;
		}
	}

	static isApplicable(elements) {
		return getElement(elements) !== undefined;
	}

	static getPopupName(elements) {
		const element = getElement(elements);

		// Very weird case but this would likely be better than throwing a JavaScript error.
		if (element === undefined)
			return 'Go to procedure';

		const procedureName = findProcedureNameElementMatching(element);
		return `Go to procedure ${procedureName}`;
	}
};