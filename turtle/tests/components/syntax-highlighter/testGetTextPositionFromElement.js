import { getTextPositionFromElement } from '../../../modules/components/syntax-highlighter/getTextPositionFromElement.js';

export function testGetTextPositionFromElement(logger) {
	const id = 'textarea-syntax-highlighter-1-17-21';
	const e = document.createElement('span');
	e.setAttribute('id', id);
	const result = getTextPositionFromElement(e);
	if (result[0] !== 17)
		logger(`Expected line 17 but got ${result[0]}`);
	if (result[1] !== 21)
		logger(`Expected line 21 but got ${result[1]}`);
};