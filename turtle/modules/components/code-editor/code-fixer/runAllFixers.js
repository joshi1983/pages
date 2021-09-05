export function runAllFixers(allFixers) {
	return function(cachedParseTree, fixLogger) {
		for (let i = 0; i < allFixers.length; i++) {
			allFixers[i](cachedParseTree, fixLogger);
		}
	}
};