import { Command } from '../../../parsing/Command.js';
await Command.asyncInit();

function findProcedureNameElementMatching(element) {
	if (!(element instanceof Element))
		throw new Error('element must be an Element but got ' + element);
	const pre = element.closest('pre.syntax-highlighter');
	const span = Array.from(pre.querySelectorAll('span.procedure-name')).
		filter(e => e.innerText === element.innerText)[0];
	if (span) {
		return span;
	}
	return null;
}

export function processProcedureCall(elements) {
	elements = elements.filter(e => e.tagName === 'SPAN' &&
		e.classList.contains('parameterized-group') &&
		Command.getCommandInfo(e.innerText) === undefined &&
		findProcedureNameElementMatching(e) !== null);
	if (elements.length === 1) {
		const nameElement = findProcedureNameElementMatching(elements[0]);
		const scrollableContainer = nameElement.closest('.scrollable-logo-code');
		scrollableContainer.scrollTo(0, nameElement.offsetTop);
		return false;
	}
};