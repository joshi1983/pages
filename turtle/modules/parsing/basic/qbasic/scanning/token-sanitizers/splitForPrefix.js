import { genericProcessSplit } from './genericProcessSplit.js';
import { isStrictIdentifier } from '../isStrictIdentifier.js';
import { Token } from '../../../../Token.js';

function isPrefixOfInterest(s) {
	if (!s.toLowerCase().startsWith('for'))
		return false;

	const after = s.substring(3);
	return isStrictIdentifier(after);
}

function split(s) {
	return [s.substring(0, 3), s.substring(3)];
}

function isQualifying(s) {
	return s.toLowerCase() === 'to' ||
		s.toLowerCase() === 'step';
}

function shouldLargeBeSplit(scanTokens, i) {
	const assignToken = scanTokens[i + 1];
	if (assignToken === undefined || assignToken.s !== '=')
		return false;

	const afterAssign = scanTokens[i + 2];
	if (afterAssign === undefined ||
	afterAssign.s.toLowerCase().startsWith('to'))
		return false;

	const toPrefixedToken = scanTokens[i + 3];
	if (toPrefixedToken === undefined)
		return false;

	const s = toPrefixedToken.s.toLowerCase();
	if (!s.startsWith('to'))
		return false;

	return true;
}

function processLargeSplit(scanTokens, i) {
	const token = scanTokens[i];
	const assignToken = scanTokens[i + 1];
	const afterAssign = scanTokens[i + 2];
	const toPrefixedToken = scanTokens[i + 3];
	const forToken = new Token(token.s.substring(0, 3), token.colIndex + 3 - token.s.length, token.lineIndex);
	token.s = token.s.substring(3);
	const toToken = new Token(toPrefixedToken.s.substring(0, 2),
		toPrefixedToken.colIndex + 2 - toPrefixedToken.s.length, toPrefixedToken.lineIndex);
	toPrefixedToken.s = toPrefixedToken.s.substring(2);
	scanTokens.splice(i, 4, forToken, token, assignToken, afterAssign, toToken);
	if (toPrefixedToken.s !== '') {
		scanTokens.splice(i + 5, 0, toPrefixedToken);
	}
}

export function splitForPrefix(scanTokens, customFunctionNames) {
	for (let i = 0; i < scanTokens.length; i++) {
		const tok = scanTokens[i];
		if (isPrefixOfInterest(tok.s)) {
			if (shouldLargeBeSplit(scanTokens, i)) {
				processLargeSplit(scanTokens, i);
			}
			else
				genericProcessSplit(scanTokens, customFunctionNames, isPrefixOfInterest, split, i,
					1, tok.lineIndex, undefined, isQualifying);
		}
	}
};