import { ParseTreeTokenType } from
'../../../../../parsing/ParseTreeTokenType.js';
import { SetUtils } from
'../../../../../SetUtils.js';
import { validateIdentifier } from
'../../../../../parsing/parse-tree-analysis/validateIdentifier.js';

function isOfInterest(excludedNames) {
	return function(token) {
		// if token.val is not a valid identifier, return false.
		if (validateIdentifier(token.val) !== undefined)
			return false;

		// if token.val matches a procedure, return false.
		return !excludedNames.has(token.val.toLowerCase());
	};
}

export function genericLeafsToVariableReadsFixer(excludedNames) {
	if (!(excludedNames instanceof Set))
		throw new Error(`excludedNames must be a Set but found ${excludedNames}`);
	return function(cachedParseTree, fixLogger) {
		const excludedNames2 = new Set(excludedNames);
		SetUtils.addAll(excludedNames2, cachedParseTree.getProceduresMap().keys());
		const leafs = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF)
			.filter(isOfInterest(excludedNames2));
		leafs.forEach(function(token) {
			token.type = ParseTreeTokenType.VARIABLE_READ;
			cachedParseTree.tokenTypeChanged(token, ParseTreeTokenType.LEAF);
			fixLogger.log(`Added : before ${token.val} to represent a variable read`, token);
		});
	}
};