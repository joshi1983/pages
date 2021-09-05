export function processTreeRoot(processToken) {
	return function(token, result, settings) {
		for (const child of token.children) {
			result.append('\n');
			processToken(child, result, settings);
		}
	};
};