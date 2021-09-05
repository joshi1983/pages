import { getClosestOfType } from
'../../../../../parsing/generic-parsing-utilities/getClosestOfType.js';
import { getSortedFirstTokenFromArray } from
'../../../../../parsing/generic-parsing-utilities/getSortedFirstTokenFromArray.js';
import { isAfterOrSame } from
'../../../../../parsing/generic-parsing-utilities/isAfterOrSame.js';
import { ParseTreeTokenType } from
'../../../../../parsing/ParseTreeTokenType.js';

function isOfInterest(firstForeach) {
	return function(token) {
		if (token.val !== '?')
			return false;
		const closestList = getClosestOfType(token, ParseTreeTokenType.LIST);
		if (closestList === null)
			return false;

		return isAfterOrSame(token, firstForeach);
	};
}

function isForeachCall(token) {
	if (token.type !== ParseTreeTokenType.LEAF)
		return false;
	if (token.val.toLowerCase() !== 'foreach')
		return false;
	return true;
}

/*
This is intended to run before ../foreachFixer.
foreachFixer expects code to be in a more FMSLogo format.
This converts from a Terrapin format to an FMSLogo format.
*/
export function convertForeachSymbolFixer(cachedParseTree, fixLogger) {
	const foreaches = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).
		filter(isForeachCall);
	if (foreaches.length === 0)
		return;
	const firstForEach = getSortedFirstTokenFromArray(foreaches);
	const questionMarks = cachedParseTree.getTokensByType(ParseTreeTokenType.STRING_LITERAL).
		filter(isOfInterest(firstForEach));
	questionMarks.forEach(function(questionMark) {
		const oldType = questionMark.type;
		questionMark.type = ParseTreeTokenType.LEAF;
		cachedParseTree.tokenTypeChanged(questionMark, oldType);
		fixLogger.log(`Converted "? to ? to be more like how some other versions of Logo read the current value in a foreach loop.`, questionMark);
	});
};