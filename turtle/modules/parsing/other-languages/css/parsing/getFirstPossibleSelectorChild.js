import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const selectorChildTypes = new Set([
	ParseTreeTokenType.CLASS_NAME_SELECTOR,
	ParseTreeTokenType.COMMA,
	ParseTreeTokenType.ID_SELECTOR,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.PSEUDO_CLASS,
	ParseTreeTokenType.WILDCARD
]);

const stopTokenTypes = new Set([
	ParseTreeTokenType.DECLARATION_BLOCK,
	ParseTreeTokenType.SELECTOR
]);

export function canBeSelectorChild(token) {
	if (token === null)
		return false;
	if (selectorChildTypes.has(token.type))
		return true;
	return false;
};

export function getFirstPossibleSelectorChild(token) {
	while (token !== null) {
		if (token.parentNode !== null &&
		token.parentNode.type === ParseTreeTokenType.SELECTOR) {
			return;
		}
		if (stopTokenTypes.has(token.type))
			return;
		if (canBeSelectorChild(token))
			return token;
		token = token.parentNode;
	}
};