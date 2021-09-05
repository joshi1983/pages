import { isPossibleData } from './isPossibleData.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const goodPreviousTypes = new Set([
	ParseTreeTokenType.COMMA_EXPRESSION,
	ParseTreeTokenType.IDENTIFIER
]);

function getGoodPrevious(prev) {
	const parent = prev.parentNode;
	if (prev.type === ParseTreeTokenType.DATA_TYPE_EXPRESSION) {
		if (parent.type === ParseTreeTokenType.IDENTIFIER) {
			return parent;
		}
	}
	if (isPossibleData(prev) && parent.type === ParseTreeTokenType.COMMA_EXPRESSION)
		return parent;
	return prev;
}

export function processAssignmentOperator(prev, next) {
	prev = getGoodPrevious(prev);
	if (goodPreviousTypes.has(prev.type)) {
		const prevParent = prev.parentNode;
		prevParent.replaceChild(prev, next);
		prev.remove();
		next.appendChild(prev);
	}
	else { 
		// weird case.  Something went wrong.  Likely a syntax error.
		// We want to include the next in the parse tree even if that makes the parse tree represent bad code.
		prev.appendChild(next);
	}
	return next;
};