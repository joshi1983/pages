export function setProcessTokenForToken(token, processToken, options) {
	if (typeof processToken !== 'function')
		throw new Error(`processToken must be a function but found ${processToken}`);
	if (typeof options !== 'object')
		throw new Error(`options must be an object but found ${options}`);
	if (options.processTokensMap === undefined)
		options.processTokensMap = new Map();
	options.processTokensMap.set(token, processToken);
};