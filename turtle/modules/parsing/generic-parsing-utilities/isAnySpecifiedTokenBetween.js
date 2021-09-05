import { isAfterOrSame } from './isAfterOrSame.js';

function isBetween(firstToken, lastToken) {
	return function(token) {
		if (isAfterOrSame(firstToken, token))
			return false;
		if (isAfterOrSame(token, lastToken))
			return false;
		return true;
	};
}

/*
tokens is usually an Array but might be an iterator for a collection of tokens.
*/
export function isAnySpecifiedTokenBetween(tokens, fromToken, toToken) {
	let firstToken;
	let lastToken;
	if (isAfterOrSame(toToken, fromToken)) {
		firstToken = fromToken;
		lastToken = toToken;
	}
	else {
		firstToken = toToken;
		lastToken = fromToken;
	}
	if (typeof tokens.some !== 'function') {
		tokens = Array.from(tokens);
	}
	return tokens.some(isBetween(firstToken, lastToken));
};