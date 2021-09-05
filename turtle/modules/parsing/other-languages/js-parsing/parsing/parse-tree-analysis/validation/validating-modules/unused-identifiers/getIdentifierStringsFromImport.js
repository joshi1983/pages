import { ParseTreeTokenType } from '../../../../../ParseTreeTokenType.js';

function getIdentifierValue(token) {
	if (token.type === ParseTreeTokenType.IDENTIFIER)
		return token.val;
	else if (token.children.length === 2)
		return token.children[1].val;
}

function isInterestingChild(token) {
	if (token.type === ParseTreeTokenType.IDENTIFIER)
		return true;
	if (token.type === ParseTreeTokenType.BINARY_OPERATOR &&
	token.val === 'as')
		return true;
	return false;
}

export function getIdentifierStringsFromImport(token) {
	if (token.children.length !== 0) {
		const firstChild = token.children[0];
		if (firstChild.type === ParseTreeTokenType.IDENTIFIER)
			return [firstChild.val];
		if (firstChild.type === ParseTreeTokenType.CURLY_BRACKET_EXPRESSION) {
			return firstChild.children.filter(isInterestingChild).map(getIdentifierValue).filter(s => typeof s === 'string');
		}
	}
	return [];
};