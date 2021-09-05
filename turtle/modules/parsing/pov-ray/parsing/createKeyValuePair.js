import { ParseTreeToken } from
'../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function createKeyValuePair(prev, next, isAppendingNext) {
	const pair = new ParseTreeToken(null, next.lineIndex, next.colIndex, ParseTreeTokenType.KEY_VALUE_PAIR);;
	prev.appendChild(pair);
	if (isAppendingNext)
		pair.appendChild(next);
	return pair;
}