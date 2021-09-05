import { StringUtils } from '../../modules/StringUtils.js';

/*
Adds a clickable button to copy something to clip board.
*/
export function addCopyButton(e, valToCopy) {
	if (typeof valToCopy !== 'string')
		throw new Error(`The value to copy must be a string but found ${valToCopy}`);
	const button = document.createElement('button');
	button.classList.add('copy-to-clipboard', 'fa', 'fa-solid', 'fa-clipboard');
	button.setAttribute('title', 'Copy to clipboard');
	button.addEventListener('click', function() {
		navigator.clipboard.writeText(StringUtils.sanitizeLineBreaks(valToCopy));
	});
	e.appendChild(button);
};