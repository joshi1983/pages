import { ParseTreeToken } from
'../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

export function processUntil(prev, next) {
	const prevParent = prev.parentNode;
	if (prev.type === ParseTreeTokenType.DO) {
		const doUntil = new ParseTreeToken(null, prev.lineIndex, prev.colIndex,
			ParseTreeTokenType.DO_UNTIL);
		prevParent.replaceChild(prev, doUntil);
		doUntil.appendChild(prev);
		doUntil.appendChild(next);
		return next;
	}
	prev.appendChild(next);
	return next;
};