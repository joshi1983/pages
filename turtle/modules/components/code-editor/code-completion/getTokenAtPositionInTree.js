import { flatten } from '../../../parsing/generic-parsing-utilities/flatten.js';

function isPositionMatchingToken(position) {
	return function(token) {
		if (token.val === null)
			return false;
		if (position.lineIndex !== token.lineIndex)
			return false;
		if (position.colIndex - 1 > token.colIndex)
			return false;
		let s;
		if (token.children.length === 0)
			s = token.toString();
		else if (typeof token.val === 'string')
			s = token.val;
		else if (token.originalString !== undefined)
			s = token.originalString;
		const startIndex = token.colIndex + 1 - s.length;
		if (position.colIndex > startIndex)
			return true;
		return false;
	};
}

export function getTokenAtPositionInTree(tokens, position) {
	if (!(tokens instanceof Array)) {
		tokens = flatten(tokens);
	}
	tokens = tokens.filter(isPositionMatchingToken(position));
	if (tokens.length > 0) {
		return tokens[0];
	}
};