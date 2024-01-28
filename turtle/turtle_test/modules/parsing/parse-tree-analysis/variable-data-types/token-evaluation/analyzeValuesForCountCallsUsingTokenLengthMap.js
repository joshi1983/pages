export function analyzeValuesForCountCallsUsingTokenLengthMap(cachedParseTree, tokenLengthsMap, tokenValuesMap) {
	const countCalls = cachedParseTree.getCommandCallsByName('count');
	countCalls.forEach(function(countCall) {
		const lengthInfo = tokenLengthsMap.get(countCall.children[0]);
		if (Number.isInteger(lengthInfo))
			tokenValuesMap.set(countCall, lengthInfo);
	});
};