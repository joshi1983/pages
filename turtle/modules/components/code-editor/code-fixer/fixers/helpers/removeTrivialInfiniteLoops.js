import { getAllDescendentsAsArray } from
'../../../../../parsing/generic-parsing-utilities/getAllDescendentsAsArray.js';
import { getTokensByType } from
'../../../../../parsing/generic-parsing-utilities/getTokensByType.js';
import { getTokenValueBasic } from
'../../../../../parsing/parse-tree-analysis/variable-data-types/getTokenValueBasic.js';
import { ParseTreeTokenType } from
'../../../../../parsing/ParseTreeTokenType.js';

function isOfInterest(token) {
	const commandName = token.val.toLowerCase();
	if (commandName !== 'forever' && commandName !== 'while' &&
	commandName !== 'do.while')
		return false;

	let instructionListToken = token.children[0];
	if (commandName === 'while' || commandName === 'do.while') {
		const conditionToken = token.children[ commandName === 'do.while' ? 1 : 0 ];
		if (conditionToken === undefined)
			return false;

		const conditionVal = getTokenValueBasic(conditionToken);
		if (conditionVal === undefined || conditionVal === false || conditionVal === 0)
			return false;

		if (commandName === 'while')
			instructionListToken = token.children[1];
	}
	if (instructionListToken === undefined)
		return false;

	const children = instructionListToken.children.filter(c => !c.isBracket());
	return children.length === 0;
}

export function removeTrivialInfiniteLoops(cachedParseTree, fixLogger) {
	const loopTokens = getTokensByType(cachedParseTree, ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(isOfInterest);
	loopTokens.forEach(function(loopToken) {
		const allTokens = getAllDescendentsAsArray(loopToken);
		loopToken.remove();
		allTokens.push(loopToken);
		cachedParseTree.tokensRemoved(allTokens);
		fixLogger.log(`Removed infinite loop because does nothing important other than keep the program running`, loopToken);
	});
	return loopTokens.length !== 0;
};