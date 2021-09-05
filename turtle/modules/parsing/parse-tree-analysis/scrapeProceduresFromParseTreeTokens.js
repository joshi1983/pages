import { getDescendentsOfType } from '../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeToken } from '../ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { tokenToProcedure } from './tokenToProcedure.js';

const nameTokenTypes = new Set([
ParseTreeTokenType.LEAF, 
// LEAF is the only type generally expected.
ParseTreeTokenType.NUMBER_LITERAL
// NUMBER_LITERAL is possible for parse trees from invalid WebLogo code.
// numeric procedure names are supported by Logo3D(the same one documented in json/logo-migrations/Logo_3D.json).
// The tree might contain that so it can be auto-fixed and validated by validateProcedureNames.
]);

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
			nameTokenTypes.has(token.children[0].type);
		return result;
	});
	return procedureStartTokens.map(tokenToProcedure);
};