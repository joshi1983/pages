import { isPossibleData } from './isPossibleData.js';
import { ParseTreeToken } from
'../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const checkLastChildTypes = new Set([
	ParseTreeTokenType.ARG_LIST,
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.DATA_TYPE_EXPRESSION,
	ParseTreeTokenType.TREE_ROOT
]);

function shouldCreateExpressionDotProperty(token) {
	if (token.parentNode === null)
		return false;
	if (isPossibleData(token))
		return true;
	return token.type === ParseTreeTokenType.IDENTIFIER;
}

function isGoodPrevious(token) {
	if (token.parentNode === null)
		return true;

	const parent = token.parentNode;
	if (parent.type === ParseTreeTokenType.EXPRESSION_DOT_PROPERTY &&
	parent.children.length === 3)
		return false;

	return true;
}

function getGoodPrevious(prev) {
	while (!isGoodPrevious(prev))
		prev = prev.parentNode;
	if (checkLastChildTypes.has(prev.type)) {
		const children = prev.children;
		const lastChild = children[children.length - 1];
		if (lastChild !== undefined && isPossibleData(lastChild))
			return lastChild;
	}
	return prev;
}

export function processDot(prev, next) {
	prev = getGoodPrevious(prev);
	if (shouldCreateExpressionDotProperty(prev)) {
		const edp = new ParseTreeToken(null, prev.lineIndex, prev.colIndex, ParseTreeTokenType.EXPRESSION_DOT_PROPERTY);
		const prevParent = prev.parentNode;
		prevParent.replaceChild(prev, edp);
		prev.remove();
		edp.appendChild(prev);
		edp.appendChild(next);
		return edp;
	}
	prev.appendChild(next);
	return next;
};