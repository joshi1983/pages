import { moveInnerTextWhileRemovingElement } from '../../../../modules/components/syntax-highlighter/inner-text/moveInnerTextWhileRemovingElement.js';

export function testMoveInnerTextWhileRemovingElement(logger) {
	const div = document.createElement('div');
	div.innerHTML = 'print <span class="string-literal">\'<a href="https://www.google.com">https://www.google.com</a>\'</span>';
	const innerText = div.innerText;
	const innerHTML = 'print \'<a href="https://www.google.com">https://www.google.com</a>\'';
	const elementToRemove = div.querySelector('.string-literal');
	moveInnerTextWhileRemovingElement(elementToRemove);
	if (innerText !== div.innerText)
		logger(`Expected innerText to be "${innerText}" but got "${div.innerText}"`);
	if (innerHTML !== div.innerHTML)
		logger(`Expected innerText to be "${innerHTML}" but got "${div.innerHTML}"`);
};