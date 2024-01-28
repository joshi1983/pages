export function analyzeListCommandCalls(cachedParseTree, tokenLengthsMap) {
	const listCalls = cachedParseTree.getCommandCallsByName('list');
	listCalls.forEach(function(listCall) {
		tokenLengthsMap.set(listCall, listCall.children.length);
	});
};