import { isIdentifier } from
'../../0L/scanning/isIdentifier.js';

function startsWithWrapper(scanTokens) {
	if (scanTokens.length < 2)
		return false;

	return isIdentifier(scanTokens[0].s) &&
		scanTokens[1].s === '{';
}

export function removeFractIntWrapperTokens(scanTokens) {
	const lastToken = scanTokens[scanTokens.length - 1];
	if (startsWithWrapper(scanTokens))
		scanTokens.splice(0, 2); // remove first 2 tokens.
	if (lastToken.s === '}')
		scanTokens.pop();
};