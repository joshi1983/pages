export function processReturn(processToken, settings) {
	if (typeof processToken !== 'function')
		throw new Error(`processToken expected to be a function but got ${processToken}`);
	return function(token, result) {
		if (token.children.length === 0) {
			result.append('stop');
		}
		else {
			result.append('output ');
			processToken(token.children[0], result, settings);
		}
	};
};