import { ParseTreeToken } from
'../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

function shouldCreateElseIf(prev, next) {
	if (prev.type === ParseTreeTokenType.ELSE) {
		return true;
	}
	return false;
}

export function processIf(prev, next) {
	if (shouldCreateElseIf(prev)) {
		const elseToken = prev;
		const prevParent = prev.parentNode;
		const ei = new ParseTreeToken(null, elseToken.lineIndex, elseToken.colIndex, ParseTreeTokenType.ELSE_IF);
		prevParent.replaceChild(elseToken, ei);
		ei.appendChild(elseToken);
		ei.appendChild(next);
		return ei;
	}
	else {
		prev.appendChild(next);
		return next;
	}
};