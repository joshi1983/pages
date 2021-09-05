import { isCommonDataTypeName } from
'../../parsing/parse-tree-analysis/variable-data-types/isCommonDataTypeName.js';
import { isStrictIdentifier } from
'../isStrictIdentifier.js';
import { Token } from
'../../../../../parsing/generic-parsing-utilities/Token.js';

function isOfInterest(scanTokens, i) {
	const dimToken = scanTokens[i];
	if (dimToken.s.toLowerCase() !== 'dim')
		return false;
	const asToken = scanTokens[i + 1];
	if (asToken === undefined || asToken.s.toLowerCase() !== 'as')
		return false;
	const unsignedToken = scanTokens[i + 2];
	if (unsignedToken === undefined)
		return false;
	let typeIndex = i + 2;
	if (unsignedToken.s.toLowerCase() === '_unsigned') {
		typeIndex++;
	}
	const typeToken = scanTokens[typeIndex];
	if (typeToken === undefined ||
	!isCommonDataTypeName(typeToken.s))
		return false;

	const identifierToken = scanTokens[typeIndex + 1];
	if (identifierToken === undefined ||
	identifierToken.lineIndex !== dimToken.lineIndex ||
	!isStrictIdentifier(identifierToken.s))
		return false;
	
	const afterIdentifier = scanTokens[typeIndex + 3];
	if (afterIdentifier !== undefined &&
	afterIdentifier.s === '(')
		return false;

	return true;
}

// This includes a few keywords that should never appear in a variable declaration in QBASIC or QB64.
// The extra keywords should be redundant in a lot of cases.
// We include the keywords anyway because
// we want to handle cases where the code is invalid.
const endMarkers = new Set([
	'(', ')', ':', 'as', 'const', 'dim',
	'def', 'defdbl', 'defint', 'deflng',
	'end', 'for', 'if', 'sub', 'type', 'var'
]);

function getEndTypeIndex(scanTokens, i) {
	const token = scanTokens[i];
	for (let j = i + 1; j < scanTokens.length; j++) {
		const tok = scanTokens[j];
		const s = tok.s.toLowerCase();
		if (tok.lineIndex !== token.lineIndex ||
		endMarkers.has(s)) {
			if (s === '(')
				return j - 2;
			return j;
		}
	}
	return scanTokens.length;
}

function cloneToken(t, posToken, colOffset) {
	return new Token(t.s, posToken.colIndex + colOffset, posToken.lineIndex);
}

function insertTokensAt(scanTokens, j, unsignedToken, asToken, typeToken, len) {
	const commaToken = scanTokens[j - 1];
	scanTokens.splice(j, 0, cloneToken(asToken, commaToken, 2), cloneToken(typeToken, commaToken, 3));
	if (len >= 3)
		scanTokens.splice(j, 0, cloneToken(unsignedToken, commaToken, 1));
}

function process(scanTokens, i) {
	const asToken = scanTokens[i + 1];
	const unsignedToken = scanTokens[i + 2];
	let typeToken = scanTokens[i + 2];
	let len = 2;
	if (unsignedToken.s.toLowerCase() === '_unsigned') {
		typeToken = scanTokens[i + 3];
		len = 3;
	}
	scanTokens.splice(i + 1, len); // remove the as [[_unsigned]] type.
	let endIndex = getEndTypeIndex(scanTokens, i + 1);

	// insert the last as [[_unsigned]] type.
	scanTokens.splice(endIndex, 0, asToken, typeToken);
	if (len === 3)
		scanTokens.splice(endIndex + 1, 0, unsignedToken);
	
	for (let j = endIndex - len; j > i; j--) {
		const token = scanTokens[j];
		if (isStrictIdentifier(token.s)) {
			insertTokensAt(scanTokens, j + 1, unsignedToken, asToken, typeToken, len);
			endIndex += len;
		}
	}

	return endIndex + 1;
}

export function moveAsTypeInDim(scanTokens) {
	for (let i = 0; i < scanTokens.length; i++) {
		if (isOfInterest(scanTokens, i)) {
			i = process(scanTokens, i);
		}
	}
};