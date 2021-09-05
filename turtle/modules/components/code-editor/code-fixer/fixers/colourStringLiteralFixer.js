import { Colour } from '../../../../Colour.js';
import { ParseTreeToken } from '../../../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';
import { Procedure } from '../../../../parsing/Procedure.js';
await Colour.asyncInit();
await ParseTreeToken.asyncInit();

export function colourStringLiteralFixer(cachedParseTree, fixLogger) {
	const colourTokens = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).filter(function(token) {
		if (Procedure.isNameToken(token)) // Don't replace procedure names.
			return false;
		return Colour.canBeInterprettedAsColour(token.val);
	});
	colourTokens.forEach(function(token) {
		token.type = ParseTreeTokenType.STRING_LITERAL;
		cachedParseTree.tokenTypeChanged(token, ParseTreeTokenType.LEAF);
		fixLogger.log(`Added quote to beginning of ${token.val} because color strings must start with a quote`, token);
	});
};