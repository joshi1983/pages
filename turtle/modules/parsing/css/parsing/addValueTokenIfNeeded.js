import { ParseTreeToken } from '../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function addValueTokenIfNeeded(prev, next) {
	if (prev.type === ParseTreeTokenType.DECLARATION &&
	prev.children.length === 2 &&
	prev.children[1].type === ParseTreeTokenType.COLON) {
		const valueToken = new ParseTreeToken(null, next.lineIndex, next.colIndex, ParseTreeTokenType.VALUE);
		valueToken.appendChild(next);
		prev.appendChild(valueToken);
		return next;
	}
	return prev;
};