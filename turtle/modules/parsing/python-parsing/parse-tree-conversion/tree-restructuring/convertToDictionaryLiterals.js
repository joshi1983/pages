import { convertChildren } from './helpers/convertChildren.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

function isOfInterest(token) {
	if (token.type !== ParseTreeTokenType.UNRECOGNIZED ||
	token.children.length < 2)
		return false;
	const first = token.children[0];
	if (first.type !== ParseTreeTokenType.CURLY_LEFT_BRACKET)
		return false;
	const last = token.children[token.children.length - 1];
	if (last.type !== ParseTreeTokenType.CURLY_RIGHT_BRACKET)
		return false;
	return true;
}

export function convertToDictionaryLiterals(token) {
	let result = false;
	if (isOfInterest(token)) {
		token.type = ParseTreeTokenType.DICTIONARY_LITERAL;
		result = true;
	}
	else {
		if (convertChildren(token, convertToDictionaryLiterals))
			result = true;
	}
	return result;
};