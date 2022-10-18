import { getClosestLiteral } from './getClosestLiteral.js';
import { getLiteralClassNamesFor } from './isLiteralElement.js';
import { textToSpanWithClass } from './textToSpanWithClass.js';

export function setClassName(node, className) {
	if (typeof className !== 'string')
		throw new Error('className must be a string.  Not: ' + className);
	const literal = getClosestLiteral(node);
	if (literal !== undefined) {
		if (className !== 'string-literal' && className !== 'color-literal') {
			literal.removeAttribute('style');
		}
		getLiteralClassNamesFor(literal).forEach(function(className) {
			literal.classList.remove(className);
		});
		literal.classList.add(className);
	}
	else {
		literal = textToSpanWithClass(getInnerText(node), className);
		insertAfter(node, literal);
		node.parentNode.removeChild(node);
	}
};