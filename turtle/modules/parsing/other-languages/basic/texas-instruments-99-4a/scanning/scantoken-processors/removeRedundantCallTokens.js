import { isIdentifier } from
'../../../qbasic/scanning/isIdentifier.js';

function isCallOfInterest(scanTokens, i) {
	if (i >= scanTokens.length - 1)
		return false;

	const tok = scanTokens[i];
	if (tok.s.toLowerCase() !== 'call')
		return false;

	const next = scanTokens[i + 1];
	if (!isIdentifier(next.s))
		return false;

	return true;
}

export function removeRedundantCallTokens(scanTokens) {
	for (let i = 0; i < scanTokens.length; i++) {
		if (isCallOfInterest(scanTokens, i)) {
			scanTokens.splice(i, 1);
		}
	}
};