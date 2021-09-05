import { Command } from
'../../../../../../parsing/Command.js';
import { filterBrackets } from
'../../../../../../parsing/compiling/to-js/type-processors/helpers/filterBrackets.js';
import { getAllDescendentsAsArray } from
'../../../../../../parsing/generic-parsing-utilities/getAllDescendentsAsArray.js';
import { ParseTreeTokenType } from
'../../../../../../parsing/ParseTreeTokenType.js';

function isOfInterest(token) {
	const children = token.children;
	if (children.length !== 1)
		return false;

	const info = Command.getCommandInfo(token.val);
	if (info === undefined ||
	info.primaryName !== 'createPList2')
		return false;
	
	const firstChild = children[0];
	if (firstChild.type !== ParseTreeTokenType.LIST)
		return false;

	const listChildValueTokens = filterBrackets(firstChild.children);
	if (listChildValueTokens.length !== 0)
		return false;

	return true;
}

export function simplifyCreatePList2(cachedParseTree, fixLogger) {
	const createPLists = cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP)
		.filter(isOfInterest);
	createPLists.forEach(function(createPList2Token) {
		createPList2Token.val = 'createPList';
		const listToken = createPList2Token.children[0];
		const tokensToRemove = getAllDescendentsAsArray(listToken);
		tokensToRemove.push(listToken);
		listToken.remove();
		cachedParseTree.tokensRemoved(tokensToRemove);
		fixLogger.log(`Converted createPList2 to createPList and removed empty list argument.  That simplifies the code without important changing functionality.`, createPList2Token);
	});
	
	return createPLists.length !== 0;
};