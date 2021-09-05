function isOfInterest(token) {
	if (typeof token.val !== 'string' ||
	token.isStringLiteral())
		return false;

	const val = token.val;
	return val.endsWith(',') ||
		val[0] === ',';
}

export function removeCommaInValuesFixer(cachedParseTree, fixLogger) {
	const tokens = cachedParseTree.getAllTokens().filter(isOfInterest);
	tokens.forEach(function(token) {
		const oldVal = token.val;
		const val = oldVal;
		if (val[0] === ',')
			token.val = val.substring(1);
		if (token.val.endsWith(',')) {
			token.val = token.val.substring(0, token.val.length - 1);
			token.colIndex--;
			// the last character for the token 
			// is reduced by removing the last character.
		}
		if (token.val === '') {
			token.remove();
			cachedParseTree.tokenRemoved(token);
			fixLogger.log(`Removed ${oldVal} because comma isn't used in the same way in WebLogo as it is in some dialects of BASIC.`, token);
		}
		else
			fixLogger.log(`Replaced ${oldVal} with ${token.val} because comma isn't used in the same way in WebLogo as it is in some dialects of BASIC.`, token);
	});
};