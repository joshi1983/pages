import { isAnyTextSelected } from './isAnyTextSelected.js';
import { processHyperlink } from './context-menu/processHyperlink.js';
import { processColorClick } from './context-menu/processColorClick.js';
import { processCommandLink } from './context-menu/processCommandLink.js';
import { processProcedureCall } from './context-menu/processProcedureCall.js';

const handlers = [processHyperlink, processColorClick, processCommandLink, processProcedureCall];

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