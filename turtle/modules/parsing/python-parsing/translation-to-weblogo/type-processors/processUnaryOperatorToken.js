import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { printChildren } from './helpers/printChildren.js';
import { processToken } from '../processToken.js';

const unpackableTokenTypes = new Set([
	ParseTreeTokenType.LIST_LITERAL
]);

function isIterableUnpackingOperator(token) {
	if (token.val !== '*' || token.children.length !== 1 ||
	!unpackableTokenTypes.has(token.children[0].type))
		return false;
	const child = token.children[0];
	if (child.type === ParseTreeTokenType.LIST_LITERAL) {
		if (child.children.length < 2)
			return false;
		if (child.children[0].type !== ParseTreeTokenType.SQUARE_LEFT_BRACKET ||
		child.children[child.children.length - 1].type !== ParseTreeTokenType.SQUARE_RIGHT_BRACKET)
			return false;
	}
	return true;
}

function processIterableUnpackingOperator(token, result, cachedParseTree) {
	const child = token.children[0];
	if (child.type === ParseTreeTokenType.LIST_LITERAL) {
		for (let i = 1; i < child.children.length - 1; i++) {
			result.trimRight();
			result.append(' ');
			processToken(child.children[i], result, cachedParseTree);
		}
	}
	else if (child.type === ParseTreeTokenType.DICTIONARY_LITERAL) {
		// FIXME: process the keys only.
	}
}

export function processUnaryOperatorToken(token, result, cachedParseTree) {
	const val = token.val;
	if (isIterableUnpackingOperator(token)) {
		processIterableUnpackingOperator(token, result, cachedParseTree);
		return;
	}
	result.append(val);
	printChildren(token, result, cachedParseTree);
};