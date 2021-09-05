import { PostScriptLocalStorage } from '../../../../modules/drawing-menu/download/post-script/PostScriptLocalStorage.js';

export function testPostScriptLocalStorage(logger) {
	const checkbox = document.createElement('input');
	checkbox.setAttribute('type', 'checkbox');
	try {
		PostScriptLocalStorage.loadFromLocalStorage();
		logger('Expected to throw an Error when no Element is passed to loadFromLocalStorage');
	}
	catch (e) {
		// error expected.
	}
	PostScriptLocalStorage.loadFromLocalStorage(checkbox);
	PostScriptLocalStorage.saveToLocalStorage(checkbox);
};