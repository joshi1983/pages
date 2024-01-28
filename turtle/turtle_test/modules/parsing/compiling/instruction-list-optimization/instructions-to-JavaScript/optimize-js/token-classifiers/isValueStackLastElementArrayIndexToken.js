import { isValueStackLength } from './isValueStackLength.js';
import { ParseTreeTokenType } from
'../../../../../js-parsing/ParseTreeTokenType.js';

export function isValueStackLastElementArrayIndexToken(token) {
	if (token.children.length !== 3 || token.type !== ParseTreeTokenType.INDEX_EXPRESSION)
		return false;
	const minusOperator = token.children[1];
	if (minusOperator.type !== ParseTreeTokenType.BINARY_OPERATOR ||
	minusOperator.val !== '-' || minusOperator.children.length !== 2)
		return false;
	const oneToken = minusOperator.children[1];
	if (oneToken.val !== '1' || oneToken.type !== ParseTreeTokenType.NUMBER_LITERAL)
		return false;
	if (!isValueStackLength(minusOperator.children[0]))
		return false;
	return true;
};