import { ParseTreeToken } from
'../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

function shouldCreateElseIf(prev) {
	if (prev.children.length !== 0)
		return false;
	return prev.type === ParseTreeTokenType.ELSE;
}

export function processIf(prev, next) {
	if (shouldCreateElseIf(prev)) {
		const ei = new ParseTreeToken(null, prev.lineIndex, prev.colIndex, ParseTreeTokenType.ELSE_IF);
		const prevParent = prev.parentNode;
		prevParent.replaceChild(prev, ei);
		prev.remove();
		ei.appendChild(prev);
		ei.appendChild(next);
		return next;
	}
	prev.appendChild(next);
	return next;
};