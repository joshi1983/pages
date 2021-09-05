export function validateAssert(cachedParseTree, parseLogger) {
	const assertCalls = cachedParseTree.getCommandCallsByName('assert');
	const tokenValues = cachedParseTree.getTokenValues();
	assertCalls.forEach(function(assertCallToken) {
		const val = tokenValues.get(assertCallToken.children[0]);
		if (val !== undefined && !val)
			parseLogger.error(`Assert will always fail because the input is always false.  Click <span class="command">assert</span> to learn more about the command.`, assertCallToken, true);
	});
};