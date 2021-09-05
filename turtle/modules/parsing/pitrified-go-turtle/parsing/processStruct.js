import { isComplete } from './isCompleteWithNext.js';
import { MaybeDecided } from '../../../MaybeDecided.js';
import { ParseTreeToken } from '../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const goodPreviousTypes = new Set([
	ParseTreeTokenType.DATA_TYPE_EXPRESSION,
	ParseTreeTokenType.TYPE
]);

function isGoodPrevious(token) {
	if (token.parentNode === null)
		return true;
	if (isComplete(token) === MaybeDecided.No)
		return true;

	return goodPreviousTypes.has(token.type);
}

function getGoodPrevious(token) {
	while (!isGoodPrevious(token))
		token = token.parentNode;
	return token;
}

function shouldCreateDataTypeExpression(prev) {
	if (prev.type === ParseTreeTokenType.ARRAY_LITERAL &&
	prev.children.length === 1)
		return true;
	return false;
}

export function processStruct(prev, next) {
	prev = getGoodPrevious(prev);
	if (shouldCreateDataTypeExpression(prev)) {
		const dte = new ParseTreeToken(null, next.lineIndex, next.colIndex, ParseTreeTokenType.DATA_TYPE_EXPRESSION);
		prev.appendChild(dte);
		prev = dte;
	}
	prev.appendChild(next);
	return next;
};