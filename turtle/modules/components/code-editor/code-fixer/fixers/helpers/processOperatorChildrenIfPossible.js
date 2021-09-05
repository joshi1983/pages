import { ParseTreeTokenType } from '../../../../../parsing/ParseTreeTokenType.js';
const goodChildTypes = new Set([
ParseTreeTokenType.BINARY_OPERATOR,
ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
ParseTreeTokenType.LEAF,
ParseTreeTokenType.NUMBER_LITERAL,
ParseTreeTokenType.UNARY_OPERATOR,
ParseTreeTokenType.VARIABLE_READ
]);

function getGoodPrevious(prev, operatorToken) {
	if (prev === null)
		return null;
	while (prev.children.length !== 0 && !isGoodChildOfOperator(prev, operatorToken))
		prev = prev.children[prev.children.length - 1];
	return prev;
}

function isGoodChildOfOperator(possibleChild, operatorToken) {
	if (possibleChild === null)
		return false;
	if (goodChildTypes.has(possibleChild.type))
		return true;
	return false;
}

function shouldConvertNextSiblingToChild(token) {
	if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		return true;
	}
	return false;
}

function convertNextSiblingToChild(token) {
	const next = token.nextSibling;
	if (next !== null) {
		next.remove();
		token.appendChild(next);
	}
}

function tryAddingAsChild(token, newChild) {
	if (isGoodChildOfOperator(newChild, token)) {
		newChild.remove();
		token.appendChild(newChild);
		const parent = token.parentNode;
		if (shouldConvertNextSiblingToChild(parent)) {
			convertNextSiblingToChild(parent);
		}
	}
}

export function oneChildNeeded(token) {
	if (token.children.length === 0) {
		let next = token.nextSibling;
		tryAddingAsChild(token, next);
	}
}

export function twoChildrenNeeded(token) {
	if (token.children.length === 0) {
		const prev = getGoodPrevious(token.previousSibling, token);
		let next = token.nextSibling;
		if (isGoodChildOfOperator(prev, token)) {
			if (prev === token.previousSibling)
				prev.remove();
			else {
				const prevParent = prev.parentNode;
				token.remove();
				prevParent.replaceChild(prev, token);
			}
			token.appendChild(prev);
		}
		if (next === null) {
			const parent = token.parentNode;
			next = parent.nextSibling;
			if (next !== null) {
				tryAddingAsChild(token, next);
			}
		}
		else if (isGoodChildOfOperator(next, token)) {
			tryAddingAsChild(token, next);
		}
	}
}

/*
Does not guarantee to get all the children for the specified token but handles 
fairly simple and quick cases to do so.
*/
export function processOperatorChildrenIfPossible(token) {
	if (token.type === ParseTreeTokenType.BINARY_OPERATOR) {
		twoChildrenNeeded(token);
	}
};