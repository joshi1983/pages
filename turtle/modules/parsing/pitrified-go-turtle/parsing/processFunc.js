import { isComplete } from './isCompleteWithNext.js';
import { MaybeDecided } from '../../../MaybeDecided.js';
import { ParseTreeToken } from '../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const goodPreviousTypes = new Set([
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.TREE_ROOT,
]);

function isGoodPrevious(token) {
	const parent = token.parentNode;
	if (parent === null)
		return true;
	
	if (isComplete(token) === MaybeDecided.No)
		return true;

	if (token.type === ParseTreeTokenType.FUNC) {
		if (parent.type === ParseTreeTokenType.TREE_ROOT)
			return true;
	}
	return goodPreviousTypes.has(token.type);
}

function getGoodPrevious(token) {
	while (!isGoodPrevious(token))
		token = token.parentNode;
	return token;
}

export function processFunc(prev, next) {
	prev = getGoodPrevious(prev);
	if (prev.type === ParseTreeTokenType.FUNC) {
		const dte = new ParseTreeToken(null, next.lineIndex, next.colIndex, ParseTreeTokenType.DATA_TYPE_EXPRESSION);
		prev.appendChild(dte);
		prev = dte;
	}
	prev.appendChild(next);
	return next;
};