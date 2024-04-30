import { getSortedPreviousTokenOf } from
'../../../../parsing/generic-parsing-utilities/getSortedPreviousTokenOf.js';
import { insertColIndexSpanAt } from
'../../../../parsing/generic-parsing-utilities/insertColIndexSpanAt.js';
import { ParseTreeTokenType } from
'../../../../parsing/ParseTreeTokenType.js';
import { preferNonNullVal } from
'../../../../parsing/generic-parsing-utilities/preferNonNullVal.js';

function isOfInterest(token) {
	const prev = getSortedPreviousTokenOf(token, preferNonNullVal);
	if (prev === null)
		return false;
	if (prev.lineIndex !== token.lineIndex)
		return false;
	if (prev.colIndex !== token.colIndex - token.val.length - 1)
		return false;
	return true;
}

export function variableReadSpaceInsertFixer(cachedParseTree, fixLogger) {
	const varTokens = cachedParseTree.getTokensByType(ParseTreeTokenType.VARIABLE_READ).
		filter(isOfInterest);
	varTokens.forEach(function(token) {
		token.colIndex++;
		insertColIndexSpanAt(token, 300);
		fixLogger.log(`Inserted space before :${token.val} to make it easier to read and understand`, token);
	});
};