import { ParseTreeTokenType } from
'../../../../../parsing/ParseTreeTokenType.js';

const badArgTokenTypes = new Set([
	ParseTreeTokenType.PROCEDURE_END_KEYWORD,
	ParseTreeTokenType.PROCEDURE_START_KEYWORD,
	ParseTreeTokenType.TREE_ROOT
]);

function isValidArgToken(token, isBracketValid) {
	if (!isBracketValid && token.isBracket())
		return false;
	if (badArgTokenTypes.has(token.type))
		return false;
	return true;
}

export function getNextArgToken(token, isBracketValid) {
	if (isBracketValid === undefined)
		isBracketValid = false;
	if (token.nextSibling !== null) {
		if (isValidArgToken(token.nextSibling, isBracketValid))
			return token.nextSibling;
		return null;
	}
	const parent = token.parentNode;
	if (parent !== null) {
		return getNextArgToken(parent, isBracketValid);
	}
	return null;
};