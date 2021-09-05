import { Colour } from '../../../../Colour.js';
import { ParseTreeToken } from '../../../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';
import { Procedure } from '../../../../parsing/Procedure.js';
await Colour.asyncInit();
await ParseTreeToken.asyncInit();

export function quoteColourNameLeafs(cachedParseTree, fixLogger) {
	const tokensToChange = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).
		filter(t => Colour.getColourInfoByName(t.val) !== undefined &&
			Procedure.isNameToken(t) === false);
	tokensToChange.forEach(function(token) {
		token.type = ParseTreeTokenType.STRING_LITERAL;
		cachedParseTree.tokenTypeChanged(token, ParseTreeTokenType.LEAF);
		fixLogger.log(`Added a quote to color ${token.val} because color names must start with a quote`, token);
	});
};