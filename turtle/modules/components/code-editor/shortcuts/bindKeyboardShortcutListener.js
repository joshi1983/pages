import { wrapTurtleState } from './wrapTurtleState.js';

export function bindKeyboardShortcutListener(textarea, executeShortcut) {
	if (!(textarea instanceof Element))
		throw new Error(`textarea must be an Element but found ${textarea}`);
	if (typeof executeShortcut !== 'function')
		throw new Error(`executeShortcut must be a function but found ${executeShortcut}`);

	textarea.addEventListener('keydown', function(event) {
		if (event.altKey && event.key === 't') {
			executeShortcut(wrapTurtleState, textarea);
			event.preventDefault();
			event.stopPropagation();
			return false;
		}
	});
};