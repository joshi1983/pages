import { getDescendentsOfType } from '../parse-tree-token/getDescendentsOfType.js';
import { ParseTreeToken } from '../ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { tokenToProcedure } from './tokenToProcedure.js';

export function scrapeProceduresFromParseTreeTokens(tokens) {
	if (tokens instanceof ParseTreeToken) {
		// assume tokens is the tree root.
		tokens = getDescendentsOfType(tokens, ParseTreeTokenType.PROCEDURE_START_KEYWORD);
	}
	else if (!(tokens instanceof Array))
		throw new Error('tokens must either be a ParseTreeToken or an Array of ParseTreeTokens.  Not: ' + tokens);
	const procedureStartTokens = tokens.filter(function(token) {
		const result = token.type === ParseTreeTokenType.PROCEDURE_START_KEYWORD &&
			token.getChildCount() > 1 &&
			token.children[0].type === ParseTreeTokenType.LEAF;
		return result;
	});
	return procedureStartTokens.map(tokenToProcedure);
};