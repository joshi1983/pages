import { ArrayUtils } from
'../../../../../ArrayUtils.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

export function shouldTranslateToSublist(nonBracketTokens) {
	if (nonBracketTokens.length === 0 || nonBracketTokens.length > 3)
		return false;

	const colonIndex = ArrayUtils.indexOfMatch(nonBracketTokens, token => token.type === ParseTreeTokenType.COLON);
	return colonIndex !== -1;
};