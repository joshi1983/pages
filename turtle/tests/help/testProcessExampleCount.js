import { processExampleCount } from '../../modules/help/processExampleCount.js';

export function testProcessExampleCount(logger) {
	const e = document.createElement('div');
	e.innerHTML = `There are <span class="weblogo-example-count"></span> examples.`;
	processExampleCount(e);
	const span = e.querySelector('.weblogo-example-count');
	const num = parseInt(span.innerText);
	if (isNaN(num))
		logger(`Expected a number but got "${span.innerText}"`);
};