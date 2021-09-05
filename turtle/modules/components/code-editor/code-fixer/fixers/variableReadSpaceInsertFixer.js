import { getSortedPreviousTokenOf } from
'../../../../parsing/generic-parsing-utilities/getSortedPreviousTokenOf.js';
import { ParseTreeTokenType } from
'../../../../parsing/ParseTreeTokenType.js';
import { preferNonNullVal } from
'../../../../parsing/generic-parsing-utilities/preferNonNullVal.js';
import { validateIdentifier } from
'../../../../parsing/parse-tree-analysis/validateIdentifier.js';

function isOfInterest(token) {
	if (token.isNeedingSpaceBefore === true)
		return false;
	if (validateIdentifier(token.val) !== undefined)
		return false; // can't be a variable name
	const prev = getSortedPreviousTokenOf(token, preferNonNullVal);
	if (prev === null)
		return false;
	if (prev.lineIndex !== token.lineIndex)
		return false;
	if (prev.colIndex < token.colIndex - token.val.length - 1)
		return false;
	return true;
}

export function variableReadSpaceInsertFixer(cachedParseTree, fixLogger) {
	const varTokens = cachedParseTree.getTokensByType(ParseTreeTokenType.VARIABLE_READ).
		filter(isOfInterest);
	varTokens.forEach(function(token) {
		token.isNeedingSpaceBefore = true;
		fixLogger.log(`Inserted space before :${token.val} to make it easier to read and understand`, token);
	});
};