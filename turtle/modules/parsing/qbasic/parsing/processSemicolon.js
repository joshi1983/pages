import { getClosestOfType } from
'../../generic-parsing-utilities/getClosestOfType.js';
import { getSortedLastDescendentTokenOf } from
'../../generic-parsing-utilities/getSortedLastDescendentTokenOf.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

function getGoodPrevious(prev) {
	const last = getSortedLastDescendentTokenOf(prev);
	const closestArgList = getClosestOfType(last, ParseTreeTokenType.ARG_LIST);
	if (closestArgList === null)
		return prev;
	return closestArgList;
}

export function processSemicolon(prev, next) {
	prev = getGoodPrevious(prev);
	prev.appendChild(next);
	return prev;
};