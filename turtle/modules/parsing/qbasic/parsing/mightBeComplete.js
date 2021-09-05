import { isComplete } from './isComplete.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function mightBeComplete(token, functionsMap) {
	if (isComplete(token))
		return true;
	const children = token.children;
	const firstChild = children[0];
	const lastChild = children[children.length - 1];
	if (token.type === ParseTreeTokenType.ARG_LIST) {
		if (firstChild !== undefined && firstChild.type === ParseTreeTokenType.CURVED_LEFT_BRACKET)
			return lastChild.type === ParseTreeTokenType.CURVED_RIGHT_BRACKET;
		if (lastChild !== undefined && (
		lastChild.type === ParseTreeTokenType.COMMA ||
		lastChild.type === ParseTreeTokenType.SEMICOLON))
			return false;
	}
	return false;
};