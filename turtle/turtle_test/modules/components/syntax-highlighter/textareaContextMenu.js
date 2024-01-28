import { isAnyTextSelected } from './isAnyTextSelected.js';
import { ColorClickProcessor } from './context-menu/ColorClickProcessor.js';
import { CommandLinkProcessor } from './context-menu/CommandLinkProcessor.js';
import { ConvertToAssetProcessor } from './context-menu/ConvertToAssetProcessor.js';
import { HyperlinkProcessor } from './context-menu/HyperlinkProcessor.js';
import { ProcedureCallProcessor } from './context-menu/ProcedureCallProcessor.js';

export const processors = [HyperlinkProcessor, ColorClickProcessor, CommandLinkProcessor,
ConvertToAssetProcessor, ProcedureCallProcessor
];

function handlerToMenuOption(elements, context) {
	return function(processor) {
		const name = processor.getPopupName(elements, context);
		return {
			'name': name,
			'callback': () => {
				context.Dialog.hide();
				processor.process(elements, context);
			}
		};
	};
}

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
			filter(e => e.closest('.syntax-highlighter.visualization-container') !== null);
		const applicables = processors.filter(p => p.isApplicable(elements, context));
		if (applicables.length > 1) {
			context.showMenuDialog('Code Editor Popup Menu', '', applicables.map(handlerToMenuOption(elements, context)));
			event.preventDefault();
			return false;
		}
		if (applicables.length === 1 && applicables[0].process(elements, context) !== undefined) {
			event.preventDefault();
			return false;
		}
	};
};