import { getParseTokensSorted } from './getParseTokensSorted.js';
import { ParseTreeToken } from './ParseTreeToken.js';
import { ParseTreeTokenType } from './ParseTreeTokenType.js';
import { Token } from './Token.js';

function shouldBeReturned(parseToken) {
	return parseToken.type !== ParseTreeTokenType.COMMENT &&
		parseToken.type !== ParseTreeTokenType.NEW_LINE &&
		parseToken.val !== null;
}

function convertSingleToken(parseTreeToken) {
	let s = parseTreeToken.originalString;
	if (s === undefined) {
		if (parseTreeToken.children.length !== 0)
			s = parseTreeToken.val;
		else
			s = parseTreeToken.toString();
	}
	return new Token(s, parseTreeToken.colIndex, parseTreeToken.lineIndex);
}

function recursiveConvert(parseTreeToken, result) {
	if (shouldBeReturned(parseTreeToken))
		result.push(convertSingleToken(parseTreeToken));
	const children = parseTreeToken.children;
	for (let i = 0; i < children.length; i++) {
		recursiveConvert(children[i], result);
	}
}

export function convertParseTreeTokensToScanTokens(parseTreeToken) {
	const result = [];
	recursiveConvert(parseTreeToken, result);
	getParseTokensSorted(result);
	return result;
};