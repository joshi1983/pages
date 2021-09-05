export function evaluateStringLiteralVal(literalVal) {
	if (literalVal.indexOf('\\') === -1) // this is often true.
		return literalVal; 
		// save a little processing time by skipping all the work below.

	let result = '';
	for (let i = 0; i < literalVal.length; i++) {
		const ch = literalVal[i];
		if (ch === '\\' && i < literalVal.length - 1)
			result += literalVal[++i];
		else
			result += ch;
	}
	return result;
};