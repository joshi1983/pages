import { ParseTreeToken } from '../../../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';
const specialQuotes = new Set(['“', '”', '„']);

export function replaceSpecialQuoteCharactersWithNormalQuotes(cachedParseTree, fixLogger) {
	const leafsWithSpecialQuotes = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).
		filter(t => specialQuotes.has(t.val.charAt(0)));
	leafsWithSpecialQuotes.forEach(function(leaf) {
		let newVal = leaf.val.substring(1);
		while (specialQuotes.has(newVal.charAt(0)))
			newVal = newVal.substring(1);
		fixLogger.log(`Replaced special quote(${leaf.val.charAt(0)}) with regular quote in ${leaf.val}`, leaf);
		const previousVal = leaf.val;
		leaf.val = newVal;
		leaf.type = ParseTreeTokenType.STRING_LITERAL;
		cachedParseTree.tokenValueChanged(leaf, previousVal);
		cachedParseTree.tokenTypeChanged(leaf, ParseTreeTokenType.LEAF);
	});
};