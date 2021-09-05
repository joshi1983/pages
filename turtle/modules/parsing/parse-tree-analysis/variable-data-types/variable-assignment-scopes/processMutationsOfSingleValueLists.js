export function processMutationsOfSingleValueLists(cachedParseTree, variables) {
	const listScopes = variables.getAllScopesAsArray().filter(scope => scope.singleValue instanceof Array);
	if (listScopes.length === 0)
		return; // nothing to do here.
	const queue2Calls = cachedParseTree.getCommandCallsByName('queue2');
	if (queue2Calls.length === 0)
		return; // nothing to do here because a list value 
	// can't be mutated by a queue2 if queue2 is never called.
	for (let i = 0; i < listScopes.length; i++) {
		const scope = listScopes[i];
		scope.singleValue = undefined;
	}
};