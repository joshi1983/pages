import { StringArtLocalStorage } from '../../../../modules/drawing-menu/download/string-art-kit/StringArtLocalStorage.js';

export function testStringArtLocalStorage(logger) {
	const lineHintCheckbox = document.createElement('input');
	lineHintCheckbox.setAttribute('type', 'checkbox');
	const result = StringArtLocalStorage.isUsingLineHints();
	if (typeof result !== 'boolean')
		logger(`Result expected to be true or false but got ${result}`);
	StringArtLocalStorage.loadFromLocalStorage(lineHintCheckbox);
	StringArtLocalStorage.saveToLocalStorage(lineHintCheckbox);
	
	// try to change the value of lineHints.
	lineHintCheckbox.checked = !result;
	StringArtLocalStorage.saveToLocalStorage(lineHintCheckbox);
	// has it not changed?
	if (StringArtLocalStorage.isUsingLineHints() === result)
		logger(`Expected ${!result} after saveToLocalStorage but got ${result}`);

	// restore so this test doesn't save any changes overall.
	lineHintCheckbox.checked = result;
	StringArtLocalStorage.saveToLocalStorage(lineHintCheckbox);
};