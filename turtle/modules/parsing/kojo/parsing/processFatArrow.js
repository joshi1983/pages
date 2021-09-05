import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const goodPreviousTypes = new Set([
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.TUPLE_LITERAL
]);

export function processFatArrow(prev, next) {
	if (goodPreviousTypes.has(prev.type)) {
		const prevParent = prev.parentNode;
		prevParent.replaceChild(prev, next);
		prev.remove();
		next.appendChild(prev);
		return next;
	}
	prev.appendChild(next);
	return next;
};