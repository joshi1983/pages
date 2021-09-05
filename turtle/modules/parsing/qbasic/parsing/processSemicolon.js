import { getClosestOfType } from
'../../generic-parsing-utilities/getClosestOfType.js';
import { getSortedLastDescendentTokenOf } from
'../../generic-parsing-utilities/getSortedLastDescendentTokenOf.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

const semicolonFunctionNames = new Set([
	'input', 'print'
]);

function getGoodPrevious(prev) {
	const last = getSortedLastDescendentTokenOf(prev);
	let closestArgList = getClosestOfType(last, ParseTreeTokenType.ARG_LIST);

	while (closestArgList !== null) {
		const funcCall = closestArgList.parentNode;
		if (funcCall.type === ParseTreeTokenType.FUNCTION_CALL &&
		funcCall.children.length === 2) {
			const firstChild = funcCall.children[0];
			if (firstChild.type === ParseTreeTokenType.IDENTIFIER &&
			!semicolonFunctionNames.has(firstChild.val.toLowerCase())) {
				closestArgList = getClosestOfType(funcCall, ParseTreeTokenType.ARG_LIST);
			}
			else
				break;
		}
		else
			break;
	}
	if (closestArgList === null)
		return prev;
	return closestArgList;
}

export function processSemicolon(prev, next) {
	prev = getGoodPrevious(prev);
	prev.appendChild(next);
	return prev;
};