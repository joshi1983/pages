const trigFunctions = new Set([
	'acs', 'asn', 'atn', 'cos', 'sin', 'tan'
]);

export { trigFunctions };

export function replaceTrigFunctionNames(scanTokens, prefix) {
	if (typeof prefix !== 'string')
		throw new Error(`prefix must be a string but found ${prefix}`);

	for (const token of scanTokens) {
		if (trigFunctions.has(token.s.toLowerCase()))
			token.s = prefix + token.s;
	}
};