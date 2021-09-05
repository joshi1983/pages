import { getSortedFirstDescendentTokenOf } from
'../../generic-parsing-utilities/getSortedFirstDescendentTokenOf.js';
import { isCompleteValueToken } from './isCompleteValueToken.js';
import { ParseTreeToken } from
'../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

function isGoodPrev(token) {
	if (token.parentNode === null)
		return true;
	if (isCompleteValueToken(token) && !isCompleteValueToken(token.parentNode))
		return true;
	return false;
}

function getGoodPrevious(token) {
	while (!isGoodPrev(token))
		token = token.parentNode;
	return token;
}

export function processQuestionMark(prev, next) {
	prev = getGoodPrevious(prev);
	const firstToken = getSortedFirstDescendentTokenOf(prev);
	const prevParent = prev.parentNode;
	if (prevParent !== null) {
		const ternary = new ParseTreeToken(null, firstToken.lineIndex, firstToken.colIndex,
			ParseTreeTokenType.CONDITIONAL_TERNARY);
		prevParent.replaceChild(prev, ternary);
		ternary.appendChild(prev);
		ternary.appendChild(next);
		return ternary;
	}
	else
		prev.appendChild(next);
	return prev;
};