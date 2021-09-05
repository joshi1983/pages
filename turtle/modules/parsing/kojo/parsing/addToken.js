import { isCompleteWithNext } from './isCompleteWithNext.js';
//import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const processors = new Map([
]);
export function addToken(prev, next) {
	while (isCompleteWithNext(prev, next))
		prev = prev.parentNode;

	const processor = processors.get(next.type);
	if (processor !== undefined) {
		return processor(prev, next);
	}
	prev.appendChild(next);
	return next;
};