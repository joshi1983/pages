import { ParseTreeTokenType } from
'../../../../parsing/ParseTreeTokenType.js';
import { getParametersFromStartToken } from
'../../../../parsing/parse-tree-analysis/tokenToProcedure.js';

/*
This fixes a parameter format used by an Apple Logo interpreter.
Some of these procedure declarations are shown at:
https://learn.adafruit.com/program-logo-on-an-apple-ii/more-logo
*/
function isOfInterest(token) {
	if (token.children.length < 2)
		return false;
	if (token.children[0].type !== ParseTreeTokenType.LEAF ||
	token.children[1].type !== ParseTreeTokenType.LIST)
		return false;
	const params = token.children[1].children;
	return params.length > 0 &&
		params[0].type === ParseTreeTokenType.STRING_LITERAL;
}

export function quotedParameterFixer(cachedParseTree, fixLogger) {
	const toTokens = cachedParseTree.getTokensByType(ParseTreeTokenType.PROCEDURE_START_KEYWORD).
		filter(isOfInterest);
	if (toTokens.length === 0)
		return;

	const procs = cachedParseTree.getProceduresMap();
	toTokens.forEach(function(toToken) {
		// loop through fixing quoted parameters.
		const nameToken = toToken.children[0];
		const params = toToken.children[1].children;
		let proc;
		if (nameToken.type === ParseTreeTokenType.LEAF) {
			proc = procs.get(nameToken.val.toLowerCase());
		}
		for (let i = 0; i < params.length; i++) {
			const p = params[i];
			if (p.type === ParseTreeTokenType.STRING_LITERAL) {
				p.type = ParseTreeTokenType.VARIABLE_READ;
				p.originalString = undefined;
				cachedParseTree.tokenTypeChanged(p, ParseTreeTokenType.STRING_LITERAL);
				fixLogger.log(`Replaced "${params[i].val} with :${params[i].val} because procedure parameter names in WebLogo must start with :.`, params[i]);
			}
			else
				break;
		}
		if (proc !== undefined) {
			// refresh Procedure instance to reflect the new changes to the parse tree.
			proc.parameters = getParametersFromStartToken(toToken);
		}
	});
};