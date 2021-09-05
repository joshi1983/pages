import { ParseTreeTokenType } from '../../../../../parsing/ParseTreeTokenType.js';
const goodChildTypes = new Set([
ParseTreeTokenType.BINARY_OPERATOR,
ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
ParseTreeTokenType.LEAF,
ParseTreeTokenType.NUMBER_LITERAL,
ParseTreeTokenType.UNARY_OPERATOR,
ParseTreeTokenType.VARIABLE_READ
]);

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

/*
Does not guarantee to get all the children for the specified token but handles 
fairly simple and quick cases to do so.
*/
export function processOperatorChildrenIfPossible(token) {
	if (token.type === ParseTreeTokenType.BINARY_OPERATOR && token.children.length === 0) {
		const prev = token.previousSibling;
		if (isGoodChildOfOperator(prev, token)) {
			prev.remove();
			token.appendChild(prev);
		}
		let next = token.nextSibling;
		if (next === null) {
			const parent = token.parentNode;
			next = parent.nextSibling;
			if (next !== null && isGoodChildOfOperator(next, token)) {
				next.remove();
				token.appendChild(next);
				if (shouldConvertNextSiblingToChild(parent)) {
					convertNextSiblingToChild(parent);
				}
			}
		}
		else if (isGoodChildOfOperator(next, token)) {
			next.remove();
			token.appendChild(next);
			const parent = token.parentNode;
			if (shouldConvertNextSiblingToChild(parent)) {
				convertNextSiblingToChild(parent);
			}
		}
	}
};