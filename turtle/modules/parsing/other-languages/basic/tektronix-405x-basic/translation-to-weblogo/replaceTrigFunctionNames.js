const trigFunctions = new Set([
	'acs', 'asn', 'atn', 'cos', 'rotate', 'sin', 'tan'
]);
// rotate is not really a trigonometry function but it involves 
// reading an angle parameter like the others so the angle unit is important.

export { trigFunctions };

export function replaceTrigFunctionNames(scanTokens, prefix) {
	if (typeof prefix !== 'string')
		throw new Error(`prefix must be a string but found ${prefix}`);

	for (const token of scanTokens) {
		if (trigFunctions.has(token.s.toLowerCase()))
			token.s = prefix + token.s;
	}
};