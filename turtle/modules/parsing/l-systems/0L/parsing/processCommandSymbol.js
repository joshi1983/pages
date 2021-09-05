import { ParseTreeToken } from
'../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

export function processCommandSymbol(prev, next) {
	if (prev.type !== ParseTreeTokenType.COMMAND_SEQUENCE) {
		const seq = new ParseTreeToken(null, next.lineIndex, next.colIndex, ParseTreeTokenType.COMMAND_SEQUENCE);
		prev.appendChild(seq);
		prev = seq;
	}
	prev.appendChild(next);
	return prev;
};