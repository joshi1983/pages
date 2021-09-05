import { ParseTreeToken } from '../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function addAngleBracketExpressionIfNeeded(prev, next) {
	if (prev.val !== '<')
		return prev;
	if (prev.parentNode !== null &&
	prev.parentNode.type === ParseTreeTokenType.VECTOR_EXPRESSION)
		return prev;
	if (prev.children.length === 0) {
		const e = new ParseTreeToken(null, prev.lineIndex, prev.colIndex, ParseTreeTokenType.VECTOR_EXPRESSION);
		const parent = prev.parentNode;
		parent.replaceChild(prev, e);
		prev.remove();
		e.appendChild(prev);
	}
	return prev;
};