import { Command } from
'../../../../../parsing/Command.js';
import { getLastDescendentTokenOf } from
'../../../../../parsing/generic-parsing-utilities/getLastDescendentTokenOf.js';
import { IntegerType } from
'../../../../../parsing/data-types/IntegerType.js';
import { ParseTreeToken } from
'../../../../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../../../../parsing/ParseTreeTokenType.js';

const iType = new IntegerType();

function isOfInterest(token) {
	if (token.children.length !== 1)
		return false;
	const info = Command.getCommandInfo(token.val);
	if (info === undefined || info.args.length !== 1)
		return false;
	const arg = info.args[0];
	if (arg.types.indexOf('color') === -1)
		return false;
	if (!iType.mayBeCompatibleWith(token.children[0]))
		return false;
	const next = token.nextSibling;
	if (next === null || next.lineIndex !== token.lineIndex ||
	!iType.mayBeCompatibleWith(next))
		return false;
	const nNext = next.nextSibling;
	if (nNext === null || nNext.lineIndex !== token.lineIndex ||
	!iType.mayBeCompatibleWith(nNext))
		return false;
	
	return true;
}

export function fixBracketedParametersForColours(cachedParseTree, fixLogger) {
	const tokens = cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(isOfInterest);
	tokens.forEach(function(token) {
		const child = token.children[0];
		const openBracket = new ParseTreeToken('[', null, token.lineIndex, token.colIndex + 1, ParseTreeTokenType.LEAF);
		const greenToken = token.nextSibling;
		const blueToken = greenToken.nextSibling;
		const next = getLastDescendentTokenOf(blueToken);
		const closeBracket = new ParseTreeToken(']', null, next.lineIndex, next.colIndex + 1, ParseTreeTokenType.LEAF);
		const listToken = new ParseTreeToken(null, null, openBracket.lineIndex, openBracket.colIndex, ParseTreeTokenType.LIST);
		listToken.appendChild(openBracket);
		for (const ch of [child, greenToken, blueToken]) {
			ch.remove();
			listToken.appendChild(ch);
		}
		listToken.appendChild(closeBracket);
		token.appendChild(listToken);
		cachedParseTree.tokensAdded([openBracket, closeBracket, listToken]);
		fixLogger.log(`Grouped red, green, blue values into a list`, listToken);
	});
};