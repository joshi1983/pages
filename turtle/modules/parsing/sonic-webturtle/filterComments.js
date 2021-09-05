import { findGoodPlaceForEndToken } from './findGoodPlaceForEndToken.js';
import { isInvalidProcStart } from './isInvalidProcStart.js';
import { isStrictlyAfter } from '../generic-parsing-utilities/isStrictlyAfter.js';

export function filterComments(allTokens) {
	const endTokens = allTokens.filter(tok => tok.s.toLowerCase() === 'end');
	let firstEndToken = endTokens[0];
	if (firstEndToken === undefined) {
		firstEndToken = findGoodPlaceForEndToken(allTokens);
	}
	const comments = allTokens.filter(function(tok) {
		if (tok.s[0] === ';')
			return true;
		if (tok.s[0] !== '#')
			return false;
		if (firstEndToken === undefined)
			return true;
		if (isStrictlyAfter(firstEndToken, tok))
			return true;
		if (isInvalidProcStart(tok.s))
			return true;
		return false;
	});
	return comments;
};