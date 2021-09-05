import { Command } from '../../parsing/Command.js';
import { isAnyTextSelected } from './isAnyTextSelected.js';

function processHyperlink(elements) {
	elements = elements.filter(e => e.tagName === 'A');
	if (elements.length === 1) {
		elements[0].click();
		return false;
	}
}

function processCommandLink(elements, context) {
	elements = elements.filter(e => e.tagName === 'SPAN' &&
		e.classList.contains('parameterized-group') &&
		Command.getCommandInfo(e.innerText) !== undefined);
	if (elements.length === 1 && typeof context === 'object' && context.CommandDetails !== undefined) {
		context.CommandDetails.showDetails(elements[0].innerText);
		return false;
	}
}

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

function processProcedureCall(elements) {
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
}

const handlers = [processHyperlink, processCommandLink, processProcedureCall];

/*
The context object should include the CommandDetails module.
It is passed in to make this easier to test in isolation from CommandDetails, GraphicsScreen...
*/
export function textareaContextMenu(context) {
	return function(event) {
		// The user might right-click to copy the selected text using the menu.
		// We don't want to block the browser's native context-menu if the user wants to use it.
		if (isAnyTextSelected(event))
			return;
		const p = {'x': event.clientX, 'y': event.clientY};
		const elements = document.elementsFromPoint(p.x, p.y).
			filter(e => e.closest('pre.syntax-highlighter') !== null);
		for (let i = 0; i < handlers.length; i++) {
			if (handlers[i](elements, context) !== undefined) {
				event.preventDefault();
				return false;
			}
		}
	};
};