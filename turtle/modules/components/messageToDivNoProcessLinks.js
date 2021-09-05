/*
This is separate from messageToDiv because processLinks is 
heavily tied to the document and is therefore harder to unit-test.
*/
import { codeToElement } from './syntax-highlighter/codeToElement.js';
import { MessageTypes } from './MessageTypes.js';
let codeSnippetElementCount = 1;

function createCodeSnippetContent(s) {
	const result = codeToElement(s, undefined, undefined, 'commander-message-' + (codeSnippetElementCount++), false);
	return result.element;
}

export function messageToDivNoProcessLinks(s, type, isHTML) {
	if (typeof s !== 'string')
		throw new Error('s must be a string');
	if (typeof type !== 'number')
		throw new Error('type must be a number');
	if (typeof isHTML !== 'boolean')
		throw new Error('isHTML must be boolean');

	const div = document.createElement('div');
	div.classList.add(MessageTypes.getClassName(type));
	const iconClasses = MessageTypes.getIconClassNames(type);
	if (iconClasses !== undefined) {
		const icon = document.createElement('span');
		icon.classList.add(...iconClasses, 'icon');
		div.appendChild(icon);
	}
	let msgElement = document.createElement('span');
	if (isHTML)
		msgElement.innerHTML = s;
	else {
		if (type === MessageTypes.TypeCodeSnippet)
			msgElement = createCodeSnippetContent(s);
		else
			msgElement.innerText = s;
	}
	div.appendChild(msgElement);
	return div;
};