import { processHyperlinks } from '../processHyperlinks.js';

export function processStringHyperlinks(container) {
	const spans = container.querySelectorAll('.string-literal[id]');
	for (let i = 0; i < spans.length; i++) {
		const span = spans[i];
		span.innerHTML = processHyperlinks(span.innerText);
	}
};