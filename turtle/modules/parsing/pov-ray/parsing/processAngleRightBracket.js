import { ExpectedChildrenResult, hasAllExpectedChildren } from './hasAllExpectedChildren.js';
import { getDescendentsOfType } from '../../generic-parsing-utilities/getDescendentsOfType.js';
import { getSortedLastTokenFromArray } from '../../generic-parsing-utilities/getSortedLastTokenFromArray.js';
import { ParseTreeToken } from '../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
const goodPrevTypes = new Set([
ParseTreeTokenType.VECTOR_EXPRESSION,
ParseTreeTokenType.BINARY_OPERATOR,
]);

function isGoodPrev(token) {
	if (token.parentNode === null)
		return true;
	const allChildrenResult = hasAllExpectedChildren(token);
	if (!ExpectedChildrenResult.canBeComplete(allChildrenResult))
		return true;
	if (!goodPrevTypes.has(token.type))
		return false;
	if (ExpectedChildrenResult.canBeComplete(allChildrenResult)) {
		return false;
	}
	return true;
}

function getGoodPrevious(token) {
	while (!isGoodPrev(token))
		token = token.parentNode;
	return token;
}

function tryConvertingBinaryOperator(token, next) {
	const parent = token.parentNode;
	if (parent === null)
		return null;
	const candidates = getDescendentsOfType(token, ParseTreeTokenType.BINARY_OPERATOR).
		filter(t => t.val === '<');
	if (candidates.length === 0)
		return null;
	const last = getSortedLastTokenFromArray(candidates);
	if (last.children.length !== 0) {
		const firstChild = last.children[0];
		firstChild.remove();
		const firstChildIndex = last.parentNode.children.indexOf(last);
		last.parentNode.insertChildBefore(firstChildIndex, firstChild);
		if (last.children.length !== 0) {
			const secondChild = last.children[0];
			secondChild.remove();
			last.appendSibling(secondChild);
		}
	}
	last.type = ParseTreeTokenType.ANGLE_LEFT_BRACKET;
	const tokensToMove = [];
	let tok = last;
	while (tok !== null) {
		tokensToMove.push(tok);
		tok = tok.getNextSibling();
	}
	const ve = new ParseTreeToken(null, last.lineIndex, last.colIndex, ParseTreeTokenType.VECTOR_EXPRESSION);
	for (const tok of tokensToMove) {
		tok.remove();
		ve.appendChild(tok);
	}
	ve.appendChild(next);
	let lastChild = parent.children[parent.children.length - 1];
	lastChild.appendChild(ve);
	lastChild = ve.getPreviousSibling();
	if (lastChild !== null &&
	lastChild.type === ParseTreeTokenType.IDENTIFIER) {
		ve.remove();
		lastChild.appendChild(ve);
	}
	return ve;
}

export function processAngleRightBracket(prev, next) {
	let goodPrev = getGoodPrevious(prev);
	if (!goodPrevTypes.has(goodPrev.type)) {
		goodPrev = tryConvertingBinaryOperator(goodPrev, next);
		if (goodPrev !== null)
			return goodPrev;
		goodPrev = prev;
	}
	goodPrev.appendChild(next);
	return next;
};