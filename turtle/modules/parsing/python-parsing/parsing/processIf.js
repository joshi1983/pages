import { getClosestOfType } from
'../../generic-parsing-utilities/getClosestOfType.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

function getGoodPrevious(prev) {
	const closestListLiteral = getClosestOfType(prev, ParseTreeTokenType.LIST_LITERAL);
	if (closestListLiteral !== null) {
		return closestListLiteral;
	}
	return prev;
}

export function processIf(prev, next) {
	prev = getGoodPrevious(prev);
	prev.appendChild(next);
	return next;
};