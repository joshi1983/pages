import { isStrictIdentifier } from
'../../scanning/isStrictIdentifier.js';
import { QBasicInternalFunctions } from '../../QBasicInternalFunctions.js';

function isFunctionName(scanTokens, i) {
	const token = scanTokens[i];
	const lowerS = token.s;
	if (!isStrictIdentifier(lowerS) ||
	QBasicInternalFunctions.getFunctionInfo(lowerS) !== undefined)
		return false;
	const prev = scanTokens[i - 1];
	if (prev.lineIndex !== token.lineIndex)
		return false;
	const prevS = prev.s.toLowerCase();
	if (prevS !== 'sub' && prevS !== 'function' &&
	prevS !== 'gosub' &&
	prevS !== 'def')
		return false;
	return true;
}

export function scanTokensToCustomFunctionNames(scanTokens) {
	const result = new Set();
	for (let i = 1; i < scanTokens.length; i++) {
		if (isFunctionName(scanTokens, i))
			result.add(scanTokens[i].s.toLowerCase());
	}
	return result;
};